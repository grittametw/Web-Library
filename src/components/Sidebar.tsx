'use client'

import { Box, Grid2, Typography, List, ListItem } from '@mui/material';
import {
  HomeOutlined, CategoryOutlined, LocalLibraryOutlined, FavoriteBorderOutlined,
  SettingsOutlined, SupportAgentOutlined, LogoutOutlined
} from '@mui/icons-material';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const currentPath = usePathname()

  return (

    <Box
      className="sidebar d-flex flex-column p-4 shadow z-1"
      sx={{ width: '100%', maxWidth: 300, minHeight: '100vh', backgroundColor: '#fff' }}>
      <Grid2 className="d-flex justify-content-center align-items-center p-2 pb-4">
        <Link href="/" className="d-flex align-items-center gap-3">
          <Image src="/icon_web.png" alt="" width={48} height={48} />
          <Typography fontWeight={600} fontSize={20}>Web - Library</Typography>
        </Link>
      </Grid2>

      <Grid2 className="nav-pills flex-column mb-auto">
        <List className="nav pb-4" sx={{ borderBottom: '1px solid #ebedf4' }}>
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
              href="/category"
              className={`nav-link d-flex align-items-center gap-4 ${currentPath === '/category' ? 'active' : ''}`}
              style={{ width: '100%' }}>
              <CategoryOutlined />
              <Typography fontSize={24}>Category</Typography>
            </Link>
          </ListItem>
          <ListItem>
            <Link
              href="/library"
              className={`nav-link d-flex align-items-center gap-4 ${currentPath === '/library' ? 'active' : ''}`}
              style={{ width: '100%' }}>
              <LocalLibraryOutlined />
              <Typography fontSize={24}>My Library</Typography>
            </Link>
          </ListItem>
          <ListItem>
            <Link
              href="/favourite"
              className={`nav-link d-flex align-items-center gap-4 ${currentPath === '/favourite' ? 'active' : ''}`}
              style={{ width: '100%' }}>
              <FavoriteBorderOutlined />
              <Typography fontSize={24}>Favourite</Typography>
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
              href="#"
              className={`nav-link d-flex align-items-center gap-4 ${currentPath === '#' ? 'active' : ''}`}
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
