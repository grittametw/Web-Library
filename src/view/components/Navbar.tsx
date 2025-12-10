import { useState } from 'react'
import { Box, Grid2, Typography, InputBase, Paper, List, ListItemButton, Avatar, Button, Badge, Divider, IconButton } from '@mui/material'
import { NotificationsOutlined, Person, Search, Close, BookmarkAdd, Forum, Comment, Star } from '@mui/icons-material'
import { useAuth } from '@/hooks/useAuth'
import { useBooks } from '@/context/BooksContext'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

const mockNotifications = [
    {
        id: 1,
        type: 'new_product',
        title: 'New book!',
        message: '"夜葬 (ผีควักหน้า)" has been added to Horror.',
        time: '5 นาทีที่แล้ว',
        isRead: false,
        icon: <BookmarkAdd sx={{ color: '#4CAF50' }} />
    },
    {
        id: 2,
        type: 'review',
        title: 'Review your order',
        message: 'Review the product rating you ordered #12345.',
        time: '2 ชั่วโมงที่แล้ว',
        isRead: false,
        icon: <Star sx={{ color: '#FFC107' }} />
    },
    {
        id: 3,
        type: 'comment',
        title: 'New comment',
        message: 'Someone commented on your post in the community.',
        time: '5 ชั่วโมงที่แล้ว',
        isRead: true,
        icon: <Comment sx={{ color: '#2196F3' }} />
    },
    {
        id: 4,
        type: 'live-chat',
        title: 'Live Chat',
        message: 'Admin replied to your message on live-chat.',
        time: '1 วันที่แล้ว',
        isRead: true,
        icon: <Forum sx={{ color: '#9C27B0' }} />
    }
]

export default function Navbar() {
    const [search, setSearch] = useState('')
    const [showSuggestions, setShowSuggestions] = useState(false)
    const [showNotifications, setShowNotifications] = useState(false)
    const { user } = useAuth()
    const { books } = useBooks()
    const router = useRouter()

    const suggestions = search
        ? books.filter(
            b =>
                b.name.toLowerCase().includes(search.toLowerCase()) ||
                b.author.toLowerCase().includes(search.toLowerCase()) ||
                b.genre.toLowerCase().includes(search.toLowerCase())
        ).slice(0, 5)
        : []

    const unreadCount = mockNotifications.filter(n => !n.isRead).length

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value)
        setShowSuggestions(true)
    }

    const handleSearch = () => {
        if (search.trim()) {
            router.push(`/?search=${encodeURIComponent(search.trim())}`)
            setShowSuggestions(false)
        } else {
            setSearch('')
            window.location.href = '/'
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch()
        }
    }

    const handleSuggestionClick = (bookName: string) => {
        setSearch(bookName)
        router.push(`/?search=${encodeURIComponent(bookName)}`)
        setShowSuggestions(false)
    }

    const handleNotificationClick = () => {
        setShowNotifications(!showNotifications)
    }

    return (
        <Box
            className="d-flex justify-content-between align-items-center p-3 px-4 pt-4 shadow z-1"
            sx={{ width: '100%', backgroundColor: '#fff', position: 'relative' }}>
            <Box
                className="d-flex align-items-center"
                sx={{ width: 800, backgroundColor: '#f0f5ff', borderRadius: '8px' }}
            >
                <Search
                    sx={{ margin: '10px', cursor: 'pointer' }}
                    onClick={handleSearch}
                />
                <InputBase
                    placeholder="Search books"
                    sx={{ width: '100%' }}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
                    onFocus={() => setShowSuggestions(true)}
                />
                {showSuggestions && suggestions.length > 0 && (
                    <Paper
                        className="position-absolute"
                        sx={{ top: '60px', width: '800px', maxHeight: '300px' }}>
                        <List>
                            {suggestions.map((s, idx) => (
                                <ListItemButton
                                    key={s.name + idx}
                                    onMouseDown={() => handleSuggestionClick(s.name)}
                                >
                                    <Typography>
                                        <Image src={s.image} alt={s.name} width={40} height={60} className="mx-3" />
                                        {s.name} <span style={{ color: '#888' }}>({s.author}, {s.genre})</span>
                                    </Typography>
                                </ListItemButton>
                            ))}
                        </List>
                    </Paper>
                )}
            </Box>
            <Grid2 className="d-flex align-items-center gap-4 px-3">
                <IconButton
                    onClick={handleNotificationClick}
                    sx={{}}
                >
                    <Badge badgeContent={unreadCount} color="error">
                        <NotificationsOutlined />
                    </Badge>
                </IconButton>

                {showNotifications && (
                    <Paper
                        className="position-absolute"
                        sx={{
                            top: '70px',
                            right: '180px',
                            width: '350px',
                            maxHeight: '500px',
                            overflow: 'auto',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                            borderRadius: '8px'
                        }}
                    >
                        <Box sx={{
                            p: 2,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            borderBottom: '1px solid #e0e0e0'
                        }}>
                            <Typography fontSize={14} color='text.secondary'>
                                Recently Received Notifications
                            </Typography>
                            <IconButton
                                size="small"
                                onClick={() => setShowNotifications(false)}
                            >
                                <Close fontSize="small" />
                            </IconButton>
                        </Box>

                        <List sx={{ p: 0 }}>
                            {mockNotifications.map((notification, index) => (
                                <Box key={notification.id}>
                                    <ListItemButton
                                        sx={{
                                            py: 2,
                                            px: 2,
                                            backgroundColor: notification.isRead ? 'transparent' : '#f0f7ff',
                                            '&:hover': {
                                                backgroundColor: notification.isRead ? '#f5f5f5' : '#e3f2fd'
                                            }
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
                                            <Box sx={{
                                                mt: 0.5,
                                                display: 'flex',
                                                alignItems: 'flex-start'
                                            }}>
                                                {notification.icon}
                                            </Box>

                                            <Box sx={{ flex: 1 }}>
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        fontWeight: notification.isRead ? 400 : 600,
                                                        mb: 0.5
                                                    }}
                                                >
                                                    {notification.title}
                                                </Typography>
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        color: '#666',
                                                        fontSize: '0.875rem'
                                                    }}
                                                >
                                                    {notification.message}
                                                </Typography>
                                                <Typography
                                                    variant="caption"
                                                    sx={{
                                                        color: '#999',
                                                        mt: 0.5,
                                                        display: 'block'
                                                    }}
                                                >
                                                    {notification.time}
                                                </Typography>
                                            </Box>

                                            {!notification.isRead && (
                                                <Box sx={{
                                                    width: 8,
                                                    height: 8,
                                                    borderRadius: '50%',
                                                    backgroundColor: '#2196F3',
                                                    mt: 1
                                                }} />
                                            )}
                                        </Box>
                                    </ListItemButton>
                                    {index < mockNotifications.length - 1 && <Divider />}
                                </Box>
                            ))}
                        </List>

                        <Box sx={{
                            textAlign: 'center',
                            borderTop: '1px solid #e0e0e0'
                        }}>
                            <Button
                                fullWidth
                                sx={{ textTransform: 'none' }}
                            >
                                View All
                            </Button>
                        </Box>
                    </Paper>
                )}

                <Grid2 className="d-flex align-items-center gap-4">
                    <Link href="/account/profile">
                        <Avatar
                            src={user?.profilePicture || undefined}
                            alt={user?.name || "Guest"}
                            sx={{ width: 40, height: 40, border: '1px solid #ccc' }}
                        >
                            {!user?.profilePicture && <Person />}
                        </Avatar>
                    </Link>
                    <Typography>{user?.name || "Guest"}</Typography>
                </Grid2>
            </Grid2>
        </Box>
    )
}