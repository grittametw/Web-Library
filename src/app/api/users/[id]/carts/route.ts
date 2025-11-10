import { NextRequest, NextResponse } from "next/server"
import { getPool } from "@/config/db"
import { CartItem } from "@/types/cart"

interface RouteContext {
  params: Promise<{ id: string }>
}

export async function GET(
  req: NextRequest,
  context: RouteContext
) {
  try {
    const params = await context.params
    const idStr = params.id
    const userId = parseInt(idStr, 10)
    if (isNaN(userId)) {
      return NextResponse.json({ error: "Invalid User ID" }, { status: 400 })
    }

    const pool = getPool()

    const result = await pool.query(
      `SELECT uc.id, uc.user_id, uc.book_id, uc.book_option_id, uc.quantity, 
              b.name, b.author, b.image, b.rate, b.genre,
              o.type AS option_type, o.price, o.stock
       FROM user_cart uc
       JOIN books b ON uc.book_id = b.id
       LEFT JOIN book_options o ON uc.book_option_id = o.id
       WHERE uc.user_id = $1`,
      [userId]
    )

    return NextResponse.json({ success: true, cart: result.rows })
  } catch (error: unknown) {
    console.error("Error fetching cart:", error)
    return NextResponse.json(
      { error: "Failed to fetch cart" },
      { status: 500 }
    )
  }
}

export async function POST(
  req: NextRequest,
  context: RouteContext
) {
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

    await pool.query(
      `INSERT INTO user_cart (user_id, book_id, book_option_id, quantity, created_at, updated_at) 
       VALUES ($1, $2, $3, $4, NOW(), NOW())
       ON CONFLICT (user_id, book_id, book_option_id)
       DO UPDATE SET 
          quantity = EXCLUDED.quantity,
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
  }
}

export async function PUT(
  req: NextRequest,
  context: RouteContext
) {
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

    await pool.query(
      `UPDATE user_cart 
       SET quantity = $1, updated_at = NOW() 
       WHERE id = $2 AND user_id = $3`,
      [body.quantity, body.id, userId]
    )

    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    console.error("Error updating cart:", error)
    return NextResponse.json(
      { error: "Failed to update cart" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  context: RouteContext
) {
  try {
    const { searchParams } = new URL(req.url)
    const params = await context.params
    const userId = parseInt(params.id, 10)
    const cartId = parseInt(searchParams.get("cartId") || "", 10)

    if (isNaN(userId) || isNaN(cartId)) {
      return NextResponse.json({ error: "Invalid params" }, { status: 400 })
    }

    const pool = getPool()

    await pool.query(
      `DELETE FROM user_cart WHERE id = $1 AND user_id = $2`,
      [cartId, userId]
    )

    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    console.error("Error deleting cart item:", error)
    return NextResponse.json(
      { error: "Failed to delete cart item" },
      { status: 500 }
    )
  }
}