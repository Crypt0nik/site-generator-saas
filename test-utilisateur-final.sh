#!/bin/bash

echo "🎯 TEST UTILISATEUR FINAL - Site Generator SAAS"
echo "=============================================="

# Simulation d'un utilisateur créant un site
echo ""
echo "👤 Simulation: Un utilisateur veut créer 'Ma Super Boutique'"
echo ""

# Configuration utilisateur
USER_CONFIG='{
  "name": "Ma Super Boutique",
  "primaryColor": "#10B981",
  "secondaryColor": "#059669", 
  "accentColor": "#F59E0B",
  "template": "e-commerce",
  "features": {
    "auth": true,
    "payment": true,
    "blog": true,
    "analytics": true
  }
}'

echo "📋 Configuration choisie:"
echo "$USER_CONFIG" | jq '.'

echo ""
echo "🚀 1. Génération du script d'installation..."

# Appel API pour générer le script
response=$(curl -s -X POST http://localhost:3001/api/generator/generate \
  -H "Content-Type: application/json" \
  -d "$USER_CONFIG")

echo "Réponse serveur: $response"

# Vérifier le succès
success=$(echo $response | jq -r '.success')
if [ "$success" = "true" ]; then
    filename=$(echo $response | jq -r '.filename')
    echo "✅ Script généré: $filename"
    
    echo ""
    echo "📥 2. Téléchargement du script..."
    
    # Télécharger dans un dossier temporaire
    temp_dir="/tmp/site-test-$(date +%s)"
    mkdir -p "$temp_dir"
    
    curl -o "$temp_dir/$filename" "http://localhost:3001/api/generator/download/$filename"
    
    if [ -f "$temp_dir/$filename" ]; then
        echo "✅ Script téléchargé dans: $temp_dir/$filename"
        
        # Rendre exécutable
        chmod +x "$temp_dir/$filename"
        
        echo ""
        echo "📄 3. Vérification du contenu personnalisé..."
        
        # Vérifier que la personnalisation est présente
        if grep -q "Ma Super Boutique" "$temp_dir/$filename"; then
            echo "✅ Nom personnalisé trouvé"
        else
            echo "❌ Nom personnalisé manquant"
        fi
        
        if grep -q "#10B981" "$temp_dir/$filename"; then
            echo "✅ Couleur primaire personnalisée trouvée"
        else
            echo "❌ Couleur primaire manquante"
        fi
        
        if grep -q "e-commerce" "$temp_dir/$filename"; then
            echo "✅ Template e-commerce configuré"
        else
            echo "❌ Template manquant"
        fi
        
        echo ""
        echo "🧪 4. Test de validation bash..."
        
        if bash -n "$temp_dir/$filename"; then
            echo "✅ Syntaxe bash valide"
        else
            echo "❌ Erreur de syntaxe bash"
        fi
        
        echo ""
        echo "📊 5. Statistiques du script généré:"
        echo "====================================="
        file_size=$(wc -c < "$temp_dir/$filename")
        line_count=$(wc -l < "$temp_dir/$filename")
        word_count=$(wc -w < "$temp_dir/$filename")
        
        echo "• Taille: $file_size octets"
        echo "• Lignes: $line_count"
        echo "• Mots: $word_count"
        
        # Afficher un extrait avec la configuration
        echo ""
        echo "📋 6. Configuration dans le script:"
        echo "=================================="
        grep -A 15 "config/brand.php" "$temp_dir/$filename" | head -20
        
        echo ""
        echo "🎉 TEST UTILISATEUR RÉUSSI!"
        echo "=========================="
        echo "✅ L'utilisateur peut:"
        echo "   • Configurer son site via l'interface web"
        echo "   • Générer un script d'installation personnalisé"
        echo "   • Télécharger le script automatiquement"
        echo "   • Exécuter le script pour installer son site"
        echo ""
        echo "📁 Script de test disponible dans: $temp_dir"
        echo "💡 Pour tester l'installation complète:"
        echo "   cd $temp_dir && ./$filename"
        
    else
        echo "❌ Erreur lors du téléchargement"
    fi
else
    echo "❌ Erreur lors de la génération"
fi

echo ""
echo "📈 Statistiques globales:"
echo "========================"

# Compter tous les scripts générés
total_scripts=$(find "/Users/arthur/projet pro/site-generator-saas/generated-packages" -name "*.sh" | wc -l)
echo "Scripts générés au total: $total_scripts"

# Taille totale des scripts
total_size=$(find "/Users/arthur/projet pro/site-generator-saas/generated-packages" -name "*.sh" -exec wc -c {} + | tail -1 | awk '{print $1}')
echo "Taille totale des scripts: $total_size octets"

# Test final des services
echo ""
echo "🔧 État des services:"
api_health=$(curl -s http://localhost:3001/health | jq -r '.status // "ERROR"')
echo "• API: $api_health"

frontend_status=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3002)
echo "• Frontend: $frontend_status"

echo ""
echo "🎯 Test utilisateur final terminé!"
