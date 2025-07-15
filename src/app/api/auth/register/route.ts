import { NextRequest } from 'next/server';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import { dbConfig } from '@/database';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return new Response(JSON.stringify({ error: 'Missing fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const connection = await mysql.createConnection(dbConfig)

    const [users]: any = await connection.execute(
      'SELECT id FROM users WHERE email = ?',
      [email]
    )
    if (users.length > 0) {
      await connection.end()
      return new Response(JSON.stringify({ error: 'Email already exists' }), {
        status: 409,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    await connection.execute(
      'INSERT INTO users (email, password) VALUES (?, ?)',
      [email, hashedPassword]
    )
    await connection.end()

    return new Response(JSON.stringify({ message: 'Register success' }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}