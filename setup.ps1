# ============================================================
# Script d'installation automatique - KAMLOG EM-ERP
# Pour Windows PowerShell
# ============================================================

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "KAMLOG EM-ERP - Installation automatique" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Vérification des prérequis
Write-Host "🔍 Vérification des prérequis..." -ForegroundColor Yellow

# Vérifier Python
$pythonVersion = python --version 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Python n'est pas installé ou pas dans le PATH" -ForegroundColor Red
    Write-Host "   Veuillez installer Python 3.12+ depuis https://www.python.org/downloads/" -ForegroundColor Yellow
    exit 1
}
Write-Host "✅ Python trouvé: $pythonVersion" -ForegroundColor Green

# Vérifier Node.js
$nodeVersion = node --version 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Node.js n'est pas installé ou pas dans le PATH" -ForegroundColor Red
    Write-Host "   Veuillez installer Node.js 20+ depuis https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}
Write-Host "✅ Node.js trouvé: $nodeVersion" -ForegroundColor Green

# Vérifier Docker
$dockerVersion = docker --version 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Docker n'est pas installé (optionnel mais recommandé)" -ForegroundColor Yellow
    Write-Host "   Veuillez installer Docker Desktop depuis https://www.docker.com/products/docker-desktop/" -ForegroundColor Yellow
} else {
    Write-Host "✅ Docker trouvé: $dockerVersion" -ForegroundColor Green
}

Write-Host ""

# Installation Backend
Write-Host "📦 Installation du Backend..." -ForegroundColor Yellow
Set-Location kamlog-backend

# Créer l'environnement virtuel
if (-not (Test-Path .venv)) {
    Write-Host "   Création de l'environnement virtuel Python..." -ForegroundColor Cyan
    python -m venv .venv
}

# Activer l'environnement virtuel
Write-Host "   Activation de l'environnement virtuel..." -ForegroundColor Cyan
& .venv\Scripts\Activate.ps1

# Installer les dépendances
Write-Host "   Installation des dépendances Python..." -ForegroundColor Cyan
pip install -r requirements.txt

# Créer le fichier .env si n'existe pas
if (-not (Test-Path .env)) {
    Write-Host "   Création du fichier .env..." -ForegroundColor Cyan
    Copy-Item .env.example .env
    Write-Host "   ⚠️  Veuillez éditer kamlog-backend/.env avec vos configurations" -ForegroundColor Yellow
}

Set-Location ..
Write-Host "✅ Backend installé" -ForegroundColor Green
Write-Host ""

# Installation Frontend
Write-Host "📦 Installation du Frontend..." -ForegroundColor Yellow
Set-Location kamlog-frontend

# Installer les dépendances
Write-Host "   Installation des dépendances Node..." -ForegroundColor Cyan
npm install

# Créer le fichier .env.local si n'existe pas
if (-not (Test-Path .env.local)) {
    Write-Host "   Création du fichier .env.local..." -ForegroundColor Cyan
    Copy-Item .env.local.example .env.local
    Write-Host "   ⚠️  Veuillez éditer kamlog-frontend/.env.local avec vos configurations" -ForegroundColor Yellow
}

Set-Location ..
Write-Host "✅ Frontend installé" -ForegroundColor Green
Write-Host ""

# Instructions de démarrage
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Installation terminée avec succès!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "🚀 Pour démarrer l'application:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Démarrer les services Docker (PostgreSQL, Redis, MinIO):" -ForegroundColor White
Write-Host "   docker-compose up -d db redis minio" -ForegroundColor Cyan
Write-Host ""
Write-Host "2. Appliquer les migrations:" -ForegroundColor White
Write-Host "   cd kamlog-backend" -ForegroundColor Cyan
Write-Host "   .venv\Scripts\Activate" -ForegroundColor Cyan
Write-Host "   alembic upgrade head" -ForegroundColor Cyan
Write-Host "   cd .." -ForegroundColor Cyan
Write-Host ""
Write-Host "3. Démarrer le Backend:" -ForegroundColor White
Write-Host "   cd kamlog-backend" -ForegroundColor Cyan
Write-Host "   .venv\Scripts\Activate" -ForegroundColor Cyan
Write-Host "   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000" -ForegroundColor Cyan
Write-Host ""
Write-Host "4. Démarrer le Frontend (dans un autre terminal):" -ForegroundColor White
Write-Host "   cd kamlog-frontend" -ForegroundColor Cyan
Write-Host "   npm run dev" -ForegroundColor Cyan
Write-Host ""
Write-Host "📚 Documentation: https://github.com/cadc/kamlog-em-erp" -ForegroundColor White
Write-Host ""
