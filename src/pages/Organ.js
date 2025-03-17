import React, { useState, useEffect } from 'react';
import { Typography, Grid, Card, CardMedia, CardContent, Container } from '@mui/material';
import axios from 'axios';
import Footer from "../components/Footer";
import Header from '../components/Header';

const Organ = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:9000/api/products/page?page=1&size=10");
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
    <>
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
    </>
  );
};

export default Organ;