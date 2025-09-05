import { NextRequest, NextResponse } from 'next/server';
import { dbConfig } from '@/database';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';

interface RegisterRequest {
  email: string
  password: string
  name?: string
}

interface RegisterResponse {
  message: string
  user?: {
    id: number
    email: string
    name?: string
  }
}

interface ErrorResponse {
  error: string
  details?: string
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

function isValidPassword(password: string): boolean {
  return password.length >= 6
}

export async function POST(request: NextRequest) {
  let connection: mysql.Connection | null = null

  try {
    const body: RegisterRequest = await request.json()
    const { email, password, name } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' } as ErrorResponse,
        { status: 400 }
      )
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' } as ErrorResponse,
        { status: 400 }
      )
    }

    if (!isValidPassword(password)) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' } as ErrorResponse,
        { status: 400 }
      )
    }

    connection = await mysql.createConnection(dbConfig)

    const [existingUsers] = await connection.execute<mysql.RowDataPacket[]>(
      'SELECT id FROM users WHERE email = ? LIMIT 1',
      [email]
    )

    if (existingUsers.length > 0) {
      return NextResponse.json(
        { error: 'Email already exists' } as ErrorResponse,
        { status: 409 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const [result] = await connection.execute<mysql.ResultSetHeader>(
      'INSERT INTO users (email, password, name, created_at) VALUES (?, ?, ?, NOW())',
      [email, hashedPassword, name || null]
    )

    const insertId = result.insertId

    const [newUser] = await connection.execute<mysql.RowDataPacket[]>(
      'SELECT id, email, name FROM users WHERE id = ?',
      [insertId]
    )

    const userData = newUser[0] as { id: number, email: string, name: string | null }

    const response: RegisterResponse = {
      message: 'User registered successfully',
      user: {
        id: userData.id,
        email: userData.email,
        name: userData.name || undefined,
      }
    }

    return NextResponse.json(response, { status: 201 })

  } catch (error) {
    console.error('Registration error:', error)

    let errorMessage = 'Unknown error occurred during registration'
    
    if (error instanceof Error) {
      errorMessage = error.message
      if ('code' in error) {
        switch (error.code) {
          case 'ER_DUP_ENTRY':
            return NextResponse.json(
              { error: 'Email already exists' } as ErrorResponse,
              { status: 409 }
            )
          case 'ER_ACCESS_DENIED_ERROR':
            errorMessage = 'Database access denied'
            break
          case 'ECONNREFUSED':
            errorMessage = 'Database connection refused'
            break
          default:
            errorMessage = 'Database error occurred'
        }
      }
    }

    const errorResponse: ErrorResponse = {
      error: 'Registration failed',
      details: errorMessage,
    }

    return NextResponse.json(errorResponse, { status: 500 })

  } finally {
    if (connection) {
      try {
        await connection.end()
      } catch (closeError) {
        console.error('Error closing database connection:', closeError)
      }
    }
  }
}