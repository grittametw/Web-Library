import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import '@/styles/category.css';
import { Box } from '@mui/material';

export default function Home() {

  return (
    <Box className="d-flex">
      <Sidebar />
      <Navbar />
    </Box>
  );
}
