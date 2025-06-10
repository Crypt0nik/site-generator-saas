# 🎉 Site Generator SAAS - Guide d'utilisation

## 📋 Aperçu

Le Site Generator SAAS est un outil qui vous permet de créer et personnaliser votre site e-commerce en quelques clics. Il génère un script d'installation automatique qui configure tout le nécessaire pour votre site.

## 🚀 Comment utiliser

### 1. Configuration de votre site

1. **Ouvrez l'interface** : [http://localhost:3002](http://localhost:3002)
2. **Nommez votre site** : Entrez le nom de votre site
3. **Choisissez un template** :
   - **Modern SAAS** : Pour applications SaaS modernes
   - **E-commerce** : Pour boutiques en ligne
   - **Portfolio** : Pour sites vitrine et portfolios

4. **Personnalisez les couleurs** :
   - Couleur primaire : Couleur principale de votre thème
   - Couleur secondaire : Couleur d'accent
   - Couleur d'accent : Couleur de contraste

5. **Sélectionnez les fonctionnalités** :
   - ✅ **Authentification** : Système de connexion/inscription
   - ✅ **Paiement** : Intégration Stripe pour les paiements
   - ✅ **Blog** : Système de blog intégré
   - ✅ **Analytics** : Suivi des statistiques

### 2. Génération du site

1. **Cliquez sur "Générer & Télécharger"**
2. **Le script d'installation se télécharge automatiquement** (fichier .sh)
3. **Une notification confirme** la génération réussie

### 3. Installation de votre site

#### Prérequis

Assurez-vous d'avoir installé :
- **Git** : `git --version`
- **PHP 8.1+** : `php --version`
- **Composer** : `composer --version`
- **Node.js 18+** : `node --version`
- **npm** : `npm --version`

#### Installation

1. **Ouvrez un terminal** dans votre dossier de téléchargements
2. **Rendez le script exécutable** :
   ```bash
   chmod +x install-votre-site-*.sh
   ```
3. **Lancez l'installation** :
   ```bash
   ./install-votre-site-*.sh
   ```

#### Le script va automatiquement :

- ✅ Vérifier les prérequis
- ✅ Cloner le projet Laravel de base
- ✅ Appliquer votre configuration personnalisée
- ✅ Installer toutes les dépendances PHP et Node.js
- ✅ Configurer la base de données
- ✅ Compiler les assets avec vos couleurs
- ✅ Configurer l'environnement de développement

### 4. Démarrage de votre site

Une fois l'installation terminée :

```bash
cd votre-site-nom
php artisan serve
```

Votre site sera accessible sur : **http://localhost:8000**

## 📁 Structure du projet généré

```
votre-site/
├── .env                    # Configuration environnement
├── config/brand.php        # Votre configuration personnalisée
├── app/                    # Code Laravel
├── resources/css/custom.css # Vos couleurs personnalisées
├── database/               # Base de données SQLite
└── ...                     # Autres fichiers Laravel
```

## 🎨 Personnalisation

### Couleurs personnalisées

Vos couleurs sont automatiquement appliquées via des variables CSS :

```css
:root {
    --color-primary: #votre-couleur-primaire;
    --color-secondary: #votre-couleur-secondaire;
    --color-accent: #votre-couleur-accent;
}
```

### Configuration de marque

Votre configuration est stockée dans `config/brand.php` :

```php
<?php
return [
    'name' => 'Votre Site',
    'template' => 'e-commerce',
    'colors' => [
        'primary' => '#10B981',
        'secondary' => '#059669',
        'accent' => '#F59E0B',
    ],
    'features' => [
        'auth' => true,
        'payment' => true,
        'blog' => true,
        'analytics' => true,
    ],
];
```

## 🔧 Fonctionnalités incluses

### 🔐 Authentification (si activée)
- Système de connexion/inscription
- Gestion des profils utilisateur
- Protection des routes

### 💳 Paiement (si activé)
- Intégration Stripe
- Panier d'achats
- Gestion des commandes
- Historique des transactions

### 📝 Blog (si activé)
- Système de publication d'articles
- Gestion des catégories
- Commentaires
- Interface d'administration

### 📊 Analytics (si activé)
- Suivi des visiteurs
- Statistiques de vente
- Rapports de performance
- Dashboard d'analyse

## 🆘 Résolution de problèmes

### Erreur "Command not found"
- Vérifiez que tous les prérequis sont installés
- Redémarrez votre terminal après l'installation

### Erreur de permissions
```bash
chmod +x install-*.sh
```

### Erreur de dépendances
```bash
composer install
npm install
```

### Base de données non créée
```bash
php artisan migrate --seed
```

## 🎯 Prochaines étapes

Après l'installation, vous pouvez :

1. **Personnaliser davantage** votre site via les fichiers de configuration
2. **Ajouter du contenu** via l'interface d'administration
3. **Configurer votre domaine** pour la production
4. **Intégrer des services externes** (email, analytics, etc.)

## 📞 Support

Si vous rencontrez des problèmes :
1. Vérifiez les logs dans `storage/logs/`
2. Consultez la documentation Laravel
3. Contactez le support technique

---

**Bon développement ! 🚀**
