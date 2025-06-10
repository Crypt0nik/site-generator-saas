#!/bin/bash

# 🚀 Script de publication GitHub pour Site Generator SAAS
# Auteur: Arthur (Crypt0nik)
# Date: 10 juin 2025

set -e

echo "🚀 Publication du Site Generator SAAS sur GitHub"
echo "================================================"

# Couleurs pour les messages
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Variables
REPO_NAME="site-generator-saas"
GITHUB_USERNAME="Crypt0nik"
GITHUB_URL="https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"

echo -e "${BLUE}📋 Configuration:${NC}"
echo "  • Repository: $REPO_NAME"
echo "  • GitHub User: $GITHUB_USERNAME"
echo "  • URL: $GITHUB_URL"
echo ""

# Vérifier que nous sommes dans le bon répertoire
if [ ! -f "package.json" ] || [ ! -d ".git" ]; then
    echo -e "${RED}❌ Erreur: Ce script doit être exécuté depuis la racine du projet${NC}"
    exit 1
fi

# Vérifier la configuration Git locale
echo -e "${BLUE}🔧 Vérification de la configuration Git...${NC}"
if ! git config user.name > /dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  Configuration Git manquante. Veuillez configurer Git:${NC}"
    echo "   git config --global user.name \"Votre Nom\""
    echo "   git config --global user.email \"votre@email.com\""
    exit 1
fi

# Ajouter les dernières modifications
echo -e "${BLUE}📦 Ajout des dernières modifications...${NC}"
git add .

# Créer un commit si nécessaire
if ! git diff --cached --quiet; then
    echo -e "${BLUE}💾 Création du commit de mise à jour...${NC}"
    git commit -m "🔧 Update GitHub configuration for Crypt0nik account

- Updated package.json with correct GitHub URLs
- Ready for publication to https://github.com/Crypt0nik/site-generator-saas
- All templates and admin panel integration complete"
else
    echo -e "${GREEN}✅ Repository déjà à jour${NC}"
fi

# Vérifier si la remote origin existe
if git remote get-url origin > /dev/null 2>&1; then
    echo -e "${BLUE}🔄 Mise à jour de la remote origin...${NC}"
    git remote set-url origin $GITHUB_URL
else
    echo -e "${BLUE}🔗 Ajout de la remote origin...${NC}"
    git remote add origin $GITHUB_URL
fi

echo ""
echo -e "${YELLOW}📝 ÉTAPES SUIVANTES MANUELLES:${NC}"
echo ""
echo "1. 🌐 Créez le repository sur GitHub:"
echo "   • Allez sur https://github.com/new"
echo "   • Nom du repository: $REPO_NAME"
echo "   • Description: Générateur SAAS de sites e-commerce avec panel d'administration intégré"
echo "   • Sélectionnez 'Public' ou 'Private' selon votre préférence"
echo "   • N'initialisez PAS avec README, .gitignore ou LICENSE (ils existent déjà)"
echo ""
echo "2. 🚀 Publiez le code:"
echo "   Exécutez cette commande quand le repository GitHub est créé:"
echo -e "   ${GREEN}git push -u origin master${NC}"
echo ""
echo "3. 🏷️  Créez un tag de release (optionnel):"
echo -e "   ${GREEN}git tag -a v1.0.0 -m \"🚀 Initial release - Site Generator SAAS v1.0.0\"${NC}"
echo -e "   ${GREEN}git push origin v1.0.0${NC}"
echo ""
echo "4. 📋 Configurez les GitHub Pages (optionnel):"
echo "   • Allez dans Settings > Pages"
echo "   • Source: Deploy from a branch"
echo "   • Branch: master / (root)"
echo ""

# Afficher l'état actuel
echo -e "${BLUE}📊 État actuel du repository:${NC}"
git log --oneline -5
echo ""
echo -e "${GREEN}✅ Repository prêt pour la publication!${NC}"
echo ""
echo -e "${BLUE}🔗 URL du repository: ${GREEN}$GITHUB_URL${NC}"
echo ""

# Proposer de faire le push automatiquement
echo -e "${YELLOW}❓ Voulez-vous pousser le code maintenant? (y/N)${NC}"
read -r response
if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    echo -e "${BLUE}🚀 Publication en cours...${NC}"
    if git push -u origin master; then
        echo -e "${GREEN}✅ Code publié avec succès sur GitHub!${NC}"
        echo -e "${BLUE}🌐 Votre repository: https://github.com/$GITHUB_USERNAME/$REPO_NAME${NC}"
    else
        echo -e "${RED}❌ Erreur lors de la publication. Vérifiez que le repository existe sur GitHub.${NC}"
        echo -e "${YELLOW}💡 Conseil: Créez d'abord le repository sur https://github.com/new${NC}"
    fi
else
    echo -e "${BLUE}📝 Commande à exécuter manuellement:${NC}"
    echo -e "${GREEN}git push -u origin master${NC}"
fi

echo ""
echo -e "${GREEN}🎉 Script terminé!${NC}"
