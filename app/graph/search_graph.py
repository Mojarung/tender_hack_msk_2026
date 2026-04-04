"""LangGraph search pipeline: cache → embed → vector_search → rerank → cache_save."""

from __future__ import annotations

import logging
from typing import TypedDict

from langgraph.graph import END, StateGraph

from app.services.cache import CacheService
from app.services.embeddings import EmbeddingService
from app.services.qdrant_service import QdrantService
from app.services.reranker import RerankerService

log = logging.getLogger(__name__)


# ── State ────────────────────────────────────────────────────────
class SearchState(TypedDict, total=False):
    # inputs
    query: str
    top_k: int
    use_rerank: bool
    # intermediate
    query_vector: list[float]
    candidates: list[dict]
    # outputs
    results: list[dict]
    cached: bool


# ── Graph builder ────────────────────────────────────────────────
def build_search_graph(
    embedding_service: EmbeddingService,
    qdrant_service: QdrantService,
    reranker_service: RerankerService,
    cache_service: CacheService,
):
    # ── node functions ───────────────────────────────────────

    async def check_cache(state: SearchState) -> dict:
        cached = await cache_service.get(
            state["query"], state["top_k"], state.get("use_rerank", True)
        )
        if cached:
            log.info("Cache hit for '%s'", state["query"])
            return {"results": cached["results"], "cached": True}
        return {"cached": False}

    async def embed(state: SearchState) -> dict:
        vector = await embedding_service.embed_query(state["query"])
        return {"query_vector": vector}

    async def vector_search(state: SearchState) -> dict:
        multiplier = 5 if state.get("use_rerank", True) else 1
        fetch_k = state["top_k"] * multiplier
        results = qdrant_service.search(state["query_vector"], top_k=fetch_k)
        log.info("Vector search returned %d candidates", len(results))
        return {"candidates": results}

    async def rerank(state: SearchState) -> dict:
        if not state.get("use_rerank", True) or not state.get("candidates"):
            return {"results": (state.get("candidates") or [])[: state["top_k"]]}

        reranked = await reranker_service.rerank(
            state["query"],
            state["candidates"],
            top_k=state["top_k"],
        )
        log.info("Reranked to %d results", len(reranked))
        return {"results": reranked}

    async def save_cache(state: SearchState) -> dict:
        await cache_service.set(
            state["query"],
            state["top_k"],
            state.get("use_rerank", True),
            {"results": state.get("results", [])},
        )
        return {}

    # ── routing ──────────────────────────────────────────────

    def after_cache(state: SearchState) -> str:
        if state.get("cached"):
            return "end"
        return "embed"

    # ── build graph ──────────────────────────────────────────

    g = StateGraph(SearchState)

    g.add_node("check_cache", check_cache)
    g.add_node("embed", embed)
    g.add_node("vector_search", vector_search)
    g.add_node("rerank", rerank)
    g.add_node("save_cache", save_cache)

    g.set_entry_point("check_cache")
    g.add_conditional_edges(
        "check_cache",
        after_cache,
        {"end": END, "embed": "embed"},
    )
    g.add_edge("embed", "vector_search")
    g.add_edge("vector_search", "rerank")
    g.add_edge("rerank", "save_cache")
    g.add_edge("save_cache", END)

    return g.compile()
