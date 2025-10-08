import { useState, useEffect } from 'react'
import { Box, Grid2, Typography, Button, TextField, FormControl, InputLabel, Select, MenuItem, Checkbox, FormControlLabel } from '@mui/material'
import { EditOutlined, Add } from '@mui/icons-material'
import { ShippingAddress, DbUserAddress } from '@/types/address'

interface Props {
  isLoggedIn?: boolean
  userId?: number
  userEmail?: string
  onAddressChange?: (address: ShippingAddress | null) => void
}

const GUEST_ADDRESS_KEY = 'guest_shipping_address'

export default function ShippingAddressSection({ isLoggedIn = false, userId, userEmail, onAddressChange }: Props) {
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [selectedAddress, setSelectedAddress] = useState<ShippingAddress | null>(null)
  const [savedAddresses, setSavedAddresses] = useState<ShippingAddress[]>([])
  const [isNewAddress, setIsNewAddress] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<ShippingAddress>({
    firstName: '',
    lastName: '',
    address: '',
    country: '',
    phoneNumber: '',
    email: '',
    city: '',
    state: '',
    zipCode: '',
    label: ''
  })

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

  const formToDbAddress = (formAddr: ShippingAddress) => ({
    first_name: formAddr.firstName,
    last_name: formAddr.lastName,
    address: formAddr.address,
    city: formAddr.city,
    state: formAddr.state,
    postal_code: formAddr.zipCode,
    country: formAddr.country,
    phone_number: formAddr.phoneNumber,
    is_default: formAddr.isDefault || false
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
      if (isLoggedIn && userId) {
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
            setFormData(prev => ({ ...prev, email: userEmail || '', label: 'Default' }))
            onAddressChange?.(null)
          }
        } else {
          console.error('Failed to load addresses:', response.statusText)
          setSavedAddresses([])
          setSelectedAddress(null)
          setFormData(prev => ({ ...prev, email: userEmail || '', label: 'Default' }))
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

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required'
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required'
    if (!formData.address.trim()) newErrors.address = 'Address is required'
    if (!formData.country.trim()) newErrors.country = 'Country is required'
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    if (!formData.city.trim()) newErrors.city = 'City is required'
    if (!formData.state.trim()) newErrors.state = 'State/Province is required'
    if (!formData.zipCode.trim()) newErrors.zipCode = 'Zip code is required'

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const saveAddress = async () => {
    if (!validateForm()) return

    setLoading(true)

    try {
      if (isLoggedIn && userId) {
        const url = `/api/users/${userId}/addresses`
        const method = formData.id ? 'PUT' : 'POST'

        const requestBody = formData.id
          ? { ...formToDbAddress(formData), id: formData.id }
          : formToDbAddress(formData)

        const response = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody)
        })

        if (response.ok) {
          const data = await response.json()
          const savedAddress: ShippingAddress = {
            ...formData,
            id: data.address?.id || formData.id
          }

          setSelectedAddress(savedAddress)
          onAddressChange?.(savedAddress)

          await loadAddresses()

          setShowAddressForm(false)
          resetForm()
        } else {
          const errorData = await response.json()
          console.error('Failed to save address:', errorData.error)
        }
      } else {
        localStorage.setItem(GUEST_ADDRESS_KEY, JSON.stringify(formData))
        setSelectedAddress(formData)
        onAddressChange?.(formData)
        setShowAddressForm(false)
        resetForm()
      }
    } catch (error) {
      console.error('Failed to save address:', error)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      address: '',
      country: '',
      phoneNumber: '',
      email: '',
      city: '',
      state: '',
      zipCode: '',
      label: ''
    })
    setErrors({})
    setIsNewAddress(false)
  }

  const handleSelectAddress = (address: ShippingAddress) => {
    setSelectedAddress(address)
    onAddressChange?.(address)
  }

  const handleEditAddress = (address?: ShippingAddress) => {
    if (address) {
      setFormData(address)
      setIsNewAddress(false)
    } else {
      setFormData(prev => ({ ...prev, email: isLoggedIn ? userEmail || '' : '', label: 'Default' }))
      setIsNewAddress(true)
    }
    setShowAddressForm(true)
  }

  const formatAddressDisplay = (address: ShippingAddress): string => {
    return `${address.firstName} ${address.lastName}${address.phoneNumber ? ' | ' + address.phoneNumber : ''}\n${address.country}, ${address.address}, ${address.city}, ${address.state}, ${address.zipCode}`
  }

  const handleInputChange = (field: keyof ShippingAddress, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleCloseAddressForm = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setShowAddressForm(false)
      resetForm()
    }
  }

  return (
    <>
      <Box
        className="d-flex justify-content-center align-items-center flex-column p-4 gap-4"
        sx={{ width: '350px', height: 'auto', backgroundColor: '#fff', borderRadius: '8px' }}
      >
        <Typography fontWeight={600} fontSize={18}>
          Shipping Address {!isLoggedIn && <Typography component="span" variant="body2" color="text.secondary">(Guest)</Typography>}
        </Typography>

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
          <Box sx={{ width: '100%', p: 2, border: '1px solid #ddd', borderRadius: 1 }}>
            <Typography variant="body2" sx={{ whiteSpace: 'pre-line', mb: 1 }}>
              {formatAddressDisplay(selectedAddress)}
            </Typography>
            <Button
              size="small"
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
      </Box>

      {showAddressForm && (
        <Box
          onClick={handleCloseAddressForm}
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 9999,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Box
            className="Address d-flex justify-content-center align-items-center flex-column p-4"
            sx={{
              width: '500px',
              maxHeight: '90vh',
              backgroundColor: '#fff',
              borderRadius: '8px',
              animation: 'fadeIn 0.3s',
              overflowY: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <Typography fontWeight={600} fontSize={20} sx={{ mb: 2 }}>
              {isNewAddress ? 'Add New Address' : 'Shipping Address'}
            </Typography>
            <Typography color="text.secondary">
              Please enter your shipping details. All fields are required.
            </Typography>

            <Box
              className="d-flex flex-column gap-3 py-4 my-4"
              sx={{ width: '100%', borderTop: '1px solid #ccc', borderBottom: '1px solid #ccc' }}
            >
              <Grid2 className="d-flex gap-3" sx={{ width: '100%' }}>
                <TextField
                  label="First Name *"
                  variant="outlined"
                  fullWidth
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  error={!!errors.firstName}
                  helperText={errors.firstName}
                />
                <TextField
                  label="Last Name *"
                  variant="outlined"
                  fullWidth
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  error={!!errors.lastName}
                  helperText={errors.lastName}
                />
              </Grid2>
              <TextField
                label="Address *"
                variant="outlined"
                fullWidth
                multiline
                rows={2}
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                error={!!errors.address}
                helperText={errors.address}
              />
              <Grid2 className="d-flex gap-3" sx={{ width: '100%' }}>
                <TextField
                  label="Country/Region *"
                  variant="outlined"
                  fullWidth
                  value={formData.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  error={!!errors.country}
                  helperText={errors.country}
                />
                <TextField
                  label="Phone Number *"
                  variant="outlined"
                  fullWidth
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  error={!!errors.phoneNumber}
                  helperText={errors.phoneNumber}
                />
              </Grid2>
              <TextField
                label="Email *"
                variant="outlined"
                fullWidth
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                error={!!errors.email}
                helperText={errors.email}
                disabled={isLoggedIn}
              />
              <Grid2 className="d-flex gap-3" sx={{ width: '100%' }}>
                <TextField
                  label="City *"
                  variant="outlined"
                  fullWidth
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  error={!!errors.city}
                  helperText={errors.city}
                />
                <TextField
                  label="State/Province *"
                  variant="outlined"
                  fullWidth
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  error={!!errors.state}
                  helperText={errors.state}
                />
                <TextField
                  label="Zip Code *"
                  variant="outlined"
                  fullWidth
                  value={formData.zipCode}
                  onChange={(e) => handleInputChange('zipCode', e.target.value)}
                  error={!!errors.zipCode}
                  helperText={errors.zipCode}
                />
              </Grid2>

              {isLoggedIn && (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.isDefault || false}
                      onChange={(e) => handleInputChange('isDefault', e.target.checked)}
                    />
                  }
                  label="Set as default address"
                  sx={{ mt: -1, mb: -2 }}
                />
              )}
            </Box>

            <Box className="d-flex gap-3" sx={{ width: '100%' }}>
              <Button
                onClick={() => {
                  setShowAddressForm(false)
                  resetForm()
                }}
                variant="outlined"
                sx={{ flex: 1 }}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                onClick={saveAddress}
                variant="contained"
                sx={{ flex: 1 }}
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Address'}
              </Button>
            </Box>
          </Box>
        </Box>
      )}
    </>
  )
}