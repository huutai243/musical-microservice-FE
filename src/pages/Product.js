import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, Avatar, Menu, MenuItem, IconButton, Box, TextField, Container, Fade, Tooltip, Grid, Card, CardMedia, CardContent, Badge, Select, FormControl, InputLabel } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import StarIcon from '@mui/icons-material/Star';
import logo from "../image/logo.png";
import Footer from "../components/Footer"; // Import the Footer component

const products = [
  {
    id: 1,
    name: 'KAWAI ND-21',
    price: '94,000,000₫',
    imageUrl: 'Guitar.jpg', // Thay thế bằng URL hình ảnh thực tế
    reviews: 0,
  },
  {
    id: 2,
    name: 'KAWAI K-15E-M/PEP',
    price: '83,000,000₫',
    oldPrice: '110,000,000₫', // Giá cũ
    imageUrl: 'Guitar.jpg', // Thay thế bằng URL hình ảnh thực tế
    reviews: 0,
  },
  {
    id: 3,
    name: 'KAWAI K-15E-MH/MP',
    price: '88,000,000₫',
    oldPrice: '99,100,000₫', // Giá cũ
    imageUrl: 'Guitar.jpg', // Thay thế bằng URL hình ảnh thực tế
    reviews: 0,
  },
  {
    id: 4,
    name: 'KAWAI K-15E-WH/P',
    price: '104,900,000₫',
    imageUrl: 'Guitar.jpg', // Thay thế bằng URL hình ảnh thực tế
    reviews: 0,
    contactForPrice: true, // Hiển thị "LIÊN HỆ ĐẢO GIÁ"
  },
  {
    id: 5,
    name: 'KAWAI K-300-M/PEP',
    price: '184,000,000₫',
    imageUrl: 'Guitar.jpg', // Thay thế bằng URL hình ảnh thực tế
    reviews: 0,
    flashSale: true, // Hiển thị "FLASH SALE"
  },
  {
    id: 6,
    name: 'KAWAI K-300-MH/MP',
    price: '198,000,000₫',
    imageUrl: 'Guitar.jpg', // Thay thế bằng URL hình ảnh thực tế
    reviews: 0,
  },
  {
    id: 7,
    name: 'KAWAI K-800-M/PEP',
    price: '285,000,000₫',
    imageUrl: 'Guitar.jpg', // Thay thế bằng URL hình ảnh thực tế
    reviews: 0,
  },
  {
    id: 8,
    name: 'KAWAI GL-10-M/PEP',
    price: '295,000,000₫',
    imageUrl: 'Guitar.jpg', // Thay thế bằng URL hình ảnh thực tế
    reviews: 0,
  },
  {
    id: 8,
    name: 'KAWAI GL-10-M/PEP',
    price: '295,000,000₫',
    imageUrl: 'Guitar.jpg', // Thay thế bằng URL hình ảnh thực tế
    reviews: 0,
  },
  {
    id: 9,
    name: 'KAWAI GL-10-M/PEP',
    price: '295,000,000₫',
    imageUrl: 'Guitar.jpg', // Thay thế bằng URL hình ảnh thực tế
    reviews: 0,
  },
    {
    id: 10,
    name: 'KAWAI GL-10-M/PEP',
    price: '295,000,000₫',
    imageUrl: 'Guitar.jpg', // Thay thế bằng URL hình ảnh thực tế
    reviews: 0,
  },
];

const Product = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

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
    <>
      <AppBar position="sticky" sx={{ backgroundColor: 'white', color: 'black', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)', borderBottom: '2px solid #993300' }}>
        <Container maxWidth="xl" disableGutters>
          <Toolbar sx={{ paddingX: '16px', minHeight: '80px' }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                borderRadius: '12px',
                padding: '5px 10px',
                transition: '0.3s',
                '&:hover': { backgroundColor: '#f2f2f2' },
                flexGrow: 1,
              }}
            >
              <img src={logo} onClick={() => navigate('/')} alt="Logo" style={{ height: '60px', marginRight: '10px', borderRadius: '10px' }} />
              <Typography onClick={() => navigate('/')} variant="h4" sx={{ fontWeight: 'bold', color: '#993300', transition: '0.3s' }}>
                Music Store
              </Typography>
            </Box>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                flexShrink: 0,
                justifyContent: 'flex-end',
              }}
            >
              <TextField
                variant="outlined"
                size="small"
                placeholder="Tìm kiếm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{
                  width: '250px',
                  maxWidth: '100%',
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
                  href="/Login"
                  sx={{
                    bgcolor: '#993300',
                    borderRadius: '25px',
                    minWidth: '130px',
                    padding: '10px 20px',fontSize: '1rem',
                    '&:hover': { bgcolor: '#7a2600' },
                    color: 'white',
                  }}
                >
                  Đăng Nhập
                </Button>
              )}
    
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Tooltip title="Giỏ hàng">
                  <IconButton color="inherit" sx={{ color: '#993300', '&:hover': { color: '#7a2600' } }}>
                    <Badge badgeContent={0} color="error">
                      <ShoppingCartIcon />
                    </Badge>
                  </IconButton>
                </Tooltip>
    
                <Tooltip title="Liên hệ">
                  <IconButton color="inherit" sx={{ color: '#993300', '&:hover': { color: '#7a2600' } }}>
                    <ChatBubbleOutlineIcon />
                  </IconButton>
                </Tooltip>
              </Box>
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
                margin: '0 15px',
                textTransform: 'uppercase',
                '&:hover': {
                  textDecoration: 'underline',
                  textDecorationColor: 'white',
                },
              }}
            >
              {item}
            </Button>
          ))}
        </Box>
    
        <Container maxWidth="lg" sx={{ marginTop: '20px' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
              GUITAR ACOUSTIC 
            </Typography>
    
            <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
              <InputLabel id="sort-select-label">Sắp xếp</InputLabel>
              <Select
                labelId="sort-select-label"
                id="sort-select"
                value="" // Giá trị mặc định
                label="Sắp xếp"
              >
                <MenuItem value="">Mặc định</MenuItem>
                <MenuItem value="priceAsc">Giá tăng dần</MenuItem>
                <MenuItem value="priceDesc">Giá giảm dần</MenuItem>
                <MenuItem value="nameAsc">Tên A-Z</MenuItem>
                <MenuItem value="nameDesc">Tên Z-A</MenuItem>
              </Select>
            </FormControl>
          </Box>
    
          <Box sx={{ display: 'flex', marginBottom: '20px' }}>
            <Button variant="outlined" startIcon={<SearchIcon />} sx={{minWidth: '180px', marginRight: '10px' }}>
              BỘ LỌC
            </Button>
    
            <FormControl variant="outlined" size="small" sx={{ marginRight: '10px' ,minWidth: '180px'}}>
              <InputLabel id="price-filter-label">Lọc giá</InputLabel>
              <Select
                labelId="price-filter-label"
                id="price-filter"
                value="" // Giá trị mặc định
                label="Lọc giá"
              >
                <MenuItem value="">Tất cả</MenuItem>
                <MenuItem value="under50">Dưới 50 triệu</MenuItem>
                <MenuItem value="50to100">50 - 100 triệu</MenuItem>
                <MenuItem value="over100">Trên 100 triệu</MenuItem>
              </Select>
            </FormControl>
    
            <FormControl variant="outlined" size="small" sx={{ marginRight: '10px' ,minWidth: '180px'}}>
              <InputLabel id="category-filter-label">Danh mục</InputLabel>
              <Select
                labelId="category-filter-label"
                id="category-filter"
                value="" // Giá trị mặc định
                label="Danh mục"
              >
                <MenuItem value="">Tất cả</MenuItem>
                <MenuItem value="upright">Upright Piano</MenuItem>
                <MenuItem value="grand">Grand Piano</MenuItem>
              </Select>
            </FormControl>
    
            <FormControl variant="outlined" size="small" sx={{ marginRight: '10px' ,minWidth: '180px'}}>
              <InputLabel id="brand-filter-label">Thương hiệu</InputLabel>
              <Select
                labelId="brand-filter-label"
                id="brand-filter"
                value="" // Giá trị mặc định
                label="Thương hiệu"
              >
                <MenuItem value="">Tất cả</MenuItem>
                <MenuItem value="kawai">Kawai</MenuItem>
                <MenuItem value="yamaha">Yamaha</MenuItem>
              </Select>
            </FormControl>
          </Box>
    
          <Grid container spacing={3}>
            {products.map((product) => (
              <Grid item xs={12} sm={6} md={3} key={product.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={product.imageUrl}
                    alt={product.name}
                    sx={{ objectFit: 'contain' }}
                  />
                  <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                    <Typography gutterBottom variant="h6" component="div">
                      {product.name}
                    </Typography>
                    {product.oldPrice && (
                      <Typography variant="body2" color="textSecondary" sx={{ textDecoration: 'line-through' }}>
                        {product.oldPrice}
                      </Typography>
                    )}
                    <Typography variant="h6" color="primary">
                      {product.price}
                    </Typography>
                    {product.reviews > 0 && (
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1 }}>
                        <StarIcon sx={{ color: 'gold' }} />
                        <Typography variant="body2" sx={{ ml: 0.5 }}>
                          {product.reviews} đánh giá
                        </Typography>
                      </Box>
                    )}
                    {product.contactForPrice && (
                      <Button variant="outlined" color="primary" sx={{ mt: 1 }}>
                        LIÊN HỆ ĐẢO GIÁ
                      </Button>
                    )}
                    {product.flashSale && (
                      <Badge badgeContent="FLASH SALE" color="error" sx={{ mt: 1 }}>
                        <Box />
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
    
        <Box
          sx={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}
        >
          <Box sx={{ position: 'relative' }}>
            <IconButton sx={{ backgroundColor: '#ffeb3b', borderRadius: '50%', padding: '15px' }}>
              <ShoppingCartIcon sx={{ color: 'black' }} />
            </IconButton>
            <Badge badgeContent={0} color="error" sx={{ position: 'absolute', top: '-8px', right: '-8px' }} />
          </Box>
    
          <IconButton sx={{ backgroundColor: 'black', borderRadius: '50%', padding: '15px' }}>
            <ChatBubbleOutlineIcon sx={{ color: 'white' }} />
            <Typography variant="caption" sx={{ color: 'white', position: 'absolute', bottom: '-20px', left: '50%', transform: 'translateX(-50%)' }}>
              Liên hệ
            </Typography>
          </IconButton>
        </Box>
      </AppBar>
      <Footer />
    </>
    );
    };
    
    export default Product;