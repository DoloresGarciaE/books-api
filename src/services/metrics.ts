import { Book } from "../models/book"
import { BooksProvider } from "../providers/books"

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

function getBooksWrittenByAuthor(books: Book[], author?: string): Book[] {
  if (!author) return []
  return books.filter(book => book.author.toLowerCase() === author.toLowerCase())
}

async function getMetrics(booksProvider: BooksProvider, author?: string) {
  
  const books: Book[] = await booksProvider.getBooks()

  if (!books || books.length === 0) {
    throw new Error('No books found')
  }

  const meanUnitsSold = getMeanUnitsSold(books)
  const cheapestBook = getCheapestBook(books)
  const booksWrittenByAuthor = getBooksWrittenByAuthor(books, author)

  return {
    meanUnitsSold,
    cheapestBook,
    booksWrittenByAuthor,
  }
}

export { getMetrics, getMeanUnitsSold, getCheapestBook, getBooksWrittenByAuthor }
