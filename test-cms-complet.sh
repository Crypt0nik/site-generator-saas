#!/bin/bash

# 🚀 Test Rapide du CMS - Installation Site Complet
# Ce script installe un site de test avec le CMS en quelques minutes

set -e

echo "🚀 Test Rapide du CMS - Installation Site Complet"
echo "================================================="

# Couleurs
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

log_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
log_success() { echo -e "${GREEN}✅ $1${NC}"; }
log_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
log_error() { echo -e "${RED}❌ $1${NC}"; }

# Vérifier les prérequis
log_info "Vérification des prérequis..."

# Vérifier PHP
if ! command -v php &> /dev/null; then
    log_error "PHP non installé. Installation requise."
    exit 1
fi

# Vérifier Composer
if ! command -v composer &> /dev/null; then
    log_error "Composer non installé. Installation requise."
    exit 1
fi

# Vérifier l'API
if ! curl -s http://localhost:3001/health > /dev/null; then
    log_error "L'API n'est pas accessible sur le port 3001"
    log_info "Démarrez le serveur avec: cd api && npm run dev"
    exit 1
fi

log_success "Tous les prérequis sont satisfaits"

# Créer un dossier temporaire pour le test
TEST_DIR="/tmp/cms-site-test-$(date +%s)"
mkdir -p "$TEST_DIR"
cd "$TEST_DIR"

log_info "Dossier de test créé : $TEST_DIR"

# Générer un site avec CMS
log_info "Génération d'un site de test avec CMS..."

RESPONSE=$(curl -s -X POST http://localhost:3001/api/generator/generate \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Mon Site CMS Test",
    "primaryColor": "#2563eb",
    "secondaryColor": "#1f2937", 
    "accentColor": "#f59e0b",
    "template": "modern-saas",
    "features": {
      "auth": true,
      "payment": false,
      "blog": false,
      "analytics": false
    }
  }')

FILENAME=$(echo $RESPONSE | grep -o '"filename":"[^"]*"' | cut -d'"' -f4)

if [ -z "$FILENAME" ]; then
    log_error "Échec de la génération du site"
    echo $RESPONSE
    exit 1
fi

log_success "Site généré : $FILENAME"

# Télécharger le script d'installation
log_info "Téléchargement du script d'installation..."
curl -s "http://localhost:3001/api/generator/download/$FILENAME" > install.sh
chmod +x install.sh

log_success "Script téléchargé"

# Analyser le contenu du script
log_info "Vérification du contenu CMS dans le script..."

if grep -q "create_content_management" install.sh; then
    log_success "✓ Fonction CMS trouvée"
else
    log_error "✗ Fonction CMS manquante"
    exit 1
fi

if grep -q "SiteContent::get" install.sh; then
    log_success "✓ Template utilise le CMS"
else
    log_error "✗ Template n'utilise pas le CMS"
    exit 1
fi

if grep -q "ContentController" install.sh; then
    log_success "✓ Contrôleur d'administration présent"
else
    log_error "✗ Contrôleur d'administration manquant"
    exit 1
fi

# Option d'installation complète
echo ""
log_warning "Voulez-vous procéder à l'installation complète ? (y/N)"
log_info "Cela va installer Laravel, configurer la base de données, etc."
log_warning "L'installation peut prendre 5-10 minutes..."

read -r response
if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    log_info "Début de l'installation complète..."
    
    # Exécuter le script d'installation
    if ./install.sh; then
        log_success "🎉 Installation terminée avec succès !"
        echo ""
        log_info "🎯 Votre site CMS est maintenant prêt !"
        echo ""
        echo "📋 Pour tester le CMS :"
        echo "   1. Ouvrez votre navigateur"
        echo "   2. Allez sur http://127.0.0.1:8000"
        echo "   3. Créez un compte"
        echo "   4. Allez sur http://127.0.0.1:8000/admin/content"
        echo "   5. Modifiez les textes !"
        echo ""
        log_success "Le serveur va démarrer automatiquement..."
    else
        log_error "Erreur lors de l'installation"
        exit 1
    fi
else
    log_info "Installation annulée"
    echo ""
    log_info "📋 Analyse du script généré :"
    
    # Compter les occurrences CMS
    CMS_FUNCTIONS=$(grep -c "SiteContent::" install.sh || echo "0")
    ADMIN_ROUTES=$(grep -c "admin.*content" install.sh || echo "0")
    
    echo "   🔢 Utilisations de SiteContent : $CMS_FUNCTIONS"
    echo "   🔢 Routes d'administration : $ADMIN_ROUTES"
    
    # Montrer quelques exemples
    echo ""
    log_info "📋 Exemples de code CMS généré :"
    echo ""
    echo "   Template (before) :"
    echo '   <h1>Titre fixe</h1>'
    echo ""
    echo "   Template (after) :"
    echo '   <h1>{!! SiteContent::get("hero", "title", "Mon Site CMS Test") !!}</h1>'
    echo ""
    
    # Montrer la structure des fichiers
    echo "📁 Fichiers CMS qui seraient créés :"
    echo "   ├── app/Models/SiteContent.php"
    echo "   ├── app/Http/Controllers/Admin/ContentController.php"
    echo "   ├── database/migrations/create_site_contents_table.php"
    echo "   ├── database/seeders/SiteContentSeeder.php"
    echo "   ├── resources/views/admin/layout.blade.php"
    echo "   ├── resources/views/admin/content/index.blade.php"
    echo "   └── routes/web.php (avec routes admin)"
fi

echo ""
log_success "🎊 Test du CMS terminé avec succès !"
log_info "📖 Consultez GUIDE-CMS.md pour plus d'informations"

# Nettoyage optionnel
echo ""
log_warning "Supprimer le dossier de test ? (y/N)"
read -r cleanup
if [[ "$cleanup" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    cd /tmp
    rm -rf "$TEST_DIR"
    log_success "Dossier de test supprimé"
else
    log_info "Dossier de test conservé : $TEST_DIR"
fi

echo ""
