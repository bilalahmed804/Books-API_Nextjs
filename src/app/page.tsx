'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Book {
  id: number
  title: string
  author: string
}

export default function Home() {
  const [books, setBooks] = useState<Book[]>([])
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [editingBook, setEditingBook] = useState<Book | null>(null)

  useEffect(() => {
    fetchBooks()
  }, [])

  const fetchBooks = async () => {
    const response = await fetch('/api/books')
    const data = await response.json()
    setBooks(data)
  }

  const addBook = async (e: React.FormEvent) => {
    e.preventDefault()
    const response = await fetch('/api/books', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, author }),
    })
    if (response.ok) {
      setTitle('')
      setAuthor('')
      fetchBooks()
    }
  }

  const updateBook = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingBook) return
    const response = await fetch('/api/books', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: editingBook.id, title, author }),
    })
    if (response.ok) {
      setEditingBook(null)
      setTitle('')
      setAuthor('')
      fetchBooks()
    }
  }

  const deleteBook = async (id: number) => {
    const response = await fetch('/api/books', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    if (response.ok) {
      fetchBooks()
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Books API</h1>
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>{editingBook ? 'Edit Book' : 'Add New Book'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={editingBook ? updateBook : addBook} className="space-y-4">
            <Input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <Input
              type="text"
              placeholder="Author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
            />
            <Button type="submit">{editingBook ? 'Update' : 'Add'} Book</Button>
            {editingBook && (
              <Button type="button" variant="outline" onClick={() => setEditingBook(null)}>
                Cancel
              </Button>
            )}
          </form>
        </CardContent>
      </Card>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {books.map((book) => (
          <Card key={book.id}>
            <CardHeader>
              <CardTitle>{book.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Author: {book.author}</p>
              <div className="mt-4 space-x-2">
                <Button onClick={() => {
                  setEditingBook(book)
                  setTitle(book.title)
                  setAuthor(book.author)
                }}>
                  Edit
                </Button>
                <Button variant="destructive" onClick={() => deleteBook(book.id)}>
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}