import { Book } from '../models/book.ts'
const API_URL = 'https://6781684b85151f714b0aa5db.mockapi.io/api/v1/books'

export type BooksProvider = {
  getBooks: () => Promise<Book[]>;
};

async function getBooks(): Promise<Book[]> {

  try {
    const response = await fetch(API_URL)
    if (!response.ok) {
      throw new Error(`Books API error: ${response.status} ${response.statusText}`);
    }
    const data = await response.json()
    console.log(data)
    return data.map((r: any): Book => ({
      id: String(r.id),
      name: String(r.name),
      author: String(r.author),
      unitsSold: Number(r.units_sold),
      price: Number(r.price),
    }));
  } catch (error) {
    console.log('Error fetching books:', error)
    throw error;
  }
}

export { getBooks }