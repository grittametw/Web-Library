import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import { dbConfig } from '@/database';

export async function GET() {
    try {
        const connection = await mysql.createConnection(dbConfig)
        const [results] = await connection.execute(
            'SELECT id, name, author, image, price, rate FROM books'
        );
        await connection.end()

        return NextResponse.json(results)
    } catch (error: any) {
        console.error('Error fetching data:', error.message)
        return NextResponse.json(
            { error: 'Error fetching data', details: error.message },
            { status: 500 }
        );
    }
}