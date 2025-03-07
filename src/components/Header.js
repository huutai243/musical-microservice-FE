import React, { useState, useEffect, useRef } from 'react';
import { AppBar, Toolbar, Typography, Button, Avatar, Menu, MenuItem, IconButton, Box, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

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

    const handleMouseEnter = (menuKey) => {
        setMenuOpen((prevState) => ({
            ...prevState,
            [menuKey]: true,
        }));
    };

    const handleMouseLeave = (menuKey) => {
        setMenuOpen((prevState) => ({
            ...prevState,
            [menuKey]: false,
        }));
    };

    return (
        <AppBar position="static" sx={{ backgroundColor: 'white', color: 'black', position: 'sticky', top: 0, zIndex: 100 }}>
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: '#993300' }}>
                    <Box sx={{ flexGrow: 1, color: '#993300' }}>
                        <img src="/logo.jpg" alt="Logo" style={{ height: '80px' }} />
                    </Box>
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <Button color="inherit" href="/" sx={{ color: '#993300', fontSize: '1.2rem' }}>Trang Chủ</Button>
                    <Button color="inherit" href="/products" sx={{ color: '#993300', fontSize: '1.2rem' }}>Sản Phẩm</Button>
                    <Button color="inherit" href="/about" sx={{ color: '#993300', fontSize: '1.2rem' }}>Giới Thiệu</Button>
                    <Button color="inherit" href="/promotions" sx={{ color: '#993300', fontSize: '1.2rem' }}>Khuyến Mãi</Button>
                    <Button color="inherit" href="/contact" sx={{ color: '#993300', fontSize: '1.2rem' }}>Liên Hệ</Button>

                    <TextField
                        variant="outlined"
                        size="small"
                        placeholder="Tìm kiếm..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        sx={{ marginRight: 1 }}
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
                        <Button variant="contained" href="/login" sx={{ bgcolor: '#993300', borderRadius: 5, '&:hover': { bgcolor: '#993300' }, color: 'white' }}>
                            Đăng Nhập
                        </Button>
                    )}
                </Box>
            </Toolbar>

            <Box sx={{ backgroundColor: '#993300', display: 'flex', justifyContent: 'center', padding: '10px 0' }}>
                <Button
                    sx={{ color: 'white', fontWeight: 'bold', textTransform: 'none', mx: 2 }}
                    onMouseEnter={() => handleMouseEnter('acousticPiano')}
                    onMouseLeave={() => handleMouseLeave('acousticPiano')}
                >
                    GUITAR <ArrowDropDownIcon />
                </Button>
                <Button
                    sx={{ color: 'white', fontWeight: 'bold', textTransform: 'none', mx: 2 }}
                    onMouseEnter={() => handleMouseEnter('digitalPiano')}
                    onMouseLeave={() => handleMouseLeave('digitalPiano')}
                >
                    PIANO <ArrowDropDownIcon />
                </Button>
                <Button
                    sx={{ color: 'white', fontWeight: 'bold', textTransform: 'none', mx: 2 }}
                    onMouseEnter={() => handleMouseEnter('keyboardOrgan')}
                    onMouseLeave={() => handleMouseLeave('keyboardOrgan')}
                >
                    UKULELE <ArrowDropDownIcon />
                </Button>
                <Button
                    sx={{ color: 'white', fontWeight: 'bold', textTransform: 'none', mx: 2 }}
                    onMouseEnter={() => handleMouseEnter('guitar')}
                    onMouseLeave={() => handleMouseLeave('guitar')}
                >
                    VIOLIN <ArrowDropDownIcon />
                </Button>
            </Box>

            {menuOpen.acousticPiano && (
                <Box
                    ref={menuRefs.acousticPiano}
                    sx={{ backgroundColor: 'white', border: '1px solid #ccc', textAlign: 'center', py: 2 }}
                    onMouseEnter={() => handleMouseEnter('acousticPiano')}
                    onMouseLeave={() => handleMouseLeave('acousticPiano')}
                >
                    <Typography>SẢN PHẨM GUITAR</Typography>
                </Box>
            )}
            {menuOpen.digitalPiano && (
                <Box
                    ref={menuRefs.digitalPiano}
                    sx={{ backgroundColor: 'white', border: '1px solid #ccc', textAlign: 'center', py: 2 }}
                    onMouseEnter={() => handleMouseEnter('digitalPiano')}
                    onMouseLeave={() => handleMouseLeave('digitalPiano')}
                >
                    <Typography>SẢN PHẨM PIANO</Typography>
                </Box>
            )}
            {menuOpen.keyboardOrgan && (
                <Box
                    ref={menuRefs.keyboardOrgan}
                    sx={{ backgroundColor: 'white', border: '1px solid #ccc', textAlign: 'center', py: 2 }}
                    onMouseEnter={() => handleMouseEnter('keyboardOrgan')}
                    onMouseLeave={() => handleMouseLeave('keyboardOrgan')}
                >
                    <Typography>SẢN PHẨM UKULELE</Typography>
                </Box>
            )}
            {menuOpen.guitar && (
                <Box
                    ref={menuRefs.guitar}
                    sx={{ backgroundColor: 'white', border: '1px solid #ccc', textAlign: 'center', py: 2 }}
                    onMouseEnter={() => handleMouseEnter('guitar')}
                    onMouseLeave={() => handleMouseLeave('guitar')}
                >
                    <Typography>SẢN PHẨM VIOLIN</Typography>
                </Box>
            )}
        </AppBar>
    );
};

export default Header;