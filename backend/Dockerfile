FROM python:3.12-slim

RUN apt-get update && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*

ENV POETRY_VERSION=1.7.1
RUN curl -sSL https://install.python-poetry.org | python3 -
ENV PATH="/root/.local/bin:${PATH}"

WORKDIR /app
COPY pyproject.toml poetry.lock ./

# Either use Solution 1:
RUN poetry config virtualenvs.create false \
    && poetry install --no-interaction --no-ansi

# Or Solution 3:
# RUN poetry config virtualenvs.create false \
#     && poetry install --no-interaction --no-ansi --only main

COPY . .

EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--root-path", "/api"]