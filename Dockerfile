FROM python:3.12-slim

# install uv
COPY --from=ghcr.io/astral-sh/uv:latest /uv /usr/local/bin/uv

WORKDIR /app

# copy dependency manifest first (layer cache)
COPY pyproject.toml ./

# install deps
RUN uv sync --no-dev

# copy application code
COPY app/ ./app/
COPY scripts/ ./scripts/

# default: run the API server
CMD ["uv", "run", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
