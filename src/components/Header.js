// src/components/Header.js
import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, Avatar, Menu, MenuItem, IconButton } from '@mui/material';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const [user, setUser] = useState(null); // Lưu thông tin người dùng
    const [anchorEl, setAnchorEl] = useState(null); // Quản lý dropdown menu
    const navigate = useNavigate();

    // Lắng nghe trạng thái đăng nhập
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setUser(user); // Lưu thông tin người dùng nếu đã đăng nhập
            } else {
                setUser(null); // Xóa thông tin người dùng nếu đăng xuất
            }
        });

        return () => unsubscribe(); // Hủy đăng ký lắng nghe khi component unmount
    }, []);

    // Mở dropdown menu
    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    // Đóng dropdown menu
    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    // Xử lý đăng xuất
    const handleLogout = async () => {
        try {
            await signOut(auth); // Đăng xuất bằng Firebase
            navigate('/'); // Chuyển hướng về trang chủ
            handleMenuClose(); // Đóng dropdown menu
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
                        {/* Hiển thị avatar và dropdown menu */}
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
                    /* Hiển thị nút đăng nhập nếu chưa đăng nhập */
                    <Button color="inherit" href="/login">
                        Đăng nhập
                    </Button>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Header;