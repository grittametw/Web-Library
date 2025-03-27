import Sidebar from "@/components/Sidebar";
import Navbar from '@/components/Navbar';
import "@/styles/home.css";
import { Box, Grid2, Typography, List, ListItem } from '@mui/material';

export default function Home() {

  return (
    <Box className="d-flex">
      <Sidebar />
      <Navbar />
    </Box>
  );
}
