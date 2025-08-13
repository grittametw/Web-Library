'use client'

import { Box, Grid2, Typography, List, ListItem } from '@mui/material';
import {
  HomeOutlined, CategoryOutlined, ShoppingCartOutlined, FavoriteBorder,
  SettingsOutlined, SupportAgentOutlined, LogoutOutlined
} from '@mui/icons-material';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

interface SidebarProps {
  cartCount?: number;
}

export default function Sidebar({ cartCount }: SidebarProps) {
  const currentPath = usePathname()

  return (

    <Box
      className="sidebar d-flex flex-column p-4 shadow z-2"
      sx={{ width: '100%', maxWidth: 300, minHeight: '100vh', backgroundColor: '#fff' }}
    >
      <Grid2 className="d-flex justify-content-center align-items-center p-2 pb-4">
        <Link href="/" className="d-flex align-items-center gap-3 text-decoration-none text-dark">
          <Image src="/favicon.ico" alt="" width={48} height={48} />
          <Typography fontWeight={600} fontSize={20}>Web - Library</Typography>
        </Link>
      </Grid2>
      <Grid2 className="nav-pills flex-column mb-auto">
        <List className="nav pb-4" sx={{ borderBottom: '1px solid #ccc' }}>
          <ListItem className="nav-item">
            <Link
              href="/"
              className={`nav-link d-flex align-items-center gap-4 ${currentPath === '/' ? 'active' : ''}`}
              style={{ width: '100%' }}>
              <HomeOutlined />
              <Typography fontSize={24}>Home</Typography>
            </Link>
          </ListItem>
          
          <ListItem>
            <Link
              href="/mycart"
              className={`nav-link d-flex align-items-center gap-4 ${currentPath === '/mycart' ? 'active' : ''}`}
              style={{ width: '100%' }}>
              <ShoppingCartOutlined />
              <Grid2 className="d-flex justify-content-between align-items-center w-100">
                <Typography fontSize={24}>My Cart</Typography>
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
              <Typography fontSize={24}>Favorite</Typography>
            </Link>
          </ListItem>
        </List>
        <List className="nav pt-4" sx={{ fontSize: '24px' }}>
          <ListItem>
            <Link
              href="/setting"
              className={`nav-link d-flex align-items-center gap-4 ${currentPath === '/setting' ? 'active' : ''}`}
              style={{ width: '100%' }}>
              <SettingsOutlined />
              <Typography fontSize={24}>Settings</Typography>
            </Link>
          </ListItem>
          <ListItem>
            <Link
              href="/support"
              className={`nav-link d-flex align-items-center gap-4 ${currentPath === '/support' ? 'active' : ''}`}
              style={{ width: '100%' }}>
              <SupportAgentOutlined />
              <Typography fontSize={24}>Support</Typography>
            </Link>
          </ListItem>
          <ListItem>
            <Link
              href="/login"
              className={`nav-link d-flex align-items-center gap-4 ${currentPath === '/login' ? 'active' : ''}`}
              style={{ width: '100%' }}>
              <LogoutOutlined />
              <Typography fontSize={24}>Logout</Typography>
            </Link>
          </ListItem>
        </List>
      </Grid2>
    </Box>
  );
}
