import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, Avatar, Menu, MenuItem, IconButton, Box, TextField, Container, Fade, Tooltip, Grid, Card, CardMedia, CardContent, Badge, Select, FormControl, InputLabel } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import StarIcon from '@mui/icons-material/Star';
import logo from "../../image/logo.png";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import api from '../../utils/api';

const Product = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products/page', {
          params: { page: 1, size: 10 }
        });
        setProducts(response.data);
      } catch (error) {
        setError("Không thể tải sản phẩm");
      } finally {
        setLoading(false);
      }
    };
  
    fetchProducts();
  }, []);

  return (
    <div style={{ background: "linear-gradient(to right, #f0f0f0, #e0e0e0)", minHeight: "100vh" }}>
      <Header />
      <Container maxWidth="lg" sx={{ marginTop: '20px' }}>
        <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
          Danh sách sản phẩm
        </Typography>

        {loading ? (
          <Typography>Đang tải sản phẩm...</Typography>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <Grid container spacing={3}>
            {products.map((product) => (
              <Grid item xs={12} sm={6} md={3} key={product.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardMedia component="img" height="200" image={product.imageUrls[0]} alt={product.name} />
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
    </div>
  );
};

export default Product;
