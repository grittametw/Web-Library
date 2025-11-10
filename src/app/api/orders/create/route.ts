import { NextResponse } from "next/server"
import { getPool } from '@/config/db'
import { ShippingAddress } from "@/types/address"
import { CartItem } from "@/types/cart"

interface RequestBody {
    userId?: number
    addressId?: number
    guestEmail?: string
    guestAddress?: ShippingAddress
    cartItems: CartItem[]
    totalPrice: number
}

interface BookOptionRow {
    stock: number
    price: number
}

export async function POST(req: Request) {
    const pool = getPool()
    const client = await pool.connect()

    try {
        const body: RequestBody = await req.json()
        const { userId, addressId, guestEmail, guestAddress, cartItems, totalPrice } = body

        if (!cartItems || cartItems.length === 0) {
            return NextResponse.json(
                { error: "Cart is empty" },
                { status: 400 }
            )
        }

        if (!userId && (!guestEmail || !guestAddress)) {
            return NextResponse.json(
                { error: "Guest must provide email and address" },
                { status: 400 }
            )
        }

        if (userId && !addressId) {
            return NextResponse.json(
                { error: "Logged-in user must provide address_id" },
                { status: 400 }
            )
        }

        await client.query('BEGIN')

        for (const item of cartItems) {
            const result = await client.query(
                `SELECT stock, price FROM book_options WHERE id = $1 AND book_id = $2`,
                [item.book_option_id, item.book_id]
            )

            if (result.rows.length === 0) {
                await client.query('ROLLBACK')
                return NextResponse.json(
                    { error: `Book option ${item.book_option_id} not found` },
                    { status: 404 }
                )
            }

            const bookOption = result.rows[0] as BookOptionRow

            if (bookOption.stock < item.quantity) {
                await client.query('ROLLBACK')
                return NextResponse.json(
                    { error: `Insufficient stock for ${item.name}. Available: ${bookOption.stock}` },
                    { status: 400 }
                )
            }

            if (Math.abs(bookOption.price - item.price) > 0.01) {
                await client.query('ROLLBACK')
                return NextResponse.json(
                    { error: `Price mismatch for ${item.name}` },
                    { status: 400 }
                )
            }
        }

        const orderResult = await client.query(
            `INSERT INTO user_orders 
            (user_id, address_id, guest_email, guest_address, payment_status, order_status, total_price, created_at, updated_at) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
            RETURNING id`,
            [
                userId || null,
                addressId || null,
                guestEmail || null,
                guestAddress ? JSON.stringify(guestAddress) : null,
                'pending',
                'pending',
                totalPrice
            ]
        )

        const orderId = orderResult.rows[0].id

        for (const item of cartItems) {
            await client.query(
                `INSERT INTO user_order_items 
                (order_id, book_id, book_option_id, quantity, price) 
                VALUES ($1, $2, $3, $4, $5)`,
                [orderId, item.book_id, item.book_option_id, item.quantity, item.price]
            )

            await client.query(
                `UPDATE book_options 
                SET stock = stock - $1 
                WHERE id = $2 AND book_id = $3`,
                [item.quantity, item.book_option_id, item.book_id]
            )
        }

        if (userId) {
            await client.query(
                `DELETE FROM user_cart WHERE user_id = $1`,
                [userId]
            )
        }

        await client.query('COMMIT')

        return NextResponse.json({
            success: true,
            orderId,
            message: "Order created successfully"
        })

    } catch (error: unknown) {
        await client.query('ROLLBACK')
        console.error("Error creating order:", error)
        return NextResponse.json(
            { error: "Failed to create order" },
            { status: 500 }
        )
    } finally {
        client.release()
    }
}