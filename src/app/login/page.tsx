'use client'

import { useState } from 'react'
import { Box, Typography, FormControl, TextField, Button, Grid2 } from '@mui/material'
import { useAuth } from '@/hooks/useAuth'
import Image from 'next/image'
import Link from 'next/link'
import '@/styles/login.css'

export default function LoginPage() {
  const [emailError, setEmailError] = useState(false)
  const [emailErrorMessage, setEmailErrorMessage] = useState('')
  const [passwordError, setPasswordError] = useState(false)
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('')
  const [loginError, setLoginError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()

  const validateInputs = (email: string, password: string) => {
    let isValid = true

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError(true)
      setEmailErrorMessage('Please enter a valid email address.')
      isValid = false
    } else {
      setEmailError(false)
      setEmailErrorMessage('')
    }

    if (!password || password.length < 6) {
      setPasswordError(true)
      setPasswordErrorMessage('Password must be at least 6 characters long.')
      isValid = false
    } else {
      setPasswordError(false)
      setPasswordErrorMessage('')
    }

    return isValid
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoginError('')
    const data = new FormData(event.currentTarget)
    const email = data.get('email') as string
    const password = data.get('password') as string

    if (!validateInputs(email, password)) return

    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const result = await res.json()

      if (res.ok) {
        login(result.user, result.token)
        
        localStorage.setItem('refreshToken', result.refreshToken)
        
        if (result.user.role === 'admin') {
          window.location.href = '/admin/dashboard'
        } else {
          window.location.href = '/'
        }
      } else {
        setLoginError(result.error || 'Login failed')
      }
    } catch (error) {
      console.error('Login error:', error)
      setLoginError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box className="d-flex justify-content-center align-items-center gap-5" sx={{ height: '100vh' }}>
      <Box
        className="hero-sections d-flex flex-column justify-content-between align-items-center pb-0"
        sx={{
          width: 400,
          height: 600,
          background: 'linear-gradient(to bottom right, #055cdb 70%, #dcdcdc 100%)',
          borderRadius: '48px', padding: 6, color: '#fff'
        }}>
        <Grid2 marginBottom={2}>
          <Grid2 marginBottom={4}>
            <Typography fontWeight={600} fontSize={32}>Simplify</Typography>
            <Typography fontWeight={600} fontSize={32}>management With</Typography>
            <Typography fontWeight={600} fontSize={32}>Our dashboard.</Typography>
          </Grid2>
          <Typography fontSize={14}>Simplify your e-commerce management with our user-friendly dashboard</Typography>
        </Grid2>

        <Image src="/image-hero.png" alt="ImageHero" width={300} height={300} />
      </Box>

      <Box className="login-form d-flex flex-column align-items-center gap-2" sx={{ width: 400 }}>
        <Grid2 className="d-flex align-items-center gap-2 mb-2">
          <Image src="/favicon.ico" alt="" width={48} height={48} />
          <Typography fontWeight={600} fontSize={20}>Web - Library</Typography>
        </Grid2>

        <Grid2 className="d-flex flex-column align-items-center">
          <Typography fontFamily='Arial' fontWeight={600} fontSize={40}>Welcome</Typography>
          <Typography color="#999">Please login to your account</Typography>
        </Grid2>

        <Box
          component="form"
          onSubmit={handleSubmit}
          className="d-flex flex-column gap-2 mt-4"
          sx={{ width: '100%' }}
        >
          <FormControl>
            <TextField
              error={emailError}
              helperText={emailErrorMessage}
              name="email"
              id="email"
              type="email"
              label="Email address"
              autoComplete="email"
              autoFocus
              required
              fullWidth
              variant="outlined"
              color={emailError ? 'error' : 'primary'}
              onChange={() => {
                setEmailError(false)
                setEmailErrorMessage('')
                setLoginError('')
              }}
            />
          </FormControl>
          <FormControl>
            <TextField
              error={passwordError}
              helperText={passwordErrorMessage}
              name="password"
              id="password"
              type="password"
              label="Password"
              autoComplete="current-password"
              required
              fullWidth
              variant="outlined"
              color={passwordError ? 'error' : 'primary'}
              onChange={() => {
                setPasswordError(false)
                setPasswordErrorMessage('')
                setLoginError('')
              }}
            />
          </FormControl>
          <Box className="d-flex justify-content-end mb-4">
            <Link
              href="#"
              className="text-decoration-none"
            >
              <Typography className="forgotpassword" fontSize={14} sx={{ color: '#000' }}>Forgot Password?</Typography>
            </Link>
          </Box>
          {loginError && (
            <Typography color="error" fontSize={14} textAlign="center" sx={{ mb: 1 }}>
              {loginError}
            </Typography>
          )}
          <Button
            variant="contained"
            type="submit"
            fullWidth
            disabled={loading}
            className="d-flex align-items-center p-3 px-4"
            sx={{ borderRadius: '4px', textTransform: 'none' }}>
            <Typography>{loading ? 'Logging in...' : 'Login'}</Typography>
          </Button>
        </Box>

        <Box className="d-flex align-items-center w-100 my-2" sx={{ gap: 2 }}>
          <Box sx={{ flex: 1, height: 2, backgroundColor: '#ccc' }} />
          <Typography>Or Login With</Typography>
          <Box sx={{ flex: 1, height: 2, backgroundColor: '#ccc' }} />
        </Box>

        <Grid2 className="d-flex justify-content-between align-items-center gap-2 w-100">
          <Button
            className="d-flex justify-content-center align-items-center gap-2 w-100"
            sx={{ border: 'solid 1px #ccc', textTransform: 'none' }}>
            <Image src="/icons-google.svg" alt="Google" width={16} height={16} />
            <Typography sx={{ color: '#000' }}>Google</Typography>
          </Button>
          <Button
            className="d-flex justify-content-center align-items-center gap-2 w-100"
            sx={{ border: 'solid 1px #ccc', textTransform: 'none' }}>
            <Image src="/icons-facebook.svg" alt="Facebook" width={16} height={16} />
            <Typography sx={{ color: '#000' }}>Facebook</Typography>
          </Button>
        </Grid2>

        <Grid2 className="d-flex gap-1">
          <Typography>Don't have an account?</Typography>
          <Link href="/register" className="text-decoration-none">
            <Typography className="signup" sx={{ color: '#055cdb' }}>Signup</Typography>
          </Link>
        </Grid2>
      </Box>
    </Box>
  )
}