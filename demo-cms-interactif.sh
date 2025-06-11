#!/bin/bash

# 🎨 Démonstration Interactive du Système CMS
# Ce script montre les fonctionnalités du CMS intégré

set -e

echo "🎨 Démonstration du Système de Gestion de Contenu (CMS)"
echo "========================================================"

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
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

log_highlight() {
    echo -e "${PURPLE}🎯 $1${NC}"
}

log_feature() {
    echo -e "${CYAN}🚀 $1${NC}"
}

echo ""
log_info "Votre générateur de sites SaaS inclut maintenant un système CMS complet !"
echo ""

# 1. Présentation du problème résolu
log_highlight "PROBLÈME RÉSOLU :"
echo "❌ Avant : Les utilisateurs devaient modifier le code pour changer les textes"
echo "❌ Avant : Pas d'interface d'administration"
echo "❌ Avant : Besoin de connaissances techniques"
echo ""
echo "✅ Maintenant : Interface web intuitive pour éditer tous les contenus"
echo "✅ Maintenant : Aucune connaissance technique requise"
echo "✅ Maintenant : Modifications en temps réel"
echo ""

# 2. Fonctionnalités
log_feature "FONCTIONNALITÉS INCLUSES :"
echo "🎯 Édition de la section Hero (titre, sous-titre, boutons)"
echo "🎯 Gestion des fonctionnalités (titres, descriptions)"
echo "🎯 Personnalisation de l'appel à l'action"
echo "🎯 Interface d'administration sécurisée"
echo "🎯 Sauvegarde automatique en base de données"
echo "🎯 Organisation logique par sections"
echo ""

# 3. Architecture technique
log_feature "ARCHITECTURE TECHNIQUE :"
echo "📊 Modèle SiteContent avec méthodes get() et set()"
echo "🗄️  Table site_contents (section, key, value, type)"
echo "🎛️  Contrôleur d'administration avec validation"
echo "🎨 Vues d'administration responsive"
echo "🔒 Authentification et sécurité CSRF"
echo "🌱 Seeder avec contenu par défaut"
echo ""

# 4. Utilisation pour l'utilisateur final
log_feature "UTILISATION POUR L'UTILISATEUR FINAL :"
echo "1️⃣  Génère son site via votre interface web"
echo "2️⃣  Télécharge et exécute le script d'installation"
echo "3️⃣  Se connecte au site généré"
echo "4️⃣  Va sur /admin/content"
echo "5️⃣  Modifie les textes en quelques clics"
echo "6️⃣  Sauvegarde et voit les changements immédiatement"
echo ""

# 5. Avantages business
log_highlight "AVANTAGES POUR VOTRE BUSINESS :"
echo "💰 Fonctionnalité premium qui justifie un prix plus élevé"
echo "🏆 Avantage concurrentiel face aux générateurs basiques"
echo "📈 Satisfaction client accrue (autonomie totale)"
echo "🔄 Meilleure rétention (les clients peuvent faire évoluer leur site)"
echo "🎯 Différenciation claire sur le marché"
echo ""

# 6. Démonstration du code généré
log_feature "APERÇU DU CODE GÉNÉRÉ :"
echo ""
echo "# Avant (code statique) :"
echo '<h1>Bienvenue sur Mon Site</h1>'
echo ""
echo "# Après (code dynamique avec CMS) :"
echo '<h1>{!! SiteContent::get("hero", "title", "Bienvenue sur Mon Site") !!}</h1>'
echo ""
log_info "Le système utilise automatiquement la base de données ou la valeur par défaut"
echo ""

# 7. Test en direct
log_warning "VOULEZ-VOUS TESTER LA GÉNÉRATION D'UN SITE AVEC CMS ? (y/N)"
read -r response
if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    log_info "Génération d'un site de test..."
    
    # Vérifier que l'API est accessible
    if curl -s http://localhost:3001/health > /dev/null; then
        log_success "API accessible"
        
        # Générer un site test
        RESPONSE=$(curl -s -X POST http://localhost:3001/api/generator/generate \
          -H "Content-Type: application/json" \
          -d '{
            "name": "Demo CMS Site",
            "primaryColor": "#3b82f6",
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
        
        if [ -n "$FILENAME" ]; then
            log_success "Site généré avec succès : $FILENAME"
            echo ""
            log_feature "CONTENU DU SCRIPT GÉNÉRÉ :"
            echo "📦 Modèle SiteContent"
            echo "🗄️  Migration site_contents" 
            echo "🌱 Seeder avec contenu par défaut"
            echo "🎛️  Contrôleur d'administration"
            echo "🎨 Interface d'édition complète"
            echo "🔒 Routes sécurisées"
            echo "📝 Template utilisant le CMS"
            echo ""
            log_info "Le script est prêt à être téléchargé et exécuté !"
            echo "URL de téléchargement : http://localhost:3001/api/generator/download/$FILENAME"
        else
            log_warning "Erreur lors de la génération"
        fi
    else
        log_warning "API non accessible. Démarrez d'abord le serveur avec :"
        echo "cd api && npm run dev"
    fi
fi

echo ""
log_highlight "PROCHAINES ÉTAPES POSSIBLES :"
echo "📸 Gestion d'images (upload et édition)"
echo "🎨 Personnalisation CSS (couleurs, styles)"
echo "📱 Prévisualisation avant publication"
echo "📋 Système de sauvegarde/restauration"
echo "🌍 Support multi-langues"
echo "👥 Gestion des rôles utilisateurs"
echo ""

log_success "🎉 Votre générateur SaaS est maintenant équipé d'un véritable CMS !"
log_info "📖 Consultez GUIDE-CMS.md pour la documentation complète"
echo ""
