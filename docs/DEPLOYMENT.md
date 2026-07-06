# Guide de Deploiement

## Perimetre actuel

Le depot fournit aujourd'hui une stack locale et un socle de deploiement simple autour de:

- PostgreSQL
- Redis
- MinIO
- FastAPI
- Next.js

Le fichier `docker-compose.yml` est la reference d'execution actuelle.

## Demarrage local avec Docker

Depuis la racine du depot:

```bash
docker-compose up -d
```

Services disponibles:

- Frontend: `http://localhost:3000`
- API: `http://localhost:8000`
- Swagger: `http://localhost:8000/api/docs`
- PostgreSQL: `localhost:5432`
- Redis: `localhost:6379`
- MinIO API: `localhost:9000`
- MinIO Console: `localhost:9001`

## Demarrage local sans Docker

### Backend

```bash
cd kamlog-backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
alembic upgrade head
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend

```bash
cd kamlog-frontend
npm install
copy .env.local.example .env.local
npm run dev
```

## Variables importantes

### Backend

- `DATABASE_URL`
- `REDIS_URL`
- `JWT_SECRET_KEY`
- `MINIO_ENDPOINT`
- `MINIO_ACCESS_KEY`
- `MINIO_SECRET_KEY`
- `MINIO_BUCKET_DOCUMENTS`

### Frontend

- `NEXT_PUBLIC_API_URL`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`

## Migrations et donnees

Appliquer les migrations:

```bash
cd kamlog-backend
alembic upgrade head
```

Charger des donnees de base si necessaire:

```bash
python scripts/seed_data.py
```

## Verification minimale avant mise en ligne

- `GET /api/health` repond
- Swagger est accessible
- login frontend fonctionne
- build frontend fonctionne
- tests backend critiques passent

## Ce que ce guide ne couvre pas encore

- orchestration de worker d'arriere-plan
- monitoring d'exploitation complet
- procedure officielle de backup/restauration
- runbook de mise en production detaille par environnement
