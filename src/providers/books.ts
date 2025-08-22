import { Book } from '../models/book';
const API_URL = 'https://6781684b85151f714b0aa5db.mockapi.io/api/v1'

export type BooksProvider = {
  getBooks: () => Promise<Book[]>;
};

const booksProvider = (): BooksProvider => {
  return {
    getBooks,
  }
}

async function getBooks(): Promise<Book[]> {
  const res = await fetch(`${API_URL}/books`)
  if (!res.ok) {
    throw new Error(`Books API error: ${res.status} ${res.statusText}`)
  }

  const data = await res.json()
  return data.map((r) => ({
    id: String(r.id),
    name: String(r.name),
    author: String(r.author),
    unitsSold: Number(r.units_sold),
    price: Number(r.price),
  }))
}

export default booksProvider