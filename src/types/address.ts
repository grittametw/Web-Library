interface ShippingAddress {
  id?: number
  firstName: string
  lastName: string
  address: string
  country: string
  phoneNumber: string
  email: string
  city: string
  state: string
  zipCode: string
  isDefault?: boolean
  label?: string
}

interface DbUserAddress {
  id: number
  user_id: number
  first_name: string
  last_name: string
  address: string
  city: string
  state: string
  postal_code: string
  country: string
  phone_number: string
  is_default: boolean
  created_at: string
  updated_at: string
}

interface AddressRow {
  first_name: string
  last_name: string
  address: string
  city: string
  state: string
  postal_code: string
  country: string
  phone_number: string
}

interface GuestAddress {
  first_name?: string
  last_name?: string
  address?: string
  city?: string
  state?: string
  postal_code?: string
  country?: string
  phone_number?: string
}

export type { ShippingAddress, DbUserAddress, AddressRow, GuestAddress }