# Architecture Technique - KAMLOG EM-ERP

**Version**: 1.0  
**Date**: Juin 2026

---

## 📐 Vue d'Ensemble

KAMLOG EM-ERP est une application ERP modulaire pour la gestion logistique portuaire, construite avec une architecture en couches et des microservices.

### Stack Technique

- **Backend**: FastAPI 0.115 (Python 3.12)
- **Frontend**: Next.js 14 (TypeScript)
- **Base de données**: PostgreSQL 17
- **Cache**: Redis 7
- **Stockage**: MinIO (S3-compatible)
- **File de tâches**: Celery 5
- **Monitoring**: Prometheus + Grafana
- **CI/CD**: GitHub Actions

---

## � Système de Modules Colorés

L'application utilise un système de couleurs distinctes pour chaque module, facilitant l'identification visuelle et la navigation.

### Palette de Couleurs par Module

```
🔵 Authentification & Administration    : #3B82F6 (Bleu)
🟢 Master Data (Tiers)                     : #10B981 (Vert)
🟠 K-Transport                            : #F59E0B (Orange)
💰 K-Finance                              : #8B5CF6 (Violet)
📦 K-Magasin                              : #EF4444 (Rouge)
🚗 K-Parc                                 : #06B6D4 (Cyan)
📄 Documents                              : #6B7280 (Gris)
🔔 Alertes                                : #F97316 (Orange foncé)
```

### Implémentation Frontend

- **Configuration**: `kamlog-frontend/src/config/moduleColors.ts`
- **Hook**: `kamlog-frontend/src/hooks/useModuleTheme.ts`
- **Layout**: `kamlog-frontend/src/components/layout/ModuleLayout.tsx`
- **Sidebar**: `kamlog-frontend/src/components/layout/ModuleSidebar.tsx`
- **Header**: `kamlog-frontend/src/components/layout/ModuleHeader.tsx`

Le système de couleurs est appliqué dynamiquement via CSS variables qui changent selon le module actif.

---

## 🔗 Passerelles Inter-Modules

L'application utilise un système de passerelles pour connecter les modules et permettre les flux métier automatiques.

### Types de Passerelles

1. **COMMANDE_FACTURE**: Commande → Facture (K-Magasin → K-Finance)
2. **COMMANDE_LIVRAISON**: Commande → Livraison (K-Magasin → K-Transport)
3. **RECEPTION_STOCK**: Réception → Stock (K-Magasin → K-Magasin)
4. **FACTURE_PAIEMENT**: Facture → Paiement (K-Finance → K-Finance)
5. **MISSION_FACTURE**: Mission → Facture (K-Transport → K-Finance)
6. **BON_LIVRAISON_FACTURE**: Bon de Livraison → Facture (K-Transport → K-Finance)

### Implémentation Backend

- **DTOs partagés**: `kamlog-backend/app/schemas/shared.py`
- **Modèles**: `kamlog-backend/app/models/gateway.py`
- **Service**: `kamlog-backend/app/services/gateway_service.py`
- **Router**: `kamlog-backend/app/routers/gateway.py`

### Flux Métier Automatisés

#### Exemple 1: Commande → Facture → Livraison

```
1. Client crée une commande (K-Magasin)
   ↓
2. Paiement validé → Création passerelle COMMANDE_FACTURE
   ↓
3. Module Finance crée automatiquement la facture
   ↓
4. Commande mise en préparation → Création passerelle COMMANDE_LIVRAISON
   ↓
5. Module Transport prépare la livraison
```

#### Exemple 2: Réception → Stock

```
1. Réception validée (K-Magasin)
   ↓
2. Mise à jour du stock
   ↓
3. Création passerelle RECEPTION_STOCK
   ↓
4. Audit trail automatique
```

### Statuts des Passerelles

- **EN_ATTENTE**: Passerelle créée, en attente de traitement
- **TRAITE**: Passerelle traitée avec succès
- **ECHOUE**: Erreur lors du traitement
- **ANNULE**: Passerelle annulée

### API Endpoints

- `POST /api/gateway/passerelles` - Créer une passerelle
- `GET /api/gateway/passerelles/{id}` - Récupérer une passerelle
- `GET /api/gateway/passerelles/en-attente` - Récupérer les passerelles en attente
- `PUT /api/gateway/passerelles/{id}` - Mettre à jour une passerelle
- `POST /api/gateway/passerelles/{id}/traiter/{cible_id}` - Traiter une passerelle
- `POST /api/gateway/passerelles/{id}/echouer` - Marquer comme échoué

---

## �🏗️ Architecture en Couches

L'application suit une architecture en couches stricte:

```
┌─────────────────────────────────────────┐
│         Frontend (Next.js)               │
│  ┌───────────────────────────────────┐  │
│  │  Pages / Components / Hooks      │  │
│  └───────────────────────────────────┘  │
└───────────────┬─────────────────────────┘
                │ HTTP/REST API
┌───────────────▼─────────────────────────┐
│         Backend (FastAPI)               │
│  ┌───────────────────────────────────┐  │
│  │  Routers (API Endpoints)         │  │
│  └───────────────┬───────────────────┘  │
│  ┌───────────────▼───────────────────┐  │
│  │  Services (Business Logic)       │  │
│  └───────────────┬───────────────────┘  │
│  ┌───────────────▼───────────────────┐  │
│  │  Repositories (Data Access)      │  │
│  └───────────────┬───────────────────┘  │
│  ┌───────────────▼───────────────────┐  │
│  │  Models (SQLAlchemy)             │  │
│  └───────────────────────────────────┘  │
└───────────────┬─────────────────────────┘
                │ SQL
┌───────────────▼─────────────────────────┐
│      PostgreSQL Database               │
└─────────────────────────────────────────┘
```

### Responsabilités de Chaque Couche

#### 1. **Routers** (`app/routers/`)
- Définissent les endpoints API
- Valident les requêtes HTTP
- Gèrent l'authentification et les permissions
- Délèguent la logique métier aux services
- Retournent les réponses HTTP

#### 2. **Services** (`app/services/`)
- Contiennent la logique métier
- Orchestrent les opérations complexes
- Gèrent les transactions
- Intègrent l'audit trail
- Valident les règles métier

#### 3. **Repositories** (`app/repositories/`)
- Abstraient l'accès aux données
- Exécutent les requêtes SQL
- Gèrent le cache
- Facilitent les tests avec des mocks

#### 4. **Models** (`app/models/`)
- Définissent le schéma de base de données
- Contiennent les relations entre entités
- Gèrent les contraintes et indexes

---

## 📦 Structure du Projet

```
kamlog-erp/
├── kamlog-backend/
│   ├── app/
│   │   ├── models/          # Modèles SQLAlchemy
│   │   ├── schemas/         # Schémas Pydantic
│   │   ├── routers/         # Endpoints API
│   │   ├── services/        # Logique métier
│   │   ├── repositories/    # Accès aux données
│   │   ├── utils/           # Utilitaires (cache, logs, etc.)
│   │   ├── config.py        # Configuration
│   │   ├── database.py      # Configuration DB
│   │   └── main.py          # Application FastAPI
│   ├── tests/               # Tests
│   ├── migrations/          # Migrations Alembic
│   └── requirements.txt     # Dépendances Python
├── kamlog-frontend/
│   ├── src/
│   │   ├── app/             # Pages Next.js
│   │   ├── components/      # Composants React
│   │   ├── hooks/           # Hooks personnalisés
│   │   └── middleware.ts   # Middleware Next.js
│   └── package.json         # Dépendances Node.js
├── docs/                    # Documentation
├── scripts/                 # Scripts utilitaires
└── docker-compose.yml       # Orchestration Docker
```

---

## 🔐 Sécurité

### Authentification
- JWT (JSON Web Tokens) pour l'authentification
- Tokens signés avec clé secrète configurable
- Expiration des tokens

### Autorisation (RBAC)
- Rôles: admin, dispatcher, finance, douane, gate_agent
- Permissions granulaires par endpoint
- Décorateurs `@check_permission` sur les endpoints sensibles

### Rate Limiting
- Protection contre les attaques par force brute
- Limites configurables par endpoint (ex: 10/minute pour POST)
- Utilisation de `slowapi`

### Sanitization
- Validation et nettoyage des entrées utilisateur
- Protection contre XSS et injection SQL
- Validation des emails, téléphones, URLs

---

## 📊 Monitoring et Logging

### Logs Structurés
- Utilisation de `loguru` pour des logs JSON en production
- Rotation automatique des logs
- Séparation des logs d'erreurs
- Correlation ID pour tracer les requêtes

### Métriques Prometheus
- Métriques HTTP (requêtes, erreurs, durée)
- Métriques de base de données (connexions, requêtes)
- Métriques métier (modifications de stock, commandes)
- Endpoint `/metrics` pour l'export Prometheus

### Health Checks
- Endpoint `/api/health` - Health check basique
- Endpoint `/api/health/detailed` - Vérification des dépendances (PostgreSQL, Redis, MinIO)

---

## 💾 Base de Données

### Connection Pooling
- Pool size: 20 connexions
- Max overflow: 10 connexions
- Pool pre-ping: Vérification des connexions
- Pool recycle: 3600 secondes

### Migrations
- Utilisation d'Alembic pour les migrations
- Versioning automatique des schémas
- Rollback possible

### Indexes
- Indexes sur les champs de recherche (nom, raison_sociale)
- Indexes uniques sur les clés naturelles (code_article, etc.)
- Indexes composites pour les requêtes fréquentes

---

## 🚀 Performance

### Cache Redis
- Cache des données fréquemment accédées (articles, clients)
- Décorateur `@cache_result` pour les fonctions
- Invalidation automatique du cache
- TTL configurable par défaut (3600 secondes)

### Eager Loading
- Utilisation de `selectinload()` pour éviter les N+1 queries
- Chargement des relations en une seule requête
- Optimisation des requêtes sur déclarations, réceptions, commandes, bandes

### Pagination
- Pagination par défaut sur tous les endpoints de liste
- Paramètres `skip` et `limit` configurables
- Limite par défaut: 100 entrées

---

## 🔄 CI/CD

### Pipeline GitHub Actions
- Tests automatiques sur chaque push
- Linting avec ruff et black
- Type checking avec mypy
- Build des images Docker
- Déploiement automatique en staging

### Tests
- Tests unitaires avec pytest
- Tests d'intégration avec httpx
- Couverture de code minimale: 80%
- Factory Boy pour les fixtures de test

---

## 📦 Déploiement

### Docker Compose
- Orchestration des services (PostgreSQL, Redis, MinIO, API, Frontend, Celery)
- Configuration via variables d'environnement
- Volumes persistants pour les données

### Backup Automatisé
- Script `scripts/backup_db.sh`
- Backup quotidien de la base de données
- Rotation des backups (30 jours)
- Compression des anciens backups

---

## 🎯 Modules Principaux

### K-Magasin (Warehouse Management)
- Gestion des magasins
- Gestion des clients
- Gestion des articles avec conversion d'unités
- Déclarations (Bill of Lading)
- Réceptions et mise à jour des stocks
- Commandes clients
- Bandes de livraison

### Autres Modules
- **Auth**: Gestion des utilisateurs et authentification
- **Tiers**: Gestion des tiers (clients, fournisseurs)
- **Transport**: Gestion du transport
- **Finance**: Gestion financière
- **Parc**: Gestion du parc automobile
- **Documents**: Gestion documentaire
- **Alertes**: Système d'alertes

---

## 📝 Conventions de Code

### Python (Backend)
- PEP 8 pour le style
- Type hints pour toutes les fonctions
- Docstrings pour les classes et fonctions publiques
- Noms de variables en snake_case
- Classes en PascalCase

### TypeScript (Frontend)
- ESLint + Prettier pour le style
- Composants fonctionnels avec hooks
- TypeScript strict mode
- Noms de variables en camelCase
- Composants en PascalCase

---

## 🔧 Développement

### Configuration Locale
1. Cloner le repository
2. Copier `.env.example` vers `.env`
3. Configurer les variables d'environnement
4. Lancer `docker-compose up`
5. Appliquer les migrations: `alembic upgrade head`

### Branches
- `main`: Branche de production
- `develop`: Branche de développement
- `feature/*`: Branches de fonctionnalités

### Commit Messages
- Format: `type(scope): description`
- Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
- Exemple: `feat(magasin): ajouter la gestion des stocks`

---

## 📚 Documentation

- **README.md**: Guide de démarrage rapide
- **DEPLOYMENT.md**: Guide de déploiement
- **TROUBLESHOOTING.md**: Guide de dépannage
- **CRITIQUE_ET_AMÉLIORATIONS.md**: Audit technique et améliorations
- **ARCHITECTURE.md**: Ce document

---

## 🎓 Décisions Techniques (ADR)

### ADR-001: FastAPI vs Django REST Framework
**Décision**: Utiliser FastAPI
**Raison**: Performance supérieure, typage natif, documentation automatique, support async

### ADR-002: PostgreSQL vs MongoDB
**Décision**: Utiliser PostgreSQL
**Raison**: Transactions ACID, relations complexes, intégrité des données, SQL mature

### ADR-003: Redis vs Memcached
**Décision**: Utiliser Redis
**Raison**: Persistance, structures de données riches, clustering, support Celery

### ADR-004: MinIO vs AWS S3
**Décision**: Utiliser MinIO
**Raison**: Self-hosted, compatible S3, contrôle total des données, réduction des coûts

---

## 🚧 Roadmap

### Court Terme (1-3 mois)
- [ ] Compléter l'implémentation du repository pattern
- [ ] Ajouter des tests E2E avec Playwright
- [ ] Implémenter le cache Redis sur tous les endpoints
- [ ] Ajouter des tests de charge avec Locust

### Moyen Terme (3-6 mois)
- [ ] Migrer vers Kubernetes
- [ ] Implémenter GraphQL pour le frontend
- [ ] Ajouter un système de notifications en temps réel
- [ ] Optimiser les performances avec CDN

### Long Terme (6-12 mois)
- [ ] Architecture microservices complète
- [ ] Machine Learning pour la prévision de stock
- [ ] Application mobile native
- [ ] Multi-tenancy

---

**Document généré le**: Juin 2026  
**Dernière mise à jour**: Juin 2026
