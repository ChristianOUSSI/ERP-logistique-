#!/bin/bash

# ============================================================
# Script d'installation automatique - KAMLOG EM-ERP
# Pour Linux et macOS
# ============================================================

echo "========================================"
echo "KAMLOG EM-ERP - Installation automatique"
echo "========================================"
echo ""

# Vérification des prérequis
echo "🔍 Vérification des prérequis..."

# Vérifier Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python n'est pas installé"
    echo "   Veuillez installer Python 3.12+ depuis https://www.python.org/downloads/"
    exit 1
fi
PYTHON_VERSION=$(python3 --version)
echo "✅ Python trouvé: $PYTHON_VERSION"

# Vérifier Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé"
    echo "   Veuillez installer Node.js 20+ depuis https://nodejs.org/"
    exit 1
fi
NODE_VERSION=$(node --version)
echo "✅ Node.js trouvé: $NODE_VERSION"

# Vérifier Docker
if ! command -v docker &> /dev/null; then
    echo "⚠️  Docker n'est pas installé (optionnel mais recommandé)"
    echo "   Veuillez installer Docker depuis https://docs.docker.com/get-docker/"
else
    DOCKER_VERSION=$(docker --version)
    echo "✅ Docker trouvé: $DOCKER_VERSION"
fi

echo ""

# Installation Backend
echo "📦 Installation du Backend..."
cd kamlog-backend

# Créer l'environnement virtuel
if [ ! -d ".venv" ]; then
    echo "   Création de l'environnement virtuel Python..."
    python3 -m venv .venv
fi

# Activer l'environnement virtuel
echo "   Activation de l'environnement virtuel..."
source .venv/bin/activate

# Installer les dépendances
echo "   Installation des dépendances Python..."
pip install -r requirements.txt

# Créer le fichier .env si n'existe pas
if [ ! -f ".env" ]; then
    echo "   Création du fichier .env..."
    cp .env.example .env
    echo "   ⚠️  Veuillez éditer kamlog-backend/.env avec vos configurations"
fi

cd ..
echo "✅ Backend installé"
echo ""

# Installation Frontend
echo "📦 Installation du Frontend..."
cd kamlog-frontend

# Installer les dépendances
echo "   Installation des dépendances Node..."
npm install

# Créer le fichier .env.local si n'existe pas
if [ ! -f ".env.local" ]; then
    echo "   Création du fichier .env.local..."
    cp .env.local.example .env.local
    echo "   ⚠️  Veuillez éditer kamlog-frontend/.env.local avec vos configurations"
fi

cd ..
echo "✅ Frontend installé"
echo ""

# Instructions de démarrage
echo "========================================"
echo "Installation terminée avec succès!"
echo "========================================"
echo ""
echo "🚀 Pour démarrer l'application:"
echo ""
echo "1. Démarrer les services Docker (PostgreSQL, Redis, MinIO):"
echo "   docker-compose up -d db redis minio"
echo ""
echo "2. Appliquer les migrations:"
echo "   cd kamlog-backend"
echo "   source .venv/bin/activate"
echo "   alembic upgrade head"
echo "   cd .."
echo ""
echo "3. Démarrer le Backend:"
echo "   cd kamlog-backend"
echo "   source .venv/bin/activate"
echo "   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"
echo ""
echo "4. Démarrer le Frontend (dans un autre terminal):"
echo "   cd kamlog-frontend"
echo "   npm run dev"
echo ""
echo "📚 Documentation: https://github.com/cadc/kamlog-em-erp"
echo ""
