import { NextResponse } from 'next/server';
import { dbConfig } from '@/database';
import mysql from 'mysql2/promise';

export async function GET() {
    try {
        const connection = await mysql.createConnection(dbConfig)
        const [results] = await connection.execute(
            `SELECT b.id, b.name, b.author, b.image, b.rate, b.genre, b.description,
                    o.id as option_id, o.type as option_type, o.price, o.stock
            FROM books b
            LEFT JOIN book_options o ON b.id = o.book_id`
        )
        await connection.end()

        function groupBooks(rows: any[]) {
            const map = new Map()
            rows.forEach(row => {
                if (!map.has(row.id)) {
                    map.set(row.id, {
                        id: row.id,
                        name: row.name,
                        author: row.author,
                        image: row.image,
                        rate: row.rate,
                        genre: row.genre,
                        description: row.description,
                        options: []
                    })
                }
                if (row.option_id) {
                    map.get(row.id).options.push({
                        id: row.option_id,
                        type: row.option_type,
                        price: row.price,
                        stock: row.stock
                    })
                }
            })
            return Array.from(map.values())
        }
        return NextResponse.json(groupBooks(results as any[]))
    } catch (error: any) {
        console.error('Error fetching data:', error.message)
        return NextResponse.json(
            { error: 'Error fetching data', details: error.message },
            { status: 500 }
        )
    }
}