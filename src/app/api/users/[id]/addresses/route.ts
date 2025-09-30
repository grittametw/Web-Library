import { NextRequest, NextResponse } from 'next/server'
import { DbUserAddress } from '@/types/address'
import { getPool } from '@/config/db'
import mysql from 'mysql2/promise'

interface CreateAddressRequest {
  first_name: string
  last_name: string
  address: string
  city: string
  state: string
  postal_code: string
  country: string
  phone_number?: string
  is_default?: boolean
}

interface UpdateAddressRequest extends CreateAddressRequest {
  id: number
}

interface RouteContext {
  params: Promise<{ id: string }>
}

export async function GET(
  req: NextRequest,
  context: RouteContext
) {
  let connection: mysql.PoolConnection | null = null

  try {
    const params = await context.params
    const userId = parseInt(params.id, 10)
    if (isNaN(userId)) {
      return NextResponse.json({ error: 'Invalid User ID' }, { status: 400 })
    }

    const pool = getPool()
    connection = await pool.getConnection()

    const [results] = await connection.execute<mysql.RowDataPacket[]>(
      `SELECT ua.*, u.email 
       FROM user_addresses ua
       JOIN users u ON ua.user_id = u.id
       WHERE ua.user_id = ?
       ORDER BY ua.is_default DESC, ua.created_at DESC`,
      [userId]
    )

    const addresses = results as (DbUserAddress & { email: string })[]

    return NextResponse.json({
      success: true,
      addresses: addresses || []
    })
  } catch (error: unknown) {
    console.error("Error fetching addresses:", error)
    return NextResponse.json(
      { error: "Failed to fetch addresses" },
      { status: 500 }
    )
  } finally {
    if (connection) connection.release()
  }
}

export async function POST(
  req: NextRequest,
  context: RouteContext
) {
  let connection: mysql.PoolConnection | null = null

  try {
    const body: CreateAddressRequest = await req.json()
    const params = await context.params
    const userId = parseInt(params.id, 10)
    if (isNaN(userId)) {
      return NextResponse.json({ error: 'Invalid User ID' }, { status: 400 })
    }

    const {
      first_name,
      last_name,
      address,
      city,
      state,
      postal_code,
      country,
      phone_number,
      is_default = false
    } = body

    if (!first_name || !last_name || !address || !city || !state || !postal_code || !country || !phone_number) {
      return NextResponse.json(
        { error: 'All address fields are required' },
        { status: 400 }
      )
    }

    const pool = getPool()
    connection = await pool.getConnection()

    if (is_default) {
      await connection.execute(
        'UPDATE user_addresses SET is_default = FALSE WHERE user_id = ?',
        [userId]
      )
    } else {
      const [existingResults] = await connection.execute<mysql.RowDataPacket[]>(
        'SELECT id FROM user_addresses WHERE user_id = ? AND is_default = TRUE',
        [userId]
      )

      const existingAddresses = existingResults as DbUserAddress[]

      if (!existingAddresses || existingAddresses.length === 0) {
        body.is_default = true
      }
    }

    const [result] = await connection.execute<mysql.ResultSetHeader>(
      `INSERT INTO user_addresses 
      (user_id, first_name, last_name, address, city, state, postal_code, country, phone_number, is_default, created_at, updated_at) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [userId, first_name, last_name, address, city, state, postal_code, country, phone_number, body.is_default]
    )

    const [newAddressResults] = await connection.execute<mysql.RowDataPacket[]>(
      'SELECT * FROM user_addresses WHERE id = ?',
      [result.insertId]
    )

    const newAddresses = newAddressResults as DbUserAddress[]

    return NextResponse.json({
      success: true,
      message: 'Address created successfully',
      address: newAddresses?.[0] || null
    }, { status: 201 })
  } catch (error: unknown) {
    console.error("Error creating address:", error)
    return NextResponse.json(
      { error: "Failed to create address" },
      { status: 500 }
    )
  } finally {
    if (connection) connection.release()
  }
}

export async function PUT(
  req: NextRequest,
  context: RouteContext
) {
  let connection: mysql.PoolConnection | null = null

  try {
    const body: UpdateAddressRequest = await req.json()
    const params = await context.params
    const userId = parseInt(params.id, 10)
    if (isNaN(userId)) {
      return NextResponse.json({ error: 'Invalid User ID' }, { status: 400 })
    }

    const {
      id: addressId,
      first_name,
      last_name,
      address,
      city,
      state,
      postal_code,
      country,
      phone_number,
      is_default = false
    } = body

    if (!addressId || !first_name || !last_name || !address || !city || !state || !postal_code || !country || !phone_number) {
      return NextResponse.json(
        { error: 'Address ID and all address fields are required' },
        { status: 400 }
      )
    }

    const pool = getPool()
    connection = await pool.getConnection()

    const [existingResults] = await connection.execute<mysql.RowDataPacket[]>(
      'SELECT * FROM user_addresses WHERE id = ? AND user_id = ?',
      [addressId, userId]
    )

    const existingAddress = existingResults as DbUserAddress[]

    if (!existingAddress || existingAddress.length === 0) {
      return NextResponse.json(
        { error: 'Address not found or access denied' },
        { status: 404 }
      )
    }

    if (is_default) {
      await connection.execute(
        'UPDATE user_addresses SET is_default = FALSE WHERE user_id = ? AND id != ?',
        [userId, addressId]
      )
    }

    await connection.execute(
      `UPDATE user_addresses 
       SET first_name = ?, last_name = ?, address = ?, city = ?, state = ?, 
       postal_code = ?, country = ?, phone_number = ?, is_default = ?, updated_at = NOW()
       WHERE id = ? AND user_id = ?`,
      [first_name, last_name, address, city, state, postal_code, country, phone_number, is_default, addressId, userId]
    )

    const [updatedResults] = await connection.execute<mysql.RowDataPacket[]>(
      'SELECT * FROM user_addresses WHERE id = ?',
      [addressId]
    )

    const updatedAddress = updatedResults as DbUserAddress[]

    return NextResponse.json({
      success: true,
      message: 'Address updated successfully',
      address: updatedAddress?.[0] || null
    })
  } catch (error: unknown) {
    console.error("Error updating address:", error)
    return NextResponse.json(
      { error: "Failed to update address" },
      { status: 500 }
    )
  } finally {
    if (connection) connection.release()
  }
}

export async function DELETE(
  req: NextRequest,
  context: RouteContext
) {
  let connection: mysql.PoolConnection | null = null

  try {
    const { searchParams } = new URL(req.url)
    const params = await context.params
    const userId = parseInt(params.id, 10)
    const addressId = parseInt(searchParams.get('addressId') || '', 10)

    if (isNaN(userId)) {
      return NextResponse.json({ error: 'Invalid User ID' }, { status: 400 })
    }
    if (isNaN(addressId)) {
      return NextResponse.json({ error: 'Invalid Address ID' }, { status: 400 })
    }

    const pool = getPool()
    connection = await pool.getConnection()

    const [existingResults] = await connection.execute<mysql.RowDataPacket[]>(
      'SELECT * FROM user_addresses WHERE id = ? AND user_id = ?',
      [addressId, userId]
    )

    const existingAddress = existingResults as DbUserAddress[]

    if (!existingAddress || existingAddress.length === 0) {
      return NextResponse.json(
        { error: 'Address not found or access denied' },
        { status: 404 }
      )
    }

    const wasDefault = existingAddress[0].is_default

    await connection.execute(
      'DELETE FROM user_addresses WHERE id = ? AND user_id = ?',
      [addressId, userId]
    )

    if (wasDefault) {
      const [remainingResults] = await connection.execute<mysql.RowDataPacket[]>(
        'SELECT id FROM user_addresses WHERE user_id = ? ORDER BY created_at ASC LIMIT 1',
        [userId]
      )

      const remainingAddresses = remainingResults as DbUserAddress[]

      if (remainingAddresses && remainingAddresses.length > 0) {
        await connection.execute(
          'UPDATE user_addresses SET is_default = TRUE WHERE id = ?',
          [remainingAddresses[0].id]
        )
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Address deleted successfully'
    })
  } catch (error: unknown) {
    console.error("Error deleting address:", error)
    return NextResponse.json(
      { error: "Failed to delete address" },
      { status: 500 }
    )
  } finally {
    if (connection) connection.release()
  }
}
