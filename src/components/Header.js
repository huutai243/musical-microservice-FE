// src/components/Header.js
import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, Avatar, Menu, MenuItem, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Header = () => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate();

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

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Cửa hàng nhạc cụ trực tuyến
                </Typography>
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
                    <Button color="inherit" href="/login">
                        Đăng nhập
                    </Button>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Header;
