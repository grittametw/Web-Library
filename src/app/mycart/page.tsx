import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import '@/styles/category.css';
import { Box } from '@mui/material';

export default function MyCart() {

  return (
    <Box className="d-flex">
      <Sidebar />
      <Navbar />
    </Box>
  );
}
