import { useState, useEffect } from 'react'
import { Box, Grid2, Typography, Button, TextField, Checkbox, FormControlLabel } from '@mui/material'
import { ShippingAddress } from '@/types/address'

interface Props {
  isOpen: boolean
  onClose: () => void
  onSave: () => void
  address?: ShippingAddress | null
  isLoggedIn: boolean
  userId?: number
  userEmail?: string
}

export default function AddressFormModal({ 
  isOpen, 
  onClose, 
  onSave, 
  address, 
  isLoggedIn, 
  userId, 
  userEmail 
}: Props) {
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formData, setFormData] = useState<ShippingAddress>({
    firstName: '',
    lastName: '',
    address: '',
    country: '',
    phoneNumber: '',
    email: userEmail || '',
    city: '',
    state: '',
    zipCode: '',
    label: ''
  })

  useEffect(() => {
    if (isOpen) {
      if (address) {
        setFormData(address)
      } else {
        setFormData({
          firstName: '',
          lastName: '',
          address: '',
          country: '',
          phoneNumber: '',
          email: userEmail || '',
          city: '',
          state: '',
          zipCode: '',
          label: ''
        })
      }
      setErrors({})
    }
  }, [isOpen, address, userEmail])

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

  const handleSave = async () => {
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
          onSave()
          onClose()
        } else {
          const errorData = await response.json()
          console.error('Failed to save address:', errorData.error)
        }
      }
    } catch (error) {
      console.error('Failed to save address:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof ShippingAddress, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <Box
      onClick={handleBackdropClick}
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
        className="d-flex justify-content-center align-items-center flex-column p-4"
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
          {address?.id ? 'Edit Address' : 'Add New Address'}
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
            onClick={onClose}
            variant="outlined"
            sx={{ flex: 1 }}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            sx={{ flex: 1 }}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Address'}
          </Button>
        </Box>
      </Box>
    </Box>
  )
}