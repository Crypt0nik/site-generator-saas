import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { generatorRoutes } from './routes/generator'
import { templateRoutes } from './routes/templates'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use('/api/generator', generatorRoutes)
app.use('/api/templates', templateRoutes)

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Site Generator API is running' })
})

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
  console.log(`📚 Health check: http://localhost:${PORT}/health`)
})
