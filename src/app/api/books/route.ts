import { NextResponse } from 'next/server'
import { getPool } from '@/config/db'
import { Book, BookRow } from '@/types/book'

export async function GET(): Promise<NextResponse<Book[] | { error: string }>> {
  try {
    const pool = getPool()

    const result = await pool.query(
      `SELECT 
        b.id, b.name, b.author, b.image, b.rate, b.genre, b.description,
        o.id as option_id, o.type as option_type, o.price, o.stock
      FROM books b
      LEFT JOIN book_options o ON b.id = o.book_id
      ORDER BY b.id ASC, o.id ASC`
    )

    const rows = result.rows as BookRow[]

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
          options: [],
        })
      }

      if (
        row.option_id !== null &&
        row.option_type !== null &&
        row.price !== null &&
        row.stock !== null
      ) {
        const book = bookMap.get(row.id)!
        if (!book.options.find(opt => opt.id === row.option_id)) {
          book.options.push({
            id: row.option_id,
            type: row.option_type,
            price: row.price,
            stock: row.stock,
          })
        }
      }
    })

    return NextResponse.json(Array.from(bookMap.values()))
  } catch (error: unknown) {
    console.error('Error fetching books:', error)
    return NextResponse.json(
      { error: 'Failed to fetch books' },
      { status: 500 }
    )
  }
}

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const body = await req.json()
    const { name, author, image, rate, genre, description } = body

    if (!name || !author || !genre) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const pool = getPool()

    const result = await pool.query(
      `INSERT INTO books (name, author, image, rate, genre, description)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [name, author, image || null, rate || null, genre, description]
    )

    return NextResponse.json(result.rows[0], { status: 201 })
  } catch (error: unknown) {
    console.error('Error creating book:', error)
    return NextResponse.json(
      { error: 'Failed to create book' },
      { status: 500 }
    )
  }
}