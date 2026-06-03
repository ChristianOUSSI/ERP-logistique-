# KAMLOG EM-ERP

ERP Logistique Portuaire — Port de Douala / Cameroun

## 📋 Vue d'ensemble

KAMLOG EM-ERP est un Progiciel de Gestion Intégré (PGI) conçu spécifiquement pour les opérateurs logistiques portuaires du Cameroun. Le Port Autonome de Douala — premier port en eau profonde d'Afrique centrale — représente le pivot économique de la région.

## 🏗️ Stack Technique

- **Backend**: FastAPI 0.115 (Python 3.12)
- **Frontend**: Next.js 14 (TypeScript)
- **Base de données**: PostgreSQL 17
- **Cache**: Redis 7
- **Stockage**: MinIO (S3-compatible)
- **Queue**: Celery 5

## 📦 Structure du Projet

```
KAMLOG-EM-ERP/
├── kamlog-backend/          # API FastAPI
│   ├── app/
│   │   ├── models/          # Modèles SQLAlchemy
│   │   ├── schemas/         # Schémas Pydantic
│   │   ├── routers/         # Endpoints API
│   │   ├── services/        # Logique métier
│   │   └── utils/           # Utilitaires
│   ├── migrations/          # Alembic
│   ├── requirements.txt
│   └── Dockerfile
├── kamlog-frontend/         # Next.js 14
│   ├── src/
│   │   ├── app/            # App Router
│   │   ├── components/     # Composants React
│   │   ├── lib/            # API client
│   │   ├── stores/         # Zustand
│   │   └── types/          # TypeScript
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

## 🚀 Démarrage Rapide

### Prérequis

- Python 3.12+
- Node.js 20+
- Docker & Docker Compose
- PostgreSQL 17

### Backend Setup

```bash
cd kamlog-backend

# Créer l'environnement virtuel
python -m venv .venv
.venv\Scripts\activate  # Windows

# Installer les dépendances
pip install -r requirements.txt

# Configurer l'environnement
cp .env.example .env
# Éditer .env avec vos valeurs

# Lancer Docker (PostgreSQL, Redis, MinIO)
cd ..
docker-compose up -d db redis minio

# Appliquer les migrations
cd kamlog-backend
alembic upgrade head

# Lancer le serveur
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

L'API est disponible sur http://localhost:8000/api/docs

### Frontend Setup

```bash
cd kamlog-frontend

# Installer les dépendances
npm install

# Configurer l'environnement
cp .env.local.example .env.local
# Éditer .env.local avec vos valeurs

# Lancer le serveur de développement
npm run dev
```

L'application est disponible sur http://localhost:3000

### Docker Compose (Tout en un)

```bash
# Lancer tous les services
docker-compose up -d

# Vérifier les logs
docker-compose logs -f
```

## 📚 Modules Principaux

### 🔐 Authentification & RBAC
- JWT Access/Refresh tokens
- 5 rôles : Admin, Dispatcher, Finance, Douane, Gate Agent
- Rate limiting sur endpoints sensibles

### 👥 Master Data (Tiers)
- Gestion clients/fournisseurs
- Validation NIU camerounais
- Habilitations services (transport, transit, acconage, magasinage)
- Limite de crédit SYSCOHADA

### 🚛 K-Transport
- Gestion flotte camions
- Profils chauffeurs
- Missions de transport
- Règles anti-doublon
- Calcul carburant théorique
- Alertes siphonnage

### 💰 K-Finance
- Grilles tarifaires
- Facturation automatique
- TVA 19.25% Cameroun
- Calcul encours temps réel
- Contrôle limite crédit
- Encaissements

### 🏭 K-Parc (Yard Management)
- Zones et emplacements
- Gate In / Gate Out
- Stock physique conteneurs
- Historique mouvements
- Règle gravité Navis N4

### 📄 K-Documents
- Génération PDF (WeasyPrint)
- Bon de Livraison
- Interchange
- Factures
- Stockage MinIO

## 🔧 Configuration

### Variables d'environnement

Voir `.env.example` pour la configuration complète :

- `DATABASE_URL` : Connexion PostgreSQL
- `REDIS_URL` : Connexion Redis
- `JWT_SECRET_KEY` : Clé secrète JWT
- `MINIO_*` : Configuration stockage objet
- `SMTP_*` : Configuration email

## 📊 API Documentation

Swagger UI : http://localhost:8000/api/docs
ReDoc : http://localhost:8000/api/redoc

## 🧪 Tests

```bash
# Backend
cd kamlog-backend
pytest

# Frontend
cd kamlog-frontend
npm test
```

## 📝 Développement

### Règles de développement

1. Toute règle métier critique est codée au niveau SERVICE
2. Chaque endpoint FastAPI a son schéma Pydantic
3. Opérations financières utilisent Decimal (jamais float)
4. Historique mouvements parc en INSERT ONLY
5. PDFs générés par backend (WeasyPrint)
6. Migrations Alembic relues par 2 devs avant prod
7. Calcul TVA centralisé dans finance_service.py

## 🚢 Déploiement

### VPS Recommandé

- **Fournisseur**: Contabo (Allemagne)
- **CPU**: 4 vCPU
- **RAM**: 8 GB
- **Stockage**: 200 GB SSD
- **OS**: Ubuntu 24.04 LTS
- **Coût**: ~8 EUR/mois

### Commandes déploiement

```bash
# Cloner sur le VPS
git clone https://github.com/cadc/kamlog-em-erp.git
cd kamlog-em-erp

# Configurer .env
cp .env.example .env
# Éditer avec valeurs production

# Build et démarrage
docker-compose -f docker-compose.prod.yml up -d --build

# Appliquer migrations
docker-compose exec api alembic upgrade head

# Configurer SSL (Let's Encrypt)
certbot --nginx -d kamlog-erp.cm
```

## 📅 Roadmap

### MVP (19 jours - 20 Juin 2026)
- ✅ Auth + RBAC
- ✅ Module Tiers
- ✅ K-Transport Core
- ✅ K-Finance Light
- ✅ K-Parc Basique
- ✅ Déploiement VPS

### Phase 2 (6 mois - Décembre 2026)
- K-Transit complet (CAMCIS, BAE)
- K-Acconage + Escales navires
- K-Planning global
- Application mobile React Native
- Intégration Mobile Money

## 🤝 Contribution

Ce projet est développé par CADC — Code Axis Digital Cameroun.

## 📄 Licence

CONFIDENTIEL — CADC / KAMLOG

---

**Version**: 1.0  
**Date**: Juin 2026  
**Organisation**: CADC — Code Axis Digital Cameroun
