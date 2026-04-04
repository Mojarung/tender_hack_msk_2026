from __future__ import annotations

from pydantic import BaseModel


# ── Search ──────────────────────────────────────────────────────
class SearchRequest(BaseModel):
    query: str
    top_k: int = 10
    use_rerank: bool = True


class CTEItem(BaseModel):
    cte_id: int
    name: str
    category: str
    attributes: str
    score: float = 0.0
    rerank_score: float | None = None


class SearchResponse(BaseModel):
    query: str
    results: list[CTEItem] = []
    cached: bool = False
    total_found: int = 0


# ── Index ───────────────────────────────────────────────────────
class IndexRequest(BaseModel):
    limit: int | None = None
    batch_size: int = 100


class IndexStatusResponse(BaseModel):
    status: str
    total: int = 0
    indexed: int = 0
    percent: float = 0.0
    message: str = ""


# ── Health ──────────────────────────────────────────────────────
class HealthResponse(BaseModel):
    status: str
    qdrant: bool
    redis: bool
    collection_points: int = 0
