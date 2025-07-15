import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import { dbConfig } from '@/database';

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json()
        const connection = await mysql.createConnection(dbConfig)

        const [adminRows]: any = await connection.execute(
            'SELECT id, email, name, role, password FROM admins WHERE email = ? LIMIT 1',
            [email]
        )
        
        if (adminRows.length) {
            const admin = adminRows[0]
            const isMatch = await bcrypt.compare(password, admin.password)
            await connection.end()
            if (!isMatch) {
                return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
            }
            return NextResponse.json({
                id: admin.id,
                email: admin.email,
                name: admin.name,
                role: 'admin',
            })
        }

        const [userRows]: any = await connection.execute(
            'SELECT id, email, name, role, password FROM users WHERE email = ? LIMIT 1',
            [email]
        )
        await connection.end()

        if (!userRows.length) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
        }

        const user = userRows[0]
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
        }

        return NextResponse.json({
            id: user.id,
            email: user.email,
            name: user.name,
            role: 'user',
        })
    } catch (error: any) {
        return NextResponse.json(
            { error: 'Error during login', details: error.message },
            { status: 500 }
        )
    }
}