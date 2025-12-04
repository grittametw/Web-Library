import { NextResponse } from 'next/server'
import { getPool } from '@/config/db'

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const body = await req.json()
    const { book_id, type, price, stock } = body

    if (!book_id || !type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const pool = getPool()
    
    const result = await pool.query(
      `INSERT INTO book_options (book_id, type, price, stock)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [book_id, type, price || 0, stock || 0]
    )

    return NextResponse.json(result.rows[0], { status: 201 })
  } catch (error: unknown) {
    console.error('Error creating book option:', error)
    return NextResponse.json(
      { error: 'Failed to create book option' },
      { status: 500 }
    )
  }
}