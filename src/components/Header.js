import React, { useState, useEffect, useRef } from 'react';
import { AppBar, Toolbar, Typography, Button, Avatar, Menu, MenuItem, IconButton, Box, TextField, Container, Fade } from '@mui/material';
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
            <Container>
                <Toolbar sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => navigate('/profile')}>
                        <img src={logo} alt="Logo" style={{ height: '100px', marginRight: '15px', transition: 'all 0.3s' }} />
                        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#993300', transition: 'all 0.3s' }}>Music Store</Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        <TextField
                            variant="outlined"
                            size="small"
                            placeholder="Tìm kiếm..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            sx={{ backgroundColor: '#f5f5f5', borderRadius: 1, '&:focus': { backgroundColor: 'white' } }}
                        />
                        <IconButton color="inherit" sx={{ color: '#993300', '&:hover': { color: '#7a2600' } }}>
                            <SearchIcon />
                        </IconButton>
                        <IconButton color="inherit" sx={{ color: '#993300', '&:hover': { color: '#7a2600' } }}>
                            <ShoppingCartIcon />
                        </IconButton>

                        {user ? (
                            <>
                                <IconButton onClick={handleMenuOpen}>
                                    <Avatar src={user.photoURL} alt={user.displayName} sx={{ width: 50, height: 50, transition: '0.3s', '&:hover': { transform: 'scale(1.1)' } }} />
                                </IconButton>
                                <Menu
                                    anchorEl={anchorEl}
                                    open={Boolean(anchorEl)}
                                    onClose={handleMenuClose}
                                    TransitionComponent={Fade}
                                >
                                    <MenuItem onClick={() => { navigate('/profile'); handleMenuClose(); }}>
                                        Thông tin cá nhân
                                    </MenuItem>
                                    <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
                                </Menu>
                            </>
                        ) : (
                            <Button variant="contained" href="/login" sx={{ bgcolor: '#993300', borderRadius: 5, '&:hover': { bgcolor: '#7a2600' }, color: 'white', fontSize: '1rem', padding: '8px 20px' }}>
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