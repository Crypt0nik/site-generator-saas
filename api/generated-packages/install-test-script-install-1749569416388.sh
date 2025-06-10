#!/bin/bash

# 🚀 Script d'installation automatique pour Test Script Install
# Généré le $(date)
# Template: modern-saas

set -e  # Exit on any error

echo "🎉 Installation de votre site: Test Script Install"
echo "================================================="

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages
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

# Vérification des prérequis
check_requirements() {
    log_info "Vérification des prérequis..."
    
    # Vérifier Git
    if ! command -v git &> /dev/null; then
        log_error "Git n'est pas installé. Veuillez installer Git et relancer le script."
        exit 1
    fi
    
    # Vérifier PHP
    if ! command -v php &> /dev/null; then
        log_error "PHP n'est pas installé. Veuillez installer PHP 8.1+ et relancer le script."
        exit 1
    fi
    
    # Vérifier Composer
    if ! command -v composer &> /dev/null; then
        log_error "Composer n'est pas installé. Veuillez installer Composer et relancer le script."
        exit 1
    fi
    
    # Vérifier Node.js
    if ! command -v node &> /dev/null; then
        log_error "Node.js n'est pas installé. Veuillez installer Node.js 18+ et relancer le script."
        exit 1
    fi
    
    # Vérifier npm
    if ! command -v npm &> /dev/null; then
        log_error "npm n'est pas installé. Veuillez installer npm et relancer le script."
        exit 1
    fi
    
    log_success "Tous les prérequis sont installés!"
}

# Cloner le projet de base
clone_project() {
    log_info "Clonage du projet de base..."
    
    if [ -d "test-script-install" ]; then
        log_warning "Le dossier test-script-install existe déjà. Suppression..."
        rm -rf "test-script-install"
    fi
    
    # Note: Remplacez cette URL par l'URL réelle de votre repository
    git clone https://github.com/votre-username/Projet-Dev-B2.git "test-script-install"
    cd "test-script-install"
    
    log_success "Projet cloné avec succès!"
}

# Configuration personnalisée
configure_project() {
    log_info "Configuration du projet avec vos paramètres..."
    
    # Créer le fichier .env
    cp .env.example .env
    
    # Configuration de base
    sed -i '' "s/APP_NAME=.*/APP_NAME="Test Script Install"/" .env
    sed -i '' "s/APP_URL=.*/APP_URL=http:\/\/localhost:8000/" .env
    
    # Configuration de la base de données SQLite
    sed -i '' "s/DB_CONNECTION=.*/DB_CONNECTION=sqlite/" .env
    sed -i '' "s/DB_DATABASE=.*/DB_DATABASE=database\/database.sqlite/" .env
    
    # Créer le fichier de configuration des couleurs personnalisées
    cat > config/brand.php << 'EOF'
<?php

return [
    'name' => 'Test Script Install',
    'template' => 'modern-saas',
    'colors' => [
        'primary' => '#3B82F6',
        'secondary' => '#1E40AF',
        'accent' => '#F59E0B',
    ],
    'features' => [
        'auth' => true,
        'payment' => true,
        'blog' => false,
        'analytics' => true,
    ],
];
EOF

    log_success "Configuration personnalisée appliquée!"
}

# Installation des dépendances
install_dependencies() {
    log_info "Installation des dépendances PHP..."
    composer install --no-dev --optimize-autoloader
    
    log_info "Installation des dépendances Node.js..."
    npm install
    
    log_success "Dépendances installées!"
}

# Configuration de Laravel
setup_laravel() {
    log_info "Configuration de Laravel..."
    
    # Générer la clé d'application
    php artisan key:generate
    
    # Créer la base de données SQLite
    touch database/database.sqlite
    
    # Lancer les migrations
    php artisan migrate --seed
    
    # Créer le lien de stockage
    php artisan storage:link
    
    log_success "Laravel configuré!"
}

# Compilation des assets
build_assets() {
    log_info "Compilation des assets..."
    
    # Générer les CSS personnalisés avec les couleurs
    cat > resources/css/custom.css << 'EOF'
:root {
    --color-primary: #3B82F6;
    --color-secondary: #1E40AF;
    --color-accent: #F59E0B;
}

.bg-primary { background-color: var(--color-primary) !important; }
.bg-secondary { background-color: var(--color-secondary) !important; }
.bg-accent { background-color: var(--color-accent) !important; }
.text-primary { color: var(--color-primary) !important; }
.text-secondary { color: var(--color-secondary) !important; }
.text-accent { color: var(--color-accent) !important; }
EOF
    
    npm run build
    
    log_success "Assets compilés!"
}

# Fonction principale d'installation
main() {
    echo ""
    log_info "Début de l'installation de Test Script Install"
    echo "Template: modern-saas"
    echo "Couleurs: Primaire(#3B82F6) Secondaire(#1E40AF) Accent(#F59E0B)"
    echo ""
    
    check_requirements
    clone_project
    configure_project
    install_dependencies
    setup_laravel
    build_assets
    
    echo ""
    log_success "🎉 Installation terminée avec succès!"
    echo ""
    echo "Pour démarrer votre site:"
    echo "  cd test-script-install"
    echo "  php artisan serve"
    echo ""
    echo "Votre site sera accessible sur: http://localhost:8000"
    echo ""
    echo "Configuration appliquée:"
    echo "  - Nom: Test Script Install"
    echo "  - Template: modern-saas"
    echo "  - Fonctionnalités: auth, payment, analytics"
    echo ""
}

# Lancer l'installation
main "$@"
