'use client'

import { useState } from 'react'
import { 
    Box, Typography, Grid2, Paper, Button, Chip, 
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Select, MenuItem, FormControl, InputLabel,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    IconButton, Avatar, Tabs, Tab
} from '@mui/material'
import { 
    Add, Close, Search, ConfirmationNumber,
    CheckCircle, Schedule, Info, Send, AttachFile
} from '@mui/icons-material'
import { useCart } from '@/hooks/useCart'
import Navbar from '@/view/components/Navbar'
import Sidebar from '@/view/components/Sidebar'

interface Ticket {
    id: string
    title: string
    category: string
    priority: 'Low' | 'Medium' | 'High' | 'Urgent'
    status: 'Open' | 'In Progress' | 'Resolved' | 'Closed'
    createdAt: string
    updatedAt: string
    orderNumber?: string
    description: string
    replies: Reply[]
}

interface Reply {
    id: number
    author: string
    role: 'user' | 'support'
    message: string
    timestamp: string
}

type StatusColor = 'primary' | 'warning' | 'success' | 'default'
type PriorityColor = 'error' | 'warning' | 'info' | 'default'

export default function TicketPage() {
    const [createTicketOpen, setCreateTicketOpen] = useState(false)
    const [ticketDetailOpen, setTicketDetailOpen] = useState(false)
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
    const [activeTab, setActiveTab] = useState(0)
    const [searchQuery, setSearchQuery] = useState('')
    const [filterStatus, setFilterStatus] = useState('All')
    const [newTicketTitle, setNewTicketTitle] = useState('')
    const [newTicketCategory, setNewTicketCategory] = useState('')
    const [newTicketPriority, setNewTicketPriority] = useState<'Low' | 'Medium' | 'High' | 'Urgent'>('Medium')
    const [newTicketDescription, setNewTicketDescription] = useState('')
    const [newTicketOrderNumber, setNewTicketOrderNumber] = useState('')
    const [replyMessage, setReplyMessage] = useState('')
    const { cartCount } = useCart()

    const mockTickets: Ticket[] = [
        {
            id: 'TKT-001',
            title: 'Payment not processed',
            category: 'Payment',
            priority: 'High',
            status: 'In Progress',
            createdAt: '2024-10-25 10:30',
            updatedAt: '2024-10-26 14:20',
            orderNumber: 'ORD-12345',
            description: 'I completed payment via QR code but my order status still shows as pending. Payment was made 2 hours ago.',
            replies: [
                {
                    id: 1,
                    author: 'You',
                    role: 'user',
                    message: 'I completed payment via QR code but my order status still shows as pending.',
                    timestamp: '2024-10-25 10:30'
                },
                {
                    id: 2,
                    author: 'Support Team',
                    role: 'support',
                    message: 'Thank you for contacting us. We are checking your payment status with our payment provider. This usually takes 1-2 hours.',
                    timestamp: '2024-10-25 11:15'
                },
                {
                    id: 3,
                    author: 'Support Team',
                    role: 'support',
                    message: 'Good news! Your payment has been confirmed. Your order is now being processed.',
                    timestamp: '2024-10-26 14:20'
                }
            ]
        },
        {
            id: 'TKT-002',
            title: 'Wrong book received',
            category: 'Order Issue',
            priority: 'Medium',
            status: 'Open',
            createdAt: '2024-10-26 09:15',
            updatedAt: '2024-10-26 09:15',
            orderNumber: 'ORD-12346',
            description: 'I ordered "The Silent Patient" but received "Gone Girl" instead. Please help me exchange it.',
            replies: [
                {
                    id: 1,
                    author: 'You',
                    role: 'user',
                    message: 'I ordered "The Silent Patient" but received "Gone Girl" instead.',
                    timestamp: '2024-10-26 09:15'
                }
            ]
        },
        {
            id: 'TKT-003',
            title: 'Delayed shipping',
            category: 'Shipping',
            priority: 'Low',
            status: 'Resolved',
            createdAt: '2024-10-20 16:45',
            updatedAt: '2024-10-23 10:30',
            orderNumber: 'ORD-12340',
            description: 'My order was supposed to arrive on Oct 22 but I haven\'t received it yet.',
            replies: [
                {
                    id: 1,
                    author: 'You',
                    role: 'user',
                    message: 'My order was supposed to arrive on Oct 22 but I haven\'t received it yet.',
                    timestamp: '2024-10-20 16:45'
                },
                {
                    id: 2,
                    author: 'Support Team',
                    role: 'support',
                    message: 'We apologize for the delay. There was a delay with the courier service. Your package is now on its way.',
                    timestamp: '2024-10-21 09:00'
                },
                {
                    id: 3,
                    author: 'You',
                    role: 'user',
                    message: 'Thank you! I received it today.',
                    timestamp: '2024-10-23 10:30'
                }
            ]
        },
        {
            id: 'TKT-004',
            title: 'Cannot download E-book',
            category: 'Technical',
            priority: 'Urgent',
            status: 'Closed',
            createdAt: '2024-10-18 14:20',
            updatedAt: '2024-10-18 15:45',
            description: 'The download link in my email is not working. Error 404.',
            replies: [
                {
                    id: 1,
                    author: 'You',
                    role: 'user',
                    message: 'The download link in my email is not working. Error 404.',
                    timestamp: '2024-10-18 14:20'
                },
                {
                    id: 2,
                    author: 'Support Team',
                    role: 'support',
                    message: 'We\'ve resent the download link to your email. Please check and try again.',
                    timestamp: '2024-10-18 14:40'
                },
                {
                    id: 3,
                    author: 'You',
                    role: 'user',
                    message: 'Working now! Thank you.',
                    timestamp: '2024-10-18 15:45'
                }
            ]
        }
    ]

    const getStatusColor = (status: string): StatusColor => {
        switch(status) {
            case 'Open': return 'primary'
            case 'In Progress': return 'warning'
            case 'Resolved': return 'success'
            case 'Closed': return 'default'
            default: return 'default'
        }
    }

    const getPriorityColor = (priority: string): PriorityColor => {
        switch(priority) {
            case 'Urgent': return 'error'
            case 'High': return 'warning'
            case 'Medium': return 'info'
            case 'Low': return 'default'
            default: return 'default'
        }
    }

    const getStatusIcon = (status: string) => {
        switch(status) {
            case 'Open': return <Info />
            case 'In Progress': return <Schedule />
            case 'Resolved': return <CheckCircle />
            case 'Closed': return <CheckCircle />
            default: return <Info />
        }
    }

    const filteredTickets = mockTickets.filter(ticket => {
        const matchesSearch = ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            ticket.id.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesStatus = filterStatus === 'All' || ticket.status === filterStatus
        const matchesTab = activeTab === 0 || 
                          (activeTab === 1 && (ticket.status === 'Open' || ticket.status === 'In Progress')) ||
                          (activeTab === 2 && (ticket.status === 'Resolved' || ticket.status === 'Closed'))
        return matchesSearch && matchesStatus && matchesTab
    })

    const handleCreateTicket = () => {
        alert(`Ticket Created! (Mock - not saved)\n\nTitle: ${newTicketTitle}\nCategory: ${newTicketCategory}\nPriority: ${newTicketPriority}\nDescription: ${newTicketDescription}`)
        setCreateTicketOpen(false)
        setNewTicketTitle('')
        setNewTicketCategory('')
        setNewTicketPriority('Medium')
        setNewTicketDescription('')
        setNewTicketOrderNumber('')
    }

    const handleSendReply = () => {
        alert(`Reply sent! (Mock - not saved)\n\nMessage: ${replyMessage}`)
        setReplyMessage('')
    }

    const ticketStats = {
        open: mockTickets.filter(t => t.status === 'Open').length,
        inProgress: mockTickets.filter(t => t.status === 'In Progress').length,
        resolved: mockTickets.filter(t => t.status === 'Resolved').length,
        closed: mockTickets.filter(t => t.status === 'Closed').length
    }

    return (
        <Box className="d-flex" sx={{ height: '100vh', overflow: 'hidden' }}>
            <Sidebar cartCount={cartCount} />
            <Box className="content-area d-flex flex-column" sx={{ width: '100%' }}>
                <Navbar />
                <Box className="scrollbar" sx={{ overflowY: 'auto' }}>
                    <Box className="m-4">
                        <Box
                            className="d-flex justify-content-between align-items-center p-4 mb-4"
                            sx={{ backgroundColor: '#fff', borderRadius: '8px' }}
                        >
                            <Box>
                                <Typography variant="h4" fontWeight={700} sx={{ color: '#1976d2', mb: 1 }}>
                                    Support Tickets
                                </Typography>
                                <Typography color="text.secondary">
                                    Track and manage your support requests
                                </Typography>
                            </Box>
                            <Button
                                variant="contained"
                                startIcon={<Add />}
                                onClick={() => setCreateTicketOpen(true)}
                                sx={{ borderRadius: '8px', textTransform: 'none', px: 3 }}
                            >
                                Create Ticket
                            </Button>
                        </Box>

                        <Grid2 container spacing={3} sx={{ mb: 4 }}>
                            <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                                <Paper sx={{ p: 3, borderRadius: '8px', borderLeft: '4px solid #2196f3' }}>
                                    <Typography color="text.secondary" fontSize={14} sx={{ mb: 1 }}>
                                        Open Tickets
                                    </Typography>
                                    <Typography variant="h4" fontWeight={700}>
                                        {ticketStats.open}
                                    </Typography>
                                </Paper>
                            </Grid2>
                            <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                                <Paper sx={{ p: 3, borderRadius: '8px', borderLeft: '4px solid #ff9800' }}>
                                    <Typography color="text.secondary" fontSize={14} sx={{ mb: 1 }}>
                                        In Progress
                                    </Typography>
                                    <Typography variant="h4" fontWeight={700}>
                                        {ticketStats.inProgress}
                                    </Typography>
                                </Paper>
                            </Grid2>
                            <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                                <Paper sx={{ p: 3, borderRadius: '8px', borderLeft: '4px solid #4caf50' }}>
                                    <Typography color="text.secondary" fontSize={14} sx={{ mb: 1 }}>
                                        Resolved
                                    </Typography>
                                    <Typography variant="h4" fontWeight={700}>
                                        {ticketStats.resolved}
                                    </Typography>
                                </Paper>
                            </Grid2>
                            <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                                <Paper sx={{ p: 3, borderRadius: '8px', borderLeft: '4px solid #9e9e9e' }}>
                                    <Typography color="text.secondary" fontSize={14} sx={{ mb: 1 }}>
                                        Closed
                                    </Typography>
                                    <Typography variant="h4" fontWeight={700}>
                                        {ticketStats.closed}
                                    </Typography>
                                </Paper>
                            </Grid2>
                        </Grid2>

                        <Paper sx={{ borderRadius: '8px' }}>
                            <Tabs
                                value={activeTab}
                                onChange={(e, v) => setActiveTab(v)}
                                sx={{ borderBottom: '1px solid #e0e0e0' }}
                            >
                                <Tab label="All Tickets" />
                                <Tab label="Active" />
                                <Tab label="Completed" />
                            </Tabs>

                            <Box className="d-flex gap-2 p-3" sx={{ borderBottom: '1px solid #e0e0e0' }}>
                                <TextField
                                    placeholder="Search tickets..."
                                    size="small"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    InputProps={{
                                        startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
                                    }}
                                    sx={{ flex: 1 }}
                                />
                                <FormControl size="small" sx={{ minWidth: 150 }}>
                                    <InputLabel>Filter by Status</InputLabel>
                                    <Select
                                        value={filterStatus}
                                        label="Filter by Status"
                                        onChange={(e) => setFilterStatus(e.target.value)}
                                    >
                                        <MenuItem value="All">All Status</MenuItem>
                                        <MenuItem value="Open">Open</MenuItem>
                                        <MenuItem value="In Progress">In Progress</MenuItem>
                                        <MenuItem value="Resolved">Resolved</MenuItem>
                                        <MenuItem value="Closed">Closed</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>

                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell><strong>Ticket ID</strong></TableCell>
                                            <TableCell><strong>Title</strong></TableCell>
                                            <TableCell><strong>Category</strong></TableCell>
                                            <TableCell><strong>Priority</strong></TableCell>
                                            <TableCell><strong>Status</strong></TableCell>
                                            <TableCell><strong>Created</strong></TableCell>
                                            <TableCell><strong>Updated</strong></TableCell>
                                            <TableCell><strong>Actions</strong></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {filteredTickets.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={8} align="center">
                                                    <Box className="d-flex flex-column align-items-center gap-2 p-4">
                                                        <ConfirmationNumber sx={{ fontSize: 48, color: 'text.secondary' }} />
                                                        <Typography color="text.secondary">
                                                            No tickets found
                                                        </Typography>
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            filteredTickets.map((ticket) => (
                                                <TableRow
                                                    key={ticket.id}
                                                    sx={{
                                                        '&:hover': { backgroundColor: '#f5f5f5', cursor: 'pointer' }
                                                    }}
                                                    onClick={() => {
                                                        setSelectedTicket(ticket)
                                                        setTicketDetailOpen(true)
                                                    }}
                                                >
                                                    <TableCell>
                                                        <Typography fontWeight={600}>{ticket.id}</Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography>{ticket.title}</Typography>
                                                        {ticket.orderNumber && (
                                                            <Typography fontSize={12} color="text.secondary">
                                                                Order: {ticket.orderNumber}
                                                            </Typography>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Chip label={ticket.category} size="small" variant="outlined" />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Chip
                                                            label={ticket.priority}
                                                            size="small"
                                                            color={getPriorityColor(ticket.priority)}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Chip
                                                            icon={getStatusIcon(ticket.status)}
                                                            label={ticket.status}
                                                            size="small"
                                                            color={getStatusColor(ticket.status)}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography fontSize={13}>{ticket.createdAt}</Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography fontSize={13}>{ticket.updatedAt}</Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Button
                                                            size="small"
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                setSelectedTicket(ticket)
                                                                setTicketDetailOpen(true)
                                                            }}
                                                        >
                                                            View
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>
                    </Box>
                </Box>
            </Box>

            <Dialog open={createTicketOpen} onClose={() => setCreateTicketOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>
                    <Box className="d-flex justify-content-between align-items-center">
                        <Typography fontWeight={600} fontSize={20}>Create New Ticket</Typography>
                        <IconButton onClick={() => setCreateTicketOpen(false)}>
                            <Close />
                        </IconButton>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <Box className="d-flex flex-column gap-3 mt-2">
                        <TextField
                            fullWidth
                            label="Title"
                            placeholder="Brief description of your issue"
                            value={newTicketTitle}
                            onChange={(e) => setNewTicketTitle(e.target.value)}
                        />
                        <FormControl fullWidth>
                            <InputLabel>Category</InputLabel>
                            <Select
                                value={newTicketCategory}
                                label="Category"
                                onChange={(e) => setNewTicketCategory(e.target.value)}
                            >
                                <MenuItem value="Order Issue">Order Issue</MenuItem>
                                <MenuItem value="Payment">Payment</MenuItem>
                                <MenuItem value="Shipping">Shipping</MenuItem>
                                <MenuItem value="Technical">Technical</MenuItem>
                                <MenuItem value="Other">Other</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel>Priority</InputLabel>
                            <Select
                                value={newTicketPriority}
                                label="Priority"
                                onChange={(e) => setNewTicketPriority(e.target.value as 'Low' | 'Medium' | 'High' | 'Urgent')}
                            >
                                <MenuItem value="Low">Low</MenuItem>
                                <MenuItem value="Medium">Medium</MenuItem>
                                <MenuItem value="High">High</MenuItem>
                                <MenuItem value="Urgent">Urgent</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            fullWidth
                            label="Order Number (Optional)"
                            placeholder="e.g., ORD-12345"
                            value={newTicketOrderNumber}
                            onChange={(e) => setNewTicketOrderNumber(e.target.value)}
                        />
                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            label="Description"
                            placeholder="Please describe your issue in detail..."
                            value={newTicketDescription}
                            onChange={(e) => setNewTicketDescription(e.target.value)}
                        />
                        <Button
                            variant="outlined"
                            startIcon={<AttachFile />}
                            sx={{ textTransform: 'none' }}
                        >
                            Attach Files (Mock)
                        </Button>
                        <Box sx={{ p: 2, backgroundColor: '#fff3e0', borderRadius: '8px' }}>
                            <Typography fontSize={13} color="text.secondary">
                                💡 This is a demo. Your ticket won't be actually saved.
                            </Typography>
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setCreateTicketOpen(false)}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={handleCreateTicket}
                        disabled={!newTicketTitle || !newTicketCategory || !newTicketDescription}
                    >
                        Submit Ticket
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={ticketDetailOpen} onClose={() => setTicketDetailOpen(false)} maxWidth="md" fullWidth>
                {selectedTicket && (
                    <>
                        <DialogTitle>
                            <Box className="d-flex justify-content-between align-items-center">
                                <Box>
                                    <Typography fontWeight={600} fontSize={20}>
                                        {selectedTicket.id}: {selectedTicket.title}
                                    </Typography>
                                    <Box className="d-flex gap-2 mt-1">
                                        <Chip label={selectedTicket.category} size="small" />
                                        <Chip
                                            label={selectedTicket.priority}
                                            size="small"
                                            color={getPriorityColor(selectedTicket.priority)}
                                        />
                                        <Chip
                                            icon={getStatusIcon(selectedTicket.status)}
                                            label={selectedTicket.status}
                                            size="small"
                                            color={getStatusColor(selectedTicket.status)}
                                        />
                                    </Box>
                                </Box>
                                <IconButton onClick={() => setTicketDetailOpen(false)}>
                                    <Close />
                                </IconButton>
                            </Box>
                        </DialogTitle>
                        <DialogContent>
                            <Box className="d-flex flex-column gap-3">
                                <Paper sx={{ p: 2, backgroundColor: '#f5f5f5' }}>
                                    <Grid2 container spacing={2}>
                                        <Grid2 size={{ xs: 6 }}>
                                            <Typography fontSize={12} color="text.secondary">Created</Typography>
                                            <Typography fontSize={14}>{selectedTicket.createdAt}</Typography>
                                        </Grid2>
                                        <Grid2 size={{ xs: 6 }}>
                                            <Typography fontSize={12} color="text.secondary">Last Updated</Typography>
                                            <Typography fontSize={14}>{selectedTicket.updatedAt}</Typography>
                                        </Grid2>
                                        {selectedTicket.orderNumber && (
                                            <Grid2 size={{ xs: 12 }}>
                                                <Typography fontSize={12} color="text.secondary">Order Number</Typography>
                                                <Typography fontSize={14} fontWeight={600}>
                                                    {selectedTicket.orderNumber}
                                                </Typography>
                                            </Grid2>
                                        )}
                                    </Grid2>
                                </Paper>

                                <Box>
                                    <Typography fontWeight={600} sx={{ mb: 2 }}>
                                        Conversation
                                    </Typography>
                                    <Box className="d-flex flex-column gap-2">
                                        {selectedTicket.replies.map((reply) => (
                                            <Box
                                                key={reply.id}
                                                className="d-flex gap-2"
                                                sx={{
                                                    flexDirection: reply.role === 'user' ? 'row-reverse' : 'row'
                                                }}
                                            >
                                                <Avatar
                                                    sx={{
                                                        width: 36,
                                                        height: 36,
                                                        bgcolor: reply.role === 'user' ? '#1976d2' : '#757575'
                                                    }}
                                                >
                                                    {reply.author[0]}
                                                </Avatar>
                                                <Box sx={{ flex: 1, maxWidth: '80%' }}>
                                                    <Box
                                                        className="d-flex align-items-center gap-2 mb-1"
                                                        sx={{
                                                            justifyContent: reply.role === 'user' ? 'flex-end' : 'flex-start'
                                                        }}
                                                    >
                                                        <Typography fontWeight={600} fontSize={14}>
                                                            {reply.author}
                                                        </Typography>
                                                        <Typography fontSize={11} color="text.secondary">
                                                            {reply.timestamp}
                                                        </Typography>
                                                    </Box>
                                                    <Paper
                                                        sx={{
                                                            p: 2,
                                                            backgroundColor: reply.role === 'user' ? '#e3f2fd' : '#f5f5f5'
                                                        }}
                                                    >
                                                        <Typography fontSize={14}>{reply.message}</Typography>
                                                    </Paper>
                                                </Box>
                                            </Box>
                                        ))}
                                    </Box>
                                </Box>

                                {selectedTicket.status !== 'Closed' && (
                                    <Box>
                                        <Typography fontWeight={600} sx={{ mb: 2 }}>
                                            Reply to this ticket
                                        </Typography>
                                        <Box className="d-flex gap-2">
                                            <TextField
                                                fullWidth
                                                multiline
                                                rows={3}
                                                placeholder="Type your message..."
                                                value={replyMessage}
                                                onChange={(e) => setReplyMessage(e.target.value)}
                                            />
                                        </Box>
                                        <Box className="d-flex justify-content-end gap-2 mt-2">
                                            <Button
                                                variant="outlined"
                                                startIcon={<AttachFile />}
                                                sx={{ textTransform: 'none' }}
                                            >
                                                Attach
                                            </Button>
                                            <Button
                                                variant="contained"
                                                endIcon={<Send />}
                                                onClick={handleSendReply}
                                                disabled={!replyMessage.trim()}
                                                sx={{ textTransform: 'none' }}
                                            >
                                                Send Reply
                                            </Button>
                                        </Box>
                                    </Box>
                                )}

                                {selectedTicket.status === 'Closed' && (
                                    <Paper sx={{ p: 2, backgroundColor: '#e8f5e9', textAlign: 'center' }}>
                                        <Typography color="success.main" fontWeight={600}>
                                            ✓ This ticket is closed
                                        </Typography>
                                        <Typography fontSize={13} color="text.secondary" sx={{ mt: 1 }}>
                                            If you need further assistance, please create a new ticket
                                        </Typography>
                                    </Paper>
                                )}
                            </Box>
                        </DialogContent>
                    </>
                )}
            </Dialog>
        </Box>
    )
}