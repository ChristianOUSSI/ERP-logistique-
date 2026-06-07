#!/bin/bash
# scripts/backup_db.sh - Script de sauvegarde automatisé PostgreSQL
# Usage: ./backup_db.sh [retention_days]

set -e

# Configuration
BACKUP_DIR="/var/backups/kamlog-erp"
RETENTION_DAYS=${1:-30}  # Garder les backups pendant 30 jours par défaut
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="kamlog_erp_${TIMESTAMP}.sql.gz"

# Charger les variables d'environnement
if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
fi

# Créer le répertoire de backup s'il n'existe pas
mkdir -p "$BACKUP_DIR"

echo "[$(date)] Début de la sauvegarde de la base de données..."

# Sauvegarde de la base de données PostgreSQL
PGPASSWORD=$DB_PASSWORD pg_dump \
    -h $DB_HOST \
    -p ${DB_PORT:-5432} \
    -U $DB_USER \
    -d $DB_NAME \
    --format=plain \
    --no-owner \
    --no-acl \
    | gzip > "$BACKUP_DIR/$BACKUP_FILE"

# Vérifier que le backup a réussi
if [ $? -eq 0 ]; then
    echo "[$(date)] Sauvegarde réussie: $BACKUP_DIR/$BACKUP_FILE"
    
    # Afficher la taille du backup
    BACKUP_SIZE=$(du -h "$BACKUP_DIR/$BACKUP_FILE" | cut -f1)
    echo "[$(date)] Taille du backup: $BACKUP_SIZE"
else
    echo "[$(date)] ERREUR: La sauvegarde a échoué"
    exit 1
fi

# Nettoyer les anciens backups
echo "[$(date)] Nettoyage des backups plus vieux que $RETENTION_DAYS jours..."
find "$BACKUP_DIR" -name "kamlog_erp_*.sql.gz" -type f -mtime +$RETENTION_DAYS -delete

# Compter les backups restants
BACKUP_COUNT=$(find "$BACKUP_DIR" -name "kamlog_erp_*.sql.gz" -type f | wc -l)
echo "[$(date)] Nombre de backups conservés: $BACKUP_COUNT"

echo "[$(date)] Sauvegarde terminée avec succès"
