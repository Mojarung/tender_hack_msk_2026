from __future__ import annotations

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # ── NVIDIA API ──────────────────────────────────────────────
    nvidia_embed_api_key: str = ""
    nvidia_rerank_api_key: str = ""

    embed_model: str = "nvidia/llama-nemotron-embed-1b-v2"
    rerank_model: str = "nvidia/llama-nemotron-rerank-1b-v2"
    rerank_url: str = (
        "https://ai.api.nvidia.com/v1/retrieval/"
        "nvidia/llama-nemotron-rerank-1b-v2/reranking"
    )

    embedding_dim: int = 2048
    max_text_chars: int = 4000

    # ── Qdrant ──────────────────────────────────────────────────
    qdrant_host: str = "localhost"
    qdrant_port: int = 6333
    qdrant_collection: str = "cte_catalog"

    # ── Redis (cache) ──────────────────────────────────────────
    redis_url: str = "redis://localhost:6379/0"
    cache_ttl: int = 3600

    # ── Search defaults ─────────────────────────────────────────
    search_top_k: int = 10
    rerank_max_passages: int = 60

    # ── Indexing ────────────────────────────────────────────────
    index_batch_size: int = 100

    # ── Data ────────────────────────────────────────────────────
    data_dir: str = "./data"
    cte_csv: str = "cte.csv"

    model_config = {"env_file": ".env", "extra": "ignore"}
