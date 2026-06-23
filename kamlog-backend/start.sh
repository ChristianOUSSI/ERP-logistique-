#!/bin/bash
set -e

echo "🚀 KAMLOG EM-ERP - Starting deployment sequence..."

# ─── Attendre que PostgreSQL soit prêt ───────────────────────
echo "⏳ Waiting for PostgreSQL to be ready..."
MAX_RETRIES=30
RETRY_COUNT=0

until python -c "
import asyncio
import asyncpg
import os
import sys

async def check():
    url = os.environ.get('DATABASE_URL', '')
    # Convertir en format asyncpg natif si nécessaire
    url = url.replace('postgresql+asyncpg://', 'postgresql://')
    url = url.replace('postgres://', 'postgresql://')
    try:
        conn = await asyncpg.connect(url, timeout=5)
        await conn.close()
        sys.exit(0)
    except Exception as e:
        print(f'DB not ready: {e}', flush=True)
        sys.exit(1)

asyncio.run(check())
" 2>/dev/null; do
    RETRY_COUNT=$((RETRY_COUNT + 1))
    if [ "$RETRY_COUNT" -ge "$MAX_RETRIES" ]; then
        echo "❌ PostgreSQL not available after $MAX_RETRIES attempts. Exiting."
        exit 1
    fi
    echo "  → Retrying ($RETRY_COUNT/$MAX_RETRIES)..."
    sleep 2
done

echo "✅ PostgreSQL is ready!"

# ─── Créer les tables via SQLAlchemy ─────────────────────────
echo "📋 Creating database tables..."
python create_tables.py
echo "✅ Tables created (or already exist)"

# ─── Alembic stamp (marquer comme à jour si pas déjà fait) ───
echo "📌 Stamping Alembic migrations..."
alembic stamp head 2>/dev/null || echo "⚠️  Alembic stamp skipped (may already be stamped)"

# ─── Seeders si SEED_DATA=true ───────────────────────────────
if [ "$SEED_DATA" = "true" ]; then
    echo "🌱 Running seed data..."
    python scripts/seed_data.py || echo "⚠️  Seed data failed or already seeded"
fi

# ─── Démarrer Uvicorn ────────────────────────────────────────
echo "🌐 Starting FastAPI on port ${PORT:-8000}..."
exec uvicorn app.main:app --host 0.0.0.0 --port "${PORT:-8000}" --workers 1 --loop uvloop
