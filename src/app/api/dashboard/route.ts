import { NextRequest, NextResponse } from 'next/server'
import { getPool } from '@/config/db'

export async function GET(req: NextRequest) {
  try {
    const pool = getPool()

    const customersResult = await pool.query(
      `SELECT COUNT(*) as total FROM users WHERE role = 'user'`
    )
    const totalCustomers = parseInt(customersResult.rows[0].total)

    let totalProducts = 0
    try {
      const productsResult = await pool.query(
        `SELECT COUNT(*) as total FROM books`
      )
      totalProducts = parseInt(productsResult.rows[0].total)
    } catch (error) {
      console.log('books table not found, using default value')
    }

    let totalOrders = 0
    try {
      const ordersResult = await pool.query(
        `SELECT COUNT(*) as total FROM user_orders`
      )
      totalOrders = parseInt(ordersResult.rows[0].total)
    } catch (error) {
      console.log('user_orders table not found, using default value')
    }

    let totalRevenue = '$0'
    try {
      const revenueResult = await pool.query(
        `SELECT COALESCE(SUM(total_price), 0) as total FROM user_orders WHERE order_status = 'delivered'`
      )
      const revenue = parseFloat(revenueResult.rows[0].total)
      totalRevenue = `$${revenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    } catch (error) {
      console.log('user_orders table not found or no revenue data')
    }

    return NextResponse.json({
      success: true,
      data: {
        totalRevenue,
        totalProducts,
        totalOrders,
        totalCustomers
      }
    })
  } catch (error: unknown) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch dashboard statistics' },
      { status: 500 }
    )
  }
}