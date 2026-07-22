# CLAUDE.md — Directives & Commandes KAMLOG EM-ERP

Ce document contient les instructions et commandes de référence pour l'utilisation des assistants de code sur le dépôt **KAMLOG EM-ERP**.

---

## 🛠️ Commandes Fréquentes

### Backend (`kamlog-backend`)
- **Installation dépendances** : `cd kamlog-backend && pip install -r requirements.txt`
- **Initialisation & Seeder BDD** : `cd kamlog-backend && python scripts/seed_data.py`
- **Exécution migrations Alembic** : `cd kamlog-backend && alembic upgrade head`
- **Création d'une migration** : `cd kamlog-backend && alembic revision --autogenerate -m "description"`
- **Démarrage serveur dev** : `cd kamlog-backend && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000`
- **Exécution tests Pytest** : `cd kamlog-backend && pytest`
- **Test unitaire ciblé** : `cd kamlog-backend && pytest tests/unit/test_magasin_service.py`

### Frontend (`kamlog-frontend`)
- **Installation dépendances** : `cd kamlog-frontend && npm install`
- **Démarrage serveur dev** : `cd kamlog-frontend && npm run dev`
- **Validation Build Production** : `cd kamlog-frontend && npm run build` (Doit générer 153/153 pages statiques sans erreur)
- **Linter TypeScript/Next.js** : `cd kamlog-frontend && npm run lint`
- **Exécution tests E2E (Playwright)** : `cd kamlog-frontend && npx playwright test`

### Stack Docker Locale
- **Démarrer tous les services** : `docker-compose up -d --build`
- **Arrêter la stack** : `docker-compose down`
- **Voir les journaux API** : `docker logs -f kamlog_api`

---

## 🏗️ Architecture du Projet

### Monolithe Modulaire Découplé
- **Frontend** : Next.js 14 (App Router), Vanilla CSS Design System, Icônes PWA 3D Métalliques (`512x512`, `192x192`, `apple-touch-icon.png`, `favicon.ico`).
- **Backend** : FastAPI 0.115, SQLAlchemy 2.0, PostgreSQL (ou SQLite dev local), Alembic, Celery, Redis, WeasyPrint.
- **Rôles & RBAC** : Rôles stricts (`ADMIN`, `MAGASINIER`, `DISPATCHER`, `QHSE`, `FINANCIER`, `DOUANE`, `PARC`, `AUDITOR`) avec contrôle dynamique `modules_allowed`.

### Organisation Backend (`kamlog-backend`)
- `app/main.py` : Point d'entrée FastAPI, middleware d'audit, SlowAPI rate limiting, `safe_include_router()` pour l'enregistrement résilient des 19 routeurs.
- `app/routers/v1/` : Routeurs v1 (auth, tiers, transport, finance, parc, magasin, qhse, acconage, maintenance, fuelguard, etc.).
- `app/models/` : Modèles SQLAlchemy (User, RoleModel, PermissionModel, Agency, Tiers, Mission, Stock, etc.).
- `app/schemas/` : Contrats de validation Pydantic v2.
- `app/services/` : Orchestration de la logique métier.
- `app/utils/` : Sécurité, hashage bcrypt, monitoring Prometheus, logs, WeasyPrint PDF.
- `scripts/seed_data.py` : Seeder idempotent alimentant la BDD avec 8 comptes opérationnels réels.

### Organisation Frontend (`kamlog-frontend`)
- `src/app/(auth)` : Écrans de connexion CADC avec splash screen gold et gestion de thème.
- `src/app/(app)` : 14 espaces applicatifs métiers (153 routes Next.js compilées).
- `src/components/layout/` : Layout global, Sidebar dynamique avec cadenas 🔒 et modale d'accès restreint.
- `src/lib/auth.ts` : Configuration NextAuth v4 synchronisée avec le backend et le RBAC.
- `public/` : Manifest PWA, Service Worker `sw.js`, assets 3D metallic icons.

---

## 🔐 Règles Spécifiques & Sécurité

1. **Jamais de données factices en dur** : Tous les seeders créent de réelles entités métiers en base de données.
2. **Mots de passe par défaut** : Le mot de passe initial des utilisateurs de test est `admin123`. La politique `must_change_password` impose un renouvellement sous 90 jours.
3. **Résilience Docker Railway** : Le `Dockerfile` intègre la règle d'auto-aplatissement `cp -rn /app/kamlog-backend/* /app/` pour fonctionner aussi bien depuis la racine `/` que depuis le sous-dossier `/kamlog-backend`.