import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, Avatar, Menu, MenuItem, IconButton, Box, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const Header = () => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState(''); // State để lưu giá trị tìm kiếm

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

            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');

            setUser(null);
            navigate('/');
            handleMenuClose();
        } catch (error) {
            console.error('Lỗi đăng xuất:', error);
        }
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    return (
        <AppBar position="static" sx={{ backgroundColor: 'white', color: 'black' }}>
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: '#993300' }}>
                    Logo
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Button color="inherit" href="/" sx={{ color: '#993300' }}>Trang Chủ</Button>
                    <Button color="inherit" href="/products" sx={{ color: '#993300' }}>Sản Phẩm</Button>
                    <Button color="inherit" href="/about" sx={{ color: '#993300' }}>Giới Thiệu</Button>
                    <Button color="inherit" href="/promotions" sx={{ color: '#993300' }}>Khuyến Mãi</Button>
                    <Button color="inherit" href="/contact" sx={{ color: '#993300' }}>Liên Hệ</Button>

                    <TextField
                        variant="outlined"
                        size="small"
                        placeholder="Tìm kiếm..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        sx={{ marginRight: 1 }} // Tạo khoảng cách với nút search
                    />

                    <IconButton color="inherit" sx={{ color: '#993300' }}>
                        <SearchIcon />
                    </IconButton>

                    <IconButton color="inherit" sx={{ color: '#993300' }}>
                        <ShoppingCartIcon />
                    </IconButton>

                    {user ? (
                        <>
                            <IconButton onClick={handleMenuOpen}>
                                <Avatar src={user.photoURL} alt={user.displayName} />
                            </IconButton>
                            <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleMenuClose}
                            >
                                <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
                            </Menu>
                        </>
                    ) : (
                        <Button variant="contained" href="/login" sx={{ bgcolor: '#A0522D', borderRadius: 5, '&:hover': { bgcolor: '#993300' }, color: 'white' }}>
                            Đăng Nhập
                        </Button>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;