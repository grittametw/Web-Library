import { NextRequest, NextResponse } from 'next/server'
import { getPool } from '@/config/db'
import bcrypt from 'bcryptjs'

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function isValidPassword(password: string) {
  return password.length >= 6
}

export async function POST(req: NextRequest) {
  try {
    const { email, password, name } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
    }
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
    }
    if (!isValidPassword(password)) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 })
    }

    const pool = getPool()

    const hashedPassword = await bcrypt.hash(password, 12)

    const insertResult = await pool.query(
      'INSERT INTO users (email, password, name, created_at) VALUES ($1, $2, $3, NOW()) RETURNING id, email, name',
      [email, hashedPassword, name || null]
    )

    const userData = insertResult.rows[0]

    return NextResponse.json(
      {
        message: 'User registered successfully',
        user: { 
          id: userData.id, 
          email: userData.email, 
          name: userData.name || undefined 
        },
      },
      { status: 201 }
    )
  } catch (error: unknown) {
    console.error('Registration error:', error)
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 })
  }
}