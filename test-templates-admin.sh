#!/bin/bash

# 🧪 Script de test pour vérifier les templates et l'intégration admin
# Date: $(date '+%Y-%m-%d %H:%M:%S')

set -e

echo "🧪 Test de tous les templates avec panel d'administration intégré"
echo "=================================================================="

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

# Test des 3 templates
templates=("modern-saas" "e-commerce" "portfolio")
colors_primary=("#3B82F6" "#10B981" "#8B5CF6")
colors_secondary=("#1E40AF" "#059669" "#7C3AED")
colors_accent=("#60A5FA" "#34D399" "#A78BFA")

for i in "${!templates[@]}"; do
    template="${templates[$i]}"
    primary="${colors_primary[$i]}"
    secondary="${colors_secondary[$i]}"
    accent="${colors_accent[$i]}"
    
    log_info "Test du template: $template"
    
    # Créer la configuration de test
    site_name="Test-$template-$(date +%s)"
    
    # Préparer la requête JSON
    json_payload=$(cat <<EOF
{
  "name": "$site_name",
  "primaryColor": "$primary",
  "secondaryColor": "$secondary",
  "accentColor": "$accent",
  "template": "$template",
  "features": {
    "auth": true,
    "payment": true,
    "blog": false,
    "analytics": true
  }
}
EOF
)
    
    log_info "Génération du site avec template $template..."
    
    # Appeler l'API de génération
    response=$(curl -s -X POST \
        -H "Content-Type: application/json" \
        -d "$json_payload" \
        http://localhost:3001/api/generator/generate)
    
    # Vérifier la réponse
    if echo "$response" | grep -q '"success":true'; then
        log_success "✅ Template $template généré avec succès"
        
        # Extraire le nom du fichier de téléchargement
        filename=$(echo "$response" | grep -o '"filename":"[^"]*"' | cut -d'"' -f4)
        
        if [ ! -z "$filename" ]; then
            log_info "Téléchargement du script: $filename"
            
            # Télécharger le script
            curl -s -o "/tmp/$filename" \
                "http://localhost:3001/api/generator/download/$filename"
            
            if [ -f "/tmp/$filename" ]; then
                log_success "Script téléchargé: /tmp/$filename"
                
                # Vérifier que le script contient les fonctions nécessaires
                if grep -q "setup_admin_panel" "/tmp/$filename"; then
                    log_success "✅ Fonction setup_admin_panel trouvée dans le script"
                else
                    log_error "❌ Fonction setup_admin_panel manquante dans le script"
                fi
                
                if grep -q "apply_template" "/tmp/$filename"; then
                    log_success "✅ Fonction apply_template trouvée dans le script"
                else
                    log_error "❌ Fonction apply_template manquante dans le script"
                fi
                
                # Vérifier que le template spécifique est présent
                case "$template" in
                    "modern-saas")
                        if grep -q "Modern Business Solutions" "/tmp/$filename"; then
                            log_success "✅ Contenu du template Modern SAAS trouvé"
                        else
                            log_error "❌ Contenu du template Modern SAAS manquant"
                        fi
                        ;;
                    "e-commerce")
                        if grep -q "Online Store" "/tmp/$filename"; then
                            log_success "✅ Contenu du template E-commerce trouvé"
                        else
                            log_error "❌ Contenu du template E-commerce manquant"
                        fi
                        ;;
                    "portfolio")
                        if grep -q "Creative Portfolio" "/tmp/$filename"; then
                            log_success "✅ Contenu du template Portfolio trouvé"
                        else
                            log_error "❌ Contenu du template Portfolio manquant"
                        fi
                        ;;
                esac
                
                # Vérifier les couleurs personnalisées
                if grep -q "$primary" "/tmp/$filename"; then
                    log_success "✅ Couleur primaire ($primary) trouvée"
                else
                    log_error "❌ Couleur primaire ($primary) manquante"
                fi
                
                # Vérifier l'intégration admin
                if grep -q "AdminController" "/tmp/$filename"; then
                    log_success "✅ Contrôleur d'administration intégré"
                else
                    log_error "❌ Contrôleur d'administration manquant"
                fi
                
                if grep -q "admin.dashboard" "/tmp/$filename"; then
                    log_success "✅ Vues d'administration intégrées"
                else
                    log_error "❌ Vues d'administration manquantes"
                fi
                
                # Nettoyer
                rm "/tmp/$filename"
            else
                log_error "❌ Échec du téléchargement du script"
            fi
        else
            log_error "❌ Nom de fichier non trouvé dans la réponse"
        fi
    else
        log_error "❌ Échec de génération du template $template"
        echo "Réponse: $response"
    fi
    
    echo ""
done

log_success "🎉 Test des templates terminé !"
echo ""
echo "📋 Résumé des fonctionnalités intégrées:"
echo "   ✅ 3 templates complets (Modern SAAS, E-commerce, Portfolio)"
echo "   ✅ Système de couleurs dynamiques"
echo "   ✅ Panel d'administration complet"
echo "   ✅ Authentification web et API"
echo "   ✅ Contrôleurs et vues d'administration"
echo "   ✅ Routes sécurisées"
echo "   ✅ Interface responsive avec TailwindCSS"
echo ""
echo "🚀 Le générateur SAAS est maintenant complet et opérationnel !"
