import { NextResponse } from "next/server"
import { getPool } from '@/config/db'
import { ShippingAddress } from "@/types/address"
import { CartItem } from "@/types/cart"
import mysql from "mysql2/promise"

interface RequestBody {
    userId?: number
    addressId?: number
    guestEmail?: string
    guestAddress?: ShippingAddress
    cartItems: CartItem[]
    totalPrice: number
}

interface BookOptionRow extends mysql.RowDataPacket {
    stock: number
    price: number
}

interface OrderInsertResult extends mysql.ResultSetHeader {
    insertId: number
}

export async function POST(req: Request) {
    const pool = getPool()
    let connection: mysql.PoolConnection | null = null

    try {
        connection = await pool.getConnection()
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

        await connection.beginTransaction()

        for (const item of cartItems) {
            const [rows] = await connection.execute<BookOptionRow[]>(
                `SELECT stock, price FROM book_options WHERE id = ? AND book_id = ?`,
                [item.book_option_id, item.book_id]
            )

            if (rows.length === 0) {
                await connection.rollback()
                return NextResponse.json(
                    { error: `Book option ${item.book_option_id} not found` },
                    { status: 404 }
                )
            }

            const bookOption = rows[0]

            if (bookOption.stock < item.quantity) {
                await connection.rollback()
                return NextResponse.json(
                    { error: `Insufficient stock for ${item.name}. Available: ${bookOption.stock}` },
                    { status: 400 }
                )
            }

            if (Math.abs(bookOption.price - item.price) > 0.01) {
                await connection.rollback()
                return NextResponse.json(
                    { error: `Price mismatch for ${item.name}` },
                    { status: 400 }
                )
            }
        }

        const [orderResult] = await connection.execute<OrderInsertResult>(
            `INSERT INTO user_orders 
        (user_id, address_id, guest_email, guest_address, payment_status, order_status, total_price, created_at, updated_at) 
        VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
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

        const orderId = orderResult.insertId

        for (const item of cartItems) {
            await connection.execute(
                `INSERT INTO user_order_items 
            (order_id, book_id, book_option_id, quantity, price) 
            VALUES (?, ?, ?, ?, ?)`,
                [orderId, item.book_id, item.book_option_id, item.quantity, item.price]
            )

            await connection.execute(
                `UPDATE book_options 
            SET stock = stock - ? 
            WHERE id = ? AND book_id = ?`,
                [item.quantity, item.book_option_id, item.book_id]
            )
        }

        if (userId) {
            await connection.execute(
                `DELETE FROM user_cart WHERE user_id = ?`,
                [userId]
            )
        }

        await connection.commit()

        return NextResponse.json({
            success: true,
            orderId,
            message: "Order created successfully"
        })

    } catch (error: unknown) {
        if (connection) {
            await connection.rollback()
        }
        console.error("Error creating order:", error)
        return NextResponse.json(
            { error: "Failed to create order" },
            { status: 500 }
        )
    } finally {
        if (connection) {
            connection.release()
        }
    }
}