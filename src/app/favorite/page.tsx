import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { Box } from '@mui/material';

export default function FavoritePage() {

  return (
    <Box className="d-flex">
      <Sidebar />
      <Navbar />
    </Box>
  );
}
