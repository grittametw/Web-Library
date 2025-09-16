import { NextResponse } from 'next/server'
import { getPool } from '@/config/db'
import { Book } from '@/types/book'
import mysql from 'mysql2/promise'

interface BookRow {
  id: number
  name: string
  author: string
  image: string
  rate: number
  genre: string
  description: string
  option_id: number | null
  option_type: string | null
  price: number | null
  stock: number | null
}

interface ErrorResponse {
  error: string
  details?: string
}

function hasErrorCode(e: unknown): e is { code: string } {
  return typeof e === 'object' && e !== null && 'code' in e
}

export async function GET(): Promise<NextResponse<Book[] | ErrorResponse>> {
  try {
    const pool = getPool()

    const [results] = await pool.execute<mysql.RowDataPacket[]>(
      `SELECT 
        b.id, b.name, b.author, b.image, b.rate, b.genre, b.description,
        o.id as option_id, o.type as option_type, o.price, o.stock
      FROM books b
      LEFT JOIN book_options o ON b.id = o.book_id
      ORDER BY b.id ASC, o.id ASC`
    )

    const rows = results as BookRow[]

    const bookMap = new Map<number, Book>()

    rows.forEach(row => {
      if (!bookMap.has(row.id)) {
        bookMap.set(row.id, {
          id: row.id,
          name: row.name,
          author: row.author,
          image: row.image,
          rate: row.rate,
          genre: row.genre,
          description: row.description,
          options: []
        })
      }

      if (row.option_id !== null && row.option_type !== null &&
          row.price !== null && row.stock !== null) {
        const book = bookMap.get(row.id)!

        if (!book.options.find(opt => opt.id === row.option_id)) {
          book.options.push({
            id: row.option_id,
            type: row.option_type,
            price: row.price,
            stock: row.stock
          })
        }
      }
    })

    return NextResponse.json(Array.from(bookMap.values()))

  } catch (error: unknown) {
    console.error('Error fetching books:', error)

    let errorMessage = 'Unknown error occurred while fetching books'
    if (error instanceof Error && hasErrorCode(error)) {
      switch (error.code) {
        case 'ER_ACCESS_DENIED_ERROR':
          errorMessage = 'Database access denied'
          break
        case 'ECONNREFUSED':
          errorMessage = 'Database connection refused'
          break
        case 'ER_BAD_DB_ERROR':
          errorMessage = 'Database does not exist'
          break
        case 'ER_NO_SUCH_TABLE':
          errorMessage = 'Required table does not exist'
          break
        default:
          errorMessage = 'Database query error'
      }
    }

    return NextResponse.json(
      { error: 'Error fetching books', details: errorMessage },
      { status: 500 }
    )
  }
}