import { Router, Request, Response } from 'express'
import path from 'path'
import { SiteGenerator, SiteConfig } from '../services/SiteGenerator'

const router = Router()
const siteGenerator = new SiteGenerator()

// Generate site endpoint
router.post('/generate', async (req: Request, res: Response) => {
  try {
    const config: SiteConfig = req.body
    
    // Validate config
    if (!config.name || !config.primaryColor || !config.template) {
      return res.status(400).json({
        error: 'Missing required fields: name, primaryColor, template'
      })
    }

    console.log('📋 Received generation request:', config)

    // Generate site
    const zipPath = await siteGenerator.generateSite(config)
    const filename = path.basename(zipPath)

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
router.get('/download/:filename', (req: Request, res: Response) => {
  try {
    const filename = req.params.filename
    const filePath = path.join(__dirname, '../../generated-packages', filename)
    
    // Security check - ensure filename is safe
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return res.status(400).json({ error: 'Invalid filename' })
    }

    res.download(filePath, (err: any) => {
      if (err) {
        console.error('Download error:', err)
        res.status(404).json({ error: 'File not found' })
      }
    })

  } catch (error) {
    console.error('Download error:', error)
    res.status(500).json({ error: 'Download failed' })
  }
})

// Get generation status/history
router.get('/status', (req: Request, res: Response) => {
  res.json({
    status: 'active',
    message: 'Site generator is ready',
    supportedTemplates: ['modern-saas', 'e-commerce', 'portfolio'],
    features: ['auth', 'payment', 'blog', 'analytics']
  })
})

export { router as generatorRoutes }
