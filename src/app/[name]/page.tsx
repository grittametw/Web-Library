'use client'

import { useEffect, useState } from 'react';
import { Box, Grid2, Typography, Rating, FormControl, Select, MenuItem, Button, Snackbar, Alert } from '@mui/material';
import { useParams } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
import { Book } from '@/types/book'
import Image from 'next/image';
import Navbar from '@/view/components/Navbar';
import Sidebar from '@/view/components/Sidebar';
import QuantityButton from '@/view/components/QuantityButton';

export default function ItemPage() {
    const [book, setBook] = useState<Book | null>(null)
    const [loading, setLoading] = useState(true)
    const [selectedOptionIds, setSelectedOptionIds] = useState<{ [bookId: number]: number }>({})
    const [quantity, setQuantity] = useState(1)
    const [openSnackbar, setOpenSnackbar] = useState(false)
    const [snackbarMessage, setSnackbarMessage] = useState('')
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success')
    const { name } = useParams()
    const {
        cart,
        handleAddToCart,
        getAvailableStock,
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

    useEffect(() => {
        if (book && selectedOptionId) {
            const selectedOption = book.options.find(opt => opt.id === selectedOptionId)
            if (selectedOption) {
                const availableStock = getAvailableStock(book.id, selectedOptionId, selectedOption.stock)
                if (quantity > availableStock) {
                    setQuantity(Math.max(1, availableStock))
                }
            }
        }
    }, [book, selectedOptionIds, cart])

    const handleAddToCartClick = () => {
        if (book && selectedOptionId) {
            const result = handleAddToCart(book, selectedOptionId, quantity)

            if (result.success) {
                setSnackbarMessage(result.isUpdate ? "Updated quantity in cart" : "Added to cart")
                setSnackbarSeverity('success')
            } else {
                setSnackbarMessage(result.error || "Failed to add to cart")
                setSnackbarSeverity('error')
            }

            setOpenSnackbar(true)
        }
    }

    const getSelectedOptionAvailableStock = () => {
        if (!book || !selectedOptionId) return 0
        const selectedOption = book.options.find(opt => opt.id === (selectedOptionIds[book.id] ?? book.options[0]?.id))?.stock
        if (!selectedOption) return 0
        return getAvailableStock(book.id, selectedOptionId, selectedOption)
    }

    const selectedOptionId = selectedOptionIds[book?.id ?? 0] ?? book?.options[0]?.id
    const selectedOption = book?.options.find(opt => opt.id === selectedOptionId)
    const selectedOptionPrice = selectedOption?.price ?? 0
    const selectedOptionStock = selectedOption?.stock ?? 0
    const availableStock = getSelectedOptionAvailableStock()

    return (
        <Box className="d-flex">
            <Sidebar cartCount={cartCount} />
            <Grid2 className="content-area d-flex flex-column" sx={{ width: '100%', overflow: 'hidden' }}>
                <Navbar />
                <Grid2 className="d-flex" sx={{ overflowY: 'auto' }}>
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
                                                <Typography fontSize={14} className="d-flex gap-1">
                                                    {book.rate > 0 ? book.rate.toLocaleString() : "0"}
                                                    <Rating
                                                        name="rate-feedback"
                                                        value={book.rate}
                                                        readOnly size="small"
                                                        precision={0.5} />
                                                </Typography>
                                            </Grid2>
                                            <Typography fontWeight={600} fontSize={26} className="my-2" sx={{ color: '#ff2a00' }}>
                                                ฿{selectedOptionPrice}
                                            </Typography>
                                            <Box sx={{ width: '350px', border: 'solid 1px #000', borderRadius: '8px' }}>
                                                <FormControl fullWidth>
                                                    <Select
                                                        labelId="book-option-select-label"
                                                        id="book-option-select"
                                                        value={selectedOptionId ?? ''}
                                                        onChange={(e) =>
                                                            setSelectedOptionIds((prev) => ({
                                                                ...prev,
                                                                [book.id]: Number(e.target.value),
                                                            }))
                                                        }>
                                                        {book.options.map(option => {
                                                            return (
                                                                <MenuItem key={option.id} value={option.id}>
                                                                    {option.type} (฿ {option.price})
                                                                </MenuItem>
                                                            )
                                                        })}
                                                    </Select>
                                                </FormControl>
                                            </Box>
                                            <Grid2 className="d-flex align-items-center gap-4">
                                                <Grid2 sx={{ width: '200px' }}>
                                                    <QuantityButton
                                                        quantity={quantity}
                                                        onIncrease={() => setQuantity(prev => {
                                                            if (prev >= availableStock) return prev
                                                            return Math.min(availableStock, prev + 1)
                                                        })}
                                                        onDecrease={() => setQuantity(prev => Math.max(1, prev - 1))}
                                                    />
                                                </Grid2>
                                                <Typography color="text.secondary">
                                                    Stock: {selectedOptionStock}
                                                    {selectedOptionStock === 0 && " (Out of stock)"}
                                                </Typography>
                                            </Grid2>
                                            <Button
                                                onClick={handleAddToCartClick}
                                                variant="contained"
                                                disabled={availableStock === 0}
                                                sx={{
                                                    width: '350px',
                                                    height: '40px',
                                                    borderRadius: '8px',
                                                    textTransform: 'none',
                                                    backgroundColor: availableStock === 0 ? '#ccc' : undefined
                                                }}>
                                                <Typography fontSize={14}>{availableStock === 0 ? "Out of Stock" : "Add to cart"}</Typography>
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
            <Snackbar
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={() => setOpenSnackbar(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert severity={snackbarSeverity} onClose={() => setOpenSnackbar(false)}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    )
}
