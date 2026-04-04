"""FastAPI application — CTE Vector Search & Rerank microservice."""

from __future__ import annotations

import csv
import logging
import os
import time
from contextlib import asynccontextmanager
from pathlib import Path

import uvicorn
from fastapi import BackgroundTasks, FastAPI, HTTPException

from app.config import Settings
from app.graph.search_graph import build_search_graph
from app.models import (
    CTEItem,
    HealthResponse,
    IndexRequest,
    IndexStatusResponse,
    SearchRequest,
    SearchResponse,
)
from app.services.cache import CacheService
from app.services.embeddings import EmbeddingService
from app.services.qdrant_service import QdrantService
from app.services.reranker import RerankerService

# ── Logging ──────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)-7s | %(name)s | %(message)s",
)
log = logging.getLogger(__name__)

# ── Global singletons ───────────────────────────────────────────
settings = Settings()
embedding_service = EmbeddingService(settings)
reranker_service = RerankerService(settings)
qdrant_service = QdrantService(settings)
cache_service = CacheService(settings)

search_graph = build_search_graph(
    embedding_service,
    qdrant_service,
    reranker_service,
    cache_service,
)

# ── Index status (shared mutable state) ──────────────────────────
_index_status: dict = {
    "status": "idle",
    "total": 0,
    "indexed": 0,
    "percent": 0.0,
    "message": "",
}


# ── Helpers ──────────────────────────────────────────────────────
def _parse_attributes(raw: str) -> str:
    """Clean CTE attribute string for embedding text."""
    if not raw:
        return ""
    parts: list[str] = []
    for pair in raw.split(";"):
        pair = pair.strip()
        if ":" not in pair:
            continue
        key, val = pair.split(":", maxsplit=1)
        key, val = key.strip(), val.strip()
        if not val or val in ("0", "0.00000", "0.0"):
            continue
        try:
            fval = float(val)
            val = str(int(fval)) if fval == int(fval) else f"{fval:.2f}"
        except ValueError:
            pass
        parts.append(f"{key}: {val}")
    return ", ".join(parts)


def _make_embedding_text(name: str, category: str, attributes_raw: str) -> str:
    parts = [name]
    if category:
        parts.append(f"Категория: {category}")
    attrs = _parse_attributes(attributes_raw)
    if attrs:
        parts.append(attrs)
    return " | ".join(parts)


def _count_csv_lines(path: str) -> int:
    n = 0
    with open(path, "rb") as f:
        for _ in f:
            n += 1
    return n


def _stream_cte(path: str, limit: int | None = None):
    done = 0
    with open(path, encoding="utf-8-sig") as f:
        reader = csv.reader(f, delimiter=";", quotechar='"')
        for row in reader:
            if len(row) < 4:
                continue
            try:
                cte_id = int(row[0])
            except ValueError:
                continue
            yield {
                "cte_id": cte_id,
                "name": row[1].strip(),
                "category": row[2].strip(),
                "attributes": row[3].strip(),
            }
            done += 1
            if limit and done >= limit:
                break


# ── Lifespan ─────────────────────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    qdrant_service.ensure_collection()
    log.info("Microservice ready")
    yield
    await cache_service.close()


app = FastAPI(
    title="CTE Vector Search & Rerank",
    description="Микросервис векторного поиска и реранжирования СТЕ-каталога",
    version="0.1.0",
    lifespan=lifespan,
)


# ═════════════════════════════════════════════════════════════════
# Endpoints
# ═════════════════════════════════════════════════════════════════


@app.post("/search", response_model=SearchResponse)
async def search(req: SearchRequest):
    """Поиск СТЕ по текстовому запросу с реранжированием."""
    state = {
        "query": req.query,
        "top_k": req.top_k,
        "use_rerank": req.use_rerank,
        "query_vector": [],
        "candidates": [],
        "results": [],
        "cached": False,
    }

    result = await search_graph.ainvoke(state)

    items = [
        CTEItem(
            cte_id=r.get("cte_id", 0),
            name=r.get("name", ""),
            category=r.get("category", ""),
            attributes=r.get("attributes", ""),
            score=r.get("score", 0.0),
            rerank_score=r.get("rerank_score"),
        )
        for r in result.get("results", [])
    ]

    return SearchResponse(
        query=req.query,
        results=items,
        cached=result.get("cached", False),
        total_found=len(items),
    )


# ── Indexing ─────────────────────────────────────────────────────


async def _run_indexing(limit: int | None, batch_size: int):
    """Background indexing task."""
    from qdrant_client.models import PointStruct

    global _index_status
    csv_path = os.path.join(settings.data_dir, settings.cte_csv)

    if not Path(csv_path).exists():
        _index_status.update(status="error", message=f"CSV not found: {csv_path}")
        return

    _index_status.update(status="running", message="Counting rows…")
    total_lines = _count_csv_lines(csv_path)
    total = min(limit, total_lines) if limit else total_lines
    _index_status["total"] = total

    log.info("Starting indexing: %d items (batch_size=%d)", total, batch_size)

    batch: list[dict] = []
    indexed = 0
    t0 = time.time()

    for item in _stream_cte(csv_path, limit):
        item["text"] = _make_embedding_text(
            item["name"], item["category"], item["attributes"]
        )
        batch.append(item)

        if len(batch) >= batch_size:
            try:
                ids_to_check = [b["cte_id"] for b in batch]
                existing_points = qdrant_service.client.retrieve(
                    collection_name=qdrant_service.collection,
                    ids=ids_to_check,
                    with_payload=False,
                    with_vectors=False,
                )
                existing_ids = {p.id for p in existing_points}

                new_batch = [b for b in batch if b["cte_id"] not in existing_ids]

                if new_batch:
                    texts = [b["text"] for b in new_batch]
                    vectors = await embedding_service.embed_documents(texts)
                    points = [
                        PointStruct(id=b["cte_id"], vector=v, payload=b)
                        for b, v in zip(new_batch, vectors)
                    ]
                    qdrant_service.upsert_batch(points)
            except Exception as exc:
                log.error("Batch error at %d: %s", indexed, exc)
                _index_status.update(status="error", message=f"Error at {indexed}: {exc}")
                return

            indexed += len(batch)
            pct = indexed / total * 100 if total else 0
            elapsed = time.time() - t0
            # Избегаем деления на ноль, если всё пропускается слишком быстро
            eta = (elapsed / indexed) * (total - indexed) if indexed else 0
            _index_status.update(
                indexed=indexed,
                percent=round(pct, 1),
                message=f"{indexed}/{total} ({pct:.1f}%) — ETA {eta:.0f}s",
            )
            log.info(
                "[%5.1f%%] Indexed %d / %d  (elapsed %.0fs, ETA %.0fs)",
                pct, indexed, total, elapsed, eta,
            )
            batch = []

    # flush remaining
    if batch:
        try:
            ids_to_check = [b["cte_id"] for b in batch]
            existing_points = qdrant_service.client.retrieve(
                collection_name=qdrant_service.collection,
                ids=ids_to_check,
                with_payload=False,
                with_vectors=False,
            )
            existing_ids = {p.id for p in existing_points}

            new_batch = [b for b in batch if b["cte_id"] not in existing_ids]

            if new_batch:
                texts = [b["text"] for b in new_batch]
                vectors = await embedding_service.embed_documents(texts)
                points = [
                    PointStruct(id=b["cte_id"], vector=v, payload=b)
                    for b, v in zip(new_batch, vectors)
                ]
                qdrant_service.upsert_batch(points)
        except Exception as exc:
            log.error("Final batch error: %s", exc)
            _index_status.update(status="error", message=str(exc))
            return
        indexed += len(batch)

    elapsed = time.time() - t0
    _index_status.update(
        status="done",
        indexed=indexed,
        percent=100.0,
        message=f"Done! {indexed} items in {elapsed:.1f}s",
    )
    log.info("Indexing complete: %d items in %.1fs", indexed, elapsed)
    await cache_service.invalidate_all()


@app.post("/index", response_model=IndexStatusResponse)
async def start_indexing(req: IndexRequest, background_tasks: BackgroundTasks):
    """Запустить индексацию СТЕ-каталога (фоновая задача)."""
    global _index_status
    if _index_status["status"] == "running":
        raise HTTPException(409, "Indexing already in progress")

    _index_status = {
        "status": "starting",
        "total": 0,
        "indexed": 0,
        "percent": 0.0,
        "message": "Queued…",
    }
    background_tasks.add_task(_run_indexing, req.limit, req.batch_size)
    return IndexStatusResponse(**_index_status)


@app.get("/index/status", response_model=IndexStatusResponse)
async def index_status():
    """Статус текущей индексации."""
    return IndexStatusResponse(**_index_status)


# ── Utility endpoints ────────────────────────────────────────────


@app.get("/health", response_model=HealthResponse)
async def health():
    redis_ok = await cache_service.ping()
    try:
        pts = qdrant_service.count()
        qdrant_ok = True
    except Exception:
        pts = 0
        qdrant_ok = False

    return HealthResponse(
        status="ok" if (redis_ok and qdrant_ok) else "degraded",
        qdrant=qdrant_ok,
        redis=redis_ok,
        collection_points=pts,
    )


@app.delete("/cache")
async def clear_cache():
    await cache_service.invalidate_all()
    return {"status": "ok", "message": "Cache cleared"}


@app.get("/collection/info")
async def collection_info():
    try:
        return qdrant_service.collection_info()
    except Exception as exc:
        raise HTTPException(500, str(exc))


# ── Entry‑point ──────────────────────────────────────────────────
def start():
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)


if __name__ == "__main__":
    start()
