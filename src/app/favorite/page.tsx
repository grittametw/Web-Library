import Navbar from '@/view/components/Navbar';
import Sidebar from '@/view/components/Sidebar';
import { Box } from '@mui/material';

export default function FavoritePage() {

  return (
    <Box className="d-flex">
      <Sidebar />
      <Navbar />
    </Box>
  );
}
