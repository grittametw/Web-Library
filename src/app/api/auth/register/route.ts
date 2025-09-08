import { NextRequest, NextResponse } from 'next/server';
import { getPool } from '@/config/db';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}
function isValidPassword(password: string) {
  return password.length >= 6;
}

export async function POST(req: NextRequest) {
  try {
    const { email, password, name } = await req.json()

    if (!email || !password) return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
    if (!isValidEmail(email)) return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
    if (!isValidPassword(password)) return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 })

    const pool = getPool()

    const [existingUsers] = await pool.execute<mysql.RowDataPacket[]>(
      'SELECT id FROM users WHERE email = ? LIMIT 1',
      [email]
    )
    if (existingUsers.length > 0) return NextResponse.json({ error: 'Email already exists' }, { status: 409 })

    const hashedPassword = await bcrypt.hash(password, 12)

    const [result] = await pool.execute<mysql.ResultSetHeader>(
      'INSERT INTO users (email, password, name, created_at) VALUES (?, ?, ?, NOW())',
      [email, hashedPassword, name || null]
    )

    const insertId = result.insertId

    const [newUser] = await pool.execute<mysql.RowDataPacket[]>(
      'SELECT id, email, name FROM users WHERE id = ?',
      [insertId]
    )

    const userData = newUser[0]
    return NextResponse.json({
      message: 'User registered successfully',
      user: { id: userData.id, email: userData.email, name: userData.name || undefined }
    }, { status: 201 })

  } catch (error: any) {
    console.error('Registration error:', error)
    let errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: 'Registration failed', details: errorMessage }, { status: 500 })
  }
}
