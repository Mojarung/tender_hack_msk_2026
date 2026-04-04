"""Wrapper around NVIDIA NIM Embeddings API via langchain."""

from __future__ import annotations

import asyncio
import logging
from functools import lru_cache

from langchain_nvidia_ai_endpoints import NVIDIAEmbeddings

from app.config import Settings

log = logging.getLogger(__name__)


class EmbeddingService:
    def __init__(self, settings: Settings) -> None:
        self.client = NVIDIAEmbeddings(
            model=settings.embed_model,
            api_key=settings.nvidia_embed_api_key,
            truncate="END",  # auto‑truncate to stay within 8 192 tokens
        )
        self.max_chars = settings.max_text_chars

    # ── helpers ──────────────────────────────────────────────
    def _truncate(self, text: str) -> str:
        if len(text) > self.max_chars:
            return text[: self.max_chars]
        return text

    # ── public API ───────────────────────────────────────────
    async def embed_query(self, text: str) -> list[float]:
        text = self._truncate(text)
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(None, self.client.embed_query, text)

    async def embed_documents(self, texts: list[str]) -> list[list[float]]:
        truncated = [self._truncate(t) for t in texts]
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(
            None, self.client.embed_documents, truncated
        )
