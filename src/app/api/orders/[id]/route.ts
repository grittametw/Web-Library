import { NextResponse } from "next/server"
import { getPool } from "@/config/db"
import { OrderItemRow } from "@/types/order"
import { AddressRow, GuestAddress } from "@/types/address"

interface RouteContext {
  params: Promise<{ id: string }>
}

interface OrderDetailRow {
  id: number
  user_id: number | null
  address_id: number | null
  guest_email: string | null
  guest_address: GuestAddress | null
  payment_status: string
  order_status: string
  total_price: number
  created_at: Date
  updated_at: Date
  user_name: string | null
}

type PaymentStatus = 'pending' | 'successful' | 'failed'
type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'

export async function GET(
  req: Request,
  context: RouteContext
) {
  try {
    const params = await context.params
    const orderId = parseInt(params.id, 10)

    if (!orderId || isNaN(orderId)) {
      return NextResponse.json(
        { error: "Invalid order ID" },
        { status: 400 }
      )
    }

    const pool = getPool()

    const orderResult = await pool.query(
      `SELECT 
        o.id,
        o.user_id,
        o.address_id,
        o.guest_email,
        o.guest_address,
        o.payment_status,
        o.order_status,
        o.total_price,
        o.created_at,
        o.updated_at,
        u.name as user_name
       FROM user_orders o
       LEFT JOIN users u ON o.user_id = u.id
       WHERE o.id = $1`,
      [orderId]
    )

    if (orderResult.rows.length === 0) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      )
    }

    const order = orderResult.rows[0] as OrderDetailRow

    const itemsResult = await pool.query(
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
       WHERE oi.order_id = $1
       ORDER BY oi.id`,
      [orderId]
    )

    const items = itemsResult.rows as OrderItemRow[]

    let shippingAddress: AddressRow | GuestAddress | null = null
    
    if (order.address_id) {
      const addressResult = await pool.query(
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
         WHERE id = $1`,
        [order.address_id]
      )
      
      if (addressResult.rows.length > 0) {
        shippingAddress = addressResult.rows[0] as AddressRow
      }
    } else if (order.guest_address) {
      shippingAddress = order.guest_address
    }

    let customerName = 'Unknown'
    if (order.user_name) {
      customerName = order.user_name
    } else if (order.guest_address) {
      const guestAddr = order.guest_address
      const firstName = guestAddr.first_name || ''
      const lastName = guestAddr.last_name || ''
      customerName = `${firstName} ${lastName}`.trim() + ' (Guest)'
    } else if (order.guest_email) {
      customerName = `${order.guest_email} (Guest)`
    }

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        customer_name: customerName,
        payment_status: order.payment_status,
        order_status: order.order_status,
        total_price: order.total_price,
        payment_method: 'Promptpay',
        created_at: order.created_at,
        updated_at: order.updated_at,
        items: items,
        shipping_address: shippingAddress
      }
    })

  } catch (error: unknown) {
    console.error("Error fetching order details:", error)
    return NextResponse.json(
      { error: "Failed to fetch order details" },
      { status: 500 }
    )
  }
}

export async function PATCH(
  req: Request,
  context: RouteContext
) {
  try {
    const params = await context.params
    const orderId = parseInt(params.id, 10)

    if (!orderId || isNaN(orderId)) {
      return NextResponse.json(
        { error: "Invalid order ID" },
        { status: 400 }
      )
    }

    const body = await req.json()
    const { payment_status, order_status } = body

    const pool = getPool()

    const updates: string[] = []
    const values: (string | number)[] = []
    let paramCount = 1

    if (payment_status) {
      const validPaymentStatuses: PaymentStatus[] = ['pending', 'successful', 'failed']
      if (!validPaymentStatuses.includes(payment_status)) {
        return NextResponse.json(
          { error: "Invalid payment status" },
          { status: 400 }
        )
      }
      updates.push(`payment_status = $${paramCount}`)
      values.push(payment_status)
      paramCount++
    }

    if (order_status) {
      const validOrderStatuses: OrderStatus[] = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
      if (!validOrderStatuses.includes(order_status)) {
        return NextResponse.json(
          { error: "Invalid order status" },
          { status: 400 }
        )
      }
      updates.push(`order_status = $${paramCount}`)
      values.push(order_status)
      paramCount++
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 }
      )
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`)
    values.push(orderId)

    const query = `
      UPDATE user_orders 
      SET ${updates.join(', ')}
      WHERE id = $${paramCount}
      RETURNING id, payment_status, order_status, updated_at
    `

    const result = await pool.query(query, values)

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      order: result.rows[0]
    })

  } catch (error: unknown) {
    console.error("Error updating order:", error)
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    )
  }
}