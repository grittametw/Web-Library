'use client'

import { useState, useEffect, useRef } from 'react'
import { Box, Typography, TextField, IconButton, Paper, Avatar, Chip } from '@mui/material'
import { Send, SupportAgent, SmartToy } from '@mui/icons-material'
import { useCart } from '@/hooks/useCart'
import Navbar from '@/view/components/Navbar'
import Sidebar from '@/view/components/Sidebar'

interface Message {
    id: number
    text: string
    sender: 'user' | 'bot'
    timestamp: Date
}

export default function LiveChatPage() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1,
            text: 'Hello! Welcome to Web Library Support. How can I help you today?',
            sender: 'bot',
            timestamp: new Date()
        }
    ])
    const [inputMessage, setInputMessage] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const { cartCount } = useCart()
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages, isTyping])

    const quickReplies = [
        'How to order?',
        'Payment methods',
        'Shipping time',
        'Track my order',
        'Refund policy'
    ]

    const botResponses: { [key: string]: string } = {
        'how to order': 'To place an order: 1) Browse books 2) Add to cart 3) Checkout 4) Complete payment via QR Code. Need help with any specific step?',
        'order': 'To place an order: 1) Browse books 2) Add to cart 3) Checkout 4) Complete payment via QR Code. Need help with any specific step?',
        'payment': 'We accept payment via QR Code PromptPay only. It\'s fast, secure, and convenient. You have 15 minutes to complete payment after creating an order.',
        'shipping': 'E-books are delivered instantly after payment. Physical books take 3-5 business days (Bangkok area) or 5-7 days (other provinces) via Kerry Express or Thailand Post.',
        'track': 'You can track your order in "Your Account" → "Order History". You\'ll find the tracking number there once your order ships.',
        'refund': 'E-books are non-refundable. Physical books can be refunded within 7 days if defective. Please contact us with your order number for assistance.',
        'hello': 'Hello! How can I assist you today?',
        'hi': 'Hi there! What can I help you with?',
        'help': 'I\'m here to help! You can ask me about orders, payments, shipping, or any other questions.',
        'thank': 'You\'re welcome! Is there anything else I can help you with?',
        'thanks': 'You\'re welcome! Is there anything else I can help you with?',
        'bye': 'Thank you for contacting Web Library Support. Have a great day!',
        'stock': 'You can check stock availability on each book\'s page. If a book is out of stock, click "Notify Me" to get an email when it\'s back.',
        'format': 'We offer 3 formats: Hardcover (premium quality), Paperback (affordable), and E-book (instant delivery). You can choose your preferred format when adding to cart.',
        'account': 'To manage your account, go to "Your Account" in the sidebar. There you can update your profile, view orders, and change settings.',
        'cancel': 'To cancel an order, please contact us immediately with your order number. Orders can only be cancelled before payment or before shipping.'
    }

    const getBotResponse = (userMessage: string): string => {
        const lowerMessage = userMessage.toLowerCase()
        
        for (const [key, response] of Object.entries(botResponses)) {
            if (lowerMessage.includes(key)) {
                return response
            }
        }
        
        return 'I\'m not sure I understand. Could you rephrase that? Or try one of the quick replies below for common questions.'
    }

    const handleSendMessage = (text?: string) => {
        const messageText = text || inputMessage.trim()
        if (!messageText) return

        const userMessage: Message = {
            id: messages.length + 1,
            text: messageText,
            sender: 'user',
            timestamp: new Date()
        }

        setMessages(prev => [...prev, userMessage])
        setInputMessage('')
        setIsTyping(true)

        setTimeout(() => {
            const botResponse: Message = {
                id: messages.length + 2,
                text: getBotResponse(messageText),
                sender: 'bot',
                timestamp: new Date()
            }
            setMessages(prev => [...prev, botResponse])
            setIsTyping(false)
        }, 1000 + Math.random() * 1000)
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage()
        }
    }

    const handleQuickReply = (reply: string) => {
        handleSendMessage(reply)
    }

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false 
        })
    }

    return (
        <Box className="d-flex" sx={{ height: '100vh', overflow: 'hidden' }}>
            <Sidebar cartCount={cartCount} />
            <Box className="content-area d-flex flex-column" sx={{ width: '100%' }}>
                <Navbar />
                <Box className="scrollbar" sx={{ overflowY: 'auto' }}>
                    <Box className="m-4">
                        <Box
                            className="d-flex flex-column"
                            sx={{ 
                                backgroundColor: '#fff', 
                                borderRadius: '8px',
                                height: 'calc(100vh - 150px)',
                                overflow: 'hidden'
                            }}
                        >
                            <Box
                                className="d-flex align-items-center gap-3 p-3"
                                sx={{ 
                                    backgroundColor: '#1976d2',
                                    borderRadius: '8px 8px 0 0'
                                }}
                            >
                                <Avatar sx={{ bgcolor: '#fff' }}>
                                    <SupportAgent sx={{ color: '#1976d2' }} />
                                </Avatar>
                                <Box>
                                    <Typography fontWeight={600} fontSize={18} color="#fff">
                                        Customer Support
                                    </Typography>
                                    <Box className="d-flex align-items-center gap-1">
                                        <Box
                                            sx={{
                                                width: 8,
                                                height: 8,
                                                borderRadius: '50%',
                                                backgroundColor: '#4caf50'
                                            }}
                                        />
                                        <Typography fontSize={12} color="#e3f2fd">
                                            Online - Usually replies instantly
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>

                            <Box
                                className="p-3"
                                sx={{
                                    flex: 1,
                                    overflowY: 'auto',
                                    backgroundColor: '#f5f5f5',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 2
                                }}
                            >
                                {messages.map((message) => (
                                    <Box
                                        key={message.id}
                                        className="d-flex"
                                        sx={{
                                            justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start'
                                        }}
                                    >
                                        <Box
                                            className="d-flex gap-2"
                                            sx={{
                                                maxWidth: '70%',
                                                flexDirection: message.sender === 'user' ? 'row-reverse' : 'row'
                                            }}
                                        >
                                            <Avatar
                                                sx={{
                                                    width: 32,
                                                    height: 32,
                                                    bgcolor: message.sender === 'user' ? '#1976d2' : '#757575'
                                                }}
                                            >
                                                {message.sender === 'user' ? 'U' : <SmartToy fontSize="small" />}
                                            </Avatar>
                                            <Box>
                                                <Paper
                                                    elevation={1}
                                                    sx={{
                                                        p: 2,
                                                        backgroundColor: message.sender === 'user' ? '#1976d2' : '#fff',
                                                        color: message.sender === 'user' ? '#fff' : '#000',
                                                        borderRadius: message.sender === 'user' 
                                                            ? '16px 16px 4px 16px' 
                                                            : '16px 16px 16px 4px'
                                                    }}
                                                >
                                                    <Typography fontSize={14}>
                                                        {message.text}
                                                    </Typography>
                                                </Paper>
                                                <Typography
                                                    fontSize={11}
                                                    color="text.secondary"
                                                    sx={{ 
                                                        mt: 0.5,
                                                        textAlign: message.sender === 'user' ? 'right' : 'left'
                                                    }}
                                                >
                                                    {formatTime(message.timestamp)}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                ))}

                                {isTyping && (
                                    <Box className="d-flex gap-2">
                                        <Avatar
                                            sx={{
                                                width: 32,
                                                height: 32,
                                                bgcolor: '#757575'
                                            }}
                                        >
                                            <SmartToy fontSize="small" />
                                        </Avatar>
                                        <Paper
                                            elevation={1}
                                            sx={{
                                                p: 2,
                                                backgroundColor: '#fff',
                                                borderRadius: '16px 16px 16px 4px'
                                            }}
                                        >
                                            <Box className="d-flex gap-1">
                                                <Box
                                                    sx={{
                                                        width: 8,
                                                        height: 8,
                                                        borderRadius: '50%',
                                                        backgroundColor: '#bdbdbd',
                                                        animation: 'typing 1.4s infinite',
                                                        animationDelay: '0s'
                                                    }}
                                                />
                                                <Box
                                                    sx={{
                                                        width: 8,
                                                        height: 8,
                                                        borderRadius: '50%',
                                                        backgroundColor: '#bdbdbd',
                                                        animation: 'typing 1.4s infinite',
                                                        animationDelay: '0.2s'
                                                    }}
                                                />
                                                <Box
                                                    sx={{
                                                        width: 8,
                                                        height: 8,
                                                        borderRadius: '50%',
                                                        backgroundColor: '#bdbdbd',
                                                        animation: 'typing 1.4s infinite',
                                                        animationDelay: '0.4s'
                                                    }}
                                                />
                                            </Box>
                                        </Paper>
                                    </Box>
                                )}
                                <div ref={messagesEndRef} />
                            </Box>

                            <Box
                                className="d-flex gap-2 p-2"
                                sx={{
                                    overflowX: 'auto',
                                    backgroundColor: '#fafafa',
                                    borderTop: '1px solid #e0e0e0'
                                }}
                            >
                                {quickReplies.map((reply, index) => (
                                    <Chip
                                        key={index}
                                        label={reply}
                                        onClick={() => handleQuickReply(reply)}
                                        sx={{
                                            cursor: 'pointer',
                                            '&:hover': {
                                                backgroundColor: '#e3f2fd'
                                            }
                                        }}
                                    />
                                ))}
                            </Box>

                            <Box
                                className="d-flex gap-2 p-3"
                                sx={{
                                    backgroundColor: '#fff',
                                    borderTop: '1px solid #e0e0e0',
                                    borderRadius: '0 0 8px 8px'
                                }}
                            >
                                <TextField
                                    fullWidth
                                    placeholder="Type your message..."
                                    value={inputMessage}
                                    onChange={(e) => setInputMessage(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    multiline
                                    maxRows={3}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: '24px',
                                            backgroundColor: '#f5f5f5'
                                        }
                                    }}
                                />
                                <IconButton
                                    onClick={() => handleSendMessage()}
                                    disabled={!inputMessage.trim()}
                                    sx={{
                                        padding: '16px',
                                        backgroundColor: '#1976d2',
                                        color: '#fff',
                                        '&:hover': {
                                            backgroundColor: '#1565c0'
                                        },
                                        '&:disabled': {
                                            backgroundColor: '#e0e0e0',
                                            color: '#9e9e9e'
                                        }
                                    }}
                                >
                                    <Send />
                                </IconButton>
                            </Box>
                        </Box>

                        <Box
                            className="p-3 mt-3 text-center"
                            sx={{
                                backgroundColor: '#fff3e0',
                                borderRadius: '8px'
                            }}
                        >
                            <Typography fontSize={14} color="text.secondary">
                                💡 This is a demo chat with an AI assistant.
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Box>

            <style jsx global>{`
                @keyframes typing {
                    0%, 60%, 100% {
                        transform: translateY(0);
                        opacity: 0.7;
                    }
                    30% {
                        transform: translateY(-10px);
                        opacity: 1;
                    }
                }
            `}</style>
        </Box>
    )
}