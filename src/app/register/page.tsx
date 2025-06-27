'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import '@/styles/register.css';
import { Box, Typography, FormControl, TextField, Button, Grid2, Checkbox } from '@mui/material';
import { CheckCircle, Visibility, VisibilityOff } from '@mui/icons-material';
import Image from 'next/image';
import Link from 'next/link';

export default function LoginPage() {
    const [emailError, setEmailError] = useState(false)
    const [emailErrorMessage, setEmailErrorMessage] = useState('')
    const [passwordError, setPasswordError] = useState(false)
    const [passwordErrorMessage, setPasswordErrorMessage] = useState('')
    const [passwordValue, setPasswordValue] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [confirmPasswordError, setConfirmPasswordError] = useState(false)
    const [confirmPasswordErrorMessage, setConfirmPasswordErrorMessage] = useState('')
    const [confirmPasswordValue, setConfirmPasswordValue] = useState('')
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [loginError, setLoginError] = useState('')
    const router = useRouter()

    const isLengthValid = passwordValue.length >= 6
    const isUppercaseValid = /[A-Z]/.test(passwordValue)
    const isNumberValid = /\d/.test(passwordValue)
    const isPasswordMatch = passwordValue === confirmPasswordValue && passwordValue.length > 0
    const [loading, setLoading] = useState(false)

    const handleClickShowPassword = () => setShowPassword((show) => !show)
    const handleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show)

    const validateInputs = (email: string, password: string, confirmPassword: string) => {
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
        } else if (!/[A-Z]/.test(password)) {
            setPasswordError(true)
            setPasswordErrorMessage('Password must include at least 1 uppercase letter.')
            isValid = false
        } else if (!/\d/.test(password)) {
            setPasswordError(true)
            setPasswordErrorMessage('Password must include at least 1 number.')
            isValid = false
        } else {
            setPasswordError(false)
            setPasswordErrorMessage('')
        }

        if (password !== confirmPassword) {
            setConfirmPasswordError(true)
            setConfirmPasswordErrorMessage('Passwords do not match.')
            isValid = false
        }

        return isValid
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setLoginError('')
        const data = new FormData(event.currentTarget)
        const email = data.get('email') as string
        const password = data.get('password') as string
        const confirmPassword = data.get('confirmPassword') as string

        if (!validateInputs(email, password, confirmPassword)) return

        setLoading(true);
        try {
            const res = await fetch('/api/admins', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            if (res.ok) {
                router.push('/')
            } else {
                const result = await res.json()
                setLoginError(result.error || 'Login failed')
            }
        } catch (err) {
            setLoginError('Network error')
        }
        setLoading(false)
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
                    <Typography fontSize={14} >Simplify your e-commerce management with our user-friendly dashboard</Typography>
                </Grid2>

                <Image src="/image-hero.png" alt="ImageHero" width={300} height={300} />
            </Box>

            <Box className="login-form d-flex flex-column align-items-center gap-2" sx={{ width: 400 }}>
                <Grid2 className="d-flex flex-column w-100">
                    <Typography fontFamily='Arial' fontWeight={600} fontSize={32}>Create your account</Typography>
                    <Typography fontFamily='Arial' fontWeight={600} fontSize={32}>on Web - Library</Typography>
                    <Grid2 className="d-flex gap-1">
                        <Typography>Already have an account?</Typography>
                        <Link href="/login" className="text-decoration-none">
                            <Typography className="login" sx={{ color: '#055cdb' }}>Log in</Typography>
                        </Link>
                    </Grid2>
                </Grid2>

                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    className="d-flex flex-column gap-2 mt-2"
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
                        />
                    </FormControl>
                    <FormControl>
                        <TextField
                            error={passwordError}
                            helperText={passwordErrorMessage}
                            name="password"
                            id="password"
                            type={showPassword ? "text" : "password"}
                            label="New password"
                            autoComplete="current-password"
                            required
                            fullWidth
                            variant="outlined"
                            color={passwordError ? 'error' : 'primary'}
                            value={passwordValue}
                            onChange={e => setPasswordValue(e.target.value)}
                            InputProps={{
                                endAdornment: (
                                    <Grid2
                                        style={{ cursor: 'pointer' }}
                                        onClick={handleClickShowPassword}
                                        tabIndex={0}
                                        onMouseDown={e => e.preventDefault()}
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </Grid2>
                                ),
                            }}
                        />
                    </FormControl>

                    <Grid2 className="d-flex flex-column mb-2">
                        <Grid2 className="d-flex align-items-center gap-1">
                            <CheckCircle sx={{ width: 16, color: isLengthValid ? '#2ecc40' : '#999' }} />
                            <Typography fontSize={12} color={isLengthValid ? '#2ecc40' : '#999'}>
                                Password must include at least 6 characters
                            </Typography>
                        </Grid2>
                        <Grid2 className="d-flex align-items-center gap-1">
                            <CheckCircle sx={{ width: 16, color: isUppercaseValid ? '#2ecc40' : '#999' }} />
                            <Typography fontSize={12} color={isUppercaseValid ? '#2ecc40' : '#999'}>
                                Password must include 1 uppercase letter
                            </Typography>
                        </Grid2>
                        <Grid2 className="d-flex align-items-center gap-1">
                            <CheckCircle sx={{ width: 16, color: isNumberValid ? '#2ecc40' : '#999' }} />
                            <Typography fontSize={12} color={isNumberValid ? '#2ecc40' : '#999'}>
                                Password must include 1 number
                            </Typography>
                        </Grid2>
                    </Grid2>

                    <FormControl>
                        <TextField
                            error={confirmPasswordError}
                            helperText={confirmPasswordErrorMessage}
                            name="confirmPassword"
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            label="Confirm new password"
                            autoComplete="current-password"
                            required
                            fullWidth
                            variant="outlined"
                            color={passwordError ? 'error' : 'primary'}
                            value={confirmPasswordValue}
                            onChange={e => setConfirmPasswordValue(e.target.value)}
                            InputProps={{
                                endAdornment: (
                                    <Grid2
                                        style={{ cursor: 'pointer' }}
                                        onClick={handleClickShowConfirmPassword}
                                        tabIndex={0}
                                        onMouseDown={e => e.preventDefault()}
                                    >
                                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                    </Grid2>
                                ),
                            }}
                        />
                    </FormControl>
                    
                    <Grid2 className="d-flex align-items-center gap-1">
                        <CheckCircle sx={{ width: 16, color: isPasswordMatch ? '#2ecc40' : '#999' }} />
                        <Typography fontSize={12} color={isPasswordMatch ? '#2ecc40' : '#999'}>
                            Passwords match
                        </Typography>
                    </Grid2>

                    <Grid2 className="d-flex align-content-start gap-2 my-2">
                        <Checkbox sx={{ width: 0, height: 0 }} />
                        <Typography fontSize={14} color='#999'>
                            By creating an account you agree to our Terms of Service
                            and Privacy Policy, and confirm you are authorized to create this
                            account on behalf of the company.
                        </Typography>
                    </Grid2>

                    {loginError && (
                        <Typography color="error" fontSize={14}>{loginError}</Typography>
                    )}
                    <Button
                        variant="contained"
                        type="submit"
                        fullWidth
                        disabled={loading}
                        className="d-flex align-items-center p-3 px-4"
                        sx={{ borderRadius: '4px' }}>
                        <Typography>{loading ? 'Signing in...' : 'Create your account'}</Typography>
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}
