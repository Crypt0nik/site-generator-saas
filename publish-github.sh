#!/bin/bash

# 🚀 Script de Publication GitHub - Site Generator SAAS
# Ce script automatise la création et publication du repository GitHub

set -e  # Arrêter en cas d'erreur

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Fonction d'affichage avec couleurs
print_step() {
    echo -e "${BLUE}🔄 $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${PURPLE}ℹ️  $1${NC}"
}

# Banner
echo -e "${PURPLE}"
echo "================================================================================================="
echo "🚀                        SITE GENERATOR SAAS - PUBLICATION GITHUB                          🚀"
echo "================================================================================================="
echo -e "${NC}"

# Vérifications préalables
print_step "Vérification des prérequis..."

# Vérifier que nous sommes dans le bon répertoire
if [ ! -f "package.json" ] || [ ! -d ".git" ]; then
    print_error "Ce script doit être exécuté depuis la racine du projet Site Generator SAAS"
    exit 1
fi

# Vérifier que git est configuré
if ! git config user.name > /dev/null || ! git config user.email > /dev/null; then
    print_error "Git n'est pas configuré. Configurez votre nom et email :"
    echo "git config --global user.name 'Votre Nom'"
    echo "git config --global user.email 'votre.email@example.com'"
    exit 1
fi

# Vérifier que GitHub CLI est installé
if ! command -v gh &> /dev/null; then
    print_warning "GitHub CLI (gh) n'est pas installé."
    print_info "Installation recommandée : brew install gh"
    print_info "Ou continuez manuellement après ce script."
fi

print_success "Prérequis validés"

# Demander confirmation
echo ""
print_step "Configuration du repository GitHub..."
echo ""
read -p "$(echo -e ${YELLOW}📝 Nom du repository GitHub: ${NC})" REPO_NAME
read -p "$(echo -e ${YELLOW}👤 Votre username GitHub: ${NC})" GITHUB_USERNAME
read -p "$(echo -e ${YELLOW}📖 Description courte: ${NC})" REPO_DESCRIPTION

# Valeurs par défaut
REPO_NAME=${REPO_NAME:-"site-generator-saas"}
REPO_DESCRIPTION=${REPO_DESCRIPTION:-"Générateur SAAS de sites e-commerce avec panel d'administration intégré"}

# Mettre à jour le package.json avec les vraies URLs
print_step "Mise à jour des URLs dans package.json..."
sed -i.bak "s/votre-username/$GITHUB_USERNAME/g" package.json
rm package.json.bak
print_success "URLs mises à jour"

# Mettre à jour le README avec les vraies URLs
print_step "Mise à jour des URLs dans README.md..."
sed -i.bak "s/votre-username/$GITHUB_USERNAME/g" README.md
rm README.md.bak
print_success "README mis à jour"

# Mettre à jour BADGES.md
print_step "Mise à jour des badges..."
sed -i.bak "s/votre-username/$GITHUB_USERNAME/g" BADGES.md
rm BADGES.md.bak
print_success "Badges mis à jour"

# Commit des modifications
print_step "Commit des modifications de configuration..."
git add package.json README.md BADGES.md
git commit -m "🔧 Update repository URLs for GitHub publication

- Updated package.json with correct GitHub URLs
- Updated README.md badges and links  
- Updated BADGES.md with proper repository paths
- Ready for GitHub repository creation" || print_info "Aucune modification à commiter"

# Vérifier l'état Git
print_step "Vérification de l'état Git..."
if ! git status --porcelain | wc -l | grep -q "0"; then
    print_warning "Il y a des fichiers non commités :"
    git status --porcelain
    echo ""
    read -p "$(echo -e ${YELLOW}❓ Continuer quand même ? (y/N): ${NC})" -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_error "Publication annulée"
        exit 1
    fi
fi

print_success "Repository local prêt pour publication"

# Instructions pour la publication GitHub
echo ""
echo -e "${PURPLE}================================================================================================="
echo "📋                                ÉTAPES DE PUBLICATION GITHUB"
echo "=================================================================================================${NC}"
echo ""

print_step "OPTION 1 : Publication automatique avec GitHub CLI"
echo ""
echo -e "${GREEN}# 1. Connectez-vous à GitHub CLI${NC}"
echo "gh auth login"
echo ""
echo -e "${GREEN}# 2. Créez le repository${NC}"
echo "gh repo create $REPO_NAME --public --description \"$REPO_DESCRIPTION\" --clone=false"
echo ""
echo -e "${GREEN}# 3. Ajoutez le remote et poussez${NC}"
echo "git remote add origin https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"
echo "git branch -M main"
echo "git push -u origin main"
echo ""

print_step "OPTION 2 : Publication manuelle"
echo ""
echo -e "${GREEN}# 1. Créez un nouveau repository sur https://github.com/new${NC}"
echo "   - Nom: $REPO_NAME"
echo "   - Description: $REPO_DESCRIPTION"
echo "   - Public: ✅"
echo "   - README: ❌ (on en a déjà un)"
echo "   - .gitignore: ❌ (on en a déjà un)"
echo "   - License: ❌ (on en a déjà une)"
echo ""
echo -e "${GREEN}# 2. Ajoutez le remote et poussez${NC}"
echo "git remote add origin https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"
echo "git branch -M main"
echo "git push -u origin main"
echo ""

print_step "ÉTAPES POST-PUBLICATION RECOMMANDÉES"
echo ""
echo -e "${GREEN}# 1. Configurez les GitHub Pages (optionnel)${NC}"
echo "   - Settings > Pages > Deploy from branch: main"
echo ""
echo -e "${GREEN}# 2. Activez les Discussions${NC}"
echo "   - Settings > Features > Discussions: ✅"
echo ""
echo -e "${GREEN}# 3. Configurez les protections de branche${NC}"
echo "   - Settings > Branches > Add rule"
echo "   - Require pull request reviews"
echo "   - Require status checks"
echo ""
echo -e "${GREEN}# 4. Ajoutez des topics${NC}"
echo "   - About > Settings ⚙️ > Topics:"
echo "   - saas, e-commerce, laravel, nextjs, typescript, generator"
echo ""

# Créer le fichier de release notes
print_step "Création des notes de release..."
cat > RELEASE-NOTES-v1.0.0.md << 'EOF'
# 🚀 Site Generator SAAS v1.0.0 - Release Notes

## 🎉 Première Release Officielle

Nous sommes fiers de présenter la **première version stable** du Site Generator SAAS !

### ✨ Fonctionnalités Principales

#### 🎨 Templates Professionnels
- **Modern SAAS** - Interface business moderne avec design sombre élégant
- **E-commerce** - Boutique en ligne complète avec catalogue et newsletter  
- **Portfolio** - Portfolio créatif pour freelances et agences

#### 🛠️ Panel d'Administration Intégré
- **Dashboard** avec statistiques temps réel
- **Gestion Produits** - CRUD complet pour le catalogue
- **Gestion Commandes** - Suivi et traitement des commandes
- **Gestion Clients** - Base de données avec pagination
- **Paramètres** - Configuration couleurs et fonctionnalités

#### 🚀 Génération Automatique
- Sites Laravel 12 complets générés en 1 clic
- Installation automatique via scripts bash intelligents
- Personnalisation couleurs et branding en temps réel
- Base de données SQLite préconfigurée

### 🛠️ Stack Technique

- **Backend API** : Node.js + Express + TypeScript
- **Frontend** : Next.js 15 + React + TypeScript  
- **Sites Générés** : Laravel 12 + Blade + PHP 8.3+
- **Base de Données** : SQLite avec migrations automatiques
- **Styling** : Tailwind CSS responsive

### 📦 Contenu de la Release

#### Packages Principaux
- **API** (`/api`) - Backend de génération avec templates
- **Web** (`/web`) - Interface utilisateur moderne
- **Templates** - 3 templates professionnels complets

#### Scripts et Outils
- `test-templates-admin.sh` - Tests automatisés complets
- `demo-finale-complete.sh` - Démonstration interactive
- `package.json` - Scripts npm pour développement

#### Documentation
- **README.md** - Documentation complète avec guides visuels
- **GUIDE-DEMARRAGE.md** - Installation express en 5 minutes
- **CONTRIBUTING.md** - Guidelines pour contributeurs
- **SECURITY.md** - Politique de sécurité

### 🎯 Métriques de Performance

- **Génération** : Sites complets en 45-60 secondes
- **Templates** : 3 templates responsives et modernes
- **Fichiers** : 109 fichiers, ~10k lignes de code
- **Tests** : Suite de tests automatisée complète

### 🔧 Installation Express

```bash
git clone https://github.com/VOTRE-USERNAME/site-generator-saas.git
cd site-generator-saas
npm install
npm run dev:all
```

### 🎪 Démo en Ligne

1. Accédez à http://localhost:3000
2. Sélectionnez un template
3. Personnalisez les couleurs  
4. Générez votre site
5. Explorez le panel admin

### 🚀 Prochaines Étapes (Roadmap)

#### v1.1 (Q3 2025)
- **Nouveaux templates** : Blog, Landing Page, Documentation
- **Authentification avancée** : 2FA, OAuth, RBAC
- **Base de données** : Support MySQL, PostgreSQL
- **Intégrations** : Stripe, PayPal, Mailchimp

#### v1.2 (Q4 2025)  
- **Multi-tenancy** : Gestion multi-sites
- **API REST complète** : Endpoints pour tous les modules
- **Thèmes dynamiques** : Builder de thèmes visuel
- **Déploiement cloud** : AWS, Vercel, Netlify

### 🤝 Contribuer

Le projet est maintenant **open source** et accueille les contributions !

- 🐛 **Signaler des bugs** via GitHub Issues
- 💡 **Proposer des fonctionnalités** via Discussions
- 🔀 **Contribuer du code** via Pull Requests
- 📖 **Améliorer la documentation**

### 📞 Support

- **Documentation** : README.md et guides inclus
- **Issues GitHub** : Pour bugs et demandes de fonctionnalités
- **Discussions** : Pour questions et aide communautaire
- **Email** : [contact@site-generator-saas.com]

### 🏆 Remerciements

Merci à tous ceux qui ont contribué à cette première release :
- Tests et retours utilisateurs
- Révisions de code et suggestions
- Documentation et guides

### 📋 Changelog Complet

Voir [CHANGELOG.md](CHANGELOG.md) pour l'historique détaillé des modifications.

---

**🎉 Félicitations ! Site Generator SAAS v1.0.0 est maintenant disponible !**

*Créez des sites e-commerce professionnels en quelques clics !* 🚀
EOF

print_success "Notes de release créées : RELEASE-NOTES-v1.0.0.md"

# Commit final
git add RELEASE-NOTES-v1.0.0.md
git commit -m "📝 Add v1.0.0 release notes

- Comprehensive release documentation
- Feature highlights and technical stack
- Installation and demo instructions  
- Roadmap and contribution guidelines
- Ready for GitHub release publication" || print_info "Notes de release déjà commités"

# Résumé final
echo ""
echo -e "${PURPLE}================================================================================================="
echo "🎉                                 PUBLICATION PRÊTE !"
echo "=================================================================================================${NC}"
echo ""
print_success "Repository local configuré et prêt pour GitHub"
print_success "URLs mises à jour avec le username: $GITHUB_USERNAME"
print_success "Notes de release v1.0.0 créées"
print_success "Documentation GitHub complète ajoutée"
echo ""
print_info "Fichiers clés créés :"
echo "  📄 GUIDE-DEMARRAGE.md - Guide d'installation express"
echo "  🔒 SECURITY.md - Politique de sécurité"  
echo "  📊 BADGES.md - Badges et statistiques"
echo "  📝 RELEASE-NOTES-v1.0.0.md - Notes de release"
echo "  ⚙️  .github/ - Configuration GitHub complète"
echo ""
print_step "Prochaine étape : Exécutez une des commandes ci-dessus pour publier sur GitHub !"
echo ""
print_success "🚀 Site Generator SAAS est prêt pour sa publication GitHub officielle !"
