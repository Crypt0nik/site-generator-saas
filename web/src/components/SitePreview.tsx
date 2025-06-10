import React from 'react'
import { ShoppingCart, User, Search, Menu, Star } from 'lucide-react'

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

interface SitePreviewProps {
  config: SiteConfig
}

export const SitePreview: React.FC<SitePreviewProps> = ({ config }) => {
  const { name, primaryColor, secondaryColor, accentColor, template } = config

  if (template === 'modern-saas') {
    return (
      <div className="w-full max-w-md mx-auto bg-white rounded-lg overflow-hidden shadow-lg transform scale-75 origin-top">
        {/* Header */}
        <div 
          className="px-4 py-3 text-white flex items-center justify-between"
          style={{ backgroundColor: primaryColor }}
        >
          <h1 className="font-bold text-lg">{name}</h1>
          <Menu className="h-5 w-5" />
        </div>
        
        {/* Hero Section */}
        <div 
          className="px-4 py-8 text-white text-center"
          style={{ 
            background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)` 
          }}
        >
          <h2 className="text-2xl font-bold mb-2">Solution SAAS Moderne</h2>
          <p className="text-sm opacity-90 mb-4">Transformez votre business avec notre plateforme</p>
          <button 
            className="px-6 py-2 rounded-full text-sm font-medium"
            style={{ backgroundColor: accentColor, color: 'white' }}
          >
            Commencer Gratuitement
          </button>
        </div>
        
        {/* Features */}
        <div className="px-4 py-6 bg-gray-50">
          <h3 className="font-semibold mb-3 text-gray-800">Fonctionnalités</h3>
          <div className="space-y-2">
            {config.features.auth && (
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4" style={{ color: primaryColor }} />
                <span className="text-sm text-gray-600">Authentification</span>
              </div>
            )}
            {config.features.analytics && (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: accentColor }} />
                <span className="text-sm text-gray-600">Analytics</span>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (template === 'e-commerce') {
    return (
      <div className="w-full max-w-md mx-auto bg-white rounded-lg overflow-hidden shadow-lg transform scale-75 origin-top">
        {/* Header */}
        <div 
          className="px-4 py-3 text-white flex items-center justify-between"
          style={{ backgroundColor: primaryColor }}
        >
          <h1 className="font-bold text-lg">{name}</h1>
          <div className="flex items-center space-x-3">
            <Search className="h-5 w-5" />
            <ShoppingCart className="h-5 w-5" />
          </div>
        </div>
        
        {/* Featured Product */}
        <div className="px-4 py-6">
          <div className="bg-gray-100 rounded-lg p-4 mb-4">
            <div className="w-full h-32 bg-gray-200 rounded mb-3" />
            <h3 className="font-semibold text-gray-800">Produit Vedette</h3>
            <div className="flex items-center justify-between mt-2">
              <span className="text-lg font-bold" style={{ color: primaryColor }}>€99.99</span>
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" style={{ color: accentColor }} />
                ))}
              </div>
            </div>
          </div>
          
          {/* Categories */}
          <div className="grid grid-cols-2 gap-2">
            <button 
              className="py-2 px-3 rounded text-sm font-medium text-white"
              style={{ backgroundColor: secondaryColor }}
            >
              Catégorie 1
            </button>
            <button 
              className="py-2 px-3 rounded text-sm font-medium border"
              style={{ borderColor: primaryColor, color: primaryColor }}
            >
              Catégorie 2
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Portfolio template
  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg overflow-hidden shadow-lg transform scale-75 origin-top">
      {/* Header */}
      <div 
        className="px-4 py-6 text-white text-center"
        style={{ backgroundColor: primaryColor }}
      >
        <div className="w-16 h-16 bg-white/20 rounded-full mx-auto mb-3" />
        <h1 className="font-bold text-xl">{name}</h1>
        <p className="text-sm opacity-90">Développeur & Designer</p>
      </div>
      
      {/* About */}
      <div className="px-4 py-6">
        <h3 className="font-semibold mb-3" style={{ color: primaryColor }}>À Propos</h3>
        <p className="text-sm text-gray-600 mb-4">
          Passionné par la création d'expériences digitales exceptionnelles...
        </p>
        
        {/* Skills */}
        <div className="flex flex-wrap gap-2">
          <span 
            className="px-3 py-1 rounded-full text-xs font-medium text-white"
            style={{ backgroundColor: secondaryColor }}
          >
            React
          </span>
          <span 
            className="px-3 py-1 rounded-full text-xs font-medium text-white"
            style={{ backgroundColor: accentColor }}
          >
            Design
          </span>
        </div>
      </div>
      
      {/* Portfolio Grid */}
      <div className="px-4 pb-6">
        <h3 className="font-semibold mb-3" style={{ color: primaryColor }}>Portfolio</h3>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-gray-100 rounded h-20" />
          <div className="bg-gray-100 rounded h-20" />
        </div>
      </div>
    </div>
  )
}
