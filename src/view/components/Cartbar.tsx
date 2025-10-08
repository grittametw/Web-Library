import { Box, Grid2, Typography } from '@mui/material'
import { useCart } from '@/hooks/useCart'
import { CartItem } from '@/types/cart'
import Image from 'next/image'
import Link from 'next/link'
import QuantityButton from './QuantityButton'

interface CartbarProps {
    cart: CartItem[]
    isCartOpen: boolean
    totalPrice: number
    getCartQuantity: (id: number, optionId: number) => number
    handleIncrease: (id: number, optionId: number) => void
    handleDecrease: (id: number, optionId: number) => void
}

export default function Cartbar({
    cart,
    isCartOpen,
    totalPrice,
    getCartQuantity,
    handleIncrease,
    handleDecrease,
}: CartbarProps) {
    const { getAvailableStock } = useCart()

    return (
        <Box
            className={`Cartbar ${isCartOpen ? 'cart-open' : ''}`}
            sx={{
                height: '100vh',
                backgroundColor: '#fff',
                position: 'fixed',
                right: 0,
                top: 0,
                zIndex: 10,
                display: 'flex',
                flexDirection: 'column',
                transition: 'width 0.3s ease',
                overflow: 'hidden',
                boxShadow: '0 0 10px #ccc'
            }}
        >
            {isCartOpen && (
                <>
                    <Box
                        className="d-flex flex-column align-items-center p-4 gap-2"
                        sx={{
                            width: '100%',
                            borderBottom: 'solid 1px #ccc',
                            paddingBottom: '16px',
                            flexShrink: 0
                        }}
                    >
                        <Typography>Total</Typography>
                        <Typography>฿ {totalPrice}</Typography>
                        <Link
                            href="/mycart"
                            className="cartButton d-flex justify-content-center align-items-center p-2"
                            style={{ width: '160px', textDecoration: 'none', border: 'solid 1px #000', borderRadius: '8px' }}>
                            <Typography fontSize={14} color="#000">Go to cart</Typography>
                        </Link>
                    </Box>
                    <Box
                        className="d-flex flex-column align-items-center pb-4"
                        sx={{
                            width: '100%',
                            flex: 1,
                            overflowY: 'auto'
                        }}
                    >
                        {cart.map(item => {
                            const quantity = getCartQuantity(item.book_id, item.book_option_id)
                            const availableStock = getAvailableStock(item.book_id, item.book_option_id, item.stock)
                            return (
                                <Box
                                    key={item.id + '-' + item.book_option_id}
                                    className="d-flex flex-column align-items-center p-4 gap-4"
                                    sx={{ width: '100%', borderBottom: 'solid 1px #ccc', paddingBottom: '16px' }}
                                >
                                    <Grid2 className="d-flex justify-content-center align-items-center gap-2" sx={{ width: '100%' }}>
                                        <Image src={item.image} alt={item.name} width={48} height={72} />
                                        <Grid2 className="d-flex flex-column">
                                            <Grid2 className="d-flex gap-4">
                                                <Typography fontSize={14} width={80}>{item.name}</Typography>
                                                <Grid2 className="d-flex flex-column">
                                                    <Typography fontSize={14}>{item.option_type}</Typography>
                                                    <Typography fontSize={14}>(฿{item.price})</Typography>
                                                </Grid2>
                                            </Grid2>
                                            {availableStock === 0 && (
                                                <Typography fontSize={12} color="error" sx={{ mt: 0.5 }}>
                                                    Available stock: {availableStock}
                                                </Typography>
                                            )}
                                        </Grid2>
                                    </Grid2>
                                    <QuantityButton
                                        quantity={quantity}
                                        onIncrease={() => handleIncrease(item.book_id, item.book_option_id)}
                                        onDecrease={() => handleDecrease(item.book_id, item.book_option_id)}
                                    />
                                </Box>
                            )
                        })}
                    </Box>
                </>
            )}
        </Box>
    )
}