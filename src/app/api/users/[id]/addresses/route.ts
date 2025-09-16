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

interface ErrorResponse {
    error: string
    details?: string
}

interface RouteContext {
    params: { id: string }
}

function hasErrorCode(e: unknown): e is { code: string } {
    return typeof e === 'object' && e !== null && 'code' in e
}

export async function GET(
    request: NextRequest,
    context: RouteContext
) {
    let connection: mysql.PoolConnection | null = null

    try {
        const params = await context.params
        const idStr = params.id
        const userId = parseInt(idStr, 10)
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
        console.error('Error fetching addresses:', error)

        let errorMessage = 'Unknown error occurred while fetching addresses'

        if (error instanceof Error && hasErrorCode(error)) {
            switch (error.code) {
                case 'ER_ACCESS_DENIED_ERROR':
                    errorMessage = 'Database access denied'
                    break
                case 'ECONNREFUSED':
                    errorMessage = 'Database connection refused'
                    break
                case 'ER_BAD_DB_ERROR':
                    errorMessage = 'Database does not exist'
                    break
                case 'ER_NO_SUCH_TABLE':
                    errorMessage = 'User addresses table does not exist'
                    break
                default:
                    errorMessage = 'Database query error'
            }
        } else if (error instanceof Error) {
            errorMessage = error.message
        }

        const errorResponse: ErrorResponse = {
            error: 'Error fetching addresses',
            details: errorMessage,
        }

        return NextResponse.json(errorResponse, { status: 500 })

    } finally {
        if (connection) {
            try {
                connection.release()
            } catch (closeError) {
                console.error('Error releasing database connection:', closeError)
            }
        }
    }
}

export async function POST(
    request: NextRequest,
    context: RouteContext
) {
    let connection: mysql.PoolConnection | null = null

    try {
        const body: CreateAddressRequest = await request.json()
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
                { error: 'All address fields are required' } as ErrorResponse,
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

        if (!result.insertId) {
            return NextResponse.json(
                { error: 'Failed to create address' } as ErrorResponse,
                { status: 500 }
            )
        }

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
        console.error('Error creating address:', error)

        let errorMessage = 'Unknown error occurred while creating address'

        if (error instanceof Error && hasErrorCode(error)) {
            switch (error.code) {
                case 'ER_ACCESS_DENIED_ERROR':
                    errorMessage = 'Database access denied'
                    break
                case 'ECONNREFUSED':
                    errorMessage = 'Database connection refused'
                    break
                case 'ER_BAD_DB_ERROR':
                    errorMessage = 'Database does not exist'
                    break
                case 'ER_NO_SUCH_TABLE':
                    errorMessage = 'User addresses table does not exist'
                    break
                case 'ER_DUP_ENTRY':
                    errorMessage = 'Duplicate address entry'
                    break
                default:
                    errorMessage = 'Database query error'
            }
        } else if (error instanceof Error) {
            errorMessage = error.message
        }

        const errorResponse: ErrorResponse = {
            error: 'Error creating address',
            details: errorMessage,
        }

        return NextResponse.json(errorResponse, { status: 500 })

    } finally {
        if (connection) {
            try {
                connection.release()
            } catch (closeError) {
                console.error('Error releasing database connection:', closeError)
            }
        }
    }
}

export async function PUT(
    request: NextRequest,
    context: RouteContext
) {
    let connection: mysql.PoolConnection | null = null

    try {
        const body: UpdateAddressRequest = await request.json()
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
                { error: 'Address ID and all address fields are required' } as ErrorResponse,
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
                { error: 'Address not found or access denied' } as ErrorResponse,
                { status: 404 }
            )
        }

        if (is_default) {
            await connection.execute(
                'UPDATE user_addresses SET is_default = FALSE WHERE user_id = ? AND id != ?',
                [userId, addressId]
            )
        }

        const [result] = await connection.execute<mysql.ResultSetHeader>(
            `UPDATE user_addresses 
            SET first_name = ?, last_name = ?, address = ?, city = ?, state = ?, 
            postal_code = ?, country = ?, phone_number = ?, is_default = ?, updated_at = NOW()
            WHERE id = ? AND user_id = ?`,
            [first_name, last_name, address, city, state, postal_code, country, phone_number, is_default, addressId, userId]
        )

        if (result.affectedRows === 0) {
            return NextResponse.json(
                { error: 'Failed to update address' } as ErrorResponse,
                { status: 500 }
            )
        }

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
        console.error('Error updating address:', error)

        let errorMessage = 'Unknown error occurred while updating address'

        if (error instanceof Error && hasErrorCode(error)) {
            switch (error.code) {
                case 'ER_ACCESS_DENIED_ERROR':
                    errorMessage = 'Database access denied'
                    break
                case 'ECONNREFUSED':
                    errorMessage = 'Database connection refused'
                    break
                case 'ER_BAD_DB_ERROR':
                    errorMessage = 'Database does not exist'
                    break
                case 'ER_NO_SUCH_TABLE':
                    errorMessage = 'User addresses table does not exist'
                    break
                default:
                    errorMessage = 'Database query error'
            }
        } else if (error instanceof Error) {
            errorMessage = error.message
        }

        const errorResponse: ErrorResponse = {
            error: 'Error updating address',
            details: errorMessage,
        }

        return NextResponse.json(errorResponse, { status: 500 })

    } finally {
        if (connection) {
            try {
                connection.release()
            } catch (closeError) {
                console.error('Error releasing database connection:', closeError)
            }
        }
    }
}

export async function DELETE(
    request: NextRequest,
    context: RouteContext
) {
    let connection: mysql.PoolConnection | null = null

    try {
        const { searchParams } = new URL(request.url)
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
                { error: 'Address not found or access denied' } as ErrorResponse,
                { status: 404 }
            )
        }

        const wasDefault = existingAddress[0].is_default

        const [result] = await connection.execute<mysql.ResultSetHeader>(
            'DELETE FROM user_addresses WHERE id = ? AND user_id = ?',
            [addressId, userId]
        )

        if (result.affectedRows === 0) {
            return NextResponse.json(
                { error: 'Failed to delete address' } as ErrorResponse,
                { status: 500 }
            )
        }

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
        console.error('Error deleting address:', error)

        let errorMessage = 'Unknown error occurred while deleting address'

        if (error instanceof Error && hasErrorCode(error)) {
            switch (error.code) {
                case 'ER_ACCESS_DENIED_ERROR':
                    errorMessage = 'Database access denied'
                    break
                case 'ECONNREFUSED':
                    errorMessage = 'Database connection refused'
                    break
                case 'ER_BAD_DB_ERROR':
                    errorMessage = 'Database does not exist'
                    break
                case 'ER_NO_SUCH_TABLE':
                    errorMessage = 'User addresses table does not exist'
                    break
                default:
                    errorMessage = 'Database query error'
            }
        } else if (error instanceof Error) {
            errorMessage = error.message
        }

        const errorResponse: ErrorResponse = {
            error: 'Error deleting address',
            details: errorMessage,
        }

        return NextResponse.json(errorResponse, { status: 500 })

    } finally {
        if (connection) {
            try {
                connection.release()
            } catch (closeError) {
                console.error('Error releasing database connection:', closeError)
            }
        }
    }
}