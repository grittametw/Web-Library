import { NextResponse } from "next/server"
import { getPool } from "@/config/db"
import { GuestAddress } from "@/types/address"

interface OrderRow {
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
  items_count: number
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search') || ''

    const pool = getPool()

    let query = `
      SELECT 
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
        u.name as user_name,
        COUNT(oi.id) as items_count
      FROM user_orders o
      LEFT JOIN users u ON o.user_id = u.id
      LEFT JOIN user_order_items oi ON o.id = oi.order_id
    `

    const params: string[] = []

    if (search) {
      query += ` WHERE (
        CAST(o.id AS TEXT) ILIKE $1 
        OR u.name ILIKE $1
        OR o.guest_email ILIKE $1
        OR CAST(o.guest_address->>'first_name' AS TEXT) ILIKE $1
        OR CAST(o.guest_address->>'last_name' AS TEXT) ILIKE $1
      )`
      params.push(`%${search}%`)
    }

    query += ` GROUP BY o.id, u.name ORDER BY o.created_at DESC`

    const result = await pool.query(query, params)
    const orders = result.rows as OrderRow[]

    const formattedOrders = orders.map(order => {
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

      return {
        id: order.id,
        user_id: order.user_id,
        address_id: order.address_id,
        customer_name: customerName,
        payment_status: order.payment_status,
        order_status: order.order_status,
        total_price: order.total_price,
        items_count: parseInt(order.items_count.toString()),
        created_at: order.created_at,
        updated_at: order.updated_at
      }
    })

    return NextResponse.json({
      success: true,
      orders: formattedOrders
    })

  } catch (error: unknown) {
    console.error("Error fetching orders:", error)
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    )
  }
}