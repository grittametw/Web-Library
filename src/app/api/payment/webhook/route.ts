import { NextResponse } from "next/server"
import { getPool } from '@/config/db'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    
    const { key, data } = body

    if (key !== 'charge.complete' && key !== 'charge.create') {
      return NextResponse.json({ message: "Event ignored" })
    }

    const chargeId = data.id
    const chargeStatus = data.status
    const paid = data.paid

    let paymentStatus: 'pending' | 'successful' | 'failed' = 'pending'
    if (paid && chargeStatus === 'successful') {
      paymentStatus = 'successful'
    } else if (chargeStatus === 'failed') {
      paymentStatus = 'failed'
    }

    let orderStatus = 'pending'
    if (paymentStatus === 'successful') {
      orderStatus = 'processing'
    }

    const pool = getPool()
    
    const result = await pool.query(
      `UPDATE user_orders 
       SET payment_status = $1, order_status = $2, updated_at = NOW() 
       WHERE charge_id = $3`,
      [paymentStatus, orderStatus, chargeId]
    )

    console.log(`Order updated: charge_id=${chargeId}, payment_status=${paymentStatus}, order_status=${orderStatus}`)
    console.log(`Rows affected: ${result.rowCount}`)

    return NextResponse.json({ 
      message: "Webhook processed successfully",
      chargeId,
      paymentStatus,
      orderStatus,
      rowsAffected: result.rowCount
    })

  } catch (error: unknown) {
    console.error("Webhook error:", error)
    return NextResponse.json(
      { error: "Failed to process webhook" },
      { status: 500 }
    )
  }
}