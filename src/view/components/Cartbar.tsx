import { Box, Grid2, Typography, Button } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import QuantityButton from './QuantityButton';

interface CartItem {
    id: number
    name: string
    image: string
    price: number
    quantity: number
    option_id: number
    option_type: string
    stock: number
}

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
    return (
        <Box className={`Cartbar ${isCartOpen ? 'cart-open' : ''}`} sx={{ minHeight: '100vh', backgroundColor: '#fff', overflowX: 'hidden' }}>
            {isCartOpen && (
                <>
                    <Box className="d-flex flex-column align-items-center p-4 gap-2" sx={{ width: '100%', borderBottom: 'solid 1px #ccc', paddingBottom: '16px' }}>
                        <Typography>Total</Typography>
                        <Typography>฿ {totalPrice}</Typography>
                        <Link
                            href="/mycart"
                            className="d-flex justify-content-center align-items-center p-2"
                            style={{ width: '160px', textDecoration: 'none', border: 'solid 1px #000', borderRadius: '8px' }}>
                            <Typography fontSize={14} color='#000'>Go to cart</Typography>
                        </Link>
                    </Box>
                    <Box className="d-flex flex-column align-items-center" sx={{ width: '100%', height: 'auto' }}>
                        {cart.map(item => {
                            const quantity = getCartQuantity(item.id, item.option_id)
                            return (
                                <Box
                                    key={item.id + '-' + item.option_id}
                                    className="d-flex flex-column align-items-center p-4"
                                    sx={{ width: '100%', borderBottom: 'solid 1px #ccc', paddingBottom: '16px' }}
                                >
                                    <Grid2 className="d-flex justify-content-between align-items-center gap-2" sx={{ width: '100%' }}>
                                        <Image src={item.image} alt={item.name} width={48} height={72} />
                                        <Typography fontSize={14}>{item.name}</Typography>
                                        <Typography fontSize={14}>{item.option_type} (฿{item.price})</Typography>
                                    </Grid2>
                                    <QuantityButton
                                        quantity={quantity}
                                        onIncrease={() => handleIncrease(item.id, item.option_id)}
                                        onDecrease={() => handleDecrease(item.id, item.option_id)}
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