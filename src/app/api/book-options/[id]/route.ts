import { NextResponse } from 'next/server'
import { getPool } from '@/config/db'

interface RouteContext {
  params: Promise<{ id: string }>
}

export async function PUT(
  req: Request,
  context: RouteContext
) {
  try {
    const params = await context.params
    const id = parseInt(params.id)
    const body = await req.json()

    const { type, price, stock } = body

    if (!type) {
      return NextResponse.json(
        { error: 'Type is required' },
        { status: 400 }
      )
    }

    const pool = getPool()

    const result = await pool.query(
      `UPDATE book_options 
       SET type = $1, price = $2, stock = $3
       WHERE id = $4
       RETURNING *`,
      [type, price, stock, id]
    )

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Book option not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(result.rows[0])
  } catch (error: unknown) {
    console.error('Error updating book option:', error)
    return NextResponse.json(
      { error: 'Failed to update book option' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: Request,
  context: RouteContext
) {
  try {
    const params = await context.params
    const id = parseInt(params.id)

    const pool = getPool()

    const result = await pool.query(
      `DELETE FROM book_options WHERE id = $1 RETURNING id`,
      [id]
    )

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Book option not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: 'Book option deleted successfully', id })
  } catch (error: unknown) {
    console.error('Error deleting book option:', error)
    return NextResponse.json(
      { error: 'Failed to delete book option' },
      { status: 500 }
    )
  }
}