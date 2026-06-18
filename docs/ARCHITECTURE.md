# Architecture Technique - KAMLOG EM-ERP

**Version**: 1.2  
**Date**: Juin 2026 (Mis à jour le 10 Juin 2026)

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
- Expiration des tokens (30 minutes access token)
- Refresh tokens pour les sessions prolongées

### Multi-Factor Authentication (MFA)
- MFA obligatoire pour les comptes admin
- Support TOTP (Time-based One-Time Password)
- QR code pour la configuration facile
- Codes de secours en cas de perte d'accès
- Endpoints MFA:
  - `POST /api/auth/mfa/setup` - Configuration avec QR code
  - `POST /api/auth/mfa/enable` - Activation après vérification
  - `POST /api/auth/mfa/disable` - Désactivation
  - `POST /api/auth/mfa/verify-backup` - Vérification codes de secours
  - `GET /api/auth/mfa/status` - Statut MFA

### Autorisation (RBAC)
- Rôles: admin, dispatcher, finance, douane, gate_agent
- Permissions granulaires par endpoint
- Décorateurs `@require_permission` et `@require_role` sur les endpoints sensibles
- Vérification automatique des permissions

### Rate Limiting
- Protection contre les attaques par force brute
- Limites configurables par endpoint (ex: 10/minute pour POST)
- Utilisation de `slowapi`
- Limites spécifiques par endpoint (auth: 10/hour register, 5/minute login)

### Sanitization
- Validation et nettoyage des entrées utilisateur
- Protection contre XSS et injection SQL
- Validation des emails, téléphones, URLs
- Système de sanitization complet (`app/utils/sanitization.py`)

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
- Instrumentation avec `prometheus-fastapi-instrumentator`

### Alertes Prometheus
- Fichier de configuration: `kamlog-backend/prometheus/alerts.yml`
- Groupes d'alertes:
  - **Application Health**: ApplicationDown, HighErrorRate, HighLatency
  - **Database**: ConnectionPoolExhausted, SlowDatabaseQueries
  - **Redis**: RedisDown, RedisMemoryHigh, RedisConnectionPoolExhausted
  - **Business Logic**: FailedLoginAttempts, CreditLimitExceeded, FuelSiphoningDetected, LowStockAlert
  - **System Resources**: HighCPUUsage, HighMemoryUsage, DiskSpaceLow
  - **API Performance**: HighAPIResponseTime, APIRequestRateHigh
  - **Cache Performance**: LowCacheHitRate, HighCacheEvictionRate
  - **Security**: UnauthorizedAccessAttempts, ForbiddenAccessAttempts
  - **Module-Specific**: TiersServiceSlow, FinanceServiceSlow, TransportServiceSlow, MagasinServiceSlow, ParcServiceSlow

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
- Migrations créées pour les nouveaux modèles (15 Juin 2026):
  - `add_gateway_tables.py` - Tables passerelles
  - `add_new_models.py` - Nouveaux modèles (goods_declarations, removal_slips, receptions_mag3, suppliers)

---

## 🔄 Services Métier (Updated 15 Juin 2026)

### Services Existants (8 fichiers)
- `base_service.py` - Service de base
- `magasin_service.py` - Service Magasin (MagasinService, ClientMagasinService, ArticleService, etc.)
- `tiers_service.py` - Service Tiers
- `transport_service.py` - Service Transport
- `finance_service.py` - Service Finance
- `parc_service.py` - Service Parc
- `gateway_service.py` - Service Passerelles
- `goods_declaration_service.py` - Service Déclarations de Marchandises
- `removal_slip_service.py` - Service Bons d'Enlèvement
- `reception_mag3_service.py` - Service Réceptions Mag3
- `suppliers_service.py` - Service Fournisseurs

### Nouveaux Services (3 fichiers - Added 15 Juin 2026)

#### mag3_workflow_service.py
Service pour les workflows Mag3 (bon d'enlèvement → réception)

**Fonctionnalités:**
- Création de bon d'enlèvement avec notification
- Autorisation de bon d'enlèvement
- Création de réception à partir de bon d'enlèvement
- Validation de réception avec mise à jour de stock
- Mise à jour automatique du statut du bon d'enlèvement
- Suivi du statut du workflow
- Récupération des workflows en attente

**Endpoints:**
- `GET /api/magasin/removal-slips/{slip_id}/workflow-status`
- `POST /api/magasin/removal-slips/{slip_id}/workflow-create`
- `POST /api/magasin/receptions-mag3/from-slip/{slip_id}`
- `POST /api/magasin/receptions-mag3/{reception_id}/workflow-validate`
- `GET /api/magasin/receptions-mag3/pending-workflows`

#### notification_service.py
Service pour la gestion des notifications

**Types de notifications:**
- AUTORISATION_BON_ENLEVEMENT - Demande d'autorisation
- BON_ENLEVEMENT_AUTORISE - Bon autorisé
- RECEPTION_CREEE - Réception créée
- RECEPTION_VALIDEE - Réception validée
- STOCK_MIS_A_JOUR - Stock mis à jour
- ERREUR_WORKFLOW - Erreur workflow

**Priorités:**
- BASSE - Notifications d'information
- NORMALE - Notifications standard
- HAUTE - Notifications importantes
- CRITIQUE - Notifications critiques

**Fonctions:**
- `notify_bon_enlevement_authorisation()` - Notifier les responsables
- `notify_bon_enlevement_authorized()` - Notifier le demandeur
- `notify_reception_created()` - Notifier les magasiniers
- `notify_reception_validated()` - Notifier le demandeur
- `notify_stock_updated()` - Notifier les responsables du stock
- `notify_workflow_error()` - Notifier les responsables d'erreurs

#### validators.py
Service pour la validation des données

**Validateurs:**
- `Validator` - Validateur de données générales
- `BusinessValidator` - Validateur de règles métier

**Fonctions de validation:**
- `validate_email()` - Validation email
- `validate_phone()` - Validation téléphone
- `validate_niu()` - Validation NIU
- `validate_code()` - Validation code
- `validate_positive_number()` - Validation nombre positif
- `validate_percentage()` - Validation pourcentage
- `validate_date_range()` - Validation plage de dates
- `validate_required_fields()` - Validation champs requis
- `validate_supplier_data()` - Validation données fournisseur
- `validate_goods_declaration_data()` - Validation déclaration marchandises
- `validate_removal_slip_data()` - Validation bon d'enlèvement
- `validate_reception_mag3_data()` - Validation réception Mag3

---

## 🛡️ Gestion des Erreurs (Added 15 Juin 2026)

### error_handler.py
Système de gestion d'erreurs centralisé

**Types d'erreurs:**
- `AppException` - Exception de base
- `NotFoundException` - Ressource non trouvée
- `BadRequestException` - Requête invalide
- `UnauthorizedException` - Accès non autorisé
- `ForbiddenException` - Accès interdit
- `ConflictException` - Conflit de données
- `ValidationException` - Erreur de validation
- `BusinessLogicException` - Erreur de logique métier

**Handlers configurés:**
- Handler pour exceptions d'application
- Handler pour exceptions HTTP
- Handler pour erreurs de validation
- Handler pour erreurs d'intégrité de base de données
- Handler pour erreurs SQLAlchemy générales
- Handler pour exceptions génériques

**Intégration:**
- Configuré dans `main.py` via `setup_error_handlers(app)`
- Logging automatique des erreurs avec contexte
- Réponses JSON structurées avec codes d'erreur

### Indexes
- Indexes sur les champs de recherche (nom, raison_sociale)
- Indexes uniques sur les clés naturelles (code_article, etc.)
- Indexes composites pour les requêtes fréquentes

---

## 🚀 Performance

### Cache Redis
- Cache des données fréquemment accédées (articles, clients, tiers, camions, chauffeurs)
- Service de cache: `app/utils/cache.py` avec client Redis async
- Cache keys par module: `tiers:all:skip:limit`, `parc:zones:all:skip:limit`, `finance:factures:all:skip:limit`, `transport:camions:all:skip:limit`, `magasin:magasins:all:skip:limit`
- TTL configurable par type de données:
  - Listes: 300 secondes
  - Entités uniques: 600 secondes
  - Requêtes dynamiques: 180 secondes
  - Données fréquemment modifiées: 120 secondes
- Invalidation automatique du cache sur les opérations d'écriture (create, update, delete)
- Invalidation par pattern: `invalidate_cache_pattern("magasin:stocks:*")`
- Cache intégré dans tous les services: TiersService, ParcService, FinanceService, TransportService, MagasinService

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
- Tests créés pour tous les modules:
  - `tests/test_auth.py` - Authentification
  - `tests/test_tiers.py` - Module Tiers
  - `tests/test_parc.py` - Module Parc
  - `tests/test_finance.py` - Module Finance
  - `tests/test_transport.py` - Module Transport
  - `tests/test_magasin.py` - Module Magasin
- Fixtures pytest dans `tests/conftest.py`:
  - `db_session` - Session de base de données de test
  - `client` - Client HTTP de test
  - `auth_headers` - Headers d'authentification

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
- **ANALYSE_COMPLETE_ERP.md**: Audit technique et recommandations
- **ARCHITECTURE.md**: Ce document
- **API_DOCUMENTATION.md**: Référence des endpoints
- **CAHIER_DES_CHARGES_V2.md**: Spécifications métier
- **DOCUMENT_TRANSACTIONS.md**: Logique des flux de données

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

### ✅ Accompli (Juin 2026)
- [x] Implémentation du cache Redis complet sur tous les services ✅ CONFIRMÉ
- [x] Configuration des alertes Prometheus ✅ CONFIRMÉ
- [x] Ajout des tests dans le pipeline CI/CD pour tous les modules ✅ CONFIRMÉ
- [x] Implémentation MFA pour les comptes admin ✅ CONFIRMÉ
- [x] Documentation API complète avec exemples ✅ CONFIRMÉ
- [x] Application RBAC sur tous les endpoints ✅ CONFIRMÉ
- [x] Intégration ModuleLayout dans toutes les pages frontend ✅ CONFIRMÉ
- [x] Correction des imports Radix UI dans tous les composants UI ✅ CONFIRMÉ (10 Juin 2026)
- [x] Correction de la syntaxe TailwindCSS v3 dans globals.css ✅ CONFIRMÉ (10 Juin 2026)
- [x] Correction de l'export auth avec getServerSession ✅ CONFIRMÉ (10 Juin 2026)
- [x] Frontend entièrement fonctionnel sans erreurs de build ✅ CONFIRMÉ (10 Juin 2026)

### Court Terme (1-3 mois)
- [ ] Compléter l'implémentation du repository pattern (seul magasin_repository.py existe)
- [ ] Ajouter des tests E2E avec Playwright
- [ ] Atteindre 80% de couverture de tests
- [ ] Ajouter des tests de charge avec Locust
- [ ] Migrer vers async/await complet

### Moyen Terme (3-6 mois)
- [ ] Migrer vers async/await complet
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
**Dernière mise à jour**: 10 Juin 2026 (Corrections Frontend appliquées)

---

## 📝 Note sur l'état actuel (10 Juin 2026)

**Vérification effectuée sur le code actuel:**

✅ **Confirmés:**
- Cache Redis implémenté dans tous les services (tiers, parc, finance, transport, magasin)
- Alertes Prometheus complètes avec 9 groupes d'alertes
- Tests pour tous les 6 modules (auth, tiers, parc, finance, transport, magasin)
- MFA complet avec endpoints, service et intégration auth
- CI/CD GitHub Actions avec tests, linting et build
- Documentation API complète avec exemples
- **NOUVEAU**: Frontend entièrement fonctionnel avec imports Radix UI corrigés
- **NOUVEAU**: TailwindCSS v3 syntaxe correcte dans globals.css
- **NOUVEAU**: Auth export corrigé avec getServerSession (NextAuth v4)
- **NOUVEAU**: Composant Sonner recréé et opérationnel
- **NOUVEAU**: Gitignore mis à jour pour accès aux fichiers lib

⚠️ **Partiellement implémenté:**
- Repository pattern: Seul `magasin_repository.py` existe. Les autres modules (tiers, parc, finance, transport) utilisent directement les modèles dans les services.

**Recommandation:** Le projet est dans un excellent état pour la production. Le frontend est maintenant entièrement fonctionnel et toutes les erreurs de build ont été résolues. Le repository pattern pourrait être étendu aux autres modules pour une meilleure cohérence architecturale.
