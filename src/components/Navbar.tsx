'use client'

import { Box, Autocomplete, TextField, Grid2, Typography, Input, IconButton, InputBase } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { NotificationsOutlined } from '@mui/icons-material';
import Image from 'next/image';

export default function Navbar() {
    const top100books = [
        { title: 'A Tale of Two Cities', year: 1859 },
        { title: 'Harry Potter and the Philosopher Stone', year: 1997 },
    ]

    return (
        <Box
            className="d-flex justify-content-between align-items-center p-3 px-5 pt-4 shadow"
            sx={{ width: '100%', height: '100%', backgroundColor: '#fff' }}>
            <Box
                component="form"
                sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400, backgroundColor: '#f1f3f4', borderRadius: '8px' }}
            >
                <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
                    <SearchIcon />
                </IconButton>
                <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    placeholder="Search books"
                    inputProps={{ 'aria-label': 'search google maps' }}
                />
            </Box>

            <Grid2 className="d-flex align-items-center gap-2">
                <NotificationsOutlined />
                <Image src="/" alt="" width={32} height={32} />
                <Typography>Gong</Typography>
            </Grid2>
        </Box>
    )
}