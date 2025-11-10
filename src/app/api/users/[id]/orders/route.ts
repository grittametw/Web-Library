import { NextResponse } from "next/server"
import { getPool } from "@/config/db"
import { OrderItem, OrderRow, OrderItemRow } from "@/types/order"

interface OrderWithItems {
  id: number
  payment_status: string
  order_status: string
  total_price: number
  created_at: Date
  updated_at: Date
  items: OrderItem[]
}

interface RouteContext {
  params: Promise<{ id: string }>
}

export async function GET(
  req: Request,
  context: RouteContext
) {
  try {
    const params = await context.params
    const userId = parseInt(params.id, 10)

    if (!userId || isNaN(userId)) {
      return NextResponse.json(
        { error: "Invalid user ID" },
        { status: 400 }
      )
    }

    const pool = getPool()

    const ordersResult = await pool.query(
      `SELECT 
        id,
        payment_status,
        order_status,
        total_price,
        created_at,
        updated_at
       FROM user_orders
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [userId]
    )

    const orders = ordersResult.rows as OrderRow[]

    if (orders.length === 0) {
      return NextResponse.json({
        success: true,
        orders: []
      })
    }

    const orderIds = orders.map((order) => order.id)
    
    const itemsResult = await pool.query(
      `SELECT 
        oi.order_id,
        oi.book_id,
        oi.book_option_id,
        oi.quantity,
        oi.price,
        b.name,
        b.image,
        bo.type as option_type
       FROM user_order_items oi
       JOIN books b ON oi.book_id = b.id
       JOIN book_options bo ON oi.book_option_id = bo.id
       WHERE oi.order_id = ANY($1)
       ORDER BY oi.order_id, oi.id`,
      [orderIds]
    )

    const orderItems = itemsResult.rows as OrderItemRow[]

    const itemsByOrder: Record<number, OrderItem[]> = {}
    orderItems.forEach((item) => {
      if (!itemsByOrder[item.order_id]) {
        itemsByOrder[item.order_id] = []
      }
      itemsByOrder[item.order_id].push({
        book_id: item.book_id,
        book_option_id: item.book_option_id,
        quantity: item.quantity,
        price: item.price,
        name: item.name,
        image: item.image,
        option_type: item.option_type
      })
    })

    const ordersWithItems: OrderWithItems[] = orders.map((order) => ({
      id: order.id,
      payment_status: order.payment_status,
      order_status: order.order_status,
      total_price: order.total_price,
      created_at: order.created_at,
      updated_at: order.updated_at,
      items: itemsByOrder[order.id] || []
    }))

    return NextResponse.json({
      success: true,
      orders: ordersWithItems
    })

  } catch (error: unknown) {
    console.error("Error fetching orders:", error)
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    )
  }
}