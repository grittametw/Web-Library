'use client'

import { Box, Autocomplete, TextField, Grid2, Typography, } from '@mui/material';
import { NotificationsOutlined } from '@mui/icons-material';
import Image from 'next/image';

export default function Navbar() {
    const top100books = [
        { title: 'A Tale of Two Cities', year: 1859 },
        { title: 'Harry Potter and the Philosopher Stone', year: 1997 },
    ]

    return (
        <Box className="d-flex justify-content-between align-items-center p-3 px-5 pt-4" sx={{  backgroundColor: '#fff' }}>
            <Autocomplete
                freeSolo
                options={top100books.map((option) => option.title)}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        sx={{ width: '300px' }}
                        label="Search input"
                        slotProps={{
                            input: {
                                ...params.InputProps,
                                type: 'search',
                            },
                        }}
                    />
                )}
            />

            <Grid2 className="d-flex align-items-center gap-2">
                <NotificationsOutlined />
                <Image src="/" alt="" width={32} height={32} />
                <Typography>Gong</Typography>
            </Grid2>
        </Box>
    )
}