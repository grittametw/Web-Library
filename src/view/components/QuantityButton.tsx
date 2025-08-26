import { Box, Button, Typography } from '@mui/material';

interface QuantityButtonProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
}

export default function QuantityButton({ quantity, onIncrease, onDecrease }: QuantityButtonProps) {
  return (
    <Box
      className="d-flex justify-content-center align-items-center gap-4 mt-2"
      sx={{ border: 'solid 1px #ccc', borderRadius: '8px' }}>
      <Button
        onClick={onDecrease}
        sx={{ width: '100%', borderRadius: '0px', borderRight: '1px solid #ccc' }}>
        <Typography fontSize={14}>-</Typography>
      </Button>
      <Typography fontSize={14}>{quantity}</Typography>
      <Button
        onClick={onIncrease}
        sx={{ width: '100%', borderRadius: '0px', borderLeft: '1px solid #ccc' }}>
        <Typography fontSize={14}>+</Typography>
      </Button>
    </Box>
  );
}