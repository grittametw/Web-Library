import { NextResponse } from 'next/server';
import { dbConfig } from '@/database';
import mysql from 'mysql2/promise';

export async function GET(request: Request, { params }: { params: { name: string } }) {
    try {
        const connection = await mysql.createConnection(dbConfig)
        const [results] = await connection.execute(
            `SELECT b.id, b.name, b.author, b.image, b.rate, b.genre, b.description,
                    o.id as option_id, o.type as option_type, o.price, o.stock
            FROM books b
            LEFT JOIN book_options o ON b.id = o.book_id
            WHERE b.name = ?`,
            [decodeURIComponent(params.name)]
        )
        await connection.end()

        const rows = results as any[]
        if (Array.isArray(rows) && rows.length > 0) {
            const book = {
                id: rows[0].id,
                name: rows[0].name,
                author: rows[0].author,
                image: rows[0].image,
                rate: rows[0].rate,
                genre: rows[0].genre,
                description: rows[0].description,
                options: rows.filter(r => r.option_id).map(r => ({
                    id: r.option_id,
                    type: r.option_type,
                    price: r.price,
                    stock: r.stock
                }))
            }
            return NextResponse.json(book)
        } else {
            return NextResponse.json({ error: 'Book not found' }, { status: 404 })
        }
    } catch (error: any) {
        console.error('Error fetching book:', error.message)
        return NextResponse.json(
            { error: 'Error fetching book', details: error.message },
            { status: 500 }
        )
    }
}