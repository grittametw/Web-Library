import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import { dbConfig } from '@/database';

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();

        const connection = await mysql.createConnection(dbConfig);
        const [rows]: any = await connection.execute(
            'SELECT id, email, name, role, password_hash FROM admins WHERE email = ? LIMIT 1',
            [email]
        );
        await connection.end();

        if (!rows.length) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        const admin = rows[0];

        const isMatch = await bcrypt.compare(password, admin.password_hash);
        if (!isMatch) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        return NextResponse.json({
            id: admin.id,
            email: admin.email,
            name: admin.name,
            role: admin.role,
        });
    } catch (error: any) {
        console.error('Error during admin login:', error.message);
        return NextResponse.json(
            { error: 'Error during admin login', details: error.message },
            { status: 500 }
        );
    }
}