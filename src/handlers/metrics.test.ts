import { describe, it, expect, vi, beforeEach, Mock } from 'vitest'
import metricsHandler from './metrics'
import metricService from '../services/metrics'
import type { NextFunction, Request, Response } from 'express'
import { Book } from '../models/book'
import { BooksProvider } from '../providers/books'

describe('metricsHandler', () => {
  const mockBooks: Book[] = [
    { id: '1', name: 'Book 1', author: 'Author 1', unitsSold: 100, price: 20 },
    { id: '2', name: 'Book 2', author: 'Author 2', unitsSold: 200, price: 15 },
    { id: '3', name: 'Book 3', author: 'Author 1', unitsSold: 300, price: 25 },
  ]

  // Mock BooksProvider
  const mockBooksProvider: BooksProvider = {
    getBooks: vi.fn().mockResolvedValue(mockBooks)
  }

  // Set up handler with mock provider
  const service = metricService(mockBooksProvider)
  const handler = metricsHandler(service)

  // Mock request and response
  let mockReq: Partial<Request>
  let mockRes: Partial<Response>
  let mockNext: Partial<NextFunction>
  let jsonMock: any

  beforeEach(() => {
    jsonMock = vi.fn()
    mockRes = {
      status: vi.fn().mockReturnThis(),
      json: jsonMock,
    }
    mockReq = { query: {} }
    mockNext = vi.fn()
  })

  describe('get', () => {
    it('should return metrics with empty author query', async () => {
      await handler.get(mockReq as Request, mockRes as Response, mockNext as NextFunction)

      expect(mockBooksProvider.getBooks).toHaveBeenCalled()
      expect(mockRes.status).toHaveBeenCalledWith(200)
      expect(jsonMock).toHaveBeenCalledWith({
        meanUnitsSold: 200,
        cheapestBook: mockBooks[1],
        booksWrittenByAuthor: []
      })
    })

    it('should return metrics with author query', async () => {
      mockReq.query = { author: 'Author 1' }

      await handler.get(mockReq as Request, mockRes as Response, mockNext as NextFunction)

      expect(mockBooksProvider.getBooks).toHaveBeenCalled()
      expect(mockRes.status).toHaveBeenCalledWith(200)
      expect(jsonMock).toHaveBeenCalledWith({
        meanUnitsSold: 200,
        cheapestBook: mockBooks[1],
        booksWrittenByAuthor: [
          mockBooks[0],
          mockBooks[2]
        ]
      })
    });  

    it('getMeanUnitsSold to return 0 when list is empty', () => {
      expect(service.getMeanUnitsSold([])).toBe(0)
    })

    it('getMeanUnitsSold returns correct average for multiple books', () => {
      expect(service.getMeanUnitsSold(mockBooks)).toBe(200)
    })

    it('getCheapestBook returns null when list is empty', () => {
      expect(service.getCheapestBook([])).toBeNull()
    })

    it('getCheapestBook returns correct identifies the cheapest book', () => {
      expect(service.getCheapestBook(mockBooks)).toEqual(mockBooks[1])
    })

    it('getBooksWrittenByAuthor returns an empty array when no author is provided', () => {
      expect(service.getBooksWrittenByAuthor(mockBooks)).toEqual([])
    })

    it('getBooksWrittenByAuthor returns books written by the specified author', () => {
      expect(service.getBooksWrittenByAuthor(mockBooks, 'Author 1')).toEqual([
        mockBooks[0],
        mockBooks[2],
      ])
    })

    it('BooksProvider should return all books', async () => {
      const books = await mockBooksProvider.getBooks()
      expect(books).toEqual(mockBooks)
    })
  })
});
