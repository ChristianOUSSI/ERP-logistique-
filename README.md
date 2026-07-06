# KAMLOG EM-ERP

Monorepo ERP logistique portuaire compose d'un backend FastAPI et d'un frontend Next.js.

## Structure

```text
KAMLOG-EM-ERP/
├── docs/                Documentation maintenue
├── kamlog-backend/      API FastAPI + migrations + tests
├── kamlog-frontend/     Frontend Next.js 14 + Playwright
├── references/          Maquettes et references HTML conservees
├── scripts/             Scripts d'infrastructure
└── tools/               Outils de maintenance et utilitaires docs
```

## Documentation

- Vue d'ensemble: `docs/README.md`
- Architecture: `docs/ARCHITECTURE.md`
- API: `docs/API_DOCUMENTATION.md`
- Deploiement: `docs/DEPLOYMENT.md`
- Railway/Vercel: `docs/RAILWAY_DEPLOYMENT.md`
- Etat du projet: `docs/STATUT_GLOBAL_PROJET.md`
- Verification et tests: `docs/TESTING_CHECKLIST.md`
- Travail restant: `docs/TODO.md`

## Demarrage rapide

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

### Stack locale Docker

```bash
docker-compose up -d
```

Services exposes:

- Frontend: `http://localhost:3000`
- API: `http://localhost:8000`
- Swagger: `http://localhost:8000/api/docs`
- MinIO Console: `http://localhost:9001`

## Notes de nettoyage

- Les artefacts `.kilo` et `.cora` ne font plus partie du depot.
- Les fichiers generes frontend (`playwright-report/`, `test-results/`, `*.tsbuildinfo`) sont ignores.
- Le dossier `references/` est conserve volontairement comme base de maquettes et de comparaison visuelle.
