import { Dialog, DialogContent, DialogActions, Button, Typography, Box } from '@mui/material'

interface ConfirmDialogProps {
    open: boolean
    title?: string
    message: string
    confirmText?: string
    cancelText?: string
    onConfirm: () => void
    onCancel: () => void
    loading?: boolean
}

export default function ConfirmDialog({
    open,
    title = 'Confirm Action',
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    onConfirm,
    onCancel,
    loading = false
}: ConfirmDialogProps) {
    return (
        <Dialog open={open} onClose={onCancel} maxWidth="sm" fullWidth>
            <DialogContent>
                <Box className="d-flex flex-column gap-2" sx={{ py: 2 }}>
                    <Typography variant="h6" fontWeight={600}>
                        {title}
                    </Typography>
                    <Typography color="text.secondary">
                        {message}
                    </Typography>
                </Box>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button
                    onClick={onCancel}
                    variant="outlined"
                    disabled={loading}
                    sx={{ minWidth: 100 }}
                >
                    {cancelText}
                </Button>
                <Button
                    onClick={onConfirm}
                    variant="contained"
                    disabled={loading}
                    sx={{ minWidth: 100 }}
                >
                    {loading ? 'Processing...' : confirmText}
                </Button>
            </DialogActions>
        </Dialog>
    )
}