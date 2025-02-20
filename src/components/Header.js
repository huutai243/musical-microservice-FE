// src/components/Header.js
import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';

const Header = () => {
    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Cửa hàng nhạc cụ trực tuyến
                </Typography>
                <Button color="inherit" href="/">
                    Trang chủ
                </Button>
                <Button color="inherit" href="/login">
                    Đăng nhập
                </Button>
            </Toolbar>
        </AppBar>
    );
};

export default Header;