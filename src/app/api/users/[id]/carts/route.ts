import { NextRequest, NextResponse } from "next/server"
import { getPool } from "@/config/db"
import mysql from "mysql2/promise"

interface CartItem {
  id?: number
  user_id: number
  book_id: number
  book_option_id: number
  quantity: number
}

interface RouteContext {
  params: Promise<{ id: string }>
}

export async function GET(
  req: NextRequest,
  context: RouteContext
) {
  let connection: mysql.PoolConnection | null = null

  try {
    const params = await context.params
    const idStr = params.id
    const userId = parseInt(idStr, 10)
    if (isNaN(userId)) {
      return NextResponse.json({ error: "Invalid User ID" }, { status: 400 })
    }

    const pool = getPool()
    connection = await pool.getConnection()

    const [rows] = await connection.execute<mysql.RowDataPacket[]>(
      `SELECT uc.id, uc.user_id, uc.book_id, uc.book_option_id, uc.quantity, 
              b.name, b.author, b.image, b.rate, b.genre,
              o.type AS option_type, o.price, o.stock
       FROM user_cart uc
       JOIN books b ON uc.book_id = b.id
       LEFT JOIN book_options o ON uc.book_option_id = o.id
       WHERE uc.user_id = ?`,
      [userId]
    )

    return NextResponse.json({ success: true, cart: rows })
  } catch (error: unknown) {
    console.error("Error fetching cart:", error)
    return NextResponse.json(
      { error: "Failed to fetch cart" },
      { status: 500 }
    )
  } finally {
    if (connection) connection.release()
  }
}

export async function POST(
  req: NextRequest,
  context: RouteContext
) {
  let connection: mysql.PoolConnection | null = null
  try {
    const body: CartItem = await req.json()
    const params = await context.params
    const userId = parseInt(params.id, 10)

    if (isNaN(userId)) {
      return NextResponse.json({ error: "Invalid User ID" }, { status: 400 })
    }

    const { book_id, book_option_id, quantity } = body
    if (!book_id || !book_option_id || !quantity) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const pool = getPool()
    connection = await pool.getConnection()

    await connection.execute(
      `INSERT INTO user_cart (user_id, book_id, book_option_id, quantity) 
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE 
          quantity = VALUES(quantity),
          updated_at = NOW()`,
      [userId, book_id, book_option_id, quantity]
    )

    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    console.error("Error saving cart:", error)
    return NextResponse.json(
      { error: "Failed to save cart" },
      { status: 500 }
    )
  } finally {
    if (connection) connection.release()
  }
}

export async function PUT(
  req: NextRequest,
  context: RouteContext
) {
  let connection: mysql.PoolConnection | null = null
  try {
    const body: CartItem = await req.json()
    const params = await context.params
    const userId = parseInt(params.id, 10)

    if (isNaN(userId)) {
      return NextResponse.json({ error: "Invalid User ID" }, { status: 400 })
    }

    if (!body.id || !body.quantity) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 })
    }

    const pool = getPool()
    connection = await pool.getConnection()

    await connection.execute(
      `UPDATE user_cart 
       SET quantity = ?, updated_at = NOW() 
       WHERE id = ? AND user_id = ?`,
      [body.quantity, body.id, userId]
    )

    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    console.error("Error updating cart:", error)
    return NextResponse.json(
      { error: "Failed to update cart" },
      { status: 500 }
    )
  } finally {
    if (connection) connection.release()
  }
}

export async function DELETE(
  req: NextRequest,
  context: RouteContext
) {
  let connection: mysql.PoolConnection | null = null
  try {
    const { searchParams } = new URL(req.url)
    const params = await context.params
    const userId = parseInt(params.id, 10)
    const cartId = parseInt(searchParams.get("cartId") || "", 10)

    if (isNaN(userId) || isNaN(cartId)) {
      return NextResponse.json({ error: "Invalid params" }, { status: 400 })
    }

    const pool = getPool()
    connection = await pool.getConnection()

    await connection.execute(
      `DELETE FROM user_cart WHERE id = ? AND user_id = ?`,
      [cartId, userId]
    )

    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    console.error("Error deleting cart item:", error)
    return NextResponse.json(
      { error: "Failed to delete cart item" },
      { status: 500 }
    )
  } finally {
    if (connection) connection.release()
  }
}