import { Router } from 'express'

const router = Router()

// Types pour les templates
interface Template {
  id: string
  name: string
  description: string
  category: 'saas' | 'ecommerce' | 'portfolio'
  thumbnail: string
  features: string[]
  demo?: string
}

// Templates disponibles
const templates: Template[] = [
  {
    id: 'modern-saas',
    name: 'Modern SAAS',
    description: 'Template moderne pour applications SAAS avec design épuré',
    category: 'saas',
    thumbnail: '/templates/modern-saas.jpg',
    features: ['Responsive Design', 'Dark/Light Mode', 'Dashboard Admin', 'API Integration'],
    demo: 'https://demo-modern-saas.com'
  },
  {
    id: 'ecommerce-pro',
    name: 'E-commerce Pro',
    description: 'Template professionnel pour boutiques en ligne',
    category: 'ecommerce',
    thumbnail: '/templates/ecommerce-pro.jpg',
    features: ['Panier d\'achats', 'Paiement Stripe', 'Gestion Produits', 'Commandes'],
    demo: 'https://demo-ecommerce-pro.com'
  },
  {
    id: 'portfolio-creative',
    name: 'Portfolio Créatif',
    description: 'Template créatif pour portfolios et agences',
    category: 'portfolio',
    thumbnail: '/templates/portfolio-creative.jpg',
    features: ['Galerie Photos', 'Blog intégré', 'Contact Form', 'Animations CSS'],
    demo: 'https://demo-portfolio-creative.com'
  }
]

// GET /api/templates - Récupérer tous les templates
router.get('/', (req, res) => {
  try {
    res.json({
      success: true,
      templates: templates,
      total: templates.length
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des templates',
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    })
  }
})

// GET /api/templates/:id - Récupérer un template spécifique
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params
    const template = templates.find(t => t.id === id)
    
    if (!template) {
      return res.status(404).json({
        success: false,
        message: 'Template non trouvé'
      })
    }
    
    res.json({
      success: true,
      template: template
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du template',
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    })
  }
})

// GET /api/templates/category/:category - Récupérer templates par catégorie
router.get('/category/:category', (req, res) => {
  try {
    const { category } = req.params
    const filteredTemplates = templates.filter(t => t.category === category)
    
    res.json({
      success: true,
      templates: filteredTemplates,
      category: category,
      total: filteredTemplates.length
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des templates par catégorie',
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    })
  }
})

export { router as templateRoutes }
