'use client'

import { Box, Grid2, Typography, IconButton, InputBase, Avatar } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { NotificationsOutlined, Person } from '@mui/icons-material';
import Image from 'next/image';

export default function Navbar() {

    return (
        <Box
            className="d-flex justify-content-between align-items-center p-3 px-4 pt-4 shadow"
            sx={{ width: '100%', backgroundColor: '#fff' }}>
            <Box
                component="form"
                className="d-flex align-items-center px-2"
                sx={{ width: 400, backgroundColor: '#f0f5ff', borderRadius: '8px' }}
            >
                <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
                    <SearchIcon />
                </IconButton>
                <InputBase
                    placeholder="Search books"
                />
            </Box>

            <Grid2 className="d-flex align-items-center gap-4 px-4">
                <NotificationsOutlined />
                <Grid2 className="d-flex align-items-center gap-2">
                    <Avatar >
                        <Person />
                    </Avatar>
                    <Typography>Gong</Typography>
                </Grid2>
            </Grid2>
        </Box>
    )
}