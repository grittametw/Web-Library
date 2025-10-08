import { NextResponse } from "next/server"
import { getPool } from "@/config/db"
import { OrderItem, OrderRow, OrderItemRow } from "@/types/order"
import mysql from "mysql2/promise"

interface AddressRow extends mysql.RowDataPacket {
  first_name: string
  last_name: string
  address: string
  city: string
  state: string
  postal_code: string
  country: string
  phone_number: string
}

interface OrderShippingAddress {
  first_name: string
  last_name: string
  address: string
  city: string
  state: string
  postal_code: string
  country: string
  phone_number: string
}

interface OrderDetail {
  id: number
  payment_status: string
  order_status: string
  total_price: number
  created_at: Date
  updated_at: Date
  shipping_address: OrderShippingAddress | null
  items: OrderItem[]
}

interface RouteContext {
  params: Promise<{ id: string; orderId: string }>
}

export async function GET(
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

    const [orders] = await connection.execute<OrderRow[]>(
      `SELECT 
        id,
        user_id,
        address_id,
        payment_status,
        order_status,
        total_price,
        created_at,
        updated_at
       FROM user_orders
       WHERE id = ? AND user_id = ?`,
      [orderId, userId]
    )

    if (orders.length === 0) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      )
    }

    const order = orders[0]

    const [orderItems] = await connection.execute<OrderItemRow[]>(
      `SELECT 
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
       WHERE oi.order_id = ?
       ORDER BY oi.id`,
      [orderId]
    )

    let shippingAddress: OrderShippingAddress | null = null
    if (order.address_id) {
      const [addresses] = await connection.execute<AddressRow[]>(
        `SELECT 
          first_name,
          last_name,
          address,
          city,
          state,
          postal_code,
          country,
          phone_number
         FROM user_addresses
         WHERE id = ?`,
        [order.address_id]
      )

      if (addresses.length > 0) {
        shippingAddress = addresses[0]
      }
    }

    const orderDetail: OrderDetail = {
      id: order.id,
      payment_status: order.payment_status,
      order_status: order.order_status,
      total_price: order.total_price,
      created_at: order.created_at,
      updated_at: order.updated_at,
      shipping_address: shippingAddress,
      items: orderItems.map((item) => ({
        book_id: item.book_id,
        book_option_id: item.book_option_id,
        quantity: item.quantity,
        price: item.price,
        name: item.name,
        image: item.image,
        option_type: item.option_type
      }))
    }

    return NextResponse.json({
      success: true,
      order: orderDetail
    })

  } catch (error: unknown) {
    console.error("Error fetching order detail:", error)
    return NextResponse.json(
      { error: "Failed to fetch order detail" },
      { status: 500 }
    )
  } finally {
    if (connection) connection.release()
  }
}