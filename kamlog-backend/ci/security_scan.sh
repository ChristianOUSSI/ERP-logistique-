#!/bin/bash
# Script de scan de sécurité automatisé (CI/CD)

set -e

echo "🔒 Démarrage de la vérification de sécurité KAMLOG EM-ERP..."

# 1. Vérification des dépendances Python vulnérables
echo "📦 Analyse des vulnérabilités de dépendances avec Safety..."
safety check -r requirements.txt --full-report

# 2. Analyse statique du code (SAST)
echo "🕵️‍♂️ Analyse statique du code avec Bandit..."
bandit -r app/ -ll -ii -x tests/,scratch/ -f screen

echo "✅ Vérification de sécurité terminée avec succès. Aucun problème critique détecté."
