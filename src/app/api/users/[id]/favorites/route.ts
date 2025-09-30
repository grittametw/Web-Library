import { NextRequest, NextResponse } from "next/server"
import { getPool } from "@/config/db"
import mysql from "mysql2/promise"

interface FavoriteItem {
  id?: number
  user_id: number
  book_id: number
}

interface FavoriteRow extends mysql.RowDataPacket {
  id: number
  user_id: number
  book_id: number
  name: string
  author: string
  image: string
  rate: number | null
  genre: string | null
  option_id: number | null
  option_type: string | null
  price: number | null
  stock: number | null
}

interface FavoriteBook {
  id: number
  name: string
  author: string
  image: string
  rate: number | null
  genre: string | null
  options: BookOption[]
}

interface BookOption {
  id: number
  type: string
  price: number
  stock: number
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
    const userId = parseInt(params.id, 10)
    if (isNaN(userId)) {
      return NextResponse.json({ error: "Invalid User ID" }, { status: 400 })
    }

    const pool = getPool()
    connection = await pool.getConnection()

    const [rows] = await connection.execute<FavoriteRow[]>(
      `SELECT uf.id, uf.user_id, uf.book_id,
              b.name, b.author, b.image, b.rate, b.genre,
              o.id AS option_id, o.type AS option_type, o.price, o.stock
       FROM user_favorites uf
       JOIN books b ON uf.book_id = b.id
       LEFT JOIN book_options o ON o.book_id = b.id
       WHERE uf.user_id = ?
       ORDER BY uf.id`,
      [userId]
    )

    const booksMap = new Map<number, FavoriteBook>()

    rows.forEach(row => {
      if (!booksMap.has(row.book_id)) {
        booksMap.set(row.book_id, {
          id: row.book_id,
          name: row.name,
          author: row.author,
          image: row.image,
          rate: row.rate,
          genre: row.genre,
          options: []
        })
      }

      if (row.option_id && row.option_type && row.price !== null && row.stock !== null) {
        booksMap.get(row.book_id)!.options.push({
          id: row.option_id,
          type: row.option_type,
          price: row.price,
          stock: row.stock
        })
      }
    })

    const favorites: FavoriteBook[] = Array.from(booksMap.values())

    return NextResponse.json({ success: true, favorites })
  } catch (error: unknown) {
    console.error("Error fetching favorites:", error)
    return NextResponse.json({ error: "Failed to fetch favorites" }, { status: 500 })
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
    const body: FavoriteItem = await req.json()
    const params = await context.params
    const userId = parseInt(params.id, 10)

    if (isNaN(userId)) {
      return NextResponse.json({ error: "Invalid User ID" }, { status: 400 })
    }

    const { book_id } = body
    if (!book_id) {
      return NextResponse.json({ error: "Missing book_id" }, { status: 400 })
    }

    const pool = getPool()
    connection = await pool.getConnection()

    await connection.execute(
      `INSERT INTO user_favorites (user_id, book_id)
       VALUES (?, ?)
       ON DUPLICATE KEY UPDATE created_at = NOW()`,
      [userId, book_id]
    )

    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    console.error("Error saving favorite:", error)
    return NextResponse.json({ error: "Failed to save favorite" }, { status: 500 })
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
    const body = await req.json()
    const params = await context.params
    const userId = parseInt(params.id, 10)
    const bookId = parseInt(body.book_id, 10)

    if (isNaN(userId) || isNaN(bookId)) {
      return NextResponse.json({ error: "Invalid params" }, { status: 400 })
    }

    const pool = getPool()
    connection = await pool.getConnection()

    await connection.execute(
      `DELETE FROM user_favorites WHERE user_id = ? AND book_id = ?`,
      [userId, bookId]
    )

    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    console.error("Error deleting favorite:", error)
    return NextResponse.json({ error: "Failed to delete favorite" }, { status: 500 })
  } finally {
    if (connection) connection.release()
  }
}