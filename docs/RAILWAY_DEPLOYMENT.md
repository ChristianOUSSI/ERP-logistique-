# Railway Deployment Guide - KAMLOG Backend

## Variables d'environnement à configurer dans Railway

### Base de données PostgreSQL
Railway fournit automatiquement une base de données PostgreSQL. Vous devez ajouter:
- `DATABASE_URL` = (Railway fournit automatiquement cette variable via le plugin PostgreSQL)
- `DB_NAME` = (Utilisez le nom de la DB Railway)
- `DB_USER` = (Utilisez l'utilisateur Railway)
- `DB_PASSWORD` = (Utilisez le mot de passe Railway)

### Redis
Ajoutez un plugin Redis dans Railway:
- `REDIS_URL` = (Railway fournit automatiquement cette variable via le plugin Redis)
- `REDIS_PASSWORD` = (Mot de passe Redis Railway)

### MinIO (Optionnel - peut être remplacé par Railway Disk)
Pour le stockage des documents:
- `MINIO_ENDPOINT` = (URL du service MinIO externe ou utiliser Railway Disk)
- `MINIO_ACCESS_KEY` = (Clé d'accès MinIO)
- `MINIO_SECRET_KEY` = (Clé secrète MinIO)
- `MINIO_BUCKET_DOCUMENTS` = kamlog-documents
- `MINIO_SECURE` = true

### Authentification JWT
- `JWT_SECRET_KEY` = (Générez une clé sécurisée de 32+ caractères)
- `JWT_ALGORITHM` = HS256
- `ACCESS_TOKEN_EXPIRE_MINUTES` = 30
- `REFRESH_TOKEN_EXPIRE_DAYS` = 7

### Email (Optionnel)
- `SMTP_HOST` = smtp.gmail.com
- `SMTP_PORT` = 587
- `SMTP_USER` = noreply@kamlog.cm
- `SMTP_PASSWORD` = (Mot de passe application Gmail)
- `SMTP_FROM` = KAMLOG ERP <noreply@kamlog.cm>

### Application
- `APP_NAME` = KAMLOG EM-ERP
- `APP_VERSION` = 1.0.0
- `DEBUG` = false
- `ALLOWED_ORIGINS` = https://kamlog.vercel.app,http://localhost:3000
- `SEED_DATA` = true (pour exécuter automatiquement les seeders au démarrage)

### Celery
- `CELERY_BROKER_URL` = (Utilisez l'URL Redis Railway)
- `CELERY_RESULT_BACKEND` = (Utilisez l'URL Redis Railway)

## Étapes de déploiement

1. **Connecter le repository GitHub à Railway**
   - Allez sur https://railway.com/project/5a9c4b25-d977-4d38-842d-909f4a2baf97
   - Cliquez sur "New Project" > "Deploy from GitHub repo"
   - Sélectionnez le repository KAMLOG-EM-ERP
   - Sélectionnez le dossier `kamlog-backend` comme root directory

2. **Ajouter les plugins Railway**
   - Ajoutez un plugin **PostgreSQL** (Railway le détectera automatiquement)
   - Ajoutez un plugin **Redis** pour le cache
   - Optionnel: Ajoutez un plugin **MinIO** ou utilisez Railway Disk

3. **Configurer les variables d'environnement**
   - Allez dans l'onglet "Variables"
   - Ajoutez toutes les variables listées ci-dessus
   - Railway fournira automatiquement `DATABASE_URL` et `REDIS_URL` via les plugins

4. **Lancer le déploiement**
   - Railway détectera automatiquement le `nixpacks.toml`
   - Le build commencera automatiquement
   - Surveillez les logs dans l'onglet "Deployments"

5. **Exécuter les seeders**
   - Option 1 (Automatique): Ajoutez la variable `SEED_DATA=true` dans Railway avant le déploiement. Les seeders s'exécuteront automatiquement au démarrage.
   - Option 2 (Manuel): Une fois le déploiement terminé, allez dans l'onglet "Console" et exécutez: `python scripts/seed_data.py`
   - Cela créera les utilisateurs par défaut et les données de test

## Utilisateurs par défaut (après seeders)

- **Admin**: admin@kamlog.cm / admin123
- **Dispatcher**: dispatcher@kamlog.cm / dispatcher123
- **Finance**: finance@kamlog.cm / finance123
- **Douane**: douane@kamlog.cm / douane123
- **Gate**: gate@kamlog.cm / gate123

## Vérification

1. **Health Check**
   - Accédez à `https://votre-backend.railway.app/api/health`
   - Vous devriez voir: `{"status": "ok", "service": "KAMLOG EM-ERP", "version": "1.0.0"}`

2. **Test de connexion frontend**
   - Mettez à jour `NEXT_PUBLIC_API_URL` dans votre frontend Vercel avec l'URL Railway
   - Testez la connexion depuis https://kamlog.vercel.app

3. **Test d'authentification**
   - Essayez de vous connecter avec admin@kamlog.cm / admin123
   - Vérifiez que vous recevez un token JWT valide

## URL Frontend à configurer

Une fois le backend déployé sur Railway, vous obtiendrez une URL comme:
`https://kamlog-backend-production.up.railway.app`

Vous devez configurer cette URL dans votre frontend Vercel:
1. Allez sur votre projet Vercel: https://vercel.com/dashboard
2. Sélectionnez le projet kamlog-frontend
3. Allez dans Settings > Environment Variables
4. Ajoutez ou modifiez la variable:
   - Nom: `NEXT_PUBLIC_API_URL`
   - Valeur: `https://votre-backend-url.railway.app` (remplacez par l'URL Railway réelle)
5. Redéployez le frontend Vercel

## Configuration Next.js pour le domaine Railway

Mettez à jour `kamlog-frontend/next.config.mjs` pour autoriser le domaine Railway:

```javascript
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ['http://localhost:3000', 'localhost:3000', 'https://kamlog.vercel.app'],
    },
  },
  images: {
    domains: ['localhost', 'kamlog.vercel.app'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.railway.app',
      },
    ],
  },
};
```

## Dépannage

### Erreur 500 lors de la connexion
1. Vérifiez que les seeders ont été exécutés (logs Railway)
2. Vérifiez que la variable `SEED_DATA=true` est configurée
3. Vérifiez les logs Railway pour les erreurs de base de données
4. Testez l'endpoint `/api/health` pour vérifier que le backend est en ligne

### Erreur CORS
1. Vérifiez que `ALLOWED_ORIGINS` contient `https://kamlog.vercel.app`
2. Vérifiez que le frontend utilise la bonne URL backend
3. Redéployez le backend après avoir modifié les variables d'environnement

### Erreur de connexion base de données
1. Vérifiez que le plugin PostgreSQL Railway est actif
2. Vérifiez que `DATABASE_URL` est automatiquement fourni par Railway
3. Vérifiez les logs Railway pour les erreurs de connexion
