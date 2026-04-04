"""Redis‑backed query cache."""

from __future__ import annotations

import hashlib
import json
import logging

import redis.asyncio as aioredis

from app.config import Settings

log = logging.getLogger(__name__)


class CacheService:
    def __init__(self, settings: Settings) -> None:
        self.redis = aioredis.from_url(
            settings.redis_url,
            decode_responses=True,
        )
        self.ttl = settings.cache_ttl

    # ── helpers ──────────────────────────────────────────────
    @staticmethod
    def _key(query: str, top_k: int, use_rerank: bool) -> str:
        raw = f"cte_search:{query}:{top_k}:{use_rerank}"
        return f"cache:{hashlib.sha256(raw.encode()).hexdigest()}"

    # ── public API ───────────────────────────────────────────
    async def get(
        self, query: str, top_k: int, use_rerank: bool
    ) -> dict | None:
        key = self._key(query, top_k, use_rerank)
        data = await self.redis.get(key)
        if data:
            log.debug("Cache HIT for '%s'", query)
            return json.loads(data)
        log.debug("Cache MISS for '%s'", query)
        return None

    async def set(
        self, query: str, top_k: int, use_rerank: bool, payload: dict
    ) -> None:
        key = self._key(query, top_k, use_rerank)
        await self.redis.set(
            key,
            json.dumps(payload, ensure_ascii=False, default=str),
            ex=self.ttl,
        )

    async def invalidate_all(self) -> None:
        """Flush the whole cache DB (useful after re‑indexing)."""
        await self.redis.flushdb()
        log.info("Cache invalidated")

    async def ping(self) -> bool:
        try:
            return await self.redis.ping()
        except Exception:
            return False

    async def close(self) -> None:
        await self.redis.aclose()
