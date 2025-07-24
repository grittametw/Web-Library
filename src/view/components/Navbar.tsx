'use client'

import { Box, Grid2, Typography, InputBase, Avatar } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { NotificationsOutlined, Person } from '@mui/icons-material';

export default function Navbar() {

    return (
        <Box
            className="d-flex justify-content-between align-items-center p-3 px-4 pt-4 shadow z-1"
            sx={{ width: '100%', backgroundColor: '#fff' }}>
            <Box
                component="form"
                className="d-flex align-items-center"
                sx={{ width: 400, backgroundColor: '#f0f5ff', borderRadius: '8px' }}
            >
                <SearchIcon sx={{ margin: '10px' }} />
                <InputBase
                    placeholder="Search books"
                    sx={{ width: '100%' }}
                />
            </Box>
            <Grid2 className="d-flex align-items-center gap-4 px-4">
                <NotificationsOutlined />
                <Grid2 className="d-flex align-items-center gap-2">
                    <Avatar >
                        <Person />
                    </Avatar>
                    <Typography>User</Typography>
                </Grid2>
            </Grid2>
        </Box>
    )
}