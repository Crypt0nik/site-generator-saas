import React from 'react'
import { Store, Briefcase, User } from 'lucide-react'

interface TemplateSelectorProps {
  selected: 'modern-saas' | 'e-commerce' | 'portfolio'
  onSelect: (template: 'modern-saas' | 'e-commerce' | 'portfolio') => void
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({ selected, onSelect }) => {
  const templates = [
    {
      id: 'modern-saas' as const,
      name: 'Modern SAAS',
      description: 'Interface moderne et élégante pour SaaS',
      icon: Briefcase,
      preview: 'bg-gradient-to-br from-blue-600 to-purple-600'
    },
    {
      id: 'e-commerce' as const,
      name: 'E-commerce',
      description: 'Boutique en ligne complète avec panier',
      icon: Store,
      preview: 'bg-gradient-to-br from-green-600 to-teal-600'
    },
    {
      id: 'portfolio' as const,
      name: 'Portfolio',
      description: 'Site vitrine professionnel',
      icon: User,
      preview: 'bg-gradient-to-br from-orange-600 to-red-600'
    }
  ]

  return (
    <div className="grid grid-cols-1 gap-3">
      {templates.map((template) => {
        const IconComponent = template.icon
        return (
          <button
            key={template.id}
            onClick={() => onSelect(template.id)}
            className={`p-4 rounded-lg border transition-all text-left ${
              selected === template.id
                ? 'border-blue-500 bg-blue-500/10'
                : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className={`w-12 h-12 rounded-lg ${template.preview} flex items-center justify-center`}>
                <IconComponent className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-white">{template.name}</h3>
                <p className="text-sm text-gray-400">{template.description}</p>
              </div>
              <div className={`w-4 h-4 rounded-full border-2 ${
                selected === template.id
                  ? 'border-blue-500 bg-blue-500'
                  : 'border-gray-600'
              }`}>
                {selected === template.id && (
                  <div className="w-full h-full rounded-full bg-blue-500" />
                )}
              </div>
            </div>
          </button>
        )
      })}
    </div>
  )
}
