import Sidebar from "@/components/Sidebar";
import Navbar from '@/components/Navbar';
import "@/styles/home.css";
import { Box, Grid2, Typography, Button } from '@mui/material';
import { Sort } from '@mui/icons-material';

export default function Home() {

  return (
    <Box className="d-flex">
      <Sidebar />
      <Grid2 className="d-flex flex-column gap-4" sx={{ width: '100%' }}>
        <Navbar />

        <Box className="d-flex flex-column mx-4 p-2 px-4" sx={{ backgroundColor: '#fff', borderRadius: '8px' }}>
          <Typography fontWeight={600} fontSize={20}>Recommended</Typography>
        </Box>

        <Box className="d-flex flex-column mx-4 p-2 px-4" sx={{ backgroundColor: '#fff', borderRadius: '8px' }}>
          <Grid2 className="d-flex justify-content-between align-items-center">
            <Typography fontWeight={600} fontSize={20}>Categories</Typography>
            <Button sx={{ minWidth: '20px', backgroundColor: '#f0f5ff', borderRadius: '8px' }}>
              <Sort sx={{ fontSize: '20px' }} />
            </Button>
          </Grid2>

          <Grid2 className="d-flex gap-2">
            <Button
              variant="contained"
              sx={{ borderRadius: '8px', textTransform: 'none' }}
            >
              <Typography>All</Typography>
            </Button>
            <Button
              variant="contained"
              disableElevation
              sx={{ backgroundColor: '#e7f1fe', borderRadius: '8px', textTransform: 'none' }}
            >
              <Typography sx={{ color: '#000' }}>Sci-Fi</Typography>
            </Button>
            <Button
              variant="contained"
              disableElevation
              sx={{ backgroundColor: '#e7f1fe', borderRadius: '8px', textTransform: 'none' }}
            >
              <Typography sx={{ color: '#000' }}>Fantasy</Typography>
            </Button>
            <Button
              variant="contained"
              disableElevation
              sx={{ backgroundColor: '#e7f1fe', borderRadius: '8px', textTransform: 'none' }}
            >
              <Typography sx={{ color: '#000' }}>Drama</Typography>
            </Button>
            <Button
              variant="contained"
              disableElevation
              sx={{ backgroundColor: '#e7f1fe', borderRadius: '8px', textTransform: 'none' }}
            >
              <Typography sx={{ color: '#000' }}>Horror</Typography>
            </Button>
          </Grid2>
        </Box>
      </Grid2>
    </Box>
  );
}
