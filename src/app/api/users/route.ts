import { NextRequest, NextResponse } from 'next/server'
import { getPool } from '@/config/db'

interface User {
  id: number
  name: string
  email: string
  status: string
  created_at: string
}

export async function GET(req: NextRequest) {
  try {
    const pool = getPool()
    const result = await pool.query(
      `SELECT id, name, email, status, created_at 
       FROM users 
       ORDER BY created_at DESC`
    )

    const users: User[] = result.rows.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      status: user.status ? 'Active' : 'Inactive',
      created_at: new Date(user.created_at).toLocaleString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }))

    return NextResponse.json({ success: true, data: users })
  } catch (error: unknown) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email } = body

    if (!name || !email) {
      return NextResponse.json(
        { success: false, error: 'Name and email are required' },
        { status: 400 }
      )
    }

    const pool = getPool()
    const existingUser = await pool.query(
      `SELECT id FROM users WHERE email = $1`,
      [email]
    )

    if (existingUser.rows.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Email already exists' },
        { status: 400 }
      )
    }

    const result = await pool.query(
      `INSERT INTO users (name, email, role, status, created_at, updated_at) 
       VALUES ($1, $2, 'user', true, NOW(), NOW()) 
       RETURNING id`,
      [name, email]
    )

    return NextResponse.json({ 
      success: true, 
      message: 'User created successfully',
      data: { id: result.rows[0].id }
    })
  } catch (error: unknown) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create user' },
      { status: 500 }
    )
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, name, email } = body

    if (!id || !name || !email) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const pool = getPool()
    const existingUser = await pool.query(
      `SELECT id FROM users WHERE email = $1 AND id != $2`,
      [email, id]
    )

    if (existingUser.rows.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Email already exists' },
        { status: 400 }
      )
    }

    const result = await pool.query(
      `UPDATE users 
       SET name = $1, email = $2, updated_at = NOW() 
       WHERE id = $3
       RETURNING id`,
      [name, email, id]
    )

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      message: 'User updated successfully' 
    })
  } catch (error: unknown) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update user' },
      { status: 500 }
    )
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json()
    const { id } = body

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'User ID required' },
        { status: 400 }
      )
    }

    const pool = getPool()
    
    const checkUser = await pool.query(
      `SELECT id, role FROM users WHERE id = $1`,
      [id]
    )

    if (checkUser.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    if (checkUser.rows[0].role === 'admin') {
      return NextResponse.json(
        { success: false, error: 'Cannot delete admin user' },
        { status: 403 }
      )
    }

    await pool.query(`DELETE FROM users WHERE id = $1`, [id])

    return NextResponse.json({ 
      success: true, 
      message: 'User deleted successfully' 
    })
  } catch (error: unknown) {
    console.error('Error deleting user:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete user' },
      { status: 500 }
    )
  }
}