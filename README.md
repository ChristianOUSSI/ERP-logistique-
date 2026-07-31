# EVO-LOG SaaS — Plateforme ERP Logistique Portuaire & Transit (v2.0)

**EVO-LOG SaaS** est une solution ERP d'entreprise haute performance dédiée à la gestion des opérations logistiques, portuaires, douanières, de transport, de parc et de stockage d'entrepôt (WMS) en Afrique Centrale.

---

## 🌟 Présentation Générale & Technologies

La plateforme repose sur un monolithe modulaire moderne avec découplage strict entre l'API REST backend et l'application web PWA frontend :

- **Frontend (`EVO-LOG-frontend`)** : Next.js 14 (App Router), TypeScript, Système de Design Vanilla CSS 3D Metallique / Indigo, PWA complète (Service Worker, Bannières d'installation PWA, Icônes 3D metallic 512x512/192x192, Apple Touch Icon, Favicon).
- **Backend (`EVO-LOG-backend`)** : FastAPI 0.115, Python 3.12, SQLAlchemy 2.0, PostgreSQL (Production) / SQLite (Dev), Alembic, Celery, Redis, WeasyPrint (Génération PDF).
- **Contrôle d'Accès par Module (RBAC)** : Gestion fine des rôles et autorisations par module (`modules_allowed`), verrouillage dynamique des menus de la Sidebar avec icônes de cadenas 🔒 et modale d'accès restreint.
- **Seeder de Données Opérationnelles** : Script d'initialisation idempotent alimentant 8 comptes utilisateurs réels (`admin`, `magasinier`, `kamga`, `qhse`, `financier`, `douane`, `parc`, `auditor`) liés à des entités métiers réelles (Agences, Tiers, Missions, Stocks).

---

## 📁 Structure du Monorepo

```text
EVO-LOG/
├── docs/                        Documentation officielle complète et à jour
│   ├── API_DOCUMENTATION.md     Cartographie complète des 19 routeurs FastAPI
│   ├── ARCHITECTURE.md          Architecture technique (FastAPI, Next.js 14, RBAC)
│   ├── DEPLOYMENT.md            Guide de déploiement (Railway, Vercel, Docker)
│   ├── STATUT_GLOBAL_PROJET.md  Bilan fonctionnel et statut 100% à jour
│   └── TESTING_CHECKLIST.md     Matrice de tests et procédures de validation
├── EVO-LOG-backend/              API FastAPI + migrations Alembic + seeders + Dockerfile
│   ├── app/                     Code source FastAPI (routers, models, services, utils)
│   ├── scripts/                 Scripts d'initialisation (seed_data.py)
│   ├── start.sh                 Script d'entrée conteneur résilient
│   └── Dockerfile               Dockerfile multi-stage auto-résilient
├── EVO-LOG-frontend/             Application Web PWA Next.js 14
│   ├── src/app/                 App Router (153 pages statiques compilées)
│   ├── src/components/          Composants UI Vanilla CSS
│   └── public/                  Assets PWA (sw.js, manifest, icônes 3D metallic)
├── memory/                      Analyses historiques et plans de développement
├── references/                  Maquettes HTML/CSS d'origine conservées
├── Dockerfile                   Dockerfile racine miroir pour Railway
├── docker-compose.yml           Stack d'exécution locale (PostgreSQL, Redis, MinIO, API, UI)
├── RAILWAY_DEPLOYMENT_ANALYSIS.md Analyse et configuration des conteneurs Railway
├── CLAUDE.md                    Directives et commandes pour assistants de code
└── README.md                    Présentation générale du projet
```

---

## 🚀 Fonctionnalités & Modules Métiers (14 Modules)

1. **Administration & RBAC (`/admin`)** : Gestion des utilisateurs, rôles, agences et attribution interactive des autorisations par module (`modules_allowed`).
2. **Stock & Entrepôts WMS (`/magasin`)** : Réceptions Mag3, bons d'enlèvement, transferts, inventaires et catalogue d'articles.
3. **Transport & Livraisons (`/transport`)** : Gestion des missions de transport, déclarations de marchandises, suivi des chauffeurs et véhicules.
4. **Parc & Yard (`/parc`)** : Emplacements, conteneurs, mouvements de parc, pesage et accès porte (Gate).
5. **Acconage & Transit Portuaire (`/acconage`)** : Manutention quai, embarquement/débarquement conteneurs, manifestes de cargaison.
6. **Maintenance & Fleet (`/maintenance`)** : Ordres de réparation véhicules, révisions préventives, gestion des pièces.
7. **FuelGuard & Carburant (`/fuelguard`)** : Tickets de carburant, suivi des pleins, détection d'anomalies de consommation.
8. **Compliance & QHSE (`/qhse`)** : Audits de sécurité, déclarations d'incidents, fiches de sécurité portuaire.
9. **Procurement & Achats (`/procurement`)** : Demandes d'achat, bons de commande, homologation fournisseurs.
10. **Cotations & Tarification (`/cotations`)** : Grilles tarifaires fret/transit, devis clients automatiques.
11. **Douane & Déclarations (`/douane`)** : Déclarations en douane, apurement de manifests, dossiers de transit.
12. **Finance & Rapprochement (`/finance`)** : Facturation, encaissements, dépenses, pièces comptables.
13. **Tiers & Données Maîtres (`/master-data`)** : Répertoire clients, fournisseurs, agences, armateurs.
14. **Business Intelligence (`/reports`)** : Tableaux de bord analytiques, KPIs d'exploitation, exportations PDF/Excel.

---

## 💻 Démarrage Rapide

### 1. Stack Locale avec Docker Compose

```bash
docker-compose up -d --build
```

Services disponibles :
- **Frontend PWA** : `http://localhost:3000`
- **Backend FastAPI** : `http://localhost:8000`
- **Swagger OpenAPI** : `http://localhost:8000/api/docs`
- **MinIO Console** : `http://localhost:9001` (login/pass: `minioadmin` / `minioadmin`)

### 2. Démarrage Backend Manuel

```bash
cd EVO-LOG-backend
python -m venv .venv
.venv\Scripts\activate      # Sur Windows
source .venv/bin/activate    # Sur Linux/macOS
pip install -r requirements.txt
python scripts/seed_data.py  # Initialisation BDD & 8 comptes seeders
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 3. Démarrage Frontend Manuel

```bash
cd EVO-LOG-frontend
npm install
npm run build                # Vérification compilation (153/153 pages)
npm run dev                  # Serveur de développement
```

---

## 🔐 Comptes Utilisateurs de Démonstration (Seeder)

| Identifiant | Rôle RBAC | Mot de passe | Modules autorisés (`modules_allowed`) |
| --- | --- | --- | --- |
| `admin` | `ADMIN` | `admin123` | Tous les modules |
| `magasinier` | `MAGASINIER` | `admin123` | Magasin, Master Data |
| `kamga` | `DISPATCHER` | `admin123` | Transport, Parc, Gate |
| `qhse` | `QHSE` | `admin123` | QHSE, Maintenance |
| `financier` | `FINANCIER` | `admin123` | Finance, Procurement |
| `douane` | `DOUANE` | `admin123` | Douane, Acconage |
| `parc` | `PARC` | `admin123` | Parc, Transport |
| `auditor` | `AUDITOR` | `admin123` | BI Reports, Audit |

---

## 🚢 Déploiement Production

- **Backend FastAPI** : Hébergé sur **Railway** via conteneur Docker multi-stage résilient avec auto-aplatissement de contexte.
- **Frontend Next.js** : Hébergé sur **Vercel** avec intégration PWA et routage dynamique.
