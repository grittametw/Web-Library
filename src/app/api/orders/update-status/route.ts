import { NextResponse } from "next/server"
import { getPool } from '@/config/db'

interface RequestBody {
    orderId: number
    chargeId: string
    paymentStatus: 'pending' | 'successful' | 'failed'
}

export async function PUT(req: Request) {
    try {
        const body: RequestBody = await req.json()
        const { orderId, chargeId, paymentStatus } = body

        if (!orderId || !chargeId || !paymentStatus) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            )
        }

        const pool = getPool()

        let orderStatus = 'pending'
        if (paymentStatus === 'successful') {
            orderStatus = 'processing'
        } else if (paymentStatus === 'failed') {
            orderStatus = 'pending'
        }

        const result = await pool.query(
            `UPDATE user_orders 
             SET charge_id = $1, payment_status = $2, order_status = $3, updated_at = NOW() 
             WHERE id = $4`,
            [chargeId, paymentStatus, orderStatus, orderId]
        )

        console.log(`Order ${orderId} updated: payment=${paymentStatus}, order=${orderStatus}, rows affected: ${result.rowCount}`)

        if (result.rowCount === 0) {
            return NextResponse.json(
                { error: "Order not found" },
                { status: 404 }
            )
        }

        return NextResponse.json({
            success: true,
            message: "Order status updated successfully"
        })

    } catch (error: unknown) {
        console.error("Error updating order status:", error)
        return NextResponse.json(
            { error: "Failed to update order status" },
            { status: 500 }
        )
    }
}