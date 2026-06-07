# Guide de Dépannage - KAMLOG EM-ERP

**Version**: 1.0  
**Date**: Juin 2026

Ce guide vous aide à résoudre les problèmes courants lors de l'installation, de la configuration et de l'utilisation de KAMLOG EM-ERP.

---

## 🚀 Problèmes de Démarrage

### L'application ne démarre pas

**Symptôme**: `uvicorn` échoue au démarrage avec une erreur de connexion à la base de données.

**Solutions**:
1. Vérifiez que PostgreSQL est en cours d'exécution:
   ```bash
   sudo systemctl status postgresql
   sudo systemctl start postgresql
   ```

2. Vérifiez les variables d'environnement dans `.env`:
   ```bash
   # Vérifiez que DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD sont corrects
   cat .env | grep DB_
   ```

3. Testez la connexion à la base de données:
   ```bash
   psql -h localhost -U kamlog -d kamlog_erp
   ```

4. Vérifiez que la base de données existe:
   ```sql
   CREATE DATABASE kamlog_erp;
   ```

---

## 🔐 Problèmes d'Authentification

### Erreur "Token invalide"

**Symptôme**: Les requêtes API retournent 401 Unauthorized avec "Token invalide".

**Solutions**:
1. Vérifiez que `JWT_SECRET_KEY` est défini dans `.env`:
   ```bash
   grep JWT_SECRET_KEY .env
   ```

2. Assurez-vous que la clé a au moins 32 caractères.

3. Si vous utilisez le frontend, vérifiez que le token est stocké correctement dans localStorage.

### Erreur "Permissions insuffisantes"

**Symptôme**: 403 Forbidden avec message "Permissions insuffisantes".

**Solutions**:
1. Vérifiez que l'utilisateur a le rôle approprié dans la base de données.

2. Vérifiez que le décorateur `@check_permission` est correctement configuré sur l'endpoint.

3. Pour les tests, utilisez un compte admin avec tous les droits.

---

## 📊 Problèmes de Base de Données

### Erreur "relation does not exist"

**Symptôme**: `sqlalchemy.exc.ProgrammingError: relation does not exist`

**Solutions**:
1. Exécutez les migrations Alembic:
   ```bash
   cd kamlog-backend
   alembic upgrade head
   ```

2. Si les migrations échouent, réinitialisez:
   ```bash
   alembic downgrade base
   alembic upgrade head
   ```

3. Vérifiez que les modèles sont importés dans `models/__init__.py`.

### Erreur "UniqueViolation"

**Symptôme**: `sqlalchemy.exc.IntegrityError: duplicate key value violates unique constraint`

**Solutions**:
1. Vérifiez que vous n'essayez pas de créer un doublon (ex: même code article).

2. Pour les stocks, vérifiez la contrainte d'unicité sur `(magasin_id, article_id)`.

3. Utilisez `get_or_create` au lieu de `create` si nécessaire.

---

## 🗄️ Problèmes de Stockage (MinIO)

### Erreur de connexion MinIO

**Symptôme**: `minio.error.S3Error: Access Denied`

**Solutions**:
1. Vérifiez que MinIO est en cours d'exécution:
   ```bash
   docker ps | grep minio
   ```

2. Vérifiez les credentials dans `.env`:
   ```bash
   grep MINIO_ .env
   ```

3. Assurez-vous que le bucket existe:
   ```bash
   mc alias set minio http://localhost:9000 kamlog_minio minio_secret
   mc mb minio/kamlog-documents
   ```

---

## 🔄 Problèmes de Cache (Redis)

### Erreur de connexion Redis

**Symptôme**: `redis.exceptions.ConnectionError: Error connecting to Redis`

**Solutions**:
1. Vérifiez que Redis est en cours d'exécution:
   ```bash
   docker ps | grep redis
   ```

2. Testez la connexion:
   ```bash
   redis-cli -a your_redis_password ping
   ```

3. Vérifiez que `REDIS_URL` est correct dans `.env`.

---

## 🧪 Problèmes de Tests

### Tests échouent avec "ModuleNotFoundError"

**Symptôme**: Les tests ne trouvent pas les modules.

**Solutions**:
1. Installez les dépendances:
   ```bash
   pip install -r requirements.txt
   ```

2. Assurez-vous que vous êtes dans le bon répertoire:
   ```bash
   cd kamlog-backend
   ```

3. Vérifiez la structure des répertoires et les fichiers `__init__.py`.

---

## 📝 Problèmes de Logs

### Logs non générés

**Symptôme**: Le répertoire `logs/` ne contient aucun fichier.

**Solutions**:
1. Créez le répertoire de logs:
   ```bash
   mkdir -p logs
   ```

2. Vérifiez les permissions d'écriture:
   ```bash
   chmod 755 logs
   ```

3. Vérifiez que `loguru` est importé dans `main.py`.

---

## 🔧 Problèmes de Performance

### L'application est lente

**Symptôme**: Les requêtes prennent beaucoup de temps.

**Solutions**:
1. Vérifiez les N+1 queries avec le logging SQL activé:
   ```python
   # Dans config.py
   echo=True
   ```

2. Utilisez `selectinload()` ou `joinedload()` pour les relations:
   ```python
   from sqlalchemy.orm import selectinload
   query = db.query(Declaration).options(selectinload(Declaration.lignes))
   ```

3. Vérifiez que les indexes sont créés sur les champs de recherche.

4. Activez le cache Redis pour les données fréquemment accédées.

---

## 🐳 Problèmes Docker

### Conteneur ne démarre pas

**Symptôme**: `docker-compose up` échoue.

**Solutions**:
1. Vérifiez les logs du conteneur:
   ```bash
   docker-compose logs api
   ```

2. Recréez les conteneurs:
   ```bash
   docker-compose down
   docker-compose up --build
   ```

3. Vérifiez que les ports ne sont pas déjà utilisés:
   ```bash
   netstat -tuln | grep -E '8000|5432|6379|9000'
   ```

---

## 📦 Problèmes de Déploiement

### Erreur 502 Bad Gateway

**Symptôme**: Nginx retourne 502.

**Solutions**:
1. Vérifiez que l'application FastAPI est en cours d'exécution:
   ```bash
   systemctl status kamlog-api
   ```

2. Vérifiez la configuration Nginx:
   ```bash
   sudo nginx -t
   sudo systemctl reload nginx
   ```

3. Vérifiez les logs de Nginx:
   ```bash
   sudo tail -f /var/log/nginx/error.log
   ```

---

## 🆘 Obtenir de l'Aide

Si vous ne trouvez pas la solution ici:

1. Consultez la documentation principale: `README.md`
2. Consultez le guide de déploiement: `docs/DEPLOYMENT.md`
3. Vérifiez les logs dans `logs/` pour plus de détails
4. Activez le mode DEBUG dans `.env` pour plus d'informations:
   ```bash
   DEBUG=True
   ```

---

## 📞 Support

Pour le support technique:
- Email: support@kamlog.cm
- Documentation: https://docs.kamlog.cm
- Issues: https://github.com/kamlog/erp/issues
