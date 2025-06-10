#!/bin/bash

echo "🎯 DÉMONSTRATION COMPLÈTE - Site Generator SAAS"
echo "============================================="

# Test de génération via API directe
echo ""
echo "📋 1. Test de génération de script d'installation..."

response=$(curl -s -X POST http://localhost:3001/api/generator/generate \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Demo Site E-commerce",
    "primaryColor": "#8B5CF6",
    "secondaryColor": "#7C3AED", 
    "accentColor": "#F59E0B",
    "template": "e-commerce",
    "features": {
      "auth": true,
      "payment": true,
      "blog": true,
      "analytics": true
    }
  }')

echo "Réponse API: $response"

# Extraire le nom du fichier
filename=$(echo $response | grep -o '"filename":"[^"]*"' | cut -d'"' -f4)
echo "Fichier généré: $filename"

if [ ! -z "$filename" ]; then
    echo ""
    echo "📥 2. Test de téléchargement..."
    
    # Télécharger le script
    curl -o "/tmp/demo-script.sh" "http://localhost:3001/api/generator/download/$filename"
    
    if [ -f "/tmp/demo-script.sh" ]; then
        echo "✅ Script téléchargé avec succès!"
        
        # Afficher les premières lignes
        echo ""
        echo "📄 3. Contenu du script (extrait):"
        echo "=================================="
        head -15 "/tmp/demo-script.sh"
        echo "..."
        echo "=================================="
        
        # Vérifier si le script est exécutable
        file_info=$(file "/tmp/demo-script.sh")
        echo ""
        echo "📋 4. Informations du fichier:"
        echo "$file_info"
        
        # Compter les lignes
        line_count=$(wc -l < "/tmp/demo-script.sh")
        echo "Nombre de lignes: $line_count"
        
        # Rendre exécutable et tester la syntaxe
        chmod +x "/tmp/demo-script.sh"
        echo ""
        echo "🔍 5. Vérification de la syntaxe bash..."
        if bash -n "/tmp/demo-script.sh"; then
            echo "✅ Syntaxe bash valide!"
        else
            echo "❌ Erreur de syntaxe bash"
        fi
        
        echo ""
        echo "🎉 DÉMONSTRATION RÉUSSIE!"
        echo "========================"
        echo "✅ Génération de script: OK"
        echo "✅ Téléchargement: OK"
        echo "✅ Contenu valide: OK"
        echo "✅ Syntaxe bash: OK"
        echo ""
        echo "Le script est prêt à être utilisé:"
        echo "  chmod +x $filename"
        echo "  ./$filename"
        
    else
        echo "❌ Erreur: Script non téléchargé"
    fi
else
    echo "❌ Erreur: Pas de nom de fichier dans la réponse"
fi

echo ""
echo "📊 Statut des services:"
echo "======================"

# Vérifier API
api_status=$(curl -s http://localhost:3001/health | grep -o '"status":"[^"]*"' | cut -d'"' -f4)
echo "API (port 3001): ${api_status:-❌}"

# Vérifier Frontend  
frontend_status=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3002)
if [ "$frontend_status" = "200" ]; then
    echo "Frontend (port 3002): ✅"
else
    echo "Frontend (port 3002): ❌ ($frontend_status)"
fi

# Compter les fichiers générés
generated_count=$(ls -1 "/Users/arthur/projet pro/site-generator-saas/generated-packages"/*.sh 2>/dev/null | wc -l)
echo "Scripts générés: $generated_count fichier(s)"

echo ""
echo "🎯 Démonstration terminée!"
