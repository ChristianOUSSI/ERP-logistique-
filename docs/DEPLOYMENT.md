# Guide de Déploiement  KAMLOG EM-ERP

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

### Étape 7: Application des migrations

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

### Étape 9: Monitoring

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

### Mise à jour (Update)

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
