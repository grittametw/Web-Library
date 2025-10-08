import { NextResponse } from "next/server"
import { getPool } from '@/config/db'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    
    // Omise webhook payload
    const { key, data } = body

    // Only process charge events
    if (key !== 'charge.complete' && key !== 'charge.create') {
      return NextResponse.json({ message: "Event ignored" })
    }

    const chargeId = data.id
    const chargeStatus = data.status
    const paid = data.paid

    // Determine payment status
    let paymentStatus: 'pending' | 'successful' | 'failed' = 'pending'
    if (paid && chargeStatus === 'successful') {
      paymentStatus = 'successful'
    } else if (chargeStatus === 'failed') {
      paymentStatus = 'failed'
    }

    // Determine order status
    let orderStatus = 'pending'
    if (paymentStatus === 'successful') {
      orderStatus = 'processing'
    }

    // Update order in database
    const pool = getPool()
    const connection = await pool.getConnection()
    
    try {
      await connection.query(
        `UPDATE user_orders 
         SET payment_status = ?, order_status = ?, updated_at = NOW() 
         WHERE charge_id = ?`,
        [paymentStatus, orderStatus, chargeId]
      )

      console.log(`Order updated: charge_id=${chargeId}, payment_status=${paymentStatus}, order_status=${orderStatus}`)

      return NextResponse.json({ 
        message: "Webhook processed successfully",
        chargeId,
        paymentStatus,
        orderStatus
      })

    } finally {
      connection.release()
    }

  } catch (error: unknown) {
    console.error("Webhook error:", error)
    return NextResponse.json(
      { error: "Failed to process webhook" },
      { status: 500 }
    )
  }
}