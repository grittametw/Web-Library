import { NextResponse } from 'next/server';
import { dbConfig } from '@/database';
import mysql from 'mysql2/promise';

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

interface BookOption {
  id: number
  type: string
  price: number
  stock: number
}

interface Book {
  id: number
  name: string
  author: string
  image: string
  rate: number
  genre: string
  description: string
  options: BookOption[]
}

interface ErrorResponse {
  error: string
  details?: string
}

export async function GET(): Promise<NextResponse<Book[] | ErrorResponse>> {
  let connection: mysql.Connection | null = null

  try {
    connection = await mysql.createConnection(dbConfig)

    const [results] = await connection.execute<mysql.RowDataPacket[]>(
      `SELECT 
        b.id, b.name, b.author, b.image, b.rate, b.genre, b.description,
        o.id as option_id, o.type as option_type, o.price, o.stock
      FROM books b
      LEFT JOIN book_options o ON b.id = o.book_id
      ORDER BY b.id ASC, o.id ASC`
    )

    const rows = results as BookRow[]

    function groupBooks(rows: BookRow[]): Book[] {
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
          
          const existingOption = book.options.find(opt => opt.id === row.option_id)
          if (!existingOption) {
            book.options.push({
              id: row.option_id,
              type: row.option_type,
              price: row.price,
              stock: row.stock
            })
          }
        }
      })

      return Array.from(bookMap.values())
    }

    const books = groupBooks(rows)
    return NextResponse.json(books)

  } catch (error) {
    console.error('Error fetching books:', error)

    let errorMessage = 'Unknown error occurred while fetching books'
    
    if (error instanceof Error) {
      errorMessage = error.message
      
      if ('code' in error) {
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
    }

    const errorResponse: ErrorResponse = {
      error: 'Error fetching books',
      details: errorMessage,
    }

    return NextResponse.json(errorResponse, { status: 500 })

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