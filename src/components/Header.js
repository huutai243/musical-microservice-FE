import React, { useState, useEffect, useRef } from 'react';
import { AppBar, Toolbar, Typography, Button, Avatar, Menu, MenuItem, IconButton, Box, TextField, Container, Fade, Tooltip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import logo from "../image/logo.jpg";

const Header = () => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [menuOpen, setMenuOpen] = useState({
        acousticPiano: false,
        digitalPiano: false,
        keyboardOrgan: false,
        guitar: false,
    });
    const menuRefs = {
        acousticPiano: useRef(null),
        digitalPiano: useRef(null),
        keyboardOrgan: useRef(null),
        guitar: useRef(null),
    };

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
            setUser(storedUser);
        }
    }, []);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = async () => {
        try {
            const refreshToken = localStorage.getItem('refreshToken');
            await axios.post('http://localhost:9000/api/auth/logout', { refreshToken });
            localStorage.clear();
            setUser(null);
            navigate('/');
            handleMenuClose();
        } catch (error) {
            console.error('Lỗi đăng xuất:', error);
        }
    };

    return (
        <AppBar position="sticky" sx={{ backgroundColor: 'white', color: 'black', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)', borderBottom: '2px solid #993300' }}>
            <Container maxWidth="xl" disableGutters>
        <Toolbar sx={{ paddingX: '16px', minHeight: '80px' }}>

            {/* Logo - Căn sát trái */}
            <Box 
                sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    cursor: 'pointer', 
                    borderRadius: '12px', 
                    padding: '5px 10px', 
                    transition: '0.3s', 
                    '&:hover': { backgroundColor: '#f2f2f2' }, 
                    flexGrow: 1, // Đẩy logo về trái tối đa
                }} 
                
            >
                <img src={logo} onClick={() => navigate('/')} alt="Logo" style={{ height: '60px', marginRight: '10px', borderRadius: '10px' }} />
                <Typography onClick={() => navigate('/')}variant="h4" sx={{ fontWeight: 'bold', color: '#993300', transition: '0.3s' }}>
                    Music Store
                </Typography>
            </Box>

            {/* Nhóm tìm kiếm, giỏ hàng, avatar - Căn sát phải */}
            <Box 
                sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 2, 
                    flexShrink: 0, // Ngăn bị thu nhỏ
                    justifyContent: 'flex-end',
                }}
            >
                {/* Ô tìm kiếm - Cố định kích thước */}
                <TextField
                    variant="outlined"
                    size="small"
                    placeholder="Tìm kiếm..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    sx={{
                        width: '250px', // Đảm bảo không bị thu nhỏ
                        maxWidth: '100%', // Cho phép co dãn nếu cần
                        backgroundColor: '#f5f5f5',
                        borderRadius: '20px',
                        '& .MuiOutlinedInput-root': { borderRadius: '20px' },
                        '&:hover': { backgroundColor: '#e8e8e8' },
                    }}
                />

                {/* Nút tìm kiếm */}
                <Tooltip title="Tìm kiếm">
                    <IconButton color="inherit" sx={{ color: '#993300', '&:hover': { color: '#7a2600' } }}>
                        <SearchIcon />
                    </IconButton>
                </Tooltip>

                {/* Nút giỏ hàng */}
                <Tooltip title="Giỏ hàng">
                    <IconButton color="inherit" sx={{ color: '#993300', '&:hover': { color: '#7a2600' } }}>
                        <ShoppingCartIcon />
                    </IconButton>
                </Tooltip>

                {/* Avatar người dùng */}
                {user ? (
                    <>
                        <Tooltip title="Tài khoản">
                            <IconButton onClick={handleMenuOpen}>
                                <Avatar src={user.photoURL} alt={user.displayName} sx={{ width: 50, height: 50, transition: '0.3s', '&:hover': { transform: 'scale(1.1)' } }} />
                            </IconButton>
                        </Tooltip>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                            TransitionComponent={Fade}
                            sx={{ '& .MuiMenu-paper': { borderRadius: '12px', padding: '5px' } }}
                        >
                            <MenuItem 
                                onClick={() => { navigate('/profile'); handleMenuClose(); }} 
                                sx={{ borderRadius: '8px', '&:hover': { backgroundColor: '#f5f5f5' } }}
                            >
                                Thông tin cá nhân
                            </MenuItem>
                            <MenuItem 
                                onClick={handleLogout} 
                                sx={{ borderRadius: '8px', '&:hover': { backgroundColor: '#f5f5f5' } }}
                            >
                                Đăng xuất
                            </MenuItem>
                        </Menu>
                    </>
                ) : (
                    <Button 
                        variant="contained" 
                        href="/login" 
                        sx={{
                            bgcolor: '#993300', 
                            borderRadius: '25px', 
                            minWidth: '130px', // Giữ kích thước nút đăng nhập ổn định
                            padding: '10px 20px', 
                            fontSize: '1rem', 
                            '&:hover': { bgcolor: '#7a2600' }, 
                            color: 'white', 
                        }}
                    >
                        Đăng Nhập
                    </Button>
                )}
            </Box>
        </Toolbar>
    </Container>

            <Box
                sx={{
                    background: 'linear-gradient(90deg, #993300, #b35900)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '20px 0',
                    boxShadow: '0px 4px 15px rgba(0,0,0,0.3)',
                    height: '20px',
                }}
                >
                {['Trang Chủ', 'Sản Phẩm', 'Giới Thiệu', 'Khuyến Mãi', 'Liên Hệ', 'Profile'].map((item, index) => (
                    <Button
                    key={index}
                    href={`/${item.toLowerCase().replace(/ /g, '-')}`}
                    sx={{
                        color: 'white',
                        fontWeight: 'bold',
                        textTransform: 'none',
                        mx: 2,
                        fontSize: '1.1rem',
                        position: 'relative',
                        transition: 'all 0.3s ease-in-out',
                        padding: '10px 20px',
                        borderRadius: '8px',
                        '&:hover': {
                        transform: 'scale(1.1)',
                        boxShadow: '0 8px 16px rgba(0,0,0,0.4)',
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        },
                        '&::after': {
                        content: '""',
                        position: 'absolute',
                        width: '100%',
                        height: '3px',
                        backgroundColor: 'rgba(255,255,255,0.8)',
                        bottom: '-5px',
                        left: 0,
                        transform: 'scaleX(0)',
                        transformOrigin: 'right',
                        transition: 'transform 0.3s ease-in-out',
                        borderRadius: '2px',
                        },
                        '&:hover::after': {
                        transform: 'scaleX(1)',
                        transformOrigin: 'left',
                        },
                    }}
                    >
                    {item}
                    </Button>
                ))}
            </Box>
        </AppBar>
    );
};

export default Header;