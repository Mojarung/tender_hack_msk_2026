"""NVIDIA NIM Reranker via direct HTTP (no LangChain wrapper needed)."""

from __future__ import annotations

import logging

import httpx

from app.config import Settings

log = logging.getLogger(__name__)


class RerankerService:
    def __init__(self, settings: Settings) -> None:
        self.url = settings.rerank_url
        self.api_key = settings.nvidia_rerank_api_key
        self.model = settings.rerank_model
        self.max_passages = settings.rerank_max_passages

    async def rerank(
        self,
        query: str,
        passages: list[dict],
        top_k: int | None = None,
    ) -> list[dict]:
        """Re‑rank *passages* for *query*.  Each passage dict MUST have a 'text' key."""
        if not passages:
            return []

        # Trim to max passages the API can handle in one shot
        trimmed = passages[: self.max_passages]

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Accept": "application/json",
        }
        payload = {
            "model": self.model,
            "query": {"text": query},
            "passages": [{"text": p["text"]} for p in trimmed],
        }

        async with httpx.AsyncClient(timeout=60) as client:
            resp = await client.post(self.url, headers=headers, json=payload)
            resp.raise_for_status()
            body = resp.json()

        rankings = body.get("rankings", [])
        for r in rankings:
            idx = r["index"]
            trimmed[idx]["rerank_score"] = r["logit"]

        ranked = sorted(trimmed, key=lambda x: x.get("rerank_score", -999), reverse=True)

        if top_k:
            ranked = ranked[:top_k]
        return ranked
