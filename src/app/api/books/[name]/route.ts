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

interface BookResponse {
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

interface RouteParams {
  params: {
    name: string
  }
}

export async function GET(
  request: Request, 
  { params }: RouteParams
): Promise<NextResponse<BookResponse | ErrorResponse>> {
  let connection: mysql.Connection | null = null

  try {
    const bookName = decodeURIComponent(params.name)
    
    if (!bookName || bookName.trim().length === 0) {
      return NextResponse.json(
        { error: 'Book name is required' } as ErrorResponse,
        { status: 400 }
      )
    }

    connection = await mysql.createConnection(dbConfig);

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
        { error: 'Book not found' } as ErrorResponse,
        { status: 404 }
      )
    }

    const firstRow = rows[0]
    
    const options: BookOption[] = rows
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

    const book: BookResponse = {
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

  } catch (error) {
    console.error('Error fetching book:', error)

    let errorMessage = 'Unknown error occurred while fetching book'
    
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
      error: 'Error fetching book',
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