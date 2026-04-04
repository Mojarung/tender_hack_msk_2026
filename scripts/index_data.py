#!/usr/bin/env python3
"""CLI indexing script.

Usage:
    uv run python scripts/index_data.py --limit 100        # first 100
    uv run python scripts/index_data.py                    # ALL (with progress %)
    uv run python scripts/index_data.py --batch-size 200   # custom batch
    uv run python scripts/index_data.py --recreate         # drop & recreate collection
"""

from __future__ import annotations

import argparse
import asyncio
import csv
import logging
import os
import sys
import time
from pathlib import Path

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from qdrant_client.models import PointStruct

from app.config import Settings
from app.services.embeddings import EmbeddingService
from app.services.qdrant_service import QdrantService

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)-7s | %(message)s",
)
log = logging.getLogger("indexer")


# ── helpers ──────────────────────────────────────────────────────

def _parse_attributes(raw: str) -> str:
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


def count_lines(path: str) -> int:
    n = 0
    with open(path, "rb") as f:
        for _ in f:
            n += 1
    return n


def stream_cte(path: str, limit: int | None = None):
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


# ── main ─────────────────────────────────────────────────────────

async def run(args: argparse.Namespace) -> None:
    settings = Settings()
    csv_path = os.path.join(settings.data_dir, settings.cte_csv)

    if not Path(csv_path).exists():
        log.error("CSV file not found: %s", csv_path)
        sys.exit(1)

    embed_svc = EmbeddingService(settings)
    qdrant_svc = QdrantService(settings)

    if args.recreate:
        log.info("Dropping existing collection…")
        try:
            qdrant_svc.drop_collection()
        except Exception:
            pass

    qdrant_svc.ensure_collection()

    log.info("Counting CSV rows…")
    total_lines = count_lines(csv_path)
    total = min(args.limit, total_lines) if args.limit else total_lines
    log.info("Will index %d / %d rows  (batch_size=%d)", total, total_lines, args.batch_size)

    batch: list[dict] = []
    indexed = 0
    errors = 0
    t0 = time.time()

    for item in stream_cte(csv_path, args.limit):
        item["text"] = _make_embedding_text(item["name"], item["category"], item["attributes"])
        batch.append(item)

        if len(batch) >= args.batch_size:
            try:
                texts = [b["text"] for b in batch]
                vectors = await embed_svc.embed_documents(texts)
                points = [
                    PointStruct(id=b["cte_id"], vector=v, payload=b)
                    for b, v in zip(batch, vectors)
                ]
                qdrant_svc.upsert_batch(points)
            except Exception as exc:
                log.error("Batch error at %d: %s", indexed, exc)
                errors += 1
                batch = []
                continue

            indexed += len(batch)
            pct = indexed / total * 100 if total else 0
            elapsed = time.time() - t0
            speed = indexed / elapsed if elapsed else 0
            eta = (total - indexed) / speed if speed else 0
            log.info(
                "[%5.1f%%]  %d / %d  |  %.0f items/s  |  elapsed %.0fs  |  ETA %.0fs",
                pct, indexed, total, speed, elapsed, eta,
            )
            batch = []

    # flush tail
    if batch:
        try:
            texts = [b["text"] for b in batch]
            vectors = await embed_svc.embed_documents(texts)
            points = [
                PointStruct(id=b["cte_id"], vector=v, payload=b)
                for b, v in zip(batch, vectors)
            ]
            qdrant_svc.upsert_batch(points)
            indexed += len(batch)
        except Exception as exc:
            log.error("Final batch error: %s", exc)
            errors += 1

    elapsed = time.time() - t0
    log.info("═" * 60)
    log.info("DONE  %d indexed  |  %d errors  |  %.1fs", indexed, errors, elapsed)
    log.info("═" * 60)
    log.info("Collection: %s", qdrant_svc.collection_info())


def main():
    parser = argparse.ArgumentParser(description="Index CTE data → Qdrant")
    parser.add_argument("--limit", type=int, default=None, help="Items to index (default: all)")
    parser.add_argument("--batch-size", type=int, default=100, help="Batch size (default: 100)")
    parser.add_argument("--recreate", action="store_true", help="Drop & recreate collection")
    args = parser.parse_args()
    asyncio.run(run(args))


if __name__ == "__main__":
    main()
