import { Box, Grid2, Typography, Button } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';

interface CartItem {
    id: number
    name: string
    image: string
    price: number
    quantity: number
}

interface CartbarProps {
    cart: CartItem[]
    isCartOpen: boolean
    totalPrice: number
    getCartQuantity: (id: number) => number
    handleIncrease: (id: number) => void
    handleDecrease: (id: number) => void
}

export default function Cartbar({
    cart,
    isCartOpen,
    totalPrice,
    getCartQuantity,
    handleIncrease,
    handleDecrease,
}: CartbarProps) {
    return (
        <Box className={`Cartbar ${isCartOpen ? 'cart-open' : ''}`} sx={{ backgroundColor: '#fff' }}>
            {isCartOpen && (
                <>
                    <Box className="d-flex flex-column align-items-center" sx={{ borderBottom: 'solid 1px #ccc', width: '100%', paddingBottom: '16px' }}>
                        <Typography>Total</Typography>
                        <Typography>฿ {totalPrice}</Typography>
                        <Link
                            href="/mycart"
                            className="d-flex justify-content-center align-items-center p-2"
                            style={{ width: '160px', textDecoration: 'none', border: 'solid 1px #000', borderRadius: '8px'}}>
                            <Typography fontSize={14} color='#000'>Go to cart</Typography>
                        </Link>
                    </Box>
                    <Box className="d-flex flex-column align-items-center" sx={{ borderBottom: 'solid 1px #ccc', width: '100%' }}>
                        {cart.map(item => {
                            const quantity = getCartQuantity(item.id)
                            return (
                                <Box key={item.id} className="d-flex flex-column align-items-center p-2">
                                    <Grid2 className="d-flex justify-content-between align-items-center gap-2" sx={{ width: '100%' }}>
                                        <Image src={item.image} alt={item.name} width={48} height={72} />
                                        <Typography fontSize={14}>{item.name}</Typography>
                                        <Typography fontSize={14}>x{item.quantity}</Typography>
                                        <Typography fontSize={14}>฿{item.price * item.quantity}</Typography>
                                    </Grid2>
                                    <Box
                                        className="d-flex justify-content-center align-items-center gap-4 mt-2"
                                        sx={{ border: 'solid 1px #ccc', borderRadius: '8px' }}>
                                        <Button
                                            onClick={() => handleDecrease(item.id)}
                                            sx={{ width: 'auto', borderRadius: '0px', borderRight: '1px solid #ccc' }}>
                                            <Typography fontSize={14}>-</Typography>
                                        </Button>
                                        <Typography fontSize={14}>{quantity}</Typography>
                                        <Button
                                            onClick={() => handleIncrease(item.id)}
                                            sx={{ width: 'auto', borderRadius: '0px', borderLeft: '1px solid #ccc' }}>
                                            <Typography fontSize={14}>+</Typography>
                                        </Button>
                                    </Box>
                                </Box>
                            )
                        })}
                    </Box>
                </>
            )}
        </Box>
    )
}