// src/pages/Home.js
import React from 'react';
import { Container, Typography, Grid, Card, CardContent, CardMedia, Button, Box } from '@mui/material';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Header from '../components/Header';
import Footer from '../components/Footer';

// Dữ liệu mẫu
const products = [
    {
        id: 1,
        name: 'Guitar Acoustic',
        price: '2,500,000 VND',
        image: 'https://via.placeholder.com/300',
    },
    {
        id: 2,
        name: 'Piano Điện',
        price: '15,000,000 VND',
        image: 'https://via.placeholder.com/300',
    },
    {
        id: 3,
        name: 'Trống Jazz',
        price: '8,000,000 VND',
        image: 'https://via.placeholder.com/300',
    },
    {
        id: 4,
        name: 'Violin',
        price: '5,000,000 VND',
        image: 'https://via.placeholder.com/300',
    },
];

const categories = [
    { id: 1, name: 'Guitar', image: 'https://via.placeholder.com/200' },
    { id: 2, name: 'Piano', image: 'https://via.placeholder.com/200' },
    { id: 3, name: 'Trống', image: 'https://via.placeholder.com/200' },
    { id: 4, name: 'Violin', image: 'https://via.placeholder.com/200' },
];

const testimonials = [
    {
        id: 1,
        name: 'Nguyễn Văn A',
        comment: 'Sản phẩm chất lượng, giao hàng nhanh chóng!',
    },
    {
        id: 2,
        name: 'Trần Thị B',
        comment: 'Nhạc cụ âm thanh tuyệt vời, giá cả hợp lý.',
    },
];

// Cấu hình slider
const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
};

const Home = () => {
    return (
        <div>
            <Header />
            {/* Slider/Carousel */}
            <Box sx={{ mb: 4 }}>
                <Slider {...sliderSettings}>
                    <div>
                        <img src="https://via.placeholder.com/1200x400" alt="Slide 1" style={{ width: '100%' }} />
                    </div>
                    <div>
                        <img src="https://via.placeholder.com/1200x400" alt="Slide 2" style={{ width: '100%' }} />
                    </div>
                    <div>
                        <img src="https://via.placeholder.com/1200x400" alt="Slide 3" style={{ width: '100%' }} />
                    </div>
                </Slider>
            </Box>

            <Container>
                {/* Giới thiệu cửa hàng */}
                <Box sx={{ textAlign: 'center', mb: 6 }}>
                    <Typography variant="h4" component="h2" gutterBottom>
                        Giới thiệu về cửa hàng
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Chúng tôi cung cấp các loại nhạc cụ chất lượng cao với giá cả phải chăng. Hãy khám phá và tìm kiếm nhạc cụ phù hợp với bạn!
                    </Typography>
                </Box>

                {/* Danh mục sản phẩm */}
                <Box sx={{ mb: 6 }}>
                    <Typography variant="h4" component="h2" align="center" gutterBottom>
                        Danh mục sản phẩm
                    </Typography>
                    <Grid container spacing={4}>
                        {categories.map((category) => (
                            <Grid item key={category.id} xs={12} sm={6} md={3}>
                                <Card>
                                    <CardMedia
                                        component="img"
                                        height="140"
                                        image={category.image}
                                        alt={category.name}
                                    />
                                    <CardContent>
                                        <Typography variant="h6" component="div" align="center">
                                            {category.name}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                {/* Sản phẩm nổi bật */}
                <Box sx={{ mb: 6 }}>
                    <Typography variant="h4" component="h2" align="center" gutterBottom>
                        Sản phẩm nổi bật
                    </Typography>
                    <Grid container spacing={4}>
                        {products.map((product) => (
                            <Grid item key={product.id} xs={12} sm={6} md={4}>
                                <Card>
                                    <CardMedia
                                        component="img"
                                        height="200"
                                        image={product.image}
                                        alt={product.name}
                                    />
                                    <CardContent>
                                        <Typography variant="h6" component="div">
                                            {product.name}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {product.price}
                                        </Typography>
                                        <Button variant="contained" color="primary" sx={{ mt: 2 }}>
                                            Xem chi tiết
                                        </Button>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                {/* Đánh giá từ khách hàng */}
                <Box sx={{ mb: 6 }}>
                    <Typography variant="h4" component="h2" align="center" gutterBottom>
                        Đánh giá từ khách hàng
                    </Typography>
                    <Grid container spacing={4}>
                        {testimonials.map((testimonial) => (
                            <Grid item key={testimonial.id} xs={12} sm={6} md={4}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="body1" component="div" align="center">
                                            "{testimonial.comment}"
                                        </Typography>
                                        <Typography variant="subtitle1" align="center" sx={{ mt: 2 }}>
                                            - {testimonial.name}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Container>
            <Footer />
        </div>
    );
};

export default Home;