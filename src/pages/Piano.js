import React, { useState, useEffect } from 'react';
import { Typography, Grid, Card, CardMedia, CardContent, Container, IconButton, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Thêm useNavigate
import { Search, ShoppingCart } from '@mui/icons-material'; // Thêm icon
import axios from 'axios';
import Footer from "../components/Footer";
import Header from '../components/Header';

const Piano = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState([]); // Thêm state giỏ hàng
  const navigate = useNavigate(); // Hook điều hướng

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:9000/api/products/category/2");
        setProducts(response.data);
      } catch (error) {
        setError("Không thể tải sản phẩm");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Hàm điều hướng đến trang chi tiết sản phẩm
  const handleProductClick = (id) => {
    navigate(`/product/${id}`);
  };

  // Hàm thêm sản phẩm vào giỏ hàng
  const addToCart = (productId) => {
    console.log(`Thêm sản phẩm ${productId} vào giỏ hàng`);
    // Thêm logic lưu vào Redux hoặc localStorage nếu cần
  };

  return (
    <>
      <Header />
      <Container maxWidth="lg" sx={{ marginTop: '20px' }}>
        <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
          Danh sách sản phẩm Piano
        </Typography>

        {loading ? (
          <Typography>Đang tải sản phẩm...</Typography>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <Grid container spacing={3}>
            {products.map((product) => (
              <Grid item xs={12} sm={6} md={3} key={product.id}>
                <Card sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  position: 'relative',
                  '&:hover .hover-icons': { opacity: 1 } // Hiện icons khi hover
                }}>
                  <CardMedia component="img" height="200" image={product.imageUrls[0]} alt={product.name} />

                  {/* Hộp chứa các nút */}
                  <Box className="hover-icons" sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    display: 'flex',
                    gap: 1,
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    padding: '5px',
                    borderRadius: '20px',
                    opacity: 0, // Ẩn icons mặc định
                    transition: 'opacity 0.3s ease-in-out'
                  }}>
                    <IconButton onClick={(e) => { e.stopPropagation(); handleProductClick(product.id); }}

                      sx={{ color: '#993300' }}>
                      <Search />
                    </IconButton>
                    <IconButton onClick={(e) => { e.stopPropagation(); addToCart(product.id); }}
                      sx={{ color: '#993300' }}>
                      <ShoppingCart />
                    </IconButton>
                  </Box>

                  <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                    <Typography gutterBottom variant="h6">{product.name}</Typography>
                    <Typography variant="h6" color="primary">{product.price.toLocaleString("vi-VN")} VND</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
      <Footer />
    </>
  );
};

export default Piano;