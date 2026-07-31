# RAILWAY_DEPLOYMENT_ANALYSIS.md — Analyse de Déploiement Railway pour EVO-LOG SaaS
# Date: 2026-07-22
# Statut: VALIDE & DÉPLOYÉ - multi-stage Docker container auto-résilient

## Résumé Exécutif

Après analyse approfondie et mise à jour de la configuration conteneur sur **Railway**, la plateforme **EVO-LOG SaaS** dispose d'un conteneur Docker multi-stage entièrement sécurisé, résilient et adapté à tous les modes de déploiement Railway (qu'il soit initié depuis le sous-dossier `/EVO-LOG-backend` ou depuis la racine `/`).

---

## 🛠️ Correctifs Majeurs Appliqués & Validation Docker (`2a7a66e` & `7c5bea4`)

### 1. Auto-Aplatissement de Contexte dans le Dockerfile
Dans Railway, selon l'option *Root Directory* configurée dans l'interface, le contexte de build peut être la racine du dépôt git ou le dossier `EVO-LOG-backend`.
Pour éviter toute erreur d'importation (`ImportError: cannot import name ...`) ou d'absence de dossier (`lstat /EVO-LOG-backend: no such file or directory`), les fichiers [`EVO-LOG-backend/Dockerfile`](file:///d:/Projet/ERP/EVO-LOG/EVO-LOG-backend/Dockerfile) et [`Dockerfile`](file:///d:/Projet/ERP/EVO-LOG/Dockerfile) de racine intègrent la règle d'auto-aplatissement :

```dockerfile
# Stage 1: Builder
FROM python:3.12-slim AS builder
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends gcc libffi-dev libssl-dev && rm -rf /var/lib/apt/lists/*
COPY . .
RUN if [ -f requirements.txt ]; then pip wheel --no-cache-dir --no-deps --wheel-dir /app/wheels -r requirements.txt; elif [ -f EVO-LOG-backend/requirements.txt ]; then pip wheel --no-cache-dir --no-deps --wheel-dir /app/wheels -r EVO-LOG-backend/requirements.txt; fi

# Stage 2: Runtime
FROM python:3.12-slim
WORKDIR /app
RUN groupadd -r EVO-LOG && useradd -m -r -g EVO-LOG EVO-LOG
RUN apt-get update && apt-get install -y --no-install-recommends libcairo2 libpango-1.0-0 libpangocairo-1.0-0 libgdk-pixbuf-2.0-0 && rm -rf /var/lib/apt/lists/*
COPY --from=builder /app/wheels /wheels
RUN pip install --no-cache /wheels/*
COPY --chown=EVO-LOG:EVO-LOG . .
RUN if [ -d "/app/EVO-LOG-backend" ]; then cp -rn /app/EVO-LOG-backend/* /app/ && rm -rf /app/EVO-LOG-backend; fi
RUN chmod +x start.sh
USER EVO-LOG
EXPOSE 8000
CMD ["./start.sh"]
```

---

### 2. Résilience du Script de Démarrage (`start.sh`) & Enregistrement des Routeurs
- **PostgreSQL Waiter** : Utilise `pg_isready` pour s'assurer que le plugin PostgreSQL Railway répond.
- **SQLAlchemy Table Setup & Alembic Stamp** : Re-crée dynamiquement la structure des tables et applique `stamp_revision fe8383ba3889` pour garantir la compatibilité des migrations.
- **Seeder Idempotent** : Exécute `python scripts/seed_data.py` pour alimenter les 8 comptes de test métiers (`admin`, `magasinier`, `kamga`, `qhse`, `financier`, `douane`, `parc`, `auditor`).
- **Enregistrement Sécurisé des Routeurs (`app/main.py`)** : Encapsulé dans la fonction `safe_include_router()` qui valide la présence et le type de l'attribut `router` dans chaque module avant l'inclusion, évitant tout plantage sur les stubs.

---

## 🔑 Variables d'Environnement Railway

### Configuraion Automatique (Railway Plugins) :
- `DATABASE_URL` : Injecté automatiquement par le plugin PostgreSQL.
- `REDIS_URL` : Injecté automatiquement par le plugin Redis (utilisé pour SlowAPI, idempotence et Celery).

### Configuration Manuelle à Renseigner sur Railway :
- `JWT_SECRET_KEY` : Chaîne secrète complexe (minimum 32 caractères).
- `SEED_DATA` : Définir à `true` lors du premier déploiement pour populer les comptes seeders.
- `ALLOWED_ORIGINS` : `https://EVO-LOG-frontend.vercel.app`

---

## 📈 Vérification de Santé (Healthcheck Endpoint)

- **Path** : `/api/health`
- **Port** : `8000`
- **Code HTTP** : 200 OK
- **Structure Réponse** :
  ```json
  {
    "status": "ok",
    "service": "EVO-LOG SaaS",
    "version": "1.0.0"
  }
  ```

---

## 🚢 Statut des Dépôts Git & Commits
Le commit `7c5bea4` (*fix(docker): resolve lstat EVO-LOG-backend error in Dockerfile builder stage*) est totalement synchronisé sur les branches `develop`, `main`, `master`, `railway/code-change-K4BZqy` et `railway/code-change-oly86s` des dépôts distants `logistique` et `origin`.