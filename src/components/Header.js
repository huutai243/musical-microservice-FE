import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, Avatar, Menu, MenuItem, IconButton, Box, TextField, Container, Fade, Tooltip, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import logo from "../image/logo.png";
import { useCart } from "../context/CartContext";
import { Badge } from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";

const Header = () => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
    const [productMenu, setProductMenu] = useState(null);
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const { cartCount } = useCart();

    // Xử lý mở menu khi click vào "Sản Phẩm"
    const handleProductMenuOpen = (event) => {
        setProductMenu(event.currentTarget);
    };

    // Đóng menu khi click ra ngoài
    const handleProductMenuClose = () => {
        setProductMenu(null);
    };
    const [anchorEl, setAnchorEl] = useState(null);
    

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
            <Box sx={{ width: "100%", backgroundColor: "#000", padding: "6px 0" }}>
                <Container sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    {/* Thông tin liên hệ */}
                    <Box sx={{ display: "flex", gap: 2 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <EmailIcon fontSize="small" sx={{ color: "#fff" }} />
                            <Link href="mailto:info@musicstore.vn" sx={{ textDecoration: "none", color: "#fff", fontSize: "0.9rem" }}>
                                info@musicstore.vn
                            </Link>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <PhoneIcon fontSize="small" sx={{ color: "#fff" }} />
                            <Link href="tel:+8418006715" sx={{ textDecoration: "none", color: "#fff", fontSize: "0.9rem" }}>
                                1800 6715
                            </Link>
                        </Box>
                    </Box>
                </Container>
            </Box>
            <Container maxWidth="xl" disableGutters>
                <Toolbar sx={{ padding: '5px', minHeight: '80px' }}>

                    {/* Logo - Căn trái */}
                    <Box sx={{ paddingLeft:'80px', display: 'flex', alignItems: 'center', cursor: 'pointer', flexGrow: 1 }}>
                        <img
                            src={logo}
                            onClick={() => navigate('/')}
                            alt="Logo"
                            style={{ height: '50px', borderRadius: '10px', objectFit: 'contain' }} // Tăng kích thước logo
                        />
                        
                    </Box>
                    {/* Menu Điều Hướng */}
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: '0px 0px',
                            px: '80px',
                        }}
                    >
                        {[
                            { label: 'Trang Chủ', path: '/' },
                            { label: 'Sản Phẩm', path: '/products' },
                            { label: 'Giới Thiệu', path: '/about' },
                            { label: 'Khuyến Mãi', path: '/discount' },
                            { label: 'Liên Hệ', path: '/contact' },
                        ].map((item, index) => (
                            item.label === 'Sản Phẩm' ? (
                                <Box key={index} sx={{ position: 'relative' }}>
                                    <Button
                                        onClick={handleProductMenuOpen}
                                        sx={{
                                            color: '#b35900', // Lấy màu nền cũ làm màu chữ
                                            fontWeight: 'bold',
                                            textTransform: 'none',
                                            mx: 1,
                                            fontSize: '1rem', // Tăng kích thước chữ
                                            padding: '4px 10px',
                                            borderRadius: '6px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '4px',
                                            '&:hover': { backgroundColor: 'rgba(179, 89, 0, 0.2)' },
                                        }}
                                    >
                                        Sản Phẩm <ArrowDropDownIcon sx={{ fontSize: '1rem' }} />
                                    </Button>

                                    {/* Menu Dropdown */}
                                    <Menu
                                        anchorEl={productMenu}
                                        open={Boolean(productMenu)}
                                        onClose={handleProductMenuClose}
                                        sx={{ '& .MuiMenu-paper': { borderRadius: '6px', padding: '4px' } }}
                                        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                                        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
                                    >
                                        <MenuItem onClick={() => { navigate('/products/piano'); handleProductMenuClose(); }}>
                                            Piano
                                        </MenuItem>
                                        <MenuItem onClick={() => { navigate('/products/guitar'); handleProductMenuClose(); }}>
                                            Guitar
                                        </MenuItem>
                                        <MenuItem onClick={() => { navigate('/products/organ'); handleProductMenuClose(); }}>
                                            Organ & Keyboard
                                        </MenuItem>
                                        <MenuItem onClick={() => { navigate('/products/drums'); handleProductMenuClose(); }}>
                                            Trống & Bộ Gõ
                                        </MenuItem>
                                    </Menu>
                                </Box>
                            ) : (
                                <Button
                                    key={index}
                                    onClick={() => navigate(item.path)}
                                    sx={{
                                        color: '#b35900', // Lấy màu nền cũ làm màu chữ
                                        fontWeight: 'bold',
                                        textTransform: 'none',
                                        mx: 1,
                                        fontSize: '1rem', // Tăng kích thước chữ
                                        padding: '4px 10px',
                                        borderRadius: '6px',
                                        '&:hover': { backgroundColor: 'rgba(179, 89, 0, 0.2)' },
                                    }}
                                >
                                    {item.label}
                                </Button>
                            )
                        ))}
                    </Box>


                    {/* Nhóm tìm kiếm, giỏ hàng, avatar */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexShrink: 0 }}>
                        {/* Ô tìm kiếm */}
                        <TextField
                            variant="outlined"
                            size="small"
                            placeholder="Tìm kiếm..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            sx={{
                                width: '250px',
                                backgroundColor: '#f5f5f5',
                                borderRadius: '20px',
                                '& .MuiOutlinedInput-root': { borderRadius: '20px' },
                                '&:hover': { backgroundColor: '#e8e8e8' },
                            }}
                        />
                        <Tooltip title="Tìm kiếm">
                            <IconButton color="inherit" sx={{ color: '#993300', '&:hover': { color: '#7a2600' } }}>
                                <SearchIcon />
                            </IconButton>
                        </Tooltip>

                        {/* Nút giỏ hàng */}
                        <Tooltip title="Giỏ hàng">
                            <IconButton onClick={() => navigate("/cart")} sx={{ color: "#993300" }}>
                                <Badge badgeContent={cartCount} color="error">
                                    <ShoppingCartIcon />
                                </Badge>
                            </IconButton>
                        </Tooltip>

                        {/* Avatar người dùng */}
                        {user ? (
                            <>
                                <Tooltip title="Tài khoản">
                                    <IconButton onClick={handleMenuOpen}>
                                        <Avatar src={user.photoURL} alt={user.displayName} sx={{ width: 40, height: 40, transition: '0.3s', '&:hover': { transform: 'scale(1.1)' } }} />
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

        </AppBar>
    );
};

export default Header;
