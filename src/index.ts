import express, { Request, Response, NextFunction } from 'express'
import BooksProvider from './providers/books.ts'
import MetricsHandler from './handlers/metrics.ts'
import cors from 'cors'
import MetricService from './services/metrics.ts'
  
const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(cors())

const booksProvider = BooksProvider()
const metricService = MetricService(booksProvider)
const metricsHandler = MetricsHandler(metricService)
app.get('/metrics', metricsHandler.get)

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error('Unhandled error in request', {
    message: err?.message,
    stack: err?.stack,
  })
  
  res.status(500).json({
    error: 'Internal Server Error',
  })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

export { app }
