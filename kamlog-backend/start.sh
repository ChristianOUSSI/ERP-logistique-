#!/bin/bash
set -e
export PYTHONPATH=.


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
" ; do
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
# Désactivé: Alembic doit gérer le schéma pour éviter DuplicateTableError
# python create_tables.py
# echo "✅ Tables created (or already exist)"

# ─── Alembic upgrade (appliquer les migrations) ───
echo "📌 Running Alembic migrations..."
alembic upgrade head || echo "⚠️  Alembic upgrade failed (check logs)"

# ─── Vérifier que les tables critiques existent ─────────────
python - <<'PY'
import os
import sys
from sqlalchemy import create_engine, text
from app.utils.bootstrap import get_missing_required_tables

url = os.environ.get('DATABASE_URL', '')
if not url:
    print('⚠️ DATABASE_URL not set; skipping bootstrap table check', flush=True)
    sys.exit(0)

engine = create_engine(url.replace('+asyncpg', '').replace('+aiosqlite', ''), future=True)
with engine.connect() as conn:
    result = conn.execute(text("SELECT tablename FROM pg_tables WHERE schemaname = current_schema()"))
    existing_tables = {row[0] for row in result.fetchall()}
    missing = get_missing_required_tables(existing_tables)
    if missing:
        print(f'⚠️ Required tables missing after migrations: {missing}', flush=True)
        sys.exit(2)
    print('✅ Core tables present; proceeding with seed if enabled', flush=True)
PY
bootstrap_status=$?
if [ "$bootstrap_status" -ne 0 ]; then
    echo "⚠️ Bootstrap table check failed; skipping seed to avoid startup errors"
    exit 0
fi

# ─── Seeders si SEED_DATA=true ───────────────────────────────
if [ "$SEED_DATA" = "true" ]; then
    echo "🌱 Running seed data..."
    python scripts/seed_data.py || echo "⚠️  Seed data failed or already seeded"
fi

# ─── Démarrer Uvicorn ────────────────────────────────────────
echo "🌐 Starting FastAPI on port ${PORT:-8000}..."
exec uvicorn app.main:app --host 0.0.0.0 --port "${PORT:-8000}" --workers 1 --loop uvloop
