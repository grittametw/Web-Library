'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/view/components/Navbar';
import Sidebar from '@/view/components/Sidebar';
import { Box, Grid2, Typography } from '@mui/material';
import { useParams } from 'next/navigation';

interface Book {
    id: number
    name: string
    author: string
    image: string
    price: number
    rate: number
    genre: string
}

export default function ItemPage() {
    const [search, setSearch] = useState('')
    const [books, setBooks] = useState<Book[]>([])
    const { name } = useParams();
    const [book, setBook] = useState<Book | null>(null);

    useEffect(() => {
        if (name) {
            fetch(`/api/books/${encodeURIComponent(name as string)}`)
                .then(res => res.json())
                .then(data => setBook(data))
                .catch(err => setBook(null));
        }
    }, [name]);

    return (
        <Box className="d-flex">
            <Sidebar />
            <Grid2 className="content-area d-flex flex-column" sx={{ width: '100%', overflow: 'hidden' }}>
                <Navbar onSearch={setSearch} books={books} />
                <Grid2 className="home-area d-flex" sx={{ overflowY: 'auto' }}>
                    <Grid2 className="d-flex flex-column gap-4" sx={{ width: '100%' }}>
                        <Box className="d-flex flex-column m-4 p-2 gap-2" sx={{ backgroundColor: '#fff', borderRadius: '8px' }}>
                            {book ? (
                                <Grid2>
                                    <Typography variant="h4" fontWeight={600}>{book.name}</Typography>
                                    <Typography variant="subtitle1" color="text.secondary">by {book.author}</Typography>
                                    <Box sx={{ mt: 2 }}>
                                        <img src={book.image} alt={book.name} style={{ maxWidth: 200, borderRadius: 8 }} />
                                    </Box>
                                    <Typography sx={{ mt: 2 }}>Genre: {book.genre}</Typography>
                                    <Typography sx={{ mt: 1 }}>Price: {book.price} บาท</Typography>
                                    <Typography sx={{ mt: 1 }}>Rating: {book.rate} / 5</Typography>
                                </Grid2>
                            ) : (
                                <Typography>Loading...</Typography>
                            )}
                        </Box>
                    </Grid2>
                </Grid2>
            </Grid2>
        </Box>
    );
}
