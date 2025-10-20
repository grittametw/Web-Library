import { NextRequest, NextResponse } from 'next/server'
import { getPool } from '@/config/db'
import { UserProfile } from '@/types/user'
import mysql from 'mysql2/promise'

interface RouteContext {
    params: Promise<{ id: string }>
}

export async function GET(
    req: NextRequest,
    context: RouteContext
): Promise<NextResponse<UserProfile | { error: string }>> {
    const params = await context.params
    const userId = parseInt(params.id, 10)
    if (isNaN(userId)) {
        return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 })
    }

    try {
        const pool = getPool()
        const [rows] = await pool.execute<mysql.RowDataPacket[]>(
            `SELECT id, name, email, profile_picture, created_at, updated_at FROM users WHERE id = ?`,
            [userId]
        )

        if (rows.length === 0) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        const user = rows[0]
        const userProfile: UserProfile = {
            id: user.id,
            username: user.name,
            email: user.email,
            profilePicture: user.profile_picture || null,
            createdAt: user.created_at,
            updatedAt: user.updated_at
        }

        return NextResponse.json(userProfile)
    } catch (error: unknown) {
        console.error('Error fetching user profile:', error)
        return NextResponse.json(
            { error: 'Failed to fetch user profile' },
            { status: 500 }
        )
    }
}

export async function PUT(
    req: NextRequest,
    context: RouteContext
): Promise<
    NextResponse<
        { success: boolean; message: string } | { error: string }
    >
> {
    const params = await context.params
    const userId = parseInt(params.id, 10)

    if (isNaN(userId)) {
        return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 })
    }

    try {
        const body: Partial<{ username: string; email: string }> = await req.json()
        const { username, email } = body

        const pool = getPool()

        const updates: string[] = []
        const values: (string | number | null)[] = []

        if (username !== undefined) {
            updates.push('name = ?')
            values.push(username)
        }
        if (email !== undefined) {
            updates.push('email = ?')
            values.push(email)
        }

        if (updates.length === 0) {
            return NextResponse.json({ error: 'No fields to update' }, { status: 400 })
        }

        updates.push('updated_at = NOW()')
        values.push(userId)

        const query = `UPDATE users SET ${updates.join(', ')} WHERE id = ?`
        await pool.execute(query, values)

        return NextResponse.json({
            success: true,
            message: 'Profile updated successfully'
        })
    } catch (error: unknown) {
        console.error('Error updating user profile:', error)
        return NextResponse.json(
            { error: 'Failed to update user profile' },
            { status: 500 }
        )
    }
}