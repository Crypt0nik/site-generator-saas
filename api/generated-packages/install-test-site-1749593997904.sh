#!/bin/bash

# Script d'installation automatique pour Test Site
# Template: modern-saas

set -e

echo "Installation de votre site: Test Site"
echo "================================================="

# Variables
projectName="test-site"

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

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

# Vérifier les prérequis
check_requirements() {
    log_info "Vérification des prérequis..."
    
    # Vérifier PHP
    if ! command -v php &> /dev/null; then
        log_error "PHP n'est pas installé"
        exit 1
    fi
    
    # Vérifier Composer
    if ! command -v composer &> /dev/null; then
        log_error "Composer n'est pas installé"
        exit 1
    fi
    
    # Vérifier Node.js
    if ! command -v node &> /dev/null; then
        log_error "Node.js n'est pas installé"
        exit 1
    fi
    
    log_success "Tous les prérequis sont installés"
}

# Cloner le projet de base
clone_project() {
    log_info "Clonage du projet Laravel..."
    
    composer create-project laravel/laravel $projectName
    cd $projectName
    
    log_success "Projet Laravel créé avec succès"
}

# Configurer le projet
configure_project() {
    log_info "Configuration du projet..."
    
    # Configurer l'environnement
    cp .env.example .env
    php artisan key:generate
    
    log_success "Configuration de base terminée"
}

# Installer les dépendances
install_dependencies() {
    log_info "Installation des dépendances..."
    
    # Installer les dépendances PHP
    composer install
    
    # Installer les dépendances Node.js
    npm install
    
    log_success "Dépendances installées"
}

# Configuration Laravel spécifique
setup_laravel() {
    log_info "Configuration Laravel..."
    
    # Créer la base de données
    touch database/database.sqlite
    
    # Configurer la base de données dans .env
    sed -i 's/DB_CONNECTION=mysql/DB_CONNECTION=sqlite/g' .env
    sed -i 's/DB_DATABASE=laravel/DB_DATABASE=database\/database.sqlite/g' .env
    
    # Exécuter les migrations
    php artisan migrate:fresh --seed
    
    log_success "Laravel configuré"
}
# Fonction principale d'installation
main() {
    log_info "Début de l'installation de Test Site"
    echo "Template: modern-saas"
    echo "Couleurs: Primaire(#3b82f6) Secondaire(#1f2937) Accent(#f59e0b)"
    echo ""
    
    check_requirements
    clone_project
    configure_project
    install_dependencies
    setup_laravel
    apply_customizations
    start_application
}

# Lancer l'installation
main