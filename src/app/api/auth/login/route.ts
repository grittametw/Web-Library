import { NextRequest, NextResponse } from 'next/server'
import { getPool } from '@/config/db'
import bcrypt from 'bcryptjs'

interface AdminRow {
  id: number
  email: string
  name: string
  role: string
  password: string
  profile_picture: string | null
}

interface UserRow {
  id: number
  email: string
  name: string
  role: string
  password: string
  profile_picture: string | null
}

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    const pool = getPool()

    const adminResult = await pool.query(
      'SELECT id, email, name, role, password, profile_picture FROM admins WHERE email = $1 LIMIT 1',
      [email]
    )

    if (adminResult.rows.length > 0) {
      const admin = adminResult.rows[0] as AdminRow
      const isMatch = await bcrypt.compare(password, admin.password)
      if (!isMatch) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })

      return NextResponse.json({
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: 'admin',
        profilePicture: admin.profile_picture
      })
    }

    const userResult = await pool.query(
      'SELECT id, email, name, role, password, profile_picture FROM users WHERE email = $1 LIMIT 1',
      [email]
    )

    if (userResult.rows.length === 0) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const user = userResult.rows[0] as UserRow
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })

    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: 'user',
      profilePicture: user.profile_picture
    })
  } catch (error: unknown) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}