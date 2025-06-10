# 🎯 GUIDE DE DÉMARRAGE RAPIDE

## 🚀 Installation Express (5 minutes)

### Prérequis
- Node.js 18+ et npm 8+
- PHP 8.3+ et Composer
- Git

### 1️⃣ Cloner le Repository
```bash
git clone https://github.com/votre-username/site-generator-saas.git
cd site-generator-saas
```

### 2️⃣ Installation des Dépendances
```bash
# Installation dépendances globales
npm install

# Installation API (Backend)
cd api && npm install && cd ..

# Installation Web (Frontend)
cd web && npm install && cd ..
```

### 3️⃣ Lancement en Mode Développement
```bash
# Option 1: Tout en parallèle (recommandé)
npm run dev:all

# Option 2: Services séparés
npm run dev:api  # Port 3001
npm run dev:web  # Port 3000
```

### 4️⃣ Tester le Générateur
```bash
# Test automatique des 3 templates
npm test

# Démo complète avec sites générés
npm run test:demo
```

### 5️⃣ Accès aux Services
- **Interface Web** : http://localhost:3000
- **API Backend** : http://localhost:3001
- **Sites Générés** : Dossier `generated-packages/`

---

## 🎨 Utilisation Rapide

### Générer un Site E-commerce
1. Ouvrir http://localhost:3000
2. Sélectionner template "E-commerce"
3. Personnaliser les couleurs
4. Cliquer "Générer le Site"
5. Suivre les instructions d'installation

### Accéder au Panel Admin
Chaque site généré inclut automatiquement :
- **Dashboard** : `/admin` (stats, graphiques)
- **Gestion Produits** : `/admin/products`
- **Gestion Commandes** : `/admin/orders`
- **Gestion Clients** : `/admin/clients`

---

## 📁 Structure du Project

```
site-generator-saas/
├── 📁 api/                    # Backend Node.js + Express
│   ├── 📁 src/
│   │   ├── 📄 index.ts        # Point d'entrée API
│   │   ├── 📁 routes/         # Routes API
│   │   └── 📁 services/       # Services métier
│   └── 📁 templates/          # Templates de sites
├── 📁 web/                    # Frontend Next.js
│   ├── 📁 src/
│   │   ├── 📁 app/           # Pages Next.js
│   │   └── 📁 components/    # Composants React
├── 📁 generated-packages/     # Sites générés
├── 📄 package.json           # Scripts npm globaux
├── 📄 README.md             # Documentation principale
└── 📄 GUIDE-DEMARRAGE.md    # Ce guide
```

---

## 🔧 Scripts Disponibles

```bash
# Développement
npm run dev:all          # Lancer API + Web en parallèle
npm run dev:api          # API seule (port 3001)
npm run dev:web          # Web seul (port 3000)

# Construction
npm run build:all        # Build API + Web
npm run build:api        # Build API
npm run build:web        # Build Web

# Tests
npm test                 # Tests automatisés
npm run test:demo        # Démo complète
npm run test:integration # Tests d'intégration

# Qualité code
npm run lint             # Linting API + Web
```

---

## 🎯 Templates Disponibles

### 🏢 Modern SAAS
- Design moderne et professionnel
- Thème sombre élégant
- Sections : Hero, Features, Pricing, Contact
- **Idéal pour** : Applications SAAS, startups tech

### 🛍️ E-commerce
- Interface boutique complète
- Catalogue produits avec catégories
- Système de newsletter intégré
- **Idéal pour** : Boutiques en ligne, marketplaces

### 🎨 Portfolio
- Design créatif et moderne
- Galerie projets interactive
- Sections services et contact
- **Idéal pour** : Freelances, agences créatives

---

## 📋 Checklist de Validation

### ✅ Installation Réussie
- [ ] `npm install` sans erreurs
- [ ] API démarre sur http://localhost:3001
- [ ] Web démarre sur http://localhost:3000
- [ ] Tests `npm test` passent

### ✅ Génération de Site
- [ ] Interface de sélection template fonctionne
- [ ] Personnalisation couleurs opérationnelle
- [ ] Génération de package réussie
- [ ] Script d'installation créé automatiquement

### ✅ Panel d'Administration
- [ ] Dashboard accessible via `/admin`
- [ ] CRUD produits fonctionnel
- [ ] Gestion commandes opérationnelle
- [ ] Interface clients avec pagination

---

## 🆘 Dépannage Rapide

### Erreur Port 3000/3001 Occupé
```bash
# Trouver le processus
lsof -ti:3000
lsof -ti:3001

# Arrêter le processus
kill -9 [PID]
```

### Erreur Permissions Scripts
```bash
# Rendre les scripts exécutables
chmod +x test-templates-admin.sh
chmod +x demo-finale-complete.sh
```

### Erreur PHP/Composer
```bash
# Vérifier installation
php --version
composer --version

# Installer si nécessaire (macOS)
brew install php composer
```

### Erreur SQLite
```bash
# Vérifier extension PHP SQLite
php -m | grep sqlite
```

---

## 🎉 Prêt à Démarrer !

Votre générateur SAAS est maintenant opérationnel ! 

**Prochaines étapes :**
1. Testez les 3 templates via l'interface web
2. Générez votre premier site e-commerce
3. Explorez le panel d'administration
4. Personnalisez selon vos besoins

**Besoin d'aide ?**
- 📖 Consultez le [README.md](README.md) complet
- 🐛 Signalez les bugs via [GitHub Issues](https://github.com/votre-username/site-generator-saas/issues)
- 💬 Participez aux [Discussions](https://github.com/votre-username/site-generator-saas/discussions)

---

*Généré par Site Generator SAAS v1.0.0 - Créez des sites e-commerce professionnels en quelques clics !*
