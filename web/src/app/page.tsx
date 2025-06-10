'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ColorPicker } from '@/components/ColorPicker'
import { SitePreview } from '@/components/SitePreview'
import { TemplateSelector } from '@/components/TemplateSelector'
import { Download, Palette, Globe, Settings } from 'lucide-react'

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

export default function Home() {
  const [config, setConfig] = useState<SiteConfig>({
    name: 'Mon Super Site',
    primaryColor: '#3B82F6',
    secondaryColor: '#1E40AF',
    accentColor: '#F59E0B',
    template: 'modern-saas',
    features: {
      auth: true,
      payment: true,
      blog: false,
      analytics: true
    }
  })

  const [isGenerating, setIsGenerating] = useState(false)
  const [apiStatus, setApiStatus] = useState<string>('')
  const [lastGeneratedFile, setLastGeneratedFile] = useState<string | null>(null)

  // Fonction pour télécharger un fichier
  const downloadFile = async (filename: string) => {
    try {
      const downloadUrl = `http://localhost:3001/api/generator/download/${filename}`
      console.log('📥 Tentative de téléchargement:', downloadUrl)
      
      // Méthode 1: Téléchargement direct avec window.location (plus compatible)
      const tempAnchor = document.createElement('a')
      tempAnchor.href = downloadUrl
      tempAnchor.download = filename
      tempAnchor.target = '_blank'
      tempAnchor.rel = 'noopener noreferrer'
      tempAnchor.style.display = 'none'
      
      document.body.appendChild(tempAnchor)
      tempAnchor.click()
      document.body.removeChild(tempAnchor)
      
      console.log('✅ Téléchargement déclenché (méthode directe):', filename)
      
      // Message d'instructions
      setTimeout(() => {
        const instructions = `✅ Script d'installation téléchargé: ${filename}

🚀 INSTRUCTIONS D'INSTALLATION:

1. Ouvrez un terminal dans votre dossier de téléchargements
2. Rendez le script exécutable:
   chmod +x ${filename}
3. Lancez l'installation:
   ./${filename}

⚠️ PRÉREQUIS NÉCESSAIRES:
• Git
• PHP 8.1+
• Composer
• Node.js 18+
• npm

Le script vérifiera automatiquement tous les prérequis et installera votre site personnalisé !

💡 Si le téléchargement ne fonctionne pas automatiquement, cliquez sur "Retélécharger" ou copiez cette URL dans votre navigateur:
${downloadUrl}`
        
        alert(instructions)
      }, 1000)
      
    } catch (downloadError) {
      console.error('❌ Erreur de téléchargement:', downloadError)
      // Fallback: ouvrir dans un nouvel onglet
      const fallbackUrl = `http://localhost:3001/api/generator/download/${filename}`
      window.open(fallbackUrl, '_blank')
      alert(`Téléchargement automatique échoué. Le fichier s'ouvre dans un nouvel onglet: ${filename}`)
    }
  }

  const handleGenerateSite = async () => {
    setIsGenerating(true)
    try {
      console.log('🚀 Génération du site avec config:', config)
      
      // Appel à l'API de génération
      const response = await fetch('http://localhost:3001/api/generator/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config)
      })

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`)
      }

      const result = await response.json()
      
      if (result.success) {
        console.log('✅ Site généré avec succès!', result)
        
        // Sauvegarder le fichier généré pour téléchargement ultérieur
        setLastGeneratedFile(result.filename)
        
        // Déclencher automatiquement le téléchargement du script
        if (result.scriptType === 'installation') {
          await downloadFile(result.filename)
        } else {
          alert(`Site généré avec succès! Fichier: ${result.filename}`)
        }
      } else {
        throw new Error(result.error || 'Erreur lors de la génération')
      }
    } catch (error) {
      console.error('❌ Erreur lors de la génération:', error)
      alert(`Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`)
    } finally {
      setIsGenerating(false)
    }
  }

  const testApiConnection = async () => {
    try {
      const response = await fetch('http://localhost:3001/health')
      const data = await response.json()
      setApiStatus(`✅ API connectée: ${data.message}`)
    } catch (error) {
      setApiStatus(`❌ Erreur API: ${error instanceof Error ? error.message : 'Connexion impossible'}`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Globe className="h-8 w-8 text-blue-500" />
              <h1 className="text-2xl font-bold">SiteGen SAAS</h1>
            </div>
            <p className="text-gray-400">Créez votre site e-commerce en quelques clics</p>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Configuration Panel */}
          <div className="space-y-6">
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-6">
                <Settings className="h-6 w-6 text-blue-500" />
                <h2 className="text-xl font-semibold">Configuration de votre site</h2>
              </div>

              {/* Site Name */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Nom de votre site</label>
                <input
                  type="text"
                  value={config.name}
                  onChange={(e) => setConfig({ ...config, name: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Mon Super Site"
                />
              </div>

              {/* Template Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Template</label>
                <TemplateSelector
                  selected={config.template}
                  onSelect={(template: 'modern-saas' | 'e-commerce' | 'portfolio') => setConfig({ ...config, template })}
                />
              </div>

              {/* Color Configuration */}
              <div className="mb-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Palette className="h-5 w-5 text-blue-500" />
                  <h3 className="text-lg font-medium">Couleurs</h3>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <ColorPicker
                    label="Couleur Primaire"
                    color={config.primaryColor}
                    onChange={(color: string) => setConfig({ ...config, primaryColor: color })}
                  />
                  <ColorPicker
                    label="Couleur Secondaire"
                    color={config.secondaryColor}
                    onChange={(color: string) => setConfig({ ...config, secondaryColor: color })}
                  />
                  <ColorPicker
                    label="Couleur d'Accent"
                    color={config.accentColor}
                    onChange={(color: string) => setConfig({ ...config, accentColor: color })}
                  />
                </div>
              </div>

              {/* Features */}
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-4">Fonctionnalités</h3>
                <div className="space-y-3">
                  {Object.entries(config.features).map(([key, value]) => (
                    <label key={key} className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) =>
                          setConfig({
                            ...config,
                            features: { ...config.features, [key]: e.target.checked }
                          })
                        }
                        className="rounded border-gray-600 bg-gray-800 text-blue-500 focus:ring-blue-500"
                      />
                      <span className="capitalize">{key === 'auth' ? 'Authentification' : 
                                                   key === 'payment' ? 'Paiement' :
                                                   key === 'blog' ? 'Blog' : 'Analytics'}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <Button
                onClick={handleGenerateSite}
                disabled={isGenerating}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                size="lg"
              >
                {isGenerating ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Génération en cours...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Download className="h-5 w-5" />
                    <span>Générer & Télécharger</span>
                  </div>
                )}
              </Button>

              {/* Bouton de téléchargement direct si fichier disponible */}
              {lastGeneratedFile && (
                <Button
                  onClick={() => downloadFile(lastGeneratedFile)}
                  className="w-full bg-green-600 hover:bg-green-700 text-white mt-3"
                  size="lg"
                >
                  <div className="flex items-center space-x-2">
                    <Download className="h-5 w-5" />
                    <span>Retélécharger: {lastGeneratedFile}</span>
                  </div>
                </Button>
              )}

              {/* API Connection Test */}
              <div className="mt-6">
                <Button
                  onClick={testApiConnection}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                  size="lg"
                >
                  Tester la connexion API
                </Button>
                {apiStatus && (
                  <p className="mt-2 text-sm">
                    {apiStatus}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="space-y-6">
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-6">Prévisualisation</h2>
              <SitePreview config={config} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
