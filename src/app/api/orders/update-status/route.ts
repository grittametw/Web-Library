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
        const connection = await pool.getConnection()

        try {
            let orderStatus = 'pending'
            if (paymentStatus === 'successful') {
                orderStatus = 'processing'
            } else if (paymentStatus === 'failed') {
                orderStatus = 'pending'
            }

            await connection.query(
                `UPDATE user_orders 
            SET charge_id = ?, payment_status = ?, order_status = ?, updated_at = NOW() 
            WHERE id = ?`,
                [chargeId, paymentStatus, orderStatus, orderId]
            )

            return NextResponse.json({
                success: true,
                message: "Order status updated successfully"
            })

        } finally {
            connection.release()
        }

    } catch (error: unknown) {
        console.error("Error updating order status:", error)
        return NextResponse.json(
            { error: "Failed to update order status" },
            { status: 500 }
        )
    }
}