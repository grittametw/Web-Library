import { NextResponse } from "next/server"
import { getPool } from "@/config/db"

interface RouteContext {
  params: Promise<{ id: string; orderId: string }>
}

export async function PUT(
  req: Request,
  context: RouteContext
) {
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

    const orderResult = await pool.query(
      `SELECT id, order_status FROM user_orders WHERE id = $1 AND user_id = $2`,
      [orderId, userId]
    )

    if (orderResult.rows.length === 0) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      )
    }

    const order = orderResult.rows[0]

    if (order.order_status !== 'shipped') {
      return NextResponse.json(
        { error: "Order must be in 'shipped' status to complete" },
        { status: 400 }
      )
    }

    const updateResult = await pool.query(
      `UPDATE user_orders 
       SET order_status = 'delivered', updated_at = NOW() 
       WHERE id = $1`,
      [orderId]
    )

    console.log(`Order ${orderId} marked as delivered. Rows affected: ${updateResult.rowCount}`)

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
  }
}