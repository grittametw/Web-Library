import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getPool } from '@/config/db'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    const pool = getPool()
    const userEmail = data.user.email

    const adminResult = await pool.query(
      'SELECT id, email, name, role, profile_picture FROM admins WHERE email = $1 LIMIT 1',
      [userEmail]
    )

    if (adminResult.rows.length > 0) {
      const admin = adminResult.rows[0]
      return NextResponse.json({
        token: data.session.access_token,
        refreshToken: data.session.refresh_token,
        user: {
          id: admin.id,
          email: admin.email,
          name: admin.name,
          role: 'admin',
          profilePicture: admin.profile_picture,
        },
      })
    }

    const userResult = await pool.query(
      'SELECT id, email, name, role, profile_picture FROM users WHERE email = $1 LIMIT 1',
      [userEmail]
    )

    if (userResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'User not found in database' },
        { status: 404 }
      )
    }

    const user = userResult.rows[0]
    return NextResponse.json({
      token: data.session.access_token,
      refreshToken: data.session.refresh_token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: 'user',
        profilePicture: user.profile_picture,
      },
    })
  } catch (error: unknown) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}