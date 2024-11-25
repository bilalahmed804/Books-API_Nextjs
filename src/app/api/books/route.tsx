import { NextResponse } from 'next/server'

let books = [
  { id: 1, title: 'HTML & CSS', author: 'Jon Duckett' },
  { id: 2, title: 'JAVASCRIPT', author: "Mark Myers" },
]

export async function GET() {
  return NextResponse.json(books)
}

export async function POST(request: Request) {
  const book = await request.json()
  book.id = books.length + 1
  books.push(book)
  return NextResponse.json(book, { status: 201 })
}

export async function PUT(request: Request) {
  const book = await request.json()
  const index = books.findIndex((b) => b.id === book.id)
  if (index !== -1) {
    books[index] = book
    return NextResponse.json(book)
  }
  return NextResponse.json({ error: 'Book not found' }, { status: 404 })
}

export async function DELETE(request: Request) {
  const { id } = await request.json()
  books = books.filter((book) => book.id !== id)
  return NextResponse.json({ message: 'Book deleted' })
}