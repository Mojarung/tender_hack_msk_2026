"""Qdrant vector‑store operations."""

from __future__ import annotations

import logging

from qdrant_client import QdrantClient
from qdrant_client.models import (
    Distance,
    PointStruct,
    VectorParams,
)

from app.config import Settings

log = logging.getLogger(__name__)


class QdrantService:
    def __init__(self, settings: Settings) -> None:
        self.client = QdrantClient(
            host=settings.qdrant_host,
            port=settings.qdrant_port,
        )
        self.collection = settings.qdrant_collection
        self.dim = settings.embedding_dim

    # ── collection management ────────────────────────────────
    def ensure_collection(self) -> None:
        import time

        from qdrant_client.http.exceptions import ResponseHandlingException

        max_retries = 10
        retry_delay = 1
        for i in range(max_retries):
            try:
                existing = [c.name for c in self.client.get_collections().collections]
                if self.collection not in existing:
                    self.client.create_collection(
                        collection_name=self.collection,
                        vectors_config=VectorParams(
                            size=self.dim,
                            distance=Distance.COSINE,
                        ),
                    )
                    log.info("Created Qdrant collection '%s'", self.collection)
                else:
                    log.info("Qdrant collection '%s' already exists", self.collection)
                break
            except (ResponseHandlingException, Exception) as e:
                if i < max_retries - 1:
                    log.warning(
                        "Attempt %d/%d: Connection to Qdrant failed, retrying in %ds... (%s)",
                        i + 1,
                        max_retries,
                        retry_delay,
                        str(e),
                    )
                    time.sleep(retry_delay)
                    retry_delay *= 2
                else:
                    log.error("Failed to connect to Qdrant after %d attempts.", max_retries)
                    raise e

    def drop_collection(self) -> None:
        self.client.delete_collection(self.collection)
        log.info("Dropped collection '%s'", self.collection)

    def collection_info(self) -> dict:
        info = self.client.get_collection(self.collection)
        return {
            "name": self.collection,
            "points_count": info.points_count,
            "status": info.status.value if info.status else "unknown",
        }

    # ── write ────────────────────────────────────────────────
    def upsert_batch(self, points: list[PointStruct]) -> None:
        self.client.upsert(
            collection_name=self.collection,
            points=points,
        )

    # ── read ─────────────────────────────────────────────────
    def search(self, query_vector: list[float], top_k: int = 50) -> list[dict]:
        hits = self.client.query_points(
            collection_name=self.collection,
            query=query_vector,
            limit=top_k,
            with_payload=True,
        )
        results = []
        for hit in hits.points:
            results.append(
                {
                    "cte_id": hit.payload.get("cte_id"),
                    "name": hit.payload.get("name"),
                    "category": hit.payload.get("category"),
                    "attributes": hit.payload.get("attributes"),
                    "text": hit.payload.get("text"),
                    "score": hit.score,
                }
            )
        return results

    def count(self) -> int:
        try:
            info = self.client.get_collection(self.collection)
            return info.points_count or 0
        except Exception:
            return 0
