import express from 'express'
import path from 'path'
import fs from 'fs-extra'

const router = express.Router()

// Interface pour la configuration de site
interface SiteConfig {
  name: string
  primaryColor: string
  secondaryColor: string
  accentColor: string
  template: 'modern-saas' | 'e-commerce' | 'portfolio'
  features: {
    auth: boolean
    payment: boolean
    blog: boolean
    analytics: boolean
  }
}

// Fonction pour générer le script d'installation
function generateInstallScript(config: SiteConfig): string {
  const projectName = config.name.toLowerCase().replace(/[^a-z0-9]/g, '-')
  
  return `#!/bin/bash

# 🚀 Script d'installation automatique pour ${config.name}
# Généré le $(date '+%Y-%m-%d %H:%M:%S')
# Template: ${config.template}

set -e  # Exit on any error

echo "🎉 Installation de votre site: ${config.name}"
echo "================================================="

# Variables
projectName="${projectName}"

# Couleurs pour les messages
RED='\\033[0;31m'
GREEN='\\033[0;32m'
YELLOW='\\033[1;33m'
BLUE='\\033[0;34m'
NC='\\033[0m' # No Color

# Fonction pour afficher les messages
log_info() {
    echo -e "\${BLUE}ℹ️  \$1\${NC}"
}

log_success() {
    echo -e "\${GREEN}✅ \$1\${NC}"
}

log_warning() {
    echo -e "\${YELLOW}⚠️  \$1\${NC}"
}

log_error() {
    echo -e "\${RED}❌ \$1\${NC}"
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
    
    if [ -d "\${projectName}" ]; then
        log_warning "Le dossier \${projectName} existe déjà. Suppression..."
        rm -rf "\${projectName}"
    fi
    
    # Clonage du repository Laravel e-commerce
    git clone https://github.com/Dantr3b/Projet-Dev-B2.git "\${projectName}"
    cd "\${projectName}"
    
    log_success "Projet cloné avec succès!"
}

# Configuration personnalisée
configure_project() {
    log_info "Configuration du projet avec vos paramètres..."
    
    # Créer le fichier .env
    cp .env.example .env
    
    # Configuration sécurisée du nom (gestion des caractères spéciaux)
    # Utilisation d'un fichier temporaire pour éviter les problèmes d'échappement
    cat > temp_config.php << 'EOPHP'
<?php
\\$env = file_get_contents('.env');
\\$appName = '${config.name.replace(/'/g, "\\'")}';
\\$env = preg_replace('/^APP_NAME=.*/m', 'APP_NAME="' . \\$appName . '"', \\$env);
\\$env = preg_replace('/^APP_URL=.*/m', 'APP_URL=http://localhost:8000', \\$env);
file_put_contents('.env', \\$env);
echo "Configuration du nom d'application terminée\\n";
EOPHP
    
    php temp_config.php
    rm temp_config.php
    
    # Configuration de la base de données SQLite (compatible multi-plateforme)
    if [[ "\$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' "s/DB_CONNECTION=.*/DB_CONNECTION=sqlite/" .env
        sed -i '' "s|DB_DATABASE=.*|DB_DATABASE=\$(pwd)/database/database.sqlite|" .env
    else
        # Linux
        sed -i "s/DB_CONNECTION=.*/DB_CONNECTION=sqlite/" .env
        sed -i "s|DB_DATABASE=.*|DB_DATABASE=\$(pwd)/database/database.sqlite|" .env
    fi
    
    # Créer le fichier de configuration des couleurs personnalisées
    cat > config/brand.php << 'EOF'
<?php

return [
    'name' => '${config.name}',
    'template' => '${config.template}',
    'colors' => [
        'primary' => '${config.primaryColor}',
        'secondary' => '${config.secondaryColor}',
        'accent' => '${config.accentColor}',
    ],
    'features' => [
        'auth' => ${config.features.auth ? 'true' : 'false'},
        'payment' => ${config.features.payment ? 'true' : 'false'},
        'blog' => ${config.features.blog ? 'true' : 'false'},
        'analytics' => ${config.features.analytics ? 'true' : 'false'},
    ],
];
EOF
    
    log_success "Configuration personnalisée terminée!"
}

# Installation des dépendances
install_dependencies() {
    log_info "Installation des dépendances PHP..."
    composer install --optimize-autoloader
    
    log_info "Installation de Faker pour les données de test..."
    composer require fakerphp/faker --dev --no-interaction
    
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
    
    # Générer la documentation Swagger (si disponible)
    if php artisan list | grep -q "l5-swagger:generate"; then
        php artisan l5-swagger:generate
    fi
    
    log_success "Laravel configuré!"
}

# Appliquer les personnalisations CSS
apply_customizations() {
    log_info "Application des personnalisations CSS..."
    
    # Créer le fichier CSS personnalisé
    cat > resources/css/custom.css << 'EOF'
/* Couleurs personnalisées générées */
:root {
    --primary-color: ${config.primaryColor};
    --secondary-color: ${config.secondaryColor};
    --accent-color: ${config.accentColor};
}

.bg-primary { background-color: var(--primary-color) !important; }
.text-primary { color: var(--primary-color) !important; }
.border-primary { border-color: var(--primary-color) !important; }

.bg-secondary { background-color: var(--secondary-color) !important; }
.text-secondary { color: var(--secondary-color) !important; }
.border-secondary { border-color: var(--secondary-color) !important; }

.bg-accent { background-color: var(--accent-color) !important; }
.text-accent { color: var(--accent-color) !important; }
.border-accent { border-color: var(--accent-color) !important; }
EOF
    
    log_success "Personnalisations appliquées!"
}

# Démarrer l'application
start_application() {
    log_info "Démarrage de l'application..."
    
    # Trouver un port disponible
    PORT=8000
    while lsof -i :\$PORT >/dev/null 2>&1; do
        PORT=\$((PORT + 1))
    done
    
    log_success "🚀 Votre site est prêt!"
    echo ""
    echo "==================== INFORMATIONS ===================="
    echo "🌐 URL du site: http://localhost:\$PORT"
    echo "📊 API Documentation: http://localhost:\$PORT/api/documentation"
    echo "🎨 Template: ${config.template}"
    echo "🎨 Couleurs:"
    echo "   • Primaire: ${config.primaryColor}"
    echo "   • Secondaire: ${config.secondaryColor}"
    echo "   • Accent: ${config.accentColor}"
    echo "======================================================="
    echo ""
    echo "💡 Pour arrêter le serveur: Ctrl+C"
    echo "💡 Pour redémarrer: php artisan serve --port=\$PORT"
    echo ""
    
    # Démarrer le serveur
    php artisan serve --host=127.0.0.1 --port=\$PORT
}

# Fonction principale d'installation
main() {
    log_info "Début de l'installation de ${config.name}"
    echo "Template: ${config.template}"
    echo "Couleurs: Primaire(${config.primaryColor}) Secondaire(${config.secondaryColor}) Accent(${config.accentColor})"
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
`
}

// Generate site endpoint
router.post('/generate', async (req, res) => {
  try {
    const config: SiteConfig = req.body
    
    // Validate config
    if (!config.name || !config.primaryColor || !config.template) {
      return res.status(400).json({
        error: 'Missing required fields: name, primaryColor, template'
      })
    }

    console.log('📋 Received generation request:', config)

    // Generate installation script
    const scriptName = `install-${config.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now()}.sh`
    const scriptContent = generateInstallScript(config)
    
    // Create generated-packages directory if it doesn't exist
    const outputDir = path.join(__dirname, '../../../generated-packages')
    await fs.ensureDir(outputDir)
    
    // Write the installation script
    const scriptPath = path.join(outputDir, scriptName)
    await fs.writeFile(scriptPath, scriptContent, { mode: 0o755 })

    res.json({
      success: true,
      message: 'Script d\'installation généré avec succès',
      downloadUrl: `/api/generator/download/${scriptName}`,
      filename: scriptName,
      scriptType: 'installation'
    })

  } catch (error) {
    console.error('❌ Generation error:', error)
    res.status(500).json({
      error: 'Failed to generate site',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

// Download generated package
router.get('/download/:filename', (req, res) => {
  try {
    const filename = req.params.filename
    const filePath = path.join(__dirname, '../../../generated-packages', filename)
    
    console.log(`📥 Download request for: ${filename}`)
    console.log(`📁 File path: ${filePath}`)
    
    // Security check - ensure filename is safe
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\\\')) {
      return res.status(400).json({ error: 'Invalid filename' })
    }

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.log(`❌ File not found: ${filePath}`)
      return res.status(404).json({ error: 'File not found' })
    }

    console.log(`✅ File found, sending download...`)
    
    // Set appropriate headers for script download
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
    res.setHeader('Content-Type', 'application/x-sh')
    
    // Send the file
    res.sendFile(filePath)

  } catch (error) {
    console.error('Download error:', error)
    res.status(500).json({ error: 'Download failed' })
  }
})

// Get generation status/history
router.get('/status', (req, res) => {
  res.json({
    status: 'active',
    message: 'Site generator is ready',
    supportedTemplates: ['modern-saas', 'e-commerce', 'portfolio'],
    features: ['auth', 'payment', 'blog', 'analytics']
  })
})

export { router as generatorRoutes }
