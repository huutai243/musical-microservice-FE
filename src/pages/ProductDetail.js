import { Container, Box, Typography, Button, Grid, Card, CardMedia, Paper } from '@mui/material';
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from '../components/Header';
import Footer from '../components/Footer';
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import PaymentIcon from "@mui/icons-material/Payment";
import InventoryIcon from "@mui/icons-material/Inventory";
import AutorenewIcon from "@mui/icons-material/Autorenew";

const images = [
    "https://muzart-store-newdemo.myshopify.com/cdn/shop/files/Squier-Classic-Vibe-70s-Jaguar-Electric-Guitar-1.jpg?v=1716542924&width=600",
    "https://muzart-store-newdemo.myshopify.com/cdn/shop/files/Squier-Classic-Vibe-70s-Jaguar-Electric-Guitar-2.jpg?v=1716542925&width=600",
    "https://muzart-store-newdemo.myshopify.com/cdn/shop/files/Squier-Classic-Vibe-70s-Jaguar-Electric-Guitar-3.jpg?v=1716542925&width=600",
    "https://muzart-store-newdemo.myshopify.com/cdn/shop/files/Squier-Classic-Vibe-70s-Jaguar-Electric-Guitar-4.jpg?v=1716542925&width=600"
];

const deliveryItems = [
    {
        icon: <CheckCircleIcon color="primary" fontSize="large" />,
        text: "Cam kết 100% chính hãng",
    },
    {
        icon: <MonetizationOnIcon color="secondary" fontSize="large" />,
        text: "Miễn phí giao hàng cho đơn hàng trên 1 triệu VNĐ tại HCM",
    },
    {
        icon: <SupportAgentIcon color="success" fontSize="large" />,
        text: "Hỗ trợ từ 9h sáng đến 6h chiều",
    },
    {
        icon: <PaymentIcon color="warning" fontSize="large" />,
        text: "Thanh Toán Đa Dạng",
    },
    {
        icon: <InventoryIcon color="error" fontSize="large" />,
        text: "Mở hộp kiểm tra nhận hàng",
    },
    {
        icon: <AutorenewIcon color="info" fontSize="large" />,
        text: "Đổi trả trong 2 ngày",
    },
];

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:9000/api/products/${id}`)
            .then(response => response.json())
            .then(data => setProduct(data))
            .catch(error => console.error("Error fetching product:", error));
    }, [id]);


    if (!product) return <Typography>Loading...</Typography>;
    return (
        <div>
            <Header />
            <Container>
                <Box sx={{ display: 'flex', gap: 4, py: 4 }}>
                    <Box sx={{ maxWidth: 500 }}>
                        <Card sx={{ mb: 2 }}>
                            <CardMedia component="img" image={product.imageUrl} alt={product.name} />
                        </Card>
                        <Grid container spacing={2}>
                            {images.map((img, index) => (
                                <Grid item xs={3} key={index}>
                                    <Card>
                                        <CardMedia component="img" image={product.imageUrl} alt={product.name} />
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                    <Box sx={{ p: 3 }}>
                        <Typography variant="h4" fontWeight="bold">{product.name}</Typography>
                        <Typography variant="h6" color="error" fontWeight="bold">{product.price} VND</Typography>
                        <Typography variant="body1" sx={{ mt: 2 }}>
                            Elevate your musical journey with our top-of-the-line instruments, designed to inspire and perform at every level!
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                            <Button variant="contained" color="primary">
                                Thêm vào giỏ hàng
                            </Button>
                            <Button variant="outlined" color="secondary">
                                Mua ngay
                            </Button>
                        </Box>
                        <Box sx={{ mt: 4 }}>
                            <Grid container spacing={2}>
                                {deliveryItems.map((item, index) => (
                                    <Grid item xs={12} sm={6} md={4} key={index} sx={{ display: "flex" }}>
                                        <Paper
                                            sx={{
                                                p: 2,
                                                display: "flex",
                                                flexDirection: "column",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                flex: 1, // Tự động kéo giãn chiều cao đồng đều
                                                textAlign: "center",
                                            }}
                                        >
                                            {item.icon}
                                            <Typography variant="body1">{item.text}</Typography>
                                        </Paper>
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    </Box>
                </Box>
                <Box sx={{ mt: 4, p: 2 }}>
                    <Typography variant="h5" fontWeight="bold" sx={{ mb: 2, textAlign: 'center', textDecoration: 'underline', color: '#993300' }}>
                        Chi Tiết Sản Phẩm
                    </Typography>
                    <Typography variant="body1">
                        Blanditiis dolorem voluptatem consequuntur explicabo accusamus fugiat maxime. Eum vel fugit voluptatibus ex dolorum.
                    </Typography>
                    <Typography variant="h6" fontWeight="bold" sx={{ mt: 3 }}>
                        Outstanding Features
                    </Typography>
                    <ul>
                        <li>✅ Long-term warranty: 2 years</li>
                        <li>✅ Impact resistance: Designed to withstand collisions</li>
                        <li>✅ Premium materials: High-quality construction</li>
                        <li>✅ Secure data: Protects user information</li>
                        <li>✅ Dedicated support: Professional customer service</li>
                    </ul>
                    <Grid container spacing={2} sx={{ mt: 2 }}>
                        <Grid item xs={12} md={6}>
                            <Paper sx={{ p: 2, textAlign: 'center' }}>
                                <img src="https://cdn.shopify.com/s/files/1/0644/6546/9590/files/s2_0108410c-c2d6-4bef-9ec0-491d75473a9d.webp?v=1716864090"
                                     alt="Product feature" width="100%" style={{ borderRadius: '8px' }} />
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography variant="h6" fontWeight="bold">
                                Product Supreme Quality
                            </Typography>
                            <Typography variant="body1">
                                Labore omnis sint totam maxime. Reprehenderit eaque consectetur consequuntur.
                            </Typography>
                        </Grid>
                    </Grid>
                </Box>
            </Container>
            <Footer />
        </div>
    );
};
export default ProductDetail;