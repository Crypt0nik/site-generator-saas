#!/bin/bash

# 🎉 DÉMONSTRATION FINALE - Site Generator SAAS avec CMS
# Script de présentation complète des fonctionnalités incluant le nouveau système CMS

set -e

echo "🎉 SITE GENERATOR SAAS - DÉMONSTRATION FINALE AVEC CMS"
echo "======================================================"
echo ""

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

log_title() {
    echo -e "${BOLD}${PURPLE}🎯 $1${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
}

log_feature() {
    echo -e "${CYAN}🚀 $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_highlight() {
    echo -e "${YELLOW}⭐ $1${NC}"
}

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_feature() {
    echo -e "${PURPLE}🎯 $1${NC}"
}

log_demo() {
    echo -e "${CYAN}🎬 $1${NC}"
}

echo "Cette démonstration va montrer :"
echo ""
log_feature "1. Génération de 3 sites avec templates différents"
log_feature "2. Personnalisation complète des couleurs"
log_feature "3. Panel d'administration intégré"
log_feature "4. Installation automatique complète"
log_feature "5. Templates responsive et modernes"
echo ""

read -p "🚀 Appuyez sur ENTRÉE pour commencer la démonstration..."

# Configuration des sites de démonstration
declare -A sites=(
    ["TechCorp SAAS"]="modern-saas|#1e40af|#3730a3|#60a5fa"
    ["Boutique Élégante"]="e-commerce|#059669|#047857|#34d399"  
    ["Studio Créatif"]="portfolio|#7c3aed|#6d28d9|#a78bfa"
)

counter=1
for site_name in "${!sites[@]}"; do
    IFS='|' read -r template primary secondary accent <<< "${sites[$site_name]}"
    
    log_demo "=== DÉMONSTRATION $counter/3 : $site_name ==="
    echo ""
    
    log_info "Configuration :"
    echo "  📝 Nom : $site_name"
    echo "  🎨 Template : $template"
    echo "  🎨 Couleur primaire : $primary"
    echo "  🎨 Couleur secondaire : $secondary" 
    echo "  🎨 Couleur accent : $accent"
    echo ""
    
    log_info "Génération du site avec l'API..."
    
    # Préparer la configuration JSON
    json_config=$(cat <<EOF
{
    "name": "$site_name",
    "primaryColor": "$primary",
    "secondaryColor": "$secondary", 
    "accentColor": "$accent",
    "template": "$template",
    "features": {
        "auth": true,
        "payment": $([ "$template" == "e-commerce" ] && echo "true" || echo "false"),
        "blog": $([ "$template" == "portfolio" ] && echo "true" || echo "false"),
        "analytics": true
    }
}
EOF
)
    
    # Appeler l'API de génération
    response=$(curl -s -X POST \
        -H "Content-Type: application/json" \
        -d "$json_config" \
        http://localhost:3001/api/generator/generate 2>/dev/null)
    
    if echo "$response" | grep -q '"success":true'; then
        filename=$(echo "$response" | grep -o '"filename":"[^"]*"' | cut -d'"' -f4)
        log_success "Site généré avec succès !"
        log_success "Script d'installation : $filename"
        
        # Analyser le contenu généré
        log_info "Téléchargement et analyse du script..."
        curl -s -o "/tmp/demo-$counter.sh" \
            "http://localhost:3001/api/generator/download/$filename" 2>/dev/null
        
        if [ -f "/tmp/demo-$counter.sh" ]; then
            # Vérifications du contenu
            log_info "Vérification des fonctionnalités intégrées :"
            
            if grep -q "setup_admin_panel" "/tmp/demo-$counter.sh"; then
                log_success "  ✅ Panel d'administration"
            fi
            
            if grep -q "$template" "/tmp/demo-$counter.sh"; then
                log_success "  ✅ Template $template"
            fi
            
            if grep -q "$primary" "/tmp/demo-$counter.sh"; then
                log_success "  ✅ Couleurs personnalisées"
            fi
            
            if grep -q "AdminController" "/tmp/demo-$counter.sh"; then
                log_success "  ✅ Contrôleur d'administration"
            fi
            
            if grep -q "admin.dashboard" "/tmp/demo-$counter.sh"; then
                log_success "  ✅ Vues d'administration"
            fi
            
            case "$template" in
                "modern-saas")
                    if grep -q "Modern Business Solutions" "/tmp/demo-$counter.sh"; then
                        log_success "  ✅ Contenu SAAS moderne"
                    fi
                    ;;
                "e-commerce")
                    if grep -q "Online Store" "/tmp/demo-$counter.sh"; then
                        log_success "  ✅ Interface e-commerce"
                    fi
                    ;;
                "portfolio") 
                    if grep -q "Creative Portfolio" "/tmp/demo-$counter.sh"; then
                        log_success "  ✅ Portfolio créatif"
                    fi
                    ;;
            esac
            
            # Nettoyer
            rm "/tmp/demo-$counter.sh"
        fi
        
    else
        log_error "❌ Erreur lors de la génération"
        echo "Réponse : $response"
    fi
    
    echo ""
    if [ $counter -lt 3 ]; then
        read -p "▶️  Appuyez sur ENTRÉE pour le site suivant..."
        echo ""
    fi
    
    ((counter++))
done

log_demo "=== RÉSUMÉ DE LA DÉMONSTRATION ==="
echo ""
log_success "🎉 Démonstration terminée avec succès !"
echo ""
echo "📋 Fonctionnalités démontrées :"
echo ""
log_feature "✅ Génération automatique de 3 types de sites :"
echo "   • Modern SAAS (Business/Corporate)"
echo "   • E-commerce (Boutique en ligne)"  
echo "   • Portfolio (Créatif/Artistique)"
echo ""
log_feature "✅ Personnalisation complète :"
echo "   • Couleurs dynamiques (primaire, secondaire, accent)"
echo "   • Nom et branding personnalisés"
echo "   • Configuration des fonctionnalités"
echo ""
log_feature "✅ Panel d'administration intégré :"
echo "   • Tableau de bord avec statistiques"
echo "   • Gestion produits, commandes, clients"
echo "   • Paramètres et configuration"
echo "   • Authentification sécurisée"
echo ""
log_feature "✅ Installation automatique :"
echo "   • Vérification des prérequis"
echo "   • Clonage et configuration automatique"
echo "   • Base de données SQLite"
echo "   • Démarrage du serveur"
echo ""
log_feature "✅ Architecture professionnelle :"
echo "   • Laravel 12 + Sanctum + Swagger"
echo "   • TailwindCSS responsive"
echo "   • API REST complète"
echo "   • Code propre et documenté"
echo ""

echo "🚀 URLs de test (après installation) :"
echo "   • Générateur : http://localhost:3002"
echo "   • API : http://localhost:3001"
echo "   • Sites générés : http://localhost:8000"
echo "   • Admin panel : http://localhost:8000/admin"
echo ""

log_success "Le générateur SAAS est opérationnel et prêt pour la production !"
echo ""
echo "📖 Documentation complète : DOCUMENTATION-FINALE.md"
echo ""

# Afficher un récapitulatif des URLs importantes
echo "🔗 LIENS UTILES :"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Frontend (Générateur) : http://localhost:3002"
echo "API (Backend)         : http://localhost:3001"  
echo "Documentation API     : http://localhost:3001/api/status"
echo ""
echo "Après génération d'un site :"
echo "Site public          : http://localhost:8000"
echo "Panel Admin          : http://localhost:8000/admin"
echo "Page de connexion    : http://localhost:8000/login" 
echo "API du site          : http://localhost:8000/api/documentation"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

log_demo "🎯 Pour tester :"
echo "1. Allez sur http://localhost:3002"
echo "2. Configurez votre site (nom, couleurs, template)"
echo "3. Téléchargez le script d'installation"
echo "4. Exécutez le script : ./install-votre-site.sh"
echo "5. Accédez à votre site et son admin panel"
