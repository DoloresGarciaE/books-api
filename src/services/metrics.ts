import { MetricResponse } from "../handlers/metrics";
import { Book } from "../models/book";

function getMeanUnitsSold(books: Book[]): number {
  if (books.length === 0) return 0
  const totalUnitsSold = books.reduce((sum, book) => sum + book.unitsSold, 0)
  return totalUnitsSold / books.length
}

function getCheapestBook(books: Book[]): Book | null {
  if (books.length === 0) return null
  return books.reduce((cheapest, book) => {
    return book.price < cheapest.price ? book : cheapest
  }, books[0])
}

function getBooksWrittenByAuthor(books: Book[], author: string): Book[] {
  return books.filter(book => book.author.toLowerCase() === author.toLowerCase())
}

function getMetrics(books: Book[], author?: string): MetricResponse {
  const meanUnitsSold = getMeanUnitsSold(books)
  const cheapestBook = getCheapestBook(books)
  const booksWrittenByAuthor = author ? getBooksWrittenByAuthor(books, author) : []

  return {
    meanUnitsSold,
    cheapestBook,
    booksWrittenByAuthor,
  }
}

export { getMeanUnitsSold, getCheapestBook, getBooksWrittenByAuthor, getMetrics }
