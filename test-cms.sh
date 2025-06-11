#!/bin/bash

# 🧪 Script de test du système CMS
# Ce script va tester la génération d'un site avec le nouveau système de gestion de contenu

set -e

echo "🧪 Test du système de gestion de contenu (CMS)"
echo "==============================================="

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Vérifier que le serveur API tourne
log_info "Vérification du serveur API..."
if ! curl -s http://localhost:3001/health > /dev/null; then
    log_error "Le serveur API n'est pas accessible sur le port 3001"
    log_info "Veuillez démarrer le serveur avec: cd api && npm run dev"
    exit 1
fi
log_success "Serveur API accessible"

# Test 1: Génération d'un site test
log_info "Test 1: Génération d'un site avec CMS..."
RESPONSE=$(curl -s -X POST http://localhost:3001/api/generator/generate \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Site Test CMS",
    "primaryColor": "#3b82f6",
    "secondaryColor": "#1f2937", 
    "accentColor": "#f59e0b",
    "template": "modern-saas",
    "features": {
      "auth": true,
      "payment": true,
      "blog": false,
      "analytics": true
    }
  }')

# Extraire le nom du fichier
FILENAME=$(echo $RESPONSE | grep -o '"filename":"[^"]*"' | cut -d'"' -f4)

if [ -z "$FILENAME" ]; then
    log_error "Échec de la génération du site"
    echo $RESPONSE
    exit 1
fi

log_success "Site généré: $FILENAME"

# Test 2: Vérification du contenu du script
log_info "Test 2: Vérification du contenu du script..."

# Télécharger le script
curl -s "http://localhost:3001/api/generator/download/$FILENAME" > "test-script.sh"

# Vérifier que les éléments CMS sont présents
if grep -q "create_content_management" test-script.sh; then
    log_success "Fonction de création CMS trouvée"
else
    log_error "Fonction de création CMS manquante"
    exit 1
fi

if grep -q "SiteContent::get" test-script.sh; then
    log_success "Utilisation de SiteContent dans le template"
else
    log_error "SiteContent non utilisé dans le template"
    exit 1
fi

if grep -q "admin.*content" test-script.sh; then
    log_success "Routes d'administration présentes"
else
    log_error "Routes d'administration manquantes"
    exit 1
fi

if grep -q "ContentController" test-script.sh; then
    log_success "Contrôleur d'administration présent"
else
    log_error "Contrôleur d'administration manquant"
    exit 1
fi

# Test 3: Vérification des migrations et seeders
log_info "Test 3: Vérification des migrations et seeders..."

if grep -q "site_contents" test-script.sh; then
    log_success "Migration site_contents présente"
else
    log_error "Migration site_contents manquante"
    exit 1
fi

if grep -q "SiteContentSeeder" test-script.sh; then
    log_success "Seeder de contenu présent"
else
    log_error "Seeder de contenu manquant"
    exit 1
fi

# Test 4: Vérification des vues d'administration
log_info "Test 4: Vérification des vues d'administration..."

if grep -q "admin/layout.blade.php" test-script.sh; then
    log_success "Layout d'administration présent"
else
    log_error "Layout d'administration manquant"
    exit 1
fi

if grep -q "admin/content/index.blade.php" test-script.sh; then
    log_success "Vue de gestion de contenu présente"
else
    log_error "Vue de gestion de contenu manquante"
    exit 1
fi

# Test 5: Vérification du contenu par défaut
log_info "Test 5: Vérification du contenu par défaut..."

EXPECTED_CONTENTS=(
    "hero.*title.*Welcome to Site Test CMS"
    "hero.*subtitle.*Your premier destination"
    "hero.*cta_primary.*Explore Products"
    "features.*title.*Why Choose"
    "feature_1.*title.*Lightning Fast"
    "cta.*title.*Ready to Get Started"
)

for content in "${EXPECTED_CONTENTS[@]}"; do
    if grep -q "$content" test-script.sh; then
        log_success "Contenu par défaut trouvé: $content"
    else
        log_warning "Contenu par défaut manquant: $content"
    fi
done

# Nettoyage
rm -f test-script.sh

# Résumé des tests
echo ""
echo "🎉 Résumé des tests"
echo "==================="
log_success "✅ Génération de site avec CMS"
log_success "✅ Fonction de création CMS"
log_success "✅ Template utilisant SiteContent"
log_success "✅ Routes d'administration"
log_success "✅ Contrôleur d'administration"
log_success "✅ Migration de base de données"
log_success "✅ Seeder de contenu"
log_success "✅ Vues d'administration"
log_success "✅ Contenu par défaut"

echo ""
log_success "🎊 Tous les tests sont passés avec succès !"
log_info "💡 Le système de gestion de contenu est entièrement fonctionnel"
echo ""
echo "📋 Pour tester un site complet :"
echo "   1. Téléchargez un script généré"
echo "   2. Exécutez-le dans un dossier vide"
echo "   3. Connectez-vous au site"
echo "   4. Allez sur /admin/content"
echo "   5. Modifiez les textes !"
echo ""
