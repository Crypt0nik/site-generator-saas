#!/bin/bash

echo "🚀 Test d'intégration complète du Site Generator SAAS"
echo "=================================================="

# Test 1: Vérification API Health
echo "📋 Test 1: API Health Check"
curl -s http://localhost:3001/health | jq '.'
if [ $? -eq 0 ]; then
    echo "✅ API Health Check réussi"
else
    echo "❌ API Health Check échoué"
fi

echo ""

# Test 2: Vérification endpoints templates
echo "📋 Test 2: Templates API"
curl -s http://localhost:3001/api/templates | jq '.success'
if [ $? -eq 0 ]; then
    echo "✅ Templates API réussi"
else
    echo "❌ Templates API échoué"
fi

echo ""

# Test 3: Test de génération de site
echo "📋 Test 3: Génération de site"
result=$(curl -s -X POST http://localhost:3001/api/generator/generate \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Integration Site",
    "primaryColor": "#3B82F6",
    "secondaryColor": "#1E40AF", 
    "accentColor": "#F59E0B",
    "template": "modern-saas",
    "features": {
      "auth": true,
      "payment": true,
      "blog": false,
      "analytics": true
    }
  }' | jq '.success')

if [ "$result" = "true" ]; then
    echo "✅ Génération de site réussie"
else
    echo "❌ Génération de site échouée"
fi

echo ""

# Test 4: Vérification status du frontend
echo "📋 Test 4: Frontend status"
response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3002)
if [ "$response" = "200" ]; then
    echo "✅ Frontend accessible"
else
    echo "❌ Frontend non accessible (code: $response)"
fi

echo ""
echo "🎉 Tests d'intégration terminés!"
