#!/bin/bash

# DURABILIS.CO Chatbot - Script de déploiement
# Ce script automatise l'installation et le déploiement du projet

echo "🌱 DURABILIS.CO Chatbot - Script de déploiement"
echo "================================================"

# Vérifier si Bun est installé
if ! command -v bun &> /dev/null; then
    echo "❌ Bun n'est pas installé. Installez-le depuis: https://bun.sh"
    exit 1
fi

echo "✅ Bun détecté"

# Installer les dépendances
echo "📦 Installation des dépendances..."
bun install

if [ $? -ne 0 ]; then
    echo "❌ Erreur lors de l'installation des dépendances"
    exit 1
fi

echo "✅ Dépendances installées"

# Lancer le linter
echo "🔍 Vérification du code..."
bun run lint

# Build du projet
echo "🏗️ Build du projet..."
bun run build

if [ $? -ne 0 ]; then
    echo "❌ Erreur lors du build"
    exit 1
fi

echo "✅ Build réussi"

# Créer le zip pour Netlify
echo "📦 Création de l'archive pour déploiement..."
mkdir -p output
cd dist && zip -r ../output/durabilis-chatbot.zip . && cd ..

echo "✅ Archive créée: output/durabilis-chatbot.zip"

echo "🎉 Déploiement prêt!"
echo ""
echo "📋 Prochaines étapes:"
echo "1. Upload manual sur Netlify: drag & drop output/durabilis-chatbot.zip"
echo "2. Ou connecter le repository GitHub à Netlify pour auto-deploy"
echo "3. Configurer le domaine personnalisé si nécessaire"
echo ""
echo "🚀 Liens utiles:"
echo "- Documentation: README.md"
echo "- Demo live: https://same-s30rmqlhh9k-latest.netlify.app"
echo "- Repository: https://github.com/cheikhmansour/Durabilis_Bot"
