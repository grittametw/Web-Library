'use client';

import { useEffect, useState } from 'react';
import { Box, Grid2, Typography, Rating, FormControl, Select, MenuItem, Button } from '@mui/material';
import { useParams } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
import Image from 'next/image';
import Navbar from '@/view/components/Navbar';
import Sidebar from '@/view/components/Sidebar';

interface Book {
    id: number
    name: string
    author: string
    image: string
    price: number
    rate: number
    genre: string
    description: string
}

export default function ItemPage() {
    const [search, setSearch] = useState('')
    const [books, setBooks] = useState<Book[]>([])
    const [book, setBook] = useState<Book | null>(null)
    const [loading, setLoading] = useState(true)
    const [sortType, setSortType] = useState<string>('1')
    const { name } = useParams()
    const {
        cart,
        handleAddToCart,
        handleIncrease,
        handleDecrease,
        getCartQuantity,
        totalPrice,
        cartCount,
    } = useCart()

    useEffect(() => {
        if (name) {
            setLoading(true)
            fetch(`/api/books/${encodeURIComponent(name as string)}`)
                .then(res => res.json())
                .then(data => {
                    if (data && !data.error) {
                        setBook(data)
                    } else {
                        setBook(null)
                    }
                    setLoading(false)
                })
                .catch(() => {
                    setBook(null)
                    setLoading(false)
                })
        }
    }, [name])

    return (
        <Box className="d-flex">
            <Sidebar />
            <Grid2 className="content-area d-flex flex-column" sx={{ width: '100%', overflow: 'hidden' }}>
                <Navbar onSearch={setSearch} books={books} />
                <Grid2 className="home-area d-flex" sx={{ overflowY: 'auto' }}>
                    <Grid2 className="d-flex flex-column gap-4" sx={{ width: '100%' }}>
                        <Box className="d-flex flex-column m-4 p-4 gap-2" sx={{ backgroundColor: '#fff', borderRadius: '8px' }}>
                            {loading ? (
                                <Typography>Loading...</Typography>
                            ) : book ? (
                                <Grid2>
                                    <Grid2 className="d-flex gap-4 pb-4 mb-4" sx={{ borderBottom: '1px solid #ccc' }}>
                                        <Box className="d-flex justify-content-center align-items-center" sx={{ width: '400px', height: '500px', border: 'solid 1px #ccc', borderRadius: '8px' }}>
                                            <Image src={book.image} alt={book.name} width={250} height={400} />
                                        </Box>
                                        <Grid2 className="d-flex flex-column gap-4">
                                            <Grid2 className="d-flex flex-column">
                                                <Typography fontWeight={600} fontSize={26}>{book.name}</Typography>
                                                <Typography fontSize={14} sx={{}}>
                                                    {book.rate}
                                                    <Rating
                                                        name="rate-feedback"
                                                        value={book.rate}
                                                        readOnly size="small"
                                                        precision={0.5} />
                                                </Typography>
                                            </Grid2>
                                            <Typography fontWeight={600} fontSize={26} className="my-2" sx={{ color: '#ff2a00' }}>฿{book.price}</Typography>
                                            <Box sx={{ minWidth: '100px', border: 'solid 1px #000', borderRadius: '8px' }}>
                                                <FormControl fullWidth>
                                                    <Select
                                                        labelId="demo-simple-select-label"
                                                        id="demo-simple-select"
                                                        value={sortType}
                                                        onChange={(e) => setSortType(e.target.value)}
                                                    >
                                                        <MenuItem value="1">ปกอ่อน (฿ {book.price})</MenuItem>
                                                        <MenuItem value="2">test-2</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            </Box>
                                            <Box
                                                className="d-flex justify-content-center align-items-center gap-4 mt-2"
                                                sx={{ width: '200px', border: 'solid 1px #ccc', borderRadius: '8px' }}>
                                                <Button
                                                    onClick={() => handleDecrease(book.id)}
                                                    sx={{ width: '100%', borderRadius: '0px', borderRight: '1px solid #ccc' }}>
                                                    <Typography fontSize={14}>-</Typography>
                                                </Button>
                                                <Typography fontSize={14}>0</Typography>
                                                <Button
                                                    onClick={() => handleIncrease(book.id)}
                                                    sx={{ width: '100%', borderRadius: '0px', borderLeft: '1px solid #ccc' }}>
                                                    <Typography fontSize={14}>+</Typography>
                                                </Button>
                                            </Box>
                                            <Button
                                                onClick={() => handleAddToCart(book)}
                                                variant="contained"
                                                sx={{ width: '100%', height: '40px', borderRadius: '8px', textTransform: 'none' }}>
                                                <Typography fontSize={14}>Add to cart</Typography>
                                            </Button>
                                        </Grid2>
                                    </Grid2>
                                    <Grid2 className="d-flex flex-column gap-2">
                                        <Typography>Author: {book.author}</Typography>
                                        <Typography className="mb-4">Genre: {book.genre}</Typography>
                                        <Typography>Description</Typography>
                                        <Typography>{book.description}</Typography>
                                    </Grid2>
                                </Grid2>
                            ) : (
                                <Typography>Book not found</Typography>
                            )}
                        </Box>
                    </Grid2>
                </Grid2>
            </Grid2>
        </Box>
    );
}
