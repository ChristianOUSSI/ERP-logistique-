# Architecture Technique

## Resume

Le depot n'implemente pas une architecture microservices. L'etat reel est un monolithe modulaire:

- frontend Next.js 14;
- backend FastAPI 0.115;
- PostgreSQL pour les donnees;
- Redis pour le cache et certains mecanismes transverses;
- MinIO pour le stockage objet;
- aucun workflow CI versionne actuellement dans le depot.

La dependance `celery` existe dans `requirements.txt`, mais aucun worker n'est orchestre dans `docker-compose.yml` actuel.

## Topologie d'execution

### Locale

`docker-compose.yml` demarre:

- `db`
- `redis`
- `minio`
- `api`
- `frontend`

Il n'y a pas de service:

- `celery`
- `flower`
- `grafana`

## Backend

### Organisation

```text
HTTP -> routers -> services -> repositories -> models -> PostgreSQL
```

Responsabilites:

- `routers/`: exposition HTTP, validation, securite, permissions
- `services/`: orchestration metier
- `repositories/`: acces donnees
- `models/`: modeles SQLAlchemy
- `schemas/`: contrats Pydantic
- `utils/`: audit, securite, cache, monitoring, MFA, PDF

### Routeurs montes dans `app.main`

- `/api/auth`
- `/api/tiers`
- `/api/transport`
- `/api/finance`
- `/api/parc`
- `/api/documents`
- `/api/alerts`
- `/api/magasin`
- `/api/gateway`
- `/api/transactions`
- `/api/transport/goods-declarations`
- `/api/magasin/removal-slips`
- `/api/magasin/receptions-mag3`
- `/api/master-data`
- `/api/admin`
- `/api/admin/agencies`
- `/api/suppliers`
- `/api/notifications`
- `/api/purchase`

### Mecanismes transverses

- CORS pour le frontend local et certains domaines Vercel
- SlowAPI pour le rate limiting
- audit middleware HTTP
- idempotency middleware base sur Redis
- endpoints de sante: `/api/health` et `/api/health/detailed`
- instrumentation Prometheus cote API

## Frontend

### Organisation

Le frontend utilise l'App Router Next.js et un layout modulaire:

- `src/app/(auth)` pour les ecrans d'authentification
- `src/app/(app)` pour l'application metier
- `src/components/layout` pour la structure commune
- `src/lib/api` pour les clients d'acces backend
- `src/config/moduleColors.ts` pour la thematisation par module

### Espaces fonctionnels visibles

- administration et audit
- finance
- magasin
- master data
- parc
- reports
- security
- transport

Certaines pages servent encore surtout d'ecrans UI et ne sont pas toutes connectees a des flux backend complets.

## Donnees et stockage

- PostgreSQL reste la source de verite transactionnelle
- Redis est present pour le cache et l'idempotence
- MinIO est prevu pour les documents et assets
- les migrations sont gerees avec Alembic

## CI actuelle

Il n'y a pas de workflow GitHub Actions versionne dans `.github/workflows/` a la date de reference. Si une CI doit etre retablie, il faudra redefinir explicitement:

- tests backend
- lint backend (`ruff`, `black`, `mypy`)
- lint frontend
- build frontend
- Playwright
- build des images Docker

## Manques architecture a traiter

- documenter les flux metier par module de facon stable
- clarifier les pages frontend connectees vs placeholder
- brancher ou retirer officiellement les composants lies a Celery
- clarifier la cible de production reelle entre VPS et Railway/Vercel
- standardiser la documentation d'observabilite et les alertes exploitees
