'use client'

import { useEffect, useState } from 'react';
import '@/styles/login.css';
import { Box, Typography, FormControl, TextField, Button, Grid2, Icon } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';

export default function LoginPage() {
  const [emailError, setEmailError] = useState(false)
  const [emailErrorMessage, setEmailErrorMessage] = useState('')
  const [passwordError, setPasswordError] = useState(false)
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('')

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    if (emailError || passwordError) {
      event.preventDefault();
      return;
    }
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get('email'),
      password: data.get('password'),
    });
  };

  const validateInputs = () => {
    const email = document.getElementById('email') as HTMLInputElement;
    const password = document.getElementById('password') as HTMLInputElement;

    let isValid = true;

    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true);
      setEmailErrorMessage('Please enter a valid email address.');
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage('');
    }

    if (!password.value || password.value.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage('Password must be at least 6 characters long.');
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
    }

    return isValid;
  };

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
        <Grid2 className="d-flex align-items-center gap-2 mb-2">
          <Image src="/favicon.ico" alt="" width={48} height={48} />
          <Typography fontWeight={600} fontSize={20}>Web - Library</Typography>
        </Grid2>

        <Grid2 className="d-flex flex-column align-items-center">
          <Typography fontFamily='Arial' fontWeight={600} fontSize={40}>Welcome</Typography>
          <Typography color='#999'>Please login to your account</Typography>
        </Grid2>

        <Box
          component="form"
          onSubmit={handleSubmit}
          className="d-flex flex-column gap-2 my-4"
          sx={{ width: '100%' }}
        >
          <FormControl>
            <TextField
              error={emailError}
              helperText={emailErrorMessage}
              id="email"
              type="email"
              name="email"
              placeholder="Email address"
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
              placeholder="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              autoFocus
              required
              fullWidth
              variant="outlined"
              color={passwordError ? 'error' : 'primary'}
            />
          </FormControl>
          <Link
            href="/"
            className="d-flex justify-content-end text-decoration-none"
          >
            <Typography className="forgotpassword" fontSize={14} sx={{ color: '#000' }}>Forgot Password?</Typography>
          </Link>
        </Box>

        <Button
          variant="contained"
          type="submit"
          fullWidth
          onClick={validateInputs}
          className="d-flex align-items-center p-3 px-4"
          sx={{ borderRadius: '4px' }}>
          <Typography>Sign in</Typography>
        </Button>

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
          <Link href="/" className="text-decoration-none">
            <Typography className="signup" sx={{ color: '#055cdb' }}>Signup</Typography>
          </Link>
        </Grid2>
      </Box>
    </Box>
  );
}
