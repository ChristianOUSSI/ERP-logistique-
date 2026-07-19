# Multi-stage Dockerfile pour KAMLOG-EM-ERP Backend

# Stage 1: Builder
FROM python:3.12-slim AS builder

WORKDIR /app

# Installer les dépendances système de build
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libffi-dev \
    libssl-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip wheel --no-cache-dir --no-deps --wheel-dir /app/wheels -r requirements.txt


# Stage 2: Production Runtime
FROM python:3.12-slim

WORKDIR /app

# Création d'un utilisateur non-root pour des raisons de sécurité
RUN groupadd -r kamlog && useradd -m -r -g kamlog kamlog

# Installer les dépendances système requises au runtime (WeasyPrint)
RUN apt-get update && apt-get install -y --no-install-recommends \
    libcairo2 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libgdk-pixbuf-2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Copier les wheels et installer
COPY --from=builder /app/wheels /wheels
COPY --from=builder /app/requirements.txt .
RUN pip install --no-cache /wheels/*

# Copier le code source
COPY --chown=kamlog:kamlog . .

RUN chmod +x start.sh

# Passer à l'utilisateur non-root
USER kamlog
ENV XDG_CACHE_HOME=/home/kamlog/.cache

EXPOSE 8000

# Commande de démarrage (généralement via docker-compose)
CMD ["./start.sh"]
