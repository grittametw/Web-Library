import { ShippingAddress } from '@/types/address'

interface Order {
  id: number
  payment_status: 'pending' | 'successful' | 'failed'
  order_status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  total_price: number
  created_at: string
  updated_at: string
  shipping_address: ShippingAddress | null
  items: OrderItem[]
}

interface OrderItem {
  book_id: number
  book_option_id: number
  quantity: number
  price: number
  name: string
  image: string
  option_type: string
}

interface OrderRow {
  id: number
  user_id: number
  address_id: number | null
  payment_status: string
  order_status: string
  total_price: number
  created_at: Date
  updated_at: Date
}

interface OrderItemRow {
  order_id: number
  book_id: number
  book_option_id: number
  quantity: number
  price: number
  name: string
  image: string
  option_type: string
}

export type { Order, OrderItem, OrderRow, OrderItemRow }