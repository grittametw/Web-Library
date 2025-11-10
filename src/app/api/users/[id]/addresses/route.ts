import { NextRequest, NextResponse } from 'next/server'
import { DbUserAddress } from '@/types/address'
import { getPool } from '@/config/db'

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
  try {
    const params = await context.params
    const userId = parseInt(params.id, 10)
    if (isNaN(userId)) {
      return NextResponse.json({ error: 'Invalid User ID' }, { status: 400 })
    }

    const pool = getPool()

    const result = await pool.query(
      `SELECT ua.*, u.email 
       FROM user_addresses ua
       JOIN users u ON ua.user_id = u.id
       WHERE ua.user_id = $1
       ORDER BY ua.is_default DESC, ua.created_at DESC`,
      [userId]
    )

    const addresses = result.rows as (DbUserAddress & { email: string })[]

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
  }
}

export async function POST(
  req: NextRequest,
  context: RouteContext
) {
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

    const client = await pool.connect()
    try {
      await client.query('BEGIN')

      if (is_default) {
        await client.query(
          'UPDATE user_addresses SET is_default = FALSE WHERE user_id = $1',
          [userId]
        )
      } else {
        const existingResult = await client.query(
          'SELECT id FROM user_addresses WHERE user_id = $1 AND is_default = TRUE',
          [userId]
        )

        if (existingResult.rows.length === 0) {
          body.is_default = true
        }
      }

      const insertResult = await client.query(
        `INSERT INTO user_addresses 
        (user_id, first_name, last_name, address, city, state, postal_code, country, phone_number, is_default, created_at, updated_at) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW())
        RETURNING *`,
        [userId, first_name, last_name, address, city, state, postal_code, country, phone_number, body.is_default]
      )

      await client.query('COMMIT')

      return NextResponse.json({
        success: true,
        message: 'Address created successfully',
        address: insertResult.rows[0] || null
      }, { status: 201 })
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }
  } catch (error: unknown) {
    console.error("Error creating address:", error)
    return NextResponse.json(
      { error: "Failed to create address" },
      { status: 500 }
    )
  }
}

export async function PUT(
  req: NextRequest,
  context: RouteContext
) {
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
    const client = await pool.connect()

    try {
      await client.query('BEGIN')

      const existingResult = await client.query(
        'SELECT * FROM user_addresses WHERE id = $1 AND user_id = $2',
        [addressId, userId]
      )

      if (existingResult.rows.length === 0) {
        return NextResponse.json(
          { error: 'Address not found or access denied' },
          { status: 404 }
        )
      }

      if (is_default) {
        await client.query(
          'UPDATE user_addresses SET is_default = FALSE WHERE user_id = $1 AND id != $2',
          [userId, addressId]
        )
      }

      await client.query(
        `UPDATE user_addresses 
         SET first_name = $1, last_name = $2, address = $3, city = $4, state = $5, 
         postal_code = $6, country = $7, phone_number = $8, is_default = $9, updated_at = NOW()
         WHERE id = $10 AND user_id = $11`,
        [first_name, last_name, address, city, state, postal_code, country, phone_number, is_default, addressId, userId]
      )

      const updatedResult = await client.query(
        'SELECT * FROM user_addresses WHERE id = $1',
        [addressId]
      )

      await client.query('COMMIT')

      return NextResponse.json({
        success: true,
        message: 'Address updated successfully',
        address: updatedResult.rows[0] || null
      })
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }
  } catch (error: unknown) {
    console.error("Error updating address:", error)
    return NextResponse.json(
      { error: "Failed to update address" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  context: RouteContext
) {
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
    const client = await pool.connect()

    try {
      await client.query('BEGIN')

      const existingResult = await client.query(
        'SELECT * FROM user_addresses WHERE id = $1 AND user_id = $2',
        [addressId, userId]
      )

      if (existingResult.rows.length === 0) {
        return NextResponse.json(
          { error: 'Address not found or access denied' },
          { status: 404 }
        )
      }

      const wasDefault = existingResult.rows[0].is_default

      await client.query(
        'DELETE FROM user_addresses WHERE id = $1 AND user_id = $2',
        [addressId, userId]
      )

      if (wasDefault) {
        const remainingResult = await client.query(
          'SELECT id FROM user_addresses WHERE user_id = $1 ORDER BY created_at ASC LIMIT 1',
          [userId]
        )

        if (remainingResult.rows.length > 0) {
          await client.query(
            'UPDATE user_addresses SET is_default = TRUE WHERE id = $1',
            [remainingResult.rows[0].id]
          )
        }
      }

      await client.query('COMMIT')

      return NextResponse.json({
        success: true,
        message: 'Address deleted successfully'
      })
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }
  } catch (error: unknown) {
    console.error("Error deleting address:", error)
    return NextResponse.json(
      { error: "Failed to delete address" },
      { status: 500 }
    )
  }
}