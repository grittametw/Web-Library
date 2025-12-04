import { NextResponse } from 'next/server'
import { getPool } from '@/config/db'

interface RouteContext {
  params: Promise<{ id: string }>
}

export async function PUT(req: Request, context: RouteContext) {
  try {
    const params = await context.params
    const id = parseInt(params.id)
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
      `UPDATE books 
       SET name = $1, author = $2, image = $3, rate = $4, genre = $5, description = $6
       WHERE id = $7
       RETURNING *`,
      [name, author, image, rate || null, genre, description, id]
    )

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Book not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(result.rows[0])
  } catch (error: unknown) {
    console.error('Error updating book:', error)
    return NextResponse.json(
      { error: 'Failed to update book' },
      { status: 500 }
    )
  }
}

export async function DELETE(req: Request, context: RouteContext) {
  try {
    const params = await context.params
    const id = parseInt(params.id)

    const pool = getPool()
    
    const result = await pool.query(
      `DELETE FROM books WHERE id = $1 RETURNING id`,
      [id]
    )

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Book not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: 'Book deleted successfully', id })
  } catch (error: unknown) {
    console.error('Error deleting book:', error)
    return NextResponse.json(
      { error: 'Failed to delete book' },
      { status: 500 }
    )
  }
}