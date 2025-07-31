import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import { dbConfig } from '@/database';

export async function GET(request: Request, { params }: { params: { name: string } }) {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [results] = await connection.execute(
            'SELECT id, name, author, image, price, rate, genre FROM books WHERE name = ?',
            [decodeURIComponent(params.name)]
        );
        await connection.end();

        if (Array.isArray(results) && results.length > 0) {
            return NextResponse.json(results[0]);
        } else {
            return NextResponse.json({ error: 'Book not found' }, { status: 404 });
        }
    } catch (error: any) {
        console.error('Error fetching book:', error.message);
        return NextResponse.json(
            { error: 'Error fetching book', details: error.message },
            { status: 500 }
        );
    }
}