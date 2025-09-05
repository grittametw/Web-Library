import { NextRequest, NextResponse } from 'next/server';
import { dbConfig } from '@/database';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';

interface AdminRow {
  id: number
  email: string
  name: string
  role: string
  password: string
}

interface UserRow {
  id: number
  email: string
  name: string
  role: string
  password: string
}

interface LoginRequest {
  email: string
  password: string
}

interface LoginResponse {
  id: number
  email: string
  name: string
  role: string
}

export async function POST(req: NextRequest) {
  let connection: mysql.Connection | null = null
  
  try {
    const body: LoginRequest = await req.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' }, 
        { status: 400 }
      )
    }

    connection = await mysql.createConnection(dbConfig)

    const [adminRows] = await connection.execute<mysql.RowDataPacket[]>(
      'SELECT id, email, name, role, password FROM admins WHERE email = ? LIMIT 1',
      [email]
    )
    
    if (adminRows.length > 0) {
      const admin = adminRows[0] as AdminRow
      const isMatch = await bcrypt.compare(password, admin.password)
      
      if (!isMatch) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
      }

      const response: LoginResponse = {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: 'admin',
      }

      return NextResponse.json(response)
    }

    const [userRows] = await connection.execute<mysql.RowDataPacket[]>(
      'SELECT id, email, name, role, password FROM users WHERE email = ? LIMIT 1',
      [email]
    )

    if (userRows.length === 0) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const user = userRows[0] as UserRow
    const isMatch = await bcrypt.compare(password, user.password)
    
    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const response: LoginResponse = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: 'user',
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('Login error:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    
    return NextResponse.json(
      { error: 'Error during login', details: errorMessage },
      { status: 500 }
    )
  } finally {
    if (connection) {
      await connection.end()
    }
  }
}