'use client'

import { useState } from 'react'
import { 
    Box, Typography, Grid2, Paper, Avatar, Button, IconButton, 
    Chip, TextField, Dialog, DialogTitle, DialogContent, DialogActions,
    Select, MenuItem, FormControl, InputLabel, Tabs, Tab, SelectChangeEvent
} from '@mui/material'
import { ThumbUp, ChatBubbleOutline, Share, Create, TrendingUp, Close, EmojiEvents } from '@mui/icons-material'
import { useCart } from '@/hooks/useCart'
import Navbar from '@/view/components/Navbar'
import Sidebar from '@/view/components/Sidebar'

interface Post {
    id: number
    type: 'discussion' | 'review' | 'event'
    author: string
    avatar: string
    timestamp: string
    title?: string
    content: string
    bookTitle?: string
    rating?: number
    likes: number
    comments: number
    shares: number
    tags: string[]
    eventDate?: string
    eventLocation?: string
}

interface Comment {
    id: number
    author: string
    avatar: string
    content: string
    timestamp: string
}

type PostType = 'discussion' | 'review' | 'event'

export default function CommunityPage() {
    const { cartCount } = useCart()
    const [activeTab, setActiveTab] = useState(0)
    const [createPostOpen, setCreatePostOpen] = useState(false)
    const [postDetailOpen, setPostDetailOpen] = useState(false)
    const [selectedPost, setSelectedPost] = useState<Post | null>(null)
    const [newPostType, setNewPostType] = useState<PostType>('discussion')
    const [newPostContent, setNewPostContent] = useState('')
    const [newPostTitle, setNewPostTitle] = useState('')

    const mockPosts: Post[] = [
        {
            id: 1,
            type: 'discussion',
            author: 'Sarah Johnson',
            avatar: 'SJ',
            timestamp: '2 hours ago',
            title: 'What are your favorite sci-fi books of 2024?',
            content: 'I\'m looking for new sci-fi recommendations! I loved "Project Hail Mary" and "The Expanse" series. What have you been reading lately?',
            likes: 24,
            comments: 18,
            shares: 5,
            tags: ['Sci-Fi', 'Recommendations']
        },
        {
            id: 2,
            type: 'review',
            author: 'Michael Chen',
            avatar: 'MC',
            timestamp: '5 hours ago',
            bookTitle: 'The Silent Patient',
            rating: 5,
            content: 'Absolutely mind-blowing! This psychological thriller kept me on the edge of my seat. The twist at the end was completely unexpected. Highly recommend for anyone who loves thrillers!',
            likes: 45,
            comments: 12,
            shares: 8,
            tags: ['Thriller', 'Book Review', 'Must Read']
        },
        {
            id: 3,
            type: 'event',
            author: 'Web Library Team',
            avatar: 'WL',
            timestamp: '1 day ago',
            title: 'Virtual Book Club: Fantasy Month',
            content: 'Join us for our monthly book club discussion! This month we\'re reading "The Name of the Wind" by Patrick Rothfuss. Meeting on Zoom, all are welcome!',
            eventDate: 'December 15, 2024 at 7:00 PM',
            eventLocation: 'Zoom (Link will be sent)',
            likes: 67,
            comments: 23,
            shares: 15,
            tags: ['Event', 'Book Club', 'Fantasy']
        },
        {
            id: 4,
            type: 'discussion',
            author: 'Emma Wilson',
            avatar: 'EW',
            timestamp: '1 day ago',
            title: 'Physical books vs E-books: What\'s your preference?',
            content: 'I love the smell of physical books, but e-books are so convenient for travel. What do you prefer and why?',
            likes: 38,
            comments: 42,
            shares: 6,
            tags: ['Discussion', 'Reading']
        },
        {
            id: 5,
            type: 'review',
            author: 'David Lee',
            avatar: 'DL',
            timestamp: '2 days ago',
            bookTitle: 'Atomic Habits',
            rating: 4,
            content: 'Great practical advice on building good habits and breaking bad ones. Some concepts felt repetitive, but overall a solid read for personal development.',
            likes: 31,
            comments: 9,
            shares: 12,
            tags: ['Self-Help', 'Book Review', 'Non-Fiction']
        },
        {
            id: 6,
            type: 'event',
            author: 'Web Library Team',
            avatar: 'WL',
            timestamp: '3 days ago',
            title: 'Author Q&A: Meet bestselling author Jane Smith',
            content: 'Don\'t miss this exclusive opportunity to meet Jane Smith, author of the "Moonlight Chronicles" series. Ask questions, get books signed, and more!',
            eventDate: 'December 20, 2024 at 6:00 PM',
            eventLocation: 'Central Library, Bangkok',
            likes: 89,
            comments: 34,
            shares: 27,
            tags: ['Event', 'Author', 'Meet & Greet']
        }
    ]

    const mockComments: Comment[] = [
        {
            id: 1,
            author: 'John Doe',
            avatar: 'JD',
            content: 'Great recommendation! I just finished reading it and loved it.',
            timestamp: '1 hour ago'
        },
        {
            id: 2,
            author: 'Alice Brown',
            avatar: 'AB',
            content: 'Thanks for sharing! Adding this to my reading list.',
            timestamp: '45 minutes ago'
        },
        {
            id: 3,
            author: 'Bob Wilson',
            avatar: 'BW',
            content: 'Have you tried reading the sequel? It\'s even better!',
            timestamp: '30 minutes ago'
        }
    ]

    const topContributors = [
        { name: 'Sarah Johnson', posts: 45, avatar: 'SJ' },
        { name: 'Michael Chen', posts: 38, avatar: 'MC' },
        { name: 'Emma Wilson', posts: 32, avatar: 'EW' },
        { name: 'David Lee', posts: 28, avatar: 'DL' }
    ]

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue)
    }

    const filteredPosts = activeTab === 0 
        ? mockPosts 
        : activeTab === 1 
        ? mockPosts.filter(p => p.type === 'discussion')
        : activeTab === 2
        ? mockPosts.filter(p => p.type === 'review')
        : mockPosts.filter(p => p.type === 'event')

    const handleOpenPostDetail = (post: Post) => {
        setSelectedPost(post)
        setPostDetailOpen(true)
    }

    const handleCreatePost = () => {
        alert(`Post created! (Mock - not actually saved)\n\nType: ${newPostType}\nTitle: ${newPostTitle}\nContent: ${newPostContent}`)
        setCreatePostOpen(false)
        setNewPostTitle('')
        setNewPostContent('')
        setNewPostType('discussion')
    }

    const handlePostTypeChange = (event: SelectChangeEvent<PostType>) => {
        setNewPostType(event.target.value as PostType)
    }

    const getPostIcon = (type: string) => {
        switch(type) {
            case 'review': return '⭐'
            case 'event': return '📅'
            default: return '💬'
        }
    }

    const renderStars = (rating: number) => {
        return '⭐'.repeat(rating) + '☆'.repeat(5 - rating)
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
                                    Community
                                </Typography>
                                <Typography color="text.secondary">
                                    Connect with fellow book lovers, share reviews, and join discussions
                                </Typography>
                            </Box>
                            <Button
                                variant="contained"
                                startIcon={<Create />}
                                onClick={() => setCreatePostOpen(true)}
                                sx={{
                                    borderRadius: '8px',
                                    textTransform: 'none',
                                    px: 3
                                }}
                            >
                                Create Post
                            </Button>
                        </Box>

                        <Grid2 container spacing={3}>
                            <Grid2 size={{ xs: 12, md: 8 }}>
                                <Paper sx={{ mb: 3, borderRadius: '8px' }}>
                                    <Tabs
                                        value={activeTab}
                                        onChange={handleTabChange}
                                        sx={{ borderBottom: '1px solid #e0e0e0' }}
                                    >
                                        <Tab label="All Posts" />
                                        <Tab label="Discussions" />
                                        <Tab label="Reviews" />
                                        <Tab label="Events" />
                                    </Tabs>
                                </Paper>

                                <Box className="d-flex flex-column gap-3">
                                    {filteredPosts.map(post => (
                                        <Paper
                                            key={post.id}
                                            sx={{
                                                p: 3,
                                                borderRadius: '8px',
                                                cursor: 'pointer',
                                                transition: 'transform 0.2s, box-shadow 0.2s',
                                                '&:hover': {
                                                    transform: 'translateY(-2px)',
                                                    boxShadow: 4
                                                }
                                            }}
                                            onClick={() => handleOpenPostDetail(post)}
                                        >
                                            <Box className="d-flex align-items-center gap-2 mb-2">
                                                <Avatar sx={{ bgcolor: '#1976d2' }}>
                                                    {post.avatar}
                                                </Avatar>
                                                <Box sx={{ flex: 1 }}>
                                                    <Typography fontWeight={600}>{post.author}</Typography>
                                                    <Typography fontSize={12} color="text.secondary">
                                                        {post.timestamp}
                                                    </Typography>
                                                </Box>
                                                <Chip
                                                    label={post.type}
                                                    size="small"
                                                    icon={<span>{getPostIcon(post.type)}</span>}
                                                    sx={{ textTransform: 'capitalize' }}
                                                />
                                            </Box>

                                            {post.title && (
                                                <Typography fontWeight={600} fontSize={18} sx={{ mb: 1 }}>
                                                    {post.title}
                                                </Typography>
                                            )}
                                            {post.bookTitle && (
                                                <Box className="d-flex align-items-center gap-2 mb-1">
                                                    <Typography fontWeight={600} color="primary">
                                                        📖 {post.bookTitle}
                                                    </Typography>
                                                    {post.rating && (
                                                        <Typography fontSize={14}>
                                                            {renderStars(post.rating)}
                                                        </Typography>
                                                    )}
                                                </Box>
                                            )}
                                            <Typography color="text.secondary" sx={{ mb: 2 }}>
                                                {post.content}
                                            </Typography>

                                            {post.type === 'event' && (
                                                <Box
                                                    sx={{
                                                        p: 2,
                                                        backgroundColor: '#f5f5f5',
                                                        borderRadius: '8px',
                                                        mb: 2
                                                    }}
                                                >
                                                    <Typography fontSize={14} sx={{ mb: 0.5 }}>
                                                        📅 {post.eventDate}
                                                    </Typography>
                                                    <Typography fontSize={14}>
                                                        📍 {post.eventLocation}
                                                    </Typography>
                                                </Box>
                                            )}

                                            <Box className="d-flex gap-1 mb-2 flex-wrap">
                                                {post.tags.map((tag, index) => (
                                                    <Chip
                                                        key={index}
                                                        label={tag}
                                                        size="small"
                                                        variant="outlined"
                                                    />
                                                ))}
                                            </Box>

                                            <Box className="d-flex gap-3">
                                                <Button
                                                    startIcon={<ThumbUp />}
                                                    size="small"
                                                    sx={{ textTransform: 'none' }}
                                                >
                                                    {post.likes} Likes
                                                </Button>
                                                <Button
                                                    startIcon={<ChatBubbleOutline />}
                                                    size="small"
                                                    sx={{ textTransform: 'none' }}
                                                >
                                                    {post.comments} Comments
                                                </Button>
                                                <Button
                                                    startIcon={<Share />}
                                                    size="small"
                                                    sx={{ textTransform: 'none' }}
                                                >
                                                    {post.shares} Shares
                                                </Button>
                                            </Box>
                                        </Paper>
                                    ))}
                                </Box>
                            </Grid2>

                            <Grid2 size={{ xs: 12, md: 4 }}>
                                <Paper sx={{ p: 3, borderRadius: '8px', mb: 3 }}>
                                    <Box className="d-flex align-items-center gap-2 mb-3">
                                        <EmojiEvents sx={{ color: '#ffc107' }} />
                                        <Typography fontWeight={600} fontSize={18}>
                                            Top Contributors
                                        </Typography>
                                    </Box>
                                    <Box className="d-flex flex-column gap-2">
                                        {topContributors.map((contributor, index) => (
                                            <Box
                                                key={index}
                                                className="d-flex align-items-center justify-content-between p-2"
                                                sx={{
                                                    borderRadius: '8px',
                                                    '&:hover': { backgroundColor: '#f5f5f5' }
                                                }}
                                            >
                                                <Box className="d-flex align-items-center gap-2">
                                                    <Avatar
                                                        sx={{
                                                            width: 32,
                                                            height: 32,
                                                            bgcolor: '#1976d2'
                                                        }}
                                                    >
                                                        {contributor.avatar}
                                                    </Avatar>
                                                    <Typography fontSize={14}>
                                                        {contributor.name}
                                                    </Typography>
                                                </Box>
                                                <Typography fontSize={12} color="text.secondary">
                                                    {contributor.posts} posts
                                                </Typography>
                                            </Box>
                                        ))}
                                    </Box>
                                </Paper>

                                <Paper sx={{ p: 3, borderRadius: '8px', mb: 3 }}>
                                    <Box className="d-flex align-items-center gap-2 mb-3">
                                        <TrendingUp sx={{ color: '#1976d2' }} />
                                        <Typography fontWeight={600} fontSize={18}>
                                            Trending Topics
                                        </Typography>
                                    </Box>
                                    <Box className="d-flex flex-column gap-2">
                                        {['Sci-Fi', 'Book Review', 'Fantasy', 'Thriller', 'Self-Help'].map((topic, index) => (
                                            <Chip
                                                key={index}
                                                label={`#${topic}`}
                                                onClick={() => {}}
                                                sx={{ justifyContent: 'flex-start' }}
                                            />
                                        ))}
                                    </Box>
                                </Paper>

                                <Paper sx={{ p: 3, borderRadius: '8px', backgroundColor: '#e7f1fe' }}>
                                    <Typography fontWeight={600} fontSize={16} sx={{ mb: 2 }}>
                                        📋 Community Guidelines
                                    </Typography>
                                    <Typography fontSize={13} color="text.secondary" sx={{ mb: 1 }}>
                                        • Be respectful and kind
                                    </Typography>
                                    <Typography fontSize={13} color="text.secondary" sx={{ mb: 1 }}>
                                        • No spoilers without warnings
                                    </Typography>
                                    <Typography fontSize={13} color="text.secondary" sx={{ mb: 1 }}>
                                        • Share honest reviews
                                    </Typography>
                                    <Typography fontSize={13} color="text.secondary">
                                        • Keep discussions book-related
                                    </Typography>
                                </Paper>
                            </Grid2>
                        </Grid2>
                    </Box>
                </Box>
            </Box>

            <Dialog
                open={createPostOpen}
                onClose={() => setCreatePostOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    <Box className="d-flex justify-content-between align-items-center">
                        <Typography fontWeight={600} fontSize={20}>
                            Create New Post
                        </Typography>
                        <IconButton onClick={() => setCreatePostOpen(false)}>
                            <Close />
                        </IconButton>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <Box className="d-flex flex-column gap-3 mt-2">
                        <FormControl fullWidth>
                            <InputLabel>Post Type</InputLabel>
                            <Select
                                value={newPostType}
                                label="Post Type"
                                onChange={handlePostTypeChange}
                            >
                                <MenuItem value="discussion">💬 Discussion</MenuItem>
                                <MenuItem value="review">⭐ Book Review</MenuItem>
                                <MenuItem value="event">📅 Event</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            fullWidth
                            label="Title"
                            placeholder="What's on your mind?"
                            value={newPostTitle}
                            onChange={(e) => setNewPostTitle(e.target.value)}
                        />
                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            label="Content"
                            placeholder="Share your thoughts..."
                            value={newPostContent}
                            onChange={(e) => setNewPostContent(e.target.value)}
                        />
                        <Box
                            sx={{
                                p: 2,
                                backgroundColor: '#fff3e0',
                                borderRadius: '8px'
                            }}
                        >
                            <Typography fontSize={13} color="text.secondary">
                                💡 This is a demo. Your post won't be actually saved.
                            </Typography>
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setCreatePostOpen(false)}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleCreatePost}
                        disabled={!newPostTitle || !newPostContent}
                    >
                        Post
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={postDetailOpen}
                onClose={() => setPostDetailOpen(false)}
                maxWidth="md"
                fullWidth
            >
                {selectedPost && (
                    <>
                        <DialogTitle>
                            <Box className="d-flex justify-content-between align-items-center">
                                <Box className="d-flex align-items-center gap-2">
                                    <Avatar sx={{ bgcolor: '#1976d2' }}>
                                        {selectedPost.avatar}
                                    </Avatar>
                                    <Box>
                                        <Typography fontWeight={600}>
                                            {selectedPost.author}
                                        </Typography>
                                        <Typography fontSize={12} color="text.secondary">
                                            {selectedPost.timestamp}
                                        </Typography>
                                    </Box>
                                </Box>
                                <IconButton onClick={() => setPostDetailOpen(false)}>
                                    <Close />
                                </IconButton>
                            </Box>
                        </DialogTitle>
                        <DialogContent>
                            <Box className="d-flex flex-column gap-3">
                                {selectedPost.title && (
                                    <Typography fontWeight={600} fontSize={20}>
                                        {selectedPost.title}
                                    </Typography>
                                )}
                                {selectedPost.bookTitle && (
                                    <Box className="d-flex align-items-center gap-2">
                                        <Typography fontWeight={600} color="primary">
                                            📖 {selectedPost.bookTitle}
                                        </Typography>
                                        {selectedPost.rating && (
                                            <Typography>
                                                {renderStars(selectedPost.rating)}
                                            </Typography>
                                        )}
                                    </Box>
                                )}
                                <Typography>{selectedPost.content}</Typography>

                                {selectedPost.type === 'event' && (
                                    <Box
                                        sx={{
                                            p: 2,
                                            backgroundColor: '#f5f5f5',
                                            borderRadius: '8px'
                                        }}
                                    >
                                        <Typography sx={{ mb: 1 }}>
                                            📅 {selectedPost.eventDate}
                                        </Typography>
                                        <Typography>
                                            📍 {selectedPost.eventLocation}
                                        </Typography>
                                    </Box>
                                )}

                                <Box className="d-flex gap-1 flex-wrap">
                                    {selectedPost.tags.map((tag, index) => (
                                        <Chip key={index} label={tag} size="small" />
                                    ))}
                                </Box>

                                <Box className="d-flex gap-3 pt-2 pb-2" sx={{ borderTop: '1px solid #e0e0e0', borderBottom: '1px solid #e0e0e0' }}>
                                    <Button startIcon={<ThumbUp />} sx={{ textTransform: 'none' }}>
                                        Like ({selectedPost.likes})
                                    </Button>
                                    <Button startIcon={<ChatBubbleOutline />} sx={{ textTransform: 'none' }}>
                                        Comment ({selectedPost.comments})
                                    </Button>
                                    <Button startIcon={<Share />} sx={{ textTransform: 'none' }}>
                                        Share ({selectedPost.shares})
                                    </Button>
                                </Box>

                                <Box>
                                    <Typography fontWeight={600} sx={{ mb: 2 }}>
                                        Comments
                                    </Typography>
                                    <Box className="d-flex flex-column gap-2">
                                        {mockComments.map(comment => (
                                            <Box
                                                key={comment.id}
                                                className="d-flex gap-2 p-2"
                                                sx={{ backgroundColor: '#f5f5f5', borderRadius: '8px' }}
                                            >
                                                <Avatar sx={{ width: 32, height: 32, bgcolor: '#757575' }}>
                                                    {comment.avatar}
                                                </Avatar>
                                                <Box sx={{ flex: 1 }}>
                                                    <Box className="d-flex align-items-center gap-2 mb-1">
                                                        <Typography fontWeight={600} fontSize={14}>
                                                            {comment.author}
                                                        </Typography>
                                                        <Typography fontSize={11} color="text.secondary">
                                                            {comment.timestamp}
                                                        </Typography>
                                                    </Box>
                                                    <Typography fontSize={14}>
                                                        {comment.content}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        ))}
                                    </Box>
                                    <Box className="d-flex gap-2 mt-3">
                                        <Avatar sx={{ width: 32, height: 32, bgcolor: '#1976d2' }}>
                                            U
                                        </Avatar>
                                        <TextField
                                            fullWidth
                                            placeholder="Write a comment..."
                                            size="small"
                                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '20px' } }}
                                        />
                                    </Box>
                                </Box>
                            </Box>
                        </DialogContent>
                    </>
                )}
            </Dialog>
        </Box>
    )
}