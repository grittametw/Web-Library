import { NextResponse } from "next/server"
import { getPool } from "@/config/db"
import mysql from "mysql2/promise"

interface RouteContext {
  params: Promise<{ id: string; orderId: string }>
}

export async function PUT(
  req: Request,
  context: RouteContext
) {
  let connection: mysql.PoolConnection | null = null

  try {
    const params = await context.params
    const userId = parseInt(params.id, 10)
    const orderId = parseInt(params.orderId, 10)

    if (!userId || isNaN(userId) || !orderId || isNaN(orderId)) {
      return NextResponse.json(
        { error: "Invalid user ID or order ID" },
        { status: 400 }
      )
    }

    const pool = getPool()
    connection = await pool.getConnection()

    const [orders] = await connection.execute<mysql.RowDataPacket[]>(
      `SELECT id, order_status FROM user_orders WHERE id = ? AND user_id = ?`,
      [orderId, userId]
    )

    if (orders.length === 0) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      )
    }

    const order = orders[0]

    if (order.order_status !== 'shipped') {
      return NextResponse.json(
        { error: "Order must be in 'shipped' status to complete" },
        { status: 400 }
      )
    }

    await connection.execute(
      `UPDATE user_orders SET order_status = 'delivered', updated_at = NOW() WHERE id = ?`,
      [orderId]
    )

    return NextResponse.json({
      success: true,
      message: "Order completed successfully"
    })

  } catch (error: unknown) {
    console.error("Error completing order:", error)
    return NextResponse.json(
      { error: "Failed to complete order" },
      { status: 500 }
    )
  } finally {
    if (connection) connection.release()
  }
}