import { Box, Grid2, Typography, List, ListItem } from '@mui/material';
import {
  HomeOutlined, CategoryOutlined, LocalLibraryOutlined, FavoriteBorderOutlined,
  SettingsOutlined, SupportAgentOutlined, LogoutOutlined, Menu
} from '@mui/icons-material';
import Link from 'next/link';
import Image from 'next/image';

export default function Sidebar() {

  return (

    <Box className="d-flex flex-column flex-shrink-0 p-4" style={{ width: '100%', maxWidth: 300, minHeight: '100vh', backgroundColor: '#fff' }}>
      <Grid2 className="d-flex justify-content-between align-items-center p-2 pb-4">
        <Link href="/" className="d-flex align-items-center gap-2">
          <Image src="/icon_web.png" alt="" width={48} height={48} />
          <Typography fontWeight={600} fontSize={20}>Web - Library</Typography>
        </Link>
        <Menu style={{ fontSize: '24px' }} />
      </Grid2>

      <Grid2 className="nav-pills flex-column mb-auto">
        <List className="nav pb-4" style={{ borderBottom: '1px solid #ebedf4' }}>
          <ListItem className="nav-item">
            <Link href="#" className="nav-link active d-flex align-items-center gap-4" aria-current="page" style={{ fontSize: '24px', width: '100%' }}>
              <HomeOutlined />
              <Typography fontSize={24}>Home</Typography>
            </Link>
          </ListItem>
          <ListItem>
            <Link href="#" className="nav-link d-flex align-items-center gap-4" style={{ fontSize: '24px', width: '100%' }}>
              <CategoryOutlined />
              <Typography fontSize={24}>Category</Typography>
            </Link>
          </ListItem>
          <ListItem>
            <Link href="#" className="nav-link d-flex align-items-center gap-4" style={{ fontSize: '24px', width: '100%' }}>
              <LocalLibraryOutlined />
              <Typography fontSize={24}>My Library</Typography>
            </Link>
          </ListItem>
          <ListItem>
            <Link href="#" className="nav-link d-flex align-items-center gap-4" style={{ fontSize: '24px', width: '100%' }}>
              <FavoriteBorderOutlined />
              <Typography fontSize={24}>Favourite</Typography>
            </Link>
          </ListItem>
        </List>
        <List className="nav pt-4" style={{ fontSize: '24px' }}>
          <ListItem>
            <Link href="#" className="nav-link d-flex align-items-center gap-4" style={{ fontSize: '24px', width: '100%' }}>
              <SettingsOutlined />
              <Typography fontSize={24}>Settings</Typography>
            </Link>
          </ListItem>
          <ListItem>
            <Link href="#" className="nav-link d-flex align-items-center gap-4" style={{ fontSize: '24px', width: '100%' }}>
              <SupportAgentOutlined />
              <Typography fontSize={24}>Support</Typography>
            </Link>
          </ListItem>
          <ListItem>
            <Link href="#" className="nav-link d-flex align-items-center gap-4" style={{ fontSize: '24px', width: '100%' }}>
              <LogoutOutlined />
              <Typography fontSize={24}>Logout</Typography>
            </Link>
          </ListItem>
        </List>
      </Grid2>
    </Box>
  );
}
