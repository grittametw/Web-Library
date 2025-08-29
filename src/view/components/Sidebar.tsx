'use client'

import { Box, Grid2, Typography, List, ListItem } from '@mui/material';
import {
  HomeOutlined, ShoppingCartOutlined, FavoriteBorder,
  AssignmentIndOutlined, SupportAgentOutlined, LogoutOutlined
} from '@mui/icons-material';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import Image from 'next/image';
import '@/styles/Sidebar.css';

interface SidebarProps {
  cartCount?: number
}

export default function Sidebar({ cartCount }: SidebarProps) {
  const currentPath = usePathname()
  const { user, logout } = useAuth()

  return (
    <Box
      className="sidebar d-flex flex-column p-2 py-4 shadow z-2"
      sx={{ 
        width: '100%', 
        maxWidth: 280, 
        height: '100vh', 
        backgroundColor: '#fff'
      }}
    >
      <Grid2 className="d-flex justify-content-center align-items-center p-2 pb-4">
        <Link href="/" className="d-flex align-items-center gap-3 text-decoration-none text-dark">
          <Image src="/favicon.ico" alt="" width={48} height={48} />
          <Typography fontWeight={600} fontSize={20}>Web - Library</Typography>
        </Link>
      </Grid2>
      <Grid2 className="nav-pills flex-column mb-auto" sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <List className="nav pb-4" sx={{ borderBottom: '1px solid #ccc' }}>
          <ListItem className="nav-item">
            <Link
              href="/"
              className={`nav-link d-flex align-items-center gap-4 ${currentPath === '/' ? 'active' : ''}`}
              style={{ width: '100%' }}>
              <HomeOutlined />
              <Typography fontSize={22}>Home</Typography>
            </Link>
          </ListItem>

          <ListItem>
            <Link
              href="/mycart"
              className={`nav-link d-flex align-items-center gap-4 ${currentPath === '/mycart' ? 'active' : ''}`}
              style={{ width: '100%' }}>
              <ShoppingCartOutlined />
              <Grid2 className="d-flex justify-content-between align-items-center w-100">
                <Typography fontSize={22}>My Cart</Typography>
                {cartCount !== undefined && cartCount > 0 && (
                  <Box
                    sx={{
                      padding: '0 12px',
                      background: '#ff0f0f',
                      color: '#fff',
                      borderRadius: '24px',
                      fontSize: '24px',
                      textAlign: 'center',
                    }}
                  >
                    {cartCount}
                  </Box>
                )}
              </Grid2>
            </Link>
          </ListItem>
          <ListItem>
            <Link
              href="/favorite"
              className={`nav-link d-flex align-items-center gap-4 ${currentPath === '/favorite' ? 'active' : ''}`}
              style={{ width: '100%' }}>
              <FavoriteBorder />
              <Typography fontSize={22}>Favorite</Typography>
            </Link>
          </ListItem>
        </List>
        <List className="nav pt-4">
          <ListItem>
            <Link
              href="/account"
              className={`nav-link d-flex align-items-center gap-4 ${currentPath === '/account' ? 'active' : ''}`}
              style={{ width: '100%' }}>
              <AssignmentIndOutlined />
              <Typography fontSize={22}>Your Account</Typography>
            </Link>
          </ListItem>
          <ListItem>
            <Link
              href="/support"
              className={`nav-link d-flex align-items-center gap-4 ${currentPath === '/support' ? 'active' : ''}`}
              style={{ width: '100%' }}>
              <SupportAgentOutlined />
              <Typography fontSize={22}>Support</Typography>
            </Link>
          </ListItem>
          <ListItem>
            {user ? (
              <Link
                href="#"
                onClick={e => {
                  e.preventDefault()
                  logout()
                  window.location.href = '/login'
                }}
                className={"nav-link d-flex align-items-center gap-4"}
                style={{ width: '100%' }}>
                <LogoutOutlined />
                <Typography fontSize={22}>Logout</Typography>
              </Link>
            ) : (
              <Link
                href="/#"
                onClick={e => {
                  e.preventDefault()
                  window.location.href = '/login'
                }}
                className={"nav-link d-flex align-items-center gap-4"}
                style={{ width: '100%' }}>
                <LogoutOutlined />
                <Typography fontSize={22}>Login</Typography>
              </Link>
            )}
          </ListItem>
        </List>
      </Grid2>
    </Box>
  );
}