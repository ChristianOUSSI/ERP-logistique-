# Guide de Déploiement - KAMLOG EM-ERP

**Version**: 1.1  
**Date**: Juin 2026 (Mis à jour le 10 Juin 2026)

## US-21: Déploiement sur VPS (Contabo)

### Prérequis

- VPS Contabo (4 vCPU, 8 GB RAM, 200 GB SSD)
- Ubuntu 24.04 LTS
- Nom de domaine: kamlog-erp.cm
- Accès root SSH

### Étape 1: Configuration initiale du VPS

```bash
# Connexion SSH
ssh root@vps_ip

# Mise à jour du système
apt update && apt upgrade -y

# Installation des dépendances
apt install -y docker docker-compose git nginx certbot python3-certbot-nginx

# Créer utilisateur kamlog
adduser kamlog
usermod -aG docker kamlog
```

### Étape 2: Clonage du repository

```bash
# Cloner le repository
cd /home/kamlog
git clone https://github.com/Jiraya23/KAMLOG-EM-ERP.git
cd KAMLOG-EM-ERP

# Configuration de l'environnement
cp kamlog-backend/.env.example kamlog-backend/.env
nano kamlog-backend/.env
```

**Variables à configurer dans .env:**

```env
DATABASE_URL=postgresql+asyncpg://kamlog:CHANGE_ME_PASSWORD@db:5432/kamlog_erp
REDIS_URL=redis://redis:6379/0
JWT_SECRET_KEY=CHANGE_ME_SECRET_KEY_MIN_32_CHARS
MINIO_ROOT_USER=CHANGE_ME_MINIO_USER
MINIO_ROOT_PASSWORD=CHANGE_ME_MINIO_PASSWORD
ALLOWED_ORIGINS=https://kamlog-erp.cm
```

### Étape 3: Configuration Docker Compose Production

Créer `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  db:
    image: postgres:17
    environment:
      POSTGRES_USER: kamlog
      POSTGRES_PASSWORD: CHANGE_ME_PASSWORD
      POSTGRES_DB: kamlog_erp
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: always

  redis:
    image: redis:7-alpine
    restart: always

  minio:
    image: minio/minio:latest
    command: server /data --console-address ":9001"
    environment:
      MINIO_ROOT_USER: CHANGE_ME_MINIO_USER
      MINIO_ROOT_PASSWORD: CHANGE_ME_MINIO_PASSWORD
    volumes:
      - minio_data:/data
    ports:
      - "9000:9000"
      - "9001:9001"
    restart: always

  api:
    build: ./kamlog-backend
    environment:
      DATABASE_URL: postgresql+asyncpg://kamlog:CHANGE_ME_PASSWORD@db:5432/kamlog_erp
      REDIS_URL: redis://redis:6379/0
    depends_on:
      - db
      - redis
      - minio
    restart: always

  frontend:
    build: ./kamlog-frontend
    depends_on:
      - api
    restart: always

volumes:
  postgres_data:
  minio_data:
```

### Étape 4: Lancement des services

```bash
# Build et démarrage
docker-compose -f docker-compose.prod.yml up -d --build

# Vérifier les logs
docker-compose -f docker-compose.prod.yml logs -f
```

### Étape 5: Configuration Nginx

Créer `/etc/nginx/sites-available/kamlog-erp`:

```nginx
server {
    listen 80;
    server_name kamlog-erp.cm;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /api {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Activer le site
ln -s /etc/nginx/sites-available/kamlog-erp /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

### Étape 6: Configuration SSL avec Let's Encrypt

```bash
# Obtenir le certificat SSL
certbot --nginx -d kamlog-erp.cm

# Renouvellement automatique (déjà configuré par certbot)
certbot renew --dry-run
```

### Étape 7: Application des migrations (Updated 15 Juin 2026)

```bash
# Entrer dans le conteneur API
docker-compose -f docker-compose.prod.yml exec api bash

# Appliquer les migrations
alembic upgrade head

# Charger les données de seed
python scripts/seed_data.py

# Sortir
exit
```

**Note**: Si vous rencontrez des erreurs de migration, assurez-vous que les modèles sont correctement importés dans `app/models/__init__.py`.

**Nouvelles migrations (15 Juin 2026):**
- `add_gateway_tables.py` - Tables passerelles pour interconnexions modules
- `add_new_models.py` - Nouveaux modèles (goods_declarations, removal_slips, receptions_mag3, suppliers)

**Vérification des migrations:**
```bash
# Vérifier le statut des migrations
alembic current

# Vérifier l'historique des migrations
alembic history

# Rollback si nécessaire
alembic downgrade -1
```

**Configuration PostgreSQL pour les nouveaux modèles:**
Les migrations créent automatiquement les tables suivantes:
- `goods_declarations` - Déclarations de marchandises
- `goods_declaration_lines` - Lignes de déclaration
- `removal_slips` - Bons d'enlèvement Mag3
- `receptions_mag3` - Réceptions Mag3
- `suppliers` - Fournisseurs
- `supplier_profiles` - Profils fournisseurs

**Types enum créés:**
- `statutdeclaration` - Statuts des déclarations (BROUILLON, SOUMISE, VALIDEE, EN_COURS, COMPLETEE, ANNULEE)
- `statutremovalslip` - Statuts des bons d'enlèvement (EN_ATTENTE, AUTORISE, EN_TRANSIT, LIVRE, ANNULE)
- `statutreceptionmag3` - Statuts des réceptions (EN_ATTENTE, EN_COURS, COMPLETEE, ANNULEE)
- `statutfournisseur` - Statuts des fournisseurs (ACTIF, INACTIF, BLOQUE)
- `categoriefournisseur` - Catégories de fournisseurs (LOGISTIQUE, IMPORT_EXPORT, SERVICES, MATERIEL)

### Étape 8: Configuration MFA (Multi-Factor Authentication)

Pour les comptes admin, MFA est obligatoire. Voici comment le configurer:

```bash
# Se connecter à l'application et obtenir un token admin
curl -X POST https://kamlog-erp.cm/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin_password"}'

# Configurer MFA pour l'admin
curl -X POST https://kamlog-erp.cm/api/auth/mfa/setup \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"password":"admin_password"}'

# Activer MFA avec le code TOTP généré par l'app authenticator
curl -X POST https://kamlog-erp.cm/api/auth/mfa/enable \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"token":"123456"}'
```

**Note**: Sauvegardez les codes de secours fournis lors de la configuration MFA.

### Étape 8: Vérification

```bash
# Vérifier que tous les services sont actifs
docker-compose -f docker-compose.prod.yml ps

# Tester l'API
curl https://kamlog-erp.cm/api/health

# Tester l'authentification
curl -X POST https://kamlog-erp.cm/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### Étape 9: Vérification Frontend

```bash
# Vérifier que le frontend compile correctement
docker-compose -f docker-compose.prod.yml exec frontend npm run build

# Vérifier les logs du frontend
docker-compose -f docker-compose.prod.yml logs -f frontend
```

**Note**: Le frontend utilise TailwindCSS v3. Assurez-vous que `globals.css` contient:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

Les composants UI utilisent les packages `@radix-ui/react-*` spécifiques et non le package générique `radix-ui`.

```bash
# Logs en temps réel
docker-compose -f docker-compose.prod.yml logs -f api

# Utilisation des ressources
docker stats
```

### Sauvegarde (Backup)

```bash
# Backup PostgreSQL
docker-compose -f docker-compose.prod.yml exec db pg_dump -U kamlog kamlog_erp > backup.sql

# Backup MinIO
docker-compose -f docker-compose.prod.yml exec minio mc mirror /data /backup/minio
```

### Étape 12: Mise à jour (Update)

```bash
# Pull les dernières modifications
cd /home/kamlog/KAMLOG-EM-ERP
git pull origin develop

# Rebuild et redémarrer
docker-compose -f docker-compose.prod.yml up -d --build

# Appliquer les migrations si nécessaire
docker-compose -f docker-compose.prod.yml exec api alembic upgrade head
```

### Sécurité

- Changer tous les mots de passe par défaut
- Configurer le firewall UFW
- Désactiver l'accès root SSH
- Utiliser SSH keys uniquement
- Mettre à jour régulièrement le système

```bash
# Configuration UFW
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
```

### Support

En cas de problème:
1. Vérifier les logs: `docker-compose logs`
2. Vérifier le statut: `docker-compose ps`
3. Redémarrer les services: `docker-compose restart`

---

## US-22: Déploiement Cloud (Railway & Vercel)

Cette section décrit la procédure recommandée pour déployer l'ERP dans une infrastructure Cloud Moderne sans serveur (Serverless/Managed).

### 🛰️ 1. Déploiement du Backend (FastAPI) sur Railway

Le backend est conçu pour être exécuté sur [Railway](https://railway.com) à l'aide du `Dockerfile` fourni.

#### Prérequis & Plugins
- Créez un projet sur Railway.
- Ajoutez le plugin **PostgreSQL** (il générera et injectera automatiquement la variable `DATABASE_URL` au format `postgresql://`).
- Ajoutez le plugin **Redis** (il générera et injectera automatiquement `REDIS_URL`).

#### Variables d'environnement à configurer sur Railway :
Configurez les variables suivantes dans l'onglet **Variables** de votre service backend :

| Variable | Exemple / Recommandation | Rôle |
| :--- | :--- | :--- |
| `DATABASE_URL` | *Injectée par Railway* | Connexion PostgreSQL |
| `REDIS_URL` | *Injectée par Railway* | Stockage cache & broker Celery |
| `JWT_SECRET_KEY` | `UnSecretSuperLongEtSecuriseDePlusDe32Caracteres!` | **Requis (strict)** : Clé de chiffrement des jetons JWT |
| `JWT_ALGORITHM` | `HS256` | Algorithme des jetons d'authentification |
| `SEED_DATA` | `true` | Crée les comptes par défaut au démarrage |
| `CELERY_BROKER_URL` | `${{REDIS_URL}}` | Réutilisation du Redis de Railway pour Celery |
| `CELERY_RESULT_BACKEND` | `${{REDIS_URL}}` | Réutilisation du Redis de Railway pour Celery |
| `ALLOWED_ORIGINS` | `https://kamlog.vercel.app,http://localhost:3000` | **Crucial** : Domaines autorisés (CORS) |

---

### 🎨 2. Déploiement du Frontend (Next.js) sur Vercel

Le frontend Next.js 14 est déployé sur [Vercel](https://vercel.com).

#### Configuration du Projet Vercel
- Dans vos paramètres de projet Vercel, assurez-vous que le **Root Directory** est défini sur `kamlog-frontend` (et non sur la racine `/` du dépôt global).
- Assurez-vous que le framework sélectionné est **Next.js**.

#### Variables d'environnement à configurer sur Vercel :
Dans **Settings > Environment Variables**, ajoutez les clés de production suivantes :

| Variable | Exemple / Valeur | Rôle / Note |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_API_URL` | `https://votre-backend-railway.up.railway.app` | URL de votre API Railway (sans le slash `/` final) |
| `NEXTAUTH_SECRET` | `kamlog_nextauth_secret_change_in_prod_min_32_chars` | **Requis (strict)** : Clé pour sécuriser les sessions NextAuth en prod |
| `NEXTAUTH_URL` | `https://kamlog-frontend.vercel.app` | URL finale de votre site Vercel |

#### Déploiement via Vercel CLI
Si vous déployez depuis votre poste local :
```bash
# Lier le dossier local (kamlog-frontend) au projet Vercel
npx vercel link

# Déployer en production
npx vercel --prod --yes
```

---

### 🔧 3. Résolution des problèmes de démarrage (Diagnostics)

- **Erreur 500 sur la page d'accueil** : Vérifiez que `NEXTAUTH_SECRET` est correctement renseignée dans Vercel. NextAuth plante avec une erreur 500 si le secret n'est pas fourni en production.
- **Port d'écoute** : Le script `start.sh` détecte le port fourni par Railway via la variable `${PORT}` et s'y lie dynamiquement.
- **Vérification de la santé (Healthcheck)** : Railway utilise l'endpoint `/api/health` pour vérifier l'état du backend. Les logs de connexion PostgreSQL ne sont pas masqués et s'affichent en clair si le service DB est indisponible.

