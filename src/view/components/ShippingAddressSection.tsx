import { useState, useEffect } from 'react'
import { Box, Typography, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import { EditOutlined, Add } from '@mui/icons-material'
import { ShippingAddress, DbUserAddress } from '@/types/address'
import { useAuth } from '@/hooks/useAuth'
import AddressFormModal from '@/view/components/AddressFormModal'

interface Props {
  isLoggedIn?: boolean
  userId?: number
  userEmail?: string
  onAddressChange?: (address: ShippingAddress | null) => void
}

const GUEST_ADDRESS_KEY = 'guest_shipping_address'

export default function ShippingAddressSection({ isLoggedIn = false, userId, userEmail, onAddressChange }: Props) {
  const { user } = useAuth()
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [selectedAddress, setSelectedAddress] = useState<ShippingAddress | null>(null)
  const [savedAddresses, setSavedAddresses] = useState<ShippingAddress[]>([])
  const [editingAddress, setEditingAddress] = useState<ShippingAddress | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadAddresses()
  }, [isLoggedIn, userId])

  const dbToFormAddress = (dbAddr: DbUserAddress & { email: string }): ShippingAddress => ({
    id: dbAddr.id,
    firstName: dbAddr.first_name,
    lastName: dbAddr.last_name,
    address: dbAddr.address,
    city: dbAddr.city,
    state: dbAddr.state,
    zipCode: dbAddr.postal_code,
    country: dbAddr.country,
    phoneNumber: dbAddr.phone_number,
    isDefault: dbAddr.is_default,
    email: dbAddr.email,
    label: `${dbAddr.first_name} ${dbAddr.last_name}`
  })

  const clearGuestData = () => {
    try {
      localStorage.removeItem(GUEST_ADDRESS_KEY)
    } catch (error) {
      console.warn('Failed to clear guest address data:', error)
    }
  }

  const loadAddresses = async () => {
    setLoading(true)

    try {
      if (isLoggedIn && userId && user?.role === 'user') {
        clearGuestData()

        const response = await fetch(`/api/users/${userId}/addresses`)

        if (response.ok) {
          const data = await response.json()
          const addresses: ShippingAddress[] = data.addresses?.map(dbToFormAddress) || []

          setSavedAddresses(addresses)

          const defaultAddress = addresses.find((addr: ShippingAddress) => addr.isDefault)
          if (defaultAddress) {
            setSelectedAddress(defaultAddress)
            onAddressChange?.(defaultAddress)
          } else {
            setSelectedAddress(null)
            onAddressChange?.(null)
          }
        } else {
          console.error('Failed to load addresses:', response.statusText)
          setSavedAddresses([])
          setSelectedAddress(null)
          onAddressChange?.(null)
        }
      } else {
        setSavedAddresses([])

        try {
          const savedAddress = localStorage.getItem(GUEST_ADDRESS_KEY)
          if (savedAddress) {
            const address = JSON.parse(savedAddress)
            setSelectedAddress(address)
            onAddressChange?.(address)
          } else {
            setSelectedAddress(null)
            onAddressChange?.(null)
          }
        } catch (error) {
          console.error('Failed to parse saved guest address:', error)
          setSelectedAddress(null)
          onAddressChange?.(null)
        }
      }
    } catch (error) {
      console.error('Failed to load addresses:', error)
      setSavedAddresses([])
      setSelectedAddress(null)
      onAddressChange?.(null)
    } finally {
      setLoading(false)
    }
  }

  const handleSelectAddress = (address: ShippingAddress) => {
    setSelectedAddress(address)
    onAddressChange?.(address)
  }

  const handleEditAddress = (address?: ShippingAddress) => {
    setEditingAddress(address || null)
    setShowAddressForm(true)
  }

  const handleCloseForm = () => {
    setShowAddressForm(false)
    setEditingAddress(null)
  }

  const handleSaveAddress = () => {
    loadAddresses()
  }

  const formatAddressDisplay = (address: ShippingAddress): string => {
    return `${address.firstName} ${address.lastName}${address.phoneNumber ? ' | ' + address.phoneNumber : ''}\n${address.country}, ${address.address}, ${address.city}, ${address.state}, ${address.zipCode}`
  }

  return (
    <>
      {loading && (
        <Typography variant="body2" color="text.secondary">Loading addresses...</Typography>
      )}

      {isLoggedIn && savedAddresses.length > 0 && !loading && (
        <FormControl fullWidth size="small">
          <InputLabel>Select Address</InputLabel>
          <Select
            value={selectedAddress?.id || ''}
            label="Select Address"
            onChange={(e) => {
              const selectedId = Number(e.target.value)
              const address = savedAddresses.find(addr => addr.id === selectedId)
              if (address) handleSelectAddress(address)
            }}
          >
            {savedAddresses.map((address) => (
              <MenuItem
                key={address.id}
                value={address.id}
                sx={{ width: '300px', whiteSpace: 'normal' }}>
                {formatAddressDisplay(address)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      {selectedAddress && !loading ? (
        <Box
          className="d-flex justify-content-between align-items-center"
          sx={{ width: '100%', p: 2, border: '1px solid #ddd', borderRadius: 1 }}>
          <Typography variant="body2" sx={{ width: '100%', whiteSpace: 'pre-line', mb: 1 }}>
            {formatAddressDisplay(selectedAddress)}
          </Typography>
          <Button
            variant="outlined"
            sx={{ height: 'fit-content', border: '1px solid', textTransform: 'none', px: 2 }}
            onClick={() => handleEditAddress(selectedAddress)}
            startIcon={<EditOutlined />}
          >
            Edit
          </Button>
        </Box>
      ) : !loading && (
        <Button
          onClick={() => handleEditAddress()}
          className="d-flex gap-2"
          sx={{
            width: '100%',
            borderTop: '1px solid #ccc',
            borderBottom: '1px solid #ccc',
            color: '#000',
            textTransform: 'none',
            justifyContent: 'space-between'
          }}
        >
          Enter your shipping address
          <EditOutlined />
        </Button>
      )}

      {isLoggedIn && selectedAddress && !loading && (
        <Box sx={{ width: '100%', display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<Add />}
            onClick={() => handleEditAddress()}
            sx={{ flex: 1 }}
          >
            Add New
          </Button>
        </Box>
      )}

      {isLoggedIn && savedAddresses.length === 0 && !selectedAddress && !loading && (
        <Typography variant="body2" color="text.secondary" textAlign="center">
          You don't have any saved addresses yet.
        </Typography>
      )}

      <AddressFormModal
        isOpen={showAddressForm}
        onClose={handleCloseForm}
        onSave={handleSaveAddress}
        address={editingAddress}
        isLoggedIn={isLoggedIn}
        userId={userId}
        userEmail={userEmail}
      />
    </>
  )
}