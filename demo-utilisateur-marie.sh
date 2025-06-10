#!/bin/bash

echo "🎯 DÉMONSTRATION UTILISATEUR FINAL COMPLÈTE"
echo "=========================================="
echo ""
echo "Cette démonstration simule un utilisateur réel créant son site e-commerce"
echo "de A à Z avec le Site Generator SAAS"
echo ""

# Pause pour laisser le temps de lire
sleep 2

echo "👤 SCENARIO: Marie veut créer sa boutique en ligne 'Boutique Marie'"
echo "================================================================="
echo ""

# Configuration de Marie
MARIE_SITE='{
  "name": "Boutique Marie",
  "primaryColor": "#EC4899",
  "secondaryColor": "#DB2777", 
  "accentColor": "#F59E0B",
  "template": "e-commerce",
  "features": {
    "auth": true,
    "payment": true,
    "blog": false,
    "analytics": true
  }
}'

echo "💭 Marie configure son site:"
echo "• Nom: Boutique Marie"
echo "• Template: E-commerce"
echo "• Couleurs: Rose (#EC4899), Rose foncé (#DB2777), Orange (#F59E0B)"
echo "• Fonctionnalités: Auth ✓, Payment ✓, Blog ✗, Analytics ✓"
echo ""

echo "🔄 Étape 1: Marie clique sur 'Générer & Télécharger'"
echo "=================================================="

# Simuler l'appel du frontend
response=$(curl -s -X POST http://localhost:3001/api/generator/generate \
  -H "Content-Type: application/json" \
  -d "$MARIE_SITE")

success=$(echo $response | jq -r '.success')
if [ "$success" = "true" ]; then
    filename=$(echo $response | jq -r '.filename')
    echo "✅ Script généré: $filename"
    echo "✅ Téléchargement automatique déclenché"
else
    echo "❌ Erreur lors de la génération"
    exit 1
fi

echo ""
echo "📥 Étape 2: Le script se télécharge automatiquement"
echo "================================================"

# Simuler le téléchargement dans le dossier Downloads de Marie
marie_downloads="$HOME/Downloads/demo-marie"
mkdir -p "$marie_downloads"

curl -s -o "$marie_downloads/$filename" "http://localhost:3001/api/generator/download/$filename"

if [ -f "$marie_downloads/$filename" ]; then
    echo "✅ Script téléchargé dans: $marie_downloads/$filename"
    chmod +x "$marie_downloads/$filename"
else
    echo "❌ Erreur lors du téléchargement"
    exit 1
fi

echo ""
echo "📋 Étape 3: Marie voit les instructions"
echo "======================================"
echo ""
echo "💬 Message affiché à Marie:"
echo "----------------------------"
echo "✅ Script d'installation téléchargé: $filename"
echo ""
echo "🚀 INSTRUCTIONS D'INSTALLATION:"
echo ""
echo "1. Ouvrez un terminal dans votre dossier de téléchargements"
echo "2. Rendez le script exécutable:"
echo "   chmod +x $filename"
echo "3. Lancez l'installation:"
echo "   ./$filename"
echo ""
echo "⚠️ PRÉREQUIS NÉCESSAIRES:"
echo "• Git"
echo "• PHP 8.1+"
echo "• Composer"
echo "• Node.js 18+"
echo "• npm"
echo ""

echo "🔧 Étape 4: Marie vérifie ses prérequis"
echo "======================================"

# Vérifier les prérequis comme le ferait Marie
check_prereq() {
    local cmd=$1
    local name=$2
    if command -v $cmd &> /dev/null; then
        version=$($cmd --version 2>/dev/null | head -1)
        echo "✅ $name: Installé ($version)"
        return 0
    else
        echo "❌ $name: Non installé"
        return 1
    fi
}

all_ok=true
check_prereq "git" "Git" || all_ok=false
check_prereq "php" "PHP" || all_ok=false  
check_prereq "composer" "Composer" || all_ok=false
check_prereq "node" "Node.js" || all_ok=false
check_prereq "npm" "npm" || all_ok=false

echo ""
if [ "$all_ok" = true ]; then
    echo "✅ Tous les prérequis sont satisfaits !"
    echo ""
    echo "🚀 Étape 5: Marie lance l'installation"
    echo "===================================="
    echo ""
    echo "💻 Marie ouvre son terminal et tape:"
    echo "cd $marie_downloads"
    echo "./$filename"
    echo ""
    echo "🔄 Simulation de l'installation..."
    echo ""
    
    # Simuler les étapes d'installation (sans vraiment cloner/installer)
    echo "🔍 Vérification des prérequis... ✅"
    sleep 1
    echo "📦 Clonage du projet de base... ✅"
    sleep 1
    echo "⚙️  Configuration personnalisée... ✅"
    sleep 1
    echo "📋 Application des couleurs de Marie... ✅"
    sleep 1
    echo "🎨 Configuration template e-commerce... ✅"
    sleep 1
    echo "📦 Installation des dépendances... ✅"
    sleep 1
    echo "🗄️  Configuration Laravel... ✅"
    sleep 1
    echo "🎨 Compilation des assets... ✅"
    sleep 1
    
    echo ""
    echo "🎉 INSTALLATION TERMINÉE AVEC SUCCÈS!"
    echo "====================================="
    echo ""
    echo "💬 Message final affiché à Marie:"
    echo "Pour démarrer votre site:"
    echo "  cd boutique-marie"
    echo "  php artisan serve"
    echo ""
    echo "🌐 Votre site sera accessible sur: http://localhost:8000"
    echo ""
    echo "📋 Configuration appliquée:"
    echo "  - Nom: Boutique Marie"
    echo "  - Template: e-commerce"
    echo "  - Couleurs: Rose, Rose foncé, Orange"
    echo "  - Fonctionnalités: auth, payment, analytics"
    
else
    echo "⚠️  Marie doit installer les prérequis manquants avant de continuer"
fi

echo ""
echo "📊 Étape 6: Vérification du résultat"
echo "=================================="

# Afficher le contenu personnalisé du script
echo ""
echo "🔍 Vérification de la personnalisation dans le script:"
if grep -q "Boutique Marie" "$marie_downloads/$filename"; then
    echo "✅ Nom 'Boutique Marie' configuré"
fi
if grep -q "#EC4899" "$marie_downloads/$filename"; then
    echo "✅ Couleur rose personnalisée appliquée"
fi
if grep -q "e-commerce" "$marie_downloads/$filename"; then
    echo "✅ Template e-commerce sélectionné"
fi

# Statistiques finales
file_size=$(wc -c < "$marie_downloads/$filename")
echo ""
echo "📈 Statistiques du script de Marie:"
echo "• Taille: $file_size octets"
echo "• Nom: $filename"
echo "• Localisation: $marie_downloads/"

echo ""
echo "🎊 DÉMONSTRATION UTILISATEUR RÉUSSIE !"
echo "======================================"
echo ""
echo "✅ Marie a pu:"
echo "   1. Configurer son site via l'interface web intuitive"
echo "   2. Générer automatiquement son script d'installation"
echo "   3. Télécharger le script personnalisé"
echo "   4. Recevoir des instructions claires"
echo "   5. (Simuler) installer son site complet en une commande"
echo ""
echo "🎯 Le Site Generator SAAS répond parfaitement aux besoins utilisateur !"
echo ""
echo "📁 Fichiers de démonstration disponibles dans:"
echo "   $marie_downloads/"
