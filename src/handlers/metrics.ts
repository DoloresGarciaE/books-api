import type { Request, Response, NextFunction } from 'express'
import { BooksProvider } from '../providers/books'
import { getMetrics } from '../services/metrics'
import type { Book } from '../models/book'

export interface GetMetricsQuery {
  author?: string
}

export interface MetricResponse {
  meanUnitsSold: number
  cheapestBook: Book | null
  booksWrittenByAuthor: Book[]
}

const metricsHandler = (booksProvider: BooksProvider) => {
  const get = async (req: Request<{}, {}, {}, GetMetricsQuery>, res: Response<MetricResponse>, next: NextFunction) => {
    try {
      const author = req.query.author as string | undefined
      const metrics = await getMetrics(booksProvider, author)
      return res.status(200).json(metrics)
    } catch (err) {
      console.error('Error fetching metrics:', (err as Error).message)
      return next(err)
    }
  }

  return {
    get,
  }
}

export default metricsHandler