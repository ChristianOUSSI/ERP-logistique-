# Railway / Vercel Deployment

## Cible actuelle

Le scenario cloud documente ici est:

- backend FastAPI sur Railway;
- frontend Next.js sur Vercel.

Cette documentation est volontairement limitee a ce qui est visible dans le depot actuel.

## Backend Railway

### Root directory

- `kamlog-backend`

### Variables minimales a fournir

- `DATABASE_URL`
- `REDIS_URL`
- `JWT_SECRET_KEY`
- `ALLOWED_ORIGINS`
- `MINIO_ENDPOINT`
- `MINIO_ACCESS_KEY`
- `MINIO_SECRET_KEY`
- `MINIO_BUCKET_DOCUMENTS`

Variables optionnelles selon l'usage:

- `SEED_DATA`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASSWORD`

### Verification

- `GET /api/health` doit repondre
- `GET /api/health/detailed` doit confirmer les dependances critiques
- `GET /api/docs` doit exposer Swagger

## Frontend Vercel

### Root directory

- `kamlog-frontend`

### Variables minimales

- `NEXT_PUBLIC_API_URL`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`

### Verification

- page login accessible
- authentification operationnelle contre l'API Railway
- navigation principale sans erreurs de build ou de runtime

## Points d'attention

- la configuration CORS du backend doit inclure l'URL frontend finale;
- la stack Railway/Vercel documentee ici ne deploie pas de worker Celery;
- aucune doc d'exploitation complete des secrets ou des backups n'est encore stabilisee.

## Ce qui manque encore

- checklist de mise en prod par environnement;
- procedure de rotation des secrets;
- surveillance d'exploitation et alerting formalises;
- documentation de rollback applicatif.
