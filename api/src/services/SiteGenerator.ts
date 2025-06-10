import path from 'path'
import fs from 'fs-extra'
import archiver from 'archiver'
import Handlebars from 'handlebars'

export interface SiteConfig {
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

export class SiteGenerator {
  private baseProjectPath: string
  private templatesPath: string
  private outputPath: string

  constructor() {
    this.baseProjectPath = path.join(__dirname, '../../base-laravel')
    this.templatesPath = path.join(__dirname, '../../templates')
    this.outputPath = path.join(__dirname, '../../generated-packages')
  }

  async generateSite(config: SiteConfig): Promise<string> {
    console.log('🚀 Starting site generation with config:', config)

    // Create unique project name
    const projectName = this.sanitizeName(config.name)
    const timestamp = Date.now()
    const projectId = `${projectName}-${timestamp}`
    const projectPath = path.join(this.outputPath, projectId)

    try {
      // Step 1: Copy base Laravel project
      console.log('📁 Copying base Laravel project...')
      await this.copyBaseProject(projectPath)

      // Step 2: Apply customizations
      console.log('🎨 Applying customizations...')
      await this.applyCustomizations(projectPath, config)

      // Step 3: Generate frontend based on template
      console.log('🎨 Generating frontend...')
      await this.generateFrontend(projectPath, config)

      // Step 4: Create installation scripts
      console.log('📝 Creating installation scripts...')
      await this.createInstallationScripts(projectPath, config)

      // Step 5: Create documentation
      console.log('📚 Generating documentation...')
      await this.generateDocumentation(projectPath, config)

      // Step 6: Create ZIP package
      console.log('📦 Creating ZIP package...')
      const zipPath = await this.createZipPackage(projectPath, projectId)

      console.log('✅ Site generated successfully!')
      return zipPath

    } catch (error) {
      console.error('❌ Error generating site:', error)
      throw error
    }
  }

  private sanitizeName(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
  }

  private async copyBaseProject(destinationPath: string): Promise<void> {
    // Check if base project exists
    if (!await fs.pathExists(this.baseProjectPath)) {
      // Copy from the original Laravel project
      const originalProject = path.join(__dirname, '../../../Projet-Dev-B2')
      if (await fs.pathExists(originalProject)) {
        await fs.copy(originalProject, this.baseProjectPath, {
          filter: (src) => {
            // Exclude certain directories and files
            const exclude = [
              'node_modules',
              'vendor',
              '.git',
              'storage/logs',
              'storage/framework/cache',
              'storage/framework/sessions',
              'storage/framework/views'
            ]
            return !exclude.some(pattern => src.includes(pattern))
          }
        })
      } else {
        throw new Error('Base Laravel project not found')
      }
    }

    // Copy to destination
    await fs.copy(this.baseProjectPath, destinationPath, {
      filter: (src) => {
        const exclude = [
          'node_modules',
          'vendor',
          '.git',
          'storage/logs',
          'storage/framework/cache'
        ]
        return !exclude.some(pattern => src.includes(pattern))
      }
    })
  }

  private async applyCustomizations(projectPath: string, config: SiteConfig): Promise<void> {
    // Update .env file
    const envPath = path.join(projectPath, '.env.example')
    if (await fs.pathExists(envPath)) {
      let envContent = await fs.readFile(envPath, 'utf-8')
      
      // Update app name
      envContent = envContent.replace(
        /APP_NAME=.*/,
        `APP_NAME="${config.name}"`
      )

      await fs.writeFile(path.join(projectPath, '.env.configured'), envContent)
    }

    // Create brand configuration file
    const brandConfig = {
      site_name: config.name,
      colors: {
        primary: config.primaryColor,
        secondary: config.secondaryColor,
        accent: config.accentColor,
      },
      template: config.template,
      features: config.features
    }

    const configPath = path.join(projectPath, 'config', 'brand.php')
    const phpConfig = `<?php

return ${this.phpArrayString(brandConfig)};
`
    await fs.writeFile(configPath, phpConfig)
  }

  private async generateFrontend(projectPath: string, config: SiteConfig): Promise<void> {
    const frontendPath = path.join(projectPath, 'frontend')
    const templatePath = path.join(this.templatesPath, config.template)

    // Create frontend directory structure
    await fs.ensureDir(frontendPath)
    await fs.ensureDir(path.join(frontendPath, 'src'))
    await fs.ensureDir(path.join(frontendPath, 'public'))

    // Copy template files
    if (await fs.pathExists(templatePath)) {
      await fs.copy(templatePath, frontendPath)
    } else {
      // Create basic template
      await this.createBasicTemplate(frontendPath, config)
    }

    // Apply theme customizations
    await this.applyThemeCustomizations(frontendPath, config)
  }

  private async createBasicTemplate(frontendPath: string, config: SiteConfig): Promise<void> {
    // Create package.json
    const packageJson = {
      name: this.sanitizeName(config.name),
      version: "1.0.0",
      scripts: {
        dev: "vite",
        build: "vite build",
        preview: "vite preview"
      },
      dependencies: {
        vue: "^3.3.0",
        axios: "^1.6.0"
      },
      devDependencies: {
        "@vitejs/plugin-vue": "^4.0.0",
        "vite": "^5.0.0",
        "tailwindcss": "^3.3.0",
        "autoprefixer": "^10.4.0",
        "postcss": "^8.4.0"
      }
    }

    await fs.writeFile(
      path.join(frontendPath, 'package.json'),
      JSON.stringify(packageJson, null, 2)
    )

    // Create basic HTML template
    const htmlTemplate = `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{siteName}}</title>
    <link href="./src/style.css" rel="stylesheet">
</head>
<body>
    <div id="app">
        <header class="header">
            <h1>{{siteName}}</h1>
        </header>
        <main class="main">
            <h2>Bienvenue sur {{siteName}}</h2>
            <p>Votre site e-commerce est prêt !</p>
        </main>
    </div>
    <script type="module" src="./src/main.js"></script>
</body>
</html>`

    const compiledTemplate = Handlebars.compile(htmlTemplate)
    const html = compiledTemplate({ siteName: config.name })

    await fs.writeFile(path.join(frontendPath, 'index.html'), html)
  }

  private async applyThemeCustomizations(frontendPath: string, config: SiteConfig): Promise<void> {
    // Create custom CSS with theme colors
    const customCSS = `
:root {
  --color-primary: ${config.primaryColor};
  --color-secondary: ${config.secondaryColor};
  --color-accent: ${config.accentColor};
  --site-name: "${config.name}";
}

/* Base styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.6;
  color: #333;
}

.header {
  background: var(--color-primary);
  color: white;
  padding: 1rem 2rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.header h1 {
  font-size: 1.5rem;
  font-weight: 600;
}

.main {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.btn-primary {
  background: var(--color-primary);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary:hover {
  background: var(--color-secondary);
  transform: translateY(-1px);
}

.btn-accent {
  background: var(--color-accent);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}
`

    await fs.writeFile(path.join(frontendPath, 'src', 'style.css'), customCSS)

    // Create basic JS file
    const mainJS = `
console.log('${config.name} is ready!');

// Basic initialization
document.addEventListener('DOMContentLoaded', function() {
    console.log('Site loaded successfully');
});
`

    await fs.writeFile(path.join(frontendPath, 'src', 'main.js'), mainJS)
  }

  private async createInstallationScripts(projectPath: string, config: SiteConfig): Promise<void> {
    // Create bash installation script
    const bashScript = `#!/bin/bash

echo "🚀 Installation de ${config.name}..."

# Couleurs pour les messages
RED='\\033[0;31m'
GREEN='\\033[0;32m'
YELLOW='\\033[1;33m'
NC='\\033[0m' # No Color

# Fonction pour afficher des messages colorés
log_info() {
    echo -e "\${GREEN}ℹ️  \$1\${NC}"
}

log_warning() {
    echo -e "\${YELLOW}⚠️  \$1\${NC}"
}

log_error() {
    echo -e "\${RED}❌ \$1\${NC}"
    exit 1
}

# Vérification des prérequis
log_info "Vérification des prérequis..."

command -v php >/dev/null 2>&1 || log_error "PHP est requis mais non installé."
command -v composer >/dev/null 2>&1 || log_error "Composer est requis mais non installé."
command -v npm >/dev/null 2>&1 || log_error "Node.js/npm est requis mais non installé."

log_info "Tous les prérequis sont installés ✅"

# Installation du backend Laravel
log_info "Installation du backend..."
cd backend || log_error "Dossier backend non trouvé"

if [ ! -f "composer.json" ]; then
    log_error "Fichier composer.json non trouvé"
fi

composer install --no-dev --optimize-autoloader
if [ -f ".env.configured" ]; then
    cp .env.configured .env
    log_info "Configuration environnement copiée"
else
    log_warning "Fichier .env.configured non trouvé, copie de .env.example"
    cp .env.example .env
fi

php artisan key:generate
php artisan migrate --force
php artisan l5-swagger:generate

# Installation du frontend
log_info "Installation du frontend..."
cd ../frontend || log_error "Dossier frontend non trouvé"

if [ -f "package.json" ]; then
    npm install
    npm run build
    log_info "Frontend installé et compilé"
else
    log_warning "package.json non trouvé, installation frontend ignorée"
fi

# Retour au dossier principal
cd ..

log_info "🎉 Installation terminée avec succès!"
log_info ""
log_info "📋 Prochaines étapes:"
log_info "1. Démarrer le backend: cd backend && php artisan serve"
log_info "2. Votre site sera accessible sur: http://localhost:8000"
log_info "3. Documentation API: http://localhost:8000/api/documentation"
log_info ""
log_info "💡 Conseils:"
log_info "- Configurez votre base de données dans backend/.env"
log_info "- Ajoutez vos clés Stripe pour les paiements"
log_info "- Personnalisez les templates dans frontend/"
log_info ""
log_info "🚀 Bon développement avec ${config.name}!"
`

    await fs.writeFile(path.join(projectPath, 'install.sh'), bashScript)
    await fs.chmod(path.join(projectPath, 'install.sh'), 0o755)

    // Create Windows batch script
    const batScript = `@echo off
echo 🚀 Installation de ${config.name}...

:: Vérification des prérequis
echo Vérification des prérequis...
php --version >nul 2>&1
if errorlevel 1 (
    echo ❌ PHP est requis mais non installé.
    pause
    exit /b 1
)

composer --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Composer est requis mais non installé.
    pause
    exit /b 1
)

npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js/npm est requis mais non installé.
    pause
    exit /b 1
)

echo ✅ Tous les prérequis sont installés

:: Installation du backend
echo Installation du backend...
cd backend
composer install --no-dev --optimize-autoloader
if exist ".env.configured" (
    copy ".env.configured" ".env"
    echo Configuration environnement copiée
) else (
    copy ".env.example" ".env"
    echo Fichier .env.example copié
)

php artisan key:generate
php artisan migrate --force
php artisan l5-swagger:generate

:: Installation du frontend
echo Installation du frontend...
cd ..\\frontend
if exist "package.json" (
    npm install
    npm run build
    echo Frontend installé et compilé
)

cd ..

echo.
echo 🎉 Installation terminée avec succès!
echo.
echo 📋 Prochaines étapes:
echo 1. Démarrer le backend: cd backend ^&^& php artisan serve
echo 2. Votre site sera accessible sur: http://localhost:8000
echo 3. Documentation API: http://localhost:8000/api/documentation
echo.
echo 🚀 Bon développement avec ${config.name}!
pause
`

    await fs.writeFile(path.join(projectPath, 'install.bat'), batScript)
  }

  private async generateDocumentation(projectPath: string, config: SiteConfig): Promise<void> {
    const readmeContent = `# ${config.name}

Site e-commerce généré automatiquement avec SiteGen SAAS.

## 🎨 Configuration

- **Template**: ${config.template}
- **Couleur primaire**: ${config.primaryColor}
- **Couleur secondaire**: ${config.secondaryColor}
- **Couleur d'accent**: ${config.accentColor}

## 🚀 Fonctionnalités incluses

${Object.entries(config.features)
  .filter(([_, enabled]) => enabled)
  .map(([feature, _]) => `- ✅ ${this.getFeatureName(feature)}`)
  .join('\\n')}

## 📦 Installation

### Installation automatique

#### Sur macOS/Linux:
\`\`\`bash
chmod +x install.sh
./install.sh
\`\`\`

#### Sur Windows:
\`\`\`cmd
install.bat
\`\`\`

### Installation manuelle

1. **Backend (Laravel)**:
   \`\`\`bash
   cd backend
   composer install
   cp .env.configured .env
   php artisan key:generate
   php artisan migrate
   php artisan l5-swagger:generate
   php artisan serve
   \`\`\`

2. **Frontend**:
   \`\`\`bash
   cd frontend
   npm install
   npm run build
   npm run dev  # pour le développement
   \`\`\`

## 🌐 Accès

- **Site web**: http://localhost:8000
- **Documentation API**: http://localhost:8000/api/documentation
- **Panel d'administration**: http://localhost:8000/admin

## ⚙️ Configuration

### Base de données

Modifiez le fichier \`backend/.env\` pour configurer votre base de données:

\`\`\`env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=votre_base
DB_USERNAME=votre_utilisateur
DB_PASSWORD=votre_mot_de_passe
\`\`\`

### Paiements Stripe

Pour activer les paiements, ajoutez vos clés Stripe dans \`backend/.env\`:

\`\`\`env
STRIPE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxx
STRIPE_SECRET=sk_test_xxxxxxxxxxxxxxxxxxxxx
\`\`\`

## 🎨 Personnalisation

### Couleurs

Les couleurs du thème sont définies dans \`backend/config/brand.php\` et appliquées automatiquement au frontend.

### Templates

Les templates frontend se trouvent dans le dossier \`frontend/\`. Vous pouvez les modifier selon vos besoins.

## 📚 API Documentation

L'API RESTful complète est documentée avec Swagger. Accédez à la documentation interactive à l'adresse:
http://localhost:8000/api/documentation

### Endpoints principaux

- **Authentification**: \`/api/auth/*\`
- **Produits**: \`/api/products\`
- **Panier**: \`/api/cart\`
- **Commandes**: \`/api/orders\`
- **Utilisateurs**: \`/api/users\`

## 🧪 Tests

\`\`\`bash
cd backend
php artisan test
\`\`\`

## 🚀 Déploiement

### Déploiement rapide

1. Configurez votre serveur web (Apache/Nginx)
2. Pointez vers le dossier \`backend/public\`
3. Configurez votre base de données de production
4. Exécutez les migrations: \`php artisan migrate --force\`

### Variables d'environnement de production

\`\`\`env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://votre-domaine.com
\`\`\`

## 📞 Support

Ce site a été généré avec **SiteGen SAAS**. Pour toute question:

- 📧 Email: support@sitegen-saas.com
- 🌐 Site web: https://sitegen-saas.com
- 📚 Documentation: https://docs.sitegen-saas.com

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier LICENSE pour plus de détails.

---

**Généré le**: ${new Date().toLocaleDateString('fr-FR')}  
**Template**: ${config.template}  
**Version**: 1.0.0
`

    await fs.writeFile(path.join(projectPath, 'README.md'), readmeContent)
  }

  private async createZipPackage(projectPath: string, projectId: string): Promise<string> {
    const zipPath = path.join(this.outputPath, `${projectId}.zip`)
    
    return new Promise((resolve, reject) => {
      const output = fs.createWriteStream(zipPath)
      const archive = archiver('zip', { zlib: { level: 9 } })

      output.on('close', () => {
        console.log(`📦 Package created: ${archive.pointer()} total bytes`)
        resolve(zipPath)
      })

      archive.on('error', (err) => {
        reject(err)
      })

      archive.pipe(output)
      archive.directory(projectPath, projectId)
      archive.finalize()
    })
  }

  private phpArrayString(obj: any, depth = 0): string {
    const indent = '    '.repeat(depth)
    const nextIndent = '    '.repeat(depth + 1)

    if (Array.isArray(obj)) {
      const items = obj.map(item => `${nextIndent}${this.phpArrayString(item, depth + 1)}`).join(',\\n')
      return `[\\n${items}\\n${indent}]`
    }

    if (typeof obj === 'object' && obj !== null) {
      const items = Object.entries(obj).map(([key, value]) => 
        `${nextIndent}'${key}' => ${this.phpArrayString(value, depth + 1)}`
      ).join(',\\n')
      return `[\\n${items}\\n${indent}]`
    }

    if (typeof obj === 'string') {
      return `'${obj.replace(/'/g, "\\\\'")}'`
    }

    if (typeof obj === 'boolean') {
      return obj ? 'true' : 'false'
    }

    return String(obj)
  }

  private getFeatureName(feature: string): string {
    const names: Record<string, string> = {
      auth: 'Authentification utilisateurs',
      payment: 'Paiements en ligne (Stripe)',
      blog: 'Blog intégré',
      analytics: 'Analytics et statistiques'
    }
    return names[feature] || feature
  }
}
