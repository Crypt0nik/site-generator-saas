import express from 'express'
import path from 'path'

const router = express.Router()

// Interface pour la configuration de site
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

// Generate site endpoint
router.post('/generate', async (req, res) => {
  try {
    const config: SiteConfig = req.body
    
    // Validate config
    if (!config.name || !config.primaryColor || !config.template) {
      return res.status(400).json({
        error: 'Missing required fields: name, primaryColor, template'
      })
    }

    console.log('📋 Received generation request:', config)

    // Simulate generation process for now
    const filename = `${config.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now()}.zip`

    res.json({
      success: true,
      message: 'Site generated successfully',
      downloadUrl: `/api/generator/download/${filename}`,
      filename: filename
    })

  } catch (error) {
    console.error('❌ Generation error:', error)
    res.status(500).json({
      error: 'Failed to generate site',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

// Download generated package
router.get('/download/:filename', (req, res) => {
  try {
    const filename = req.params.filename
    const filePath = path.join(__dirname, '../../generated-packages', filename)
    
    // Security check - ensure filename is safe
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return res.status(400).json({ error: 'Invalid filename' })
    }

    // For now, return a simple response since we don't have actual files yet
    res.json({
      message: 'Download would start here',
      filename: filename,
      filePath: filePath
    })

  } catch (error) {
    console.error('Download error:', error)
    res.status(500).json({ error: 'Download failed' })
  }
})

// Get generation status/history
router.get('/status', (req, res) => {
  res.json({
    status: 'active',
    message: 'Site generator is ready',
    supportedTemplates: ['modern-saas', 'e-commerce', 'portfolio'],
    features: ['auth', 'payment', 'blog', 'analytics']
  })
})

export { router as generatorRoutes }
