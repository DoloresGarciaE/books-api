import { Request, Response } from 'express'
import { BooksProvider } from '../providers/books.ts'
import { Book } from '../models/book.ts'
import { getMetrics } from '../services/metrics.ts'

interface GetMetricsQuery {
  author?: string
}

export interface MetricResponse {
  meanUnitsSold: number;
  cheapestBook: Book | null;
  booksWrittenByAuthor: Book[];
}

const metricsHandler = (metricsProvider: BooksProvider) => {

  const get = async (req: Request<{}, {}, {}, GetMetricsQuery>, res: Response<MetricResponse | { error: string }>) => {
    const { author } = req.query

    try {
      const books: Book[] = await metricsProvider.getBooks()

    if (books.length === 0) {
      return res.status(404).json({ error: 'No books found' })
    }

    const metrics = getMetrics(books, author)

    res.status(200).json(metrics)
    } catch (error) {
      console.error('Error fetching metrics:', error)
      res.status(500).json({ error: 'Internal Server Error' })
    }
  }

  return {
    get,
  }
}

export default metricsHandler
