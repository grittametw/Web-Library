import { NextResponse } from 'next/server'
import { dbConfig } from '@/config/db'
import { Book, BookRow } from '@/types/book'
import mysql from 'mysql2/promise'

interface RouteContext {
  params: Promise<{ name: string }>
}

export async function GET(
  req: Request,
  context: RouteContext
) {
  let connection: mysql.Connection | null = null

  try {
    const params = await context.params
    const bookName = decodeURIComponent(params.name)

    if (!bookName || bookName.trim().length === 0) {
      return NextResponse.json(
        { error: 'Book name is required' },
        { status: 400 }
      )
    }

    connection = await mysql.createConnection(dbConfig)

    const [results] = await connection.execute<mysql.RowDataPacket[]>(
      `SELECT 
        b.id, b.name, b.author, b.image, b.rate, b.genre, b.description,
        o.id as option_id, o.type as option_type, o.price, o.stock
      FROM books b
      LEFT JOIN book_options o ON b.id = o.book_id
      WHERE b.name = ?
      ORDER BY o.id ASC`,
      [bookName]
    )

    const rows = results as BookRow[]

    if (rows.length === 0) {
      return NextResponse.json(
        { error: 'Book not found' },
        { status: 404 }
      )
    }

    const firstRow = rows[0]

    const options: Book['options'] = rows
      .filter(row => row.option_id !== null)
      .map(row => ({
        id: row.option_id as number,
        type: row.option_type as string,
        price: row.price as number,
        stock: row.stock as number,
      }))
      .filter((option, index, self) =>
        index === self.findIndex(o => o.id === option.id)
      )

    const book: Book = {
      id: firstRow.id,
      name: firstRow.name,
      author: firstRow.author,
      image: firstRow.image,
      rate: firstRow.rate,
      genre: firstRow.genre,
      description: firstRow.description,
      options: options,
    }

    return NextResponse.json(book)
  } catch (error: unknown) {
    console.error('Error fetching book:', error)
    return NextResponse.json(
      { error: 'Failed to fetch book' },
      { status: 500 }
    )
  } finally {
    if (connection) {
      try {
        await connection.end()
      } catch (closeError) {
        console.error('Error closing database connection:', closeError)
      }
    }
  }
}