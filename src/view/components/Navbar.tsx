import { useState } from 'react';
import { Box, Grid2, Typography, InputBase, Paper, List, ListItemButton, Avatar } from '@mui/material';
import { NotificationsOutlined, Person } from '@mui/icons-material';
import { useAuth } from '@/hooks/useAuth';
import { useBooks } from '@/context/ฺBooksContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import SearchIcon from '@mui/icons-material/Search';

export default function Navbar() {
    const [search, setSearch] = useState('')
    const [showSuggestions, setShowSuggestions] = useState(false)
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

    return (
        <Box
            className="d-flex justify-content-between align-items-center p-3 px-4 pt-4 shadow z-1"
            sx={{ width: '100%', backgroundColor: '#fff' }}>
            <Box
                className="d-flex align-items-center"
                sx={{ width: 800, backgroundColor: '#f0f5ff', borderRadius: '8px' }}
            >
                <SearchIcon
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
            <Grid2 className="d-flex align-items-center gap-4 px-4">
                <NotificationsOutlined />
                <Grid2 className="d-flex align-items-center gap-2">
                    <Avatar >
                        <Person />
                    </Avatar>
                    <Typography>{user?.name || "Guest"}</Typography>
                </Grid2>
            </Grid2>
        </Box>
    )
}