import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Container, Typography, Grid, Card, CardContent, CardMedia, IconButton, Button, Divider } from "@mui/material";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const productCategories = [1, 2, 3, 4, 5, 6, 7, 8];
const banners = ["/banner1.jpg", "/banner2.jpg", "/banner3.jpg"];
// Thêm dữ liệu sản phẩm mới
const newProducts = new Array(10).fill({
    name: "Đàn ukulele Classic",
    image: "/ukulele.jpg",
    price: "1,200,000 VND",
    originalPrice: "1,800,000 VND"
});

const Home = () => {
    const navigate = useNavigate()
    const [startIndex, setStartIndex] = useState(0);
    const itemsPerPage = 5;
    const [bannerIndex, setBannerIndex] = useState(0);
    const [hovered, setHovered] = useState(false);
    const [bestSellingProducts, setBestSellingProducts] = useState([]);

    useEffect(() => {
        fetch("http://localhost:9000/api/products")
            .then(response => response.json())
            .then(data => setBestSellingProducts(data))
            .catch(error => console.error("Error fetching products:", error));
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setBannerIndex((prevIndex) => (prevIndex + 1) % banners.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleNext = () => {
        if (startIndex + itemsPerPage < productCategories.length) {
            setStartIndex(startIndex + 1);
        }
    };

    const handlePrev = () => {
        if (startIndex > 0) {
            setStartIndex(startIndex - 1);
        }
    };

    return (
        <div>
            <Header />

            {/* Banner */}
            <Container maxWidth="lg" style={{ marginTop: 20, textAlign: "center", position: "relative", overflow: "hidden" }}
                       onMouseEnter={() => setHovered(true)}
                       onMouseLeave={() => setHovered(false)}>
                <div style={{ display: "flex", transition: "transform 0.7s ease-in-out", transform: `translateX(-${bannerIndex * 100}%)` }}>
                    {banners.map((banner, index) => (
                        <Card key={index} style={{ minWidth: "100%", height: 300, position: "relative", backgroundColor: "#ddd" }}>
                            <CardMedia component="img" height="300" image={banner} alt="Banner" />
                        </Card>
                    ))}
                </div>
                {hovered && (
                    <>
                        <IconButton onClick={() => setBannerIndex((bannerIndex - 1 + banners.length) % banners.length)}
                                    style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#993300" }}>
                            <ArrowBackIos />
                        </IconButton>
                        <IconButton onClick={() => setBannerIndex((bannerIndex + 1) % banners.length)}
                                    style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", color: "#993300" }}>
                            <ArrowForwardIos />
                        </IconButton>
                    </>
                )}
            </Container>

            {/* Danh mục sản phẩm */}
            <Container maxWidth="lg" style={{ marginTop: 40, position: "relative" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Typography variant="h5" gutterBottom style={{ color: "#993300" }}>Danh Mục Sản Phẩm</Typography>
                    <div>
                        <IconButton onClick={handlePrev} disabled={startIndex === 0} style={{ color: "#993300" }}>
                            <ArrowBackIos />
                        </IconButton>
                        <IconButton onClick={handleNext} disabled={startIndex + itemsPerPage >= productCategories.length} style={{ color: "#993300" }}>
                            <ArrowForwardIos />
                        </IconButton>
                    </div>
                </div>
                <Grid container spacing={4}>
                    {productCategories.slice(startIndex, startIndex + itemsPerPage).map((item, index) => (
                        <Grid item xs={2.4} key={index}>
                            <Card style={{ transition: "0.3s", cursor: "pointer", borderRadius: "12px" }}
                                  onMouseOver={(e) => e.currentTarget.style.boxShadow = "0 4px 8px rgba(153, 51, 0, 0.5)"}
                                  onMouseOut={(e) => e.currentTarget.style.boxShadow = "none"}>
                                <CardMedia component="img" height="240" image="/guitar.jpg" alt="Đàn Guitar" style={{ borderRadius: "12px 12px 0 0" }} />
                                <CardContent style={{ backgroundColor: "#8B4513", color: "#fff", textAlign: "center", borderRadius: "0 0 12px 12px" }}>
                                    <Typography variant="subtitle1">Đàn Guitar</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            {/* Sản phẩm bán chạy */}
            <Container maxWidth="lg" style={{ marginTop: 40 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="h5" style={{ color: "#993300" }}>Sản Phẩm Bán Chạy</Typography>
                    <Button variant="outlined" style={{ color: "#993300", borderColor: "#993300" }}>Xem thêm</Button>
                </div>
                <Grid container spacing={4}>
                    {bestSellingProducts.map((product, index) => (
                        <Grid item xs={2.4} key={index}>
                            <Card
                                style={{ cursor: "pointer" }}
                                onClick={() => navigate(`/product/${product.id}`)}
                            >
                                <CardMedia component="img" height="240" image={product.imageUrl} alt={product.name} />
                                <Divider />
                                <CardContent
                                    sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "flex-start", // Căn trái nội dung
                                        justifyContent: "space-between", // Giữ khoảng cách giữa tên và giá
                                        minHeight: 80, // Đặt chiều cao tối thiểu để các Card đồng đều
                                    }}
                                >
                                    <Typography variant="subtitle1" sx={{ flexGrow: 1, wordBreak: "break-word" }}>
                                        {product.name}
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontWeight: "bold", color: "#993300" }}>
                                        {product.price} VND
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            {/* Sản phẩm mới */}
            <Container maxWidth="lg" style={{ marginTop: 40 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="h5" style={{ color: "#993300" }}>Sản Phẩm Mới</Typography>
                    <Button variant="outlined" style={{ color: "#993300", borderColor: "#993300" }}>Xem thêm</Button>
                </div>
                <Grid container spacing={4}>
                    {newProducts.map((product, index) => (
                        <Grid item xs={2.4} key={index}>
                            <Card style={{ borderRadius: "12px", transition: "0.3s", cursor: "pointer", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)" }}>
                                <CardMedia component="img" height="240" image={product.image} alt={product.name} />
                                <Divider />
                                <CardContent>
                                    <Typography variant="subtitle1">{product.name}</Typography>
                                    <Typography variant="body1" style={{ fontWeight: "bold", color: "#993300" }}>{product.price}</Typography>
                                    <Typography variant="body2" style={{ textDecoration: "line-through", color: "#999" }}>{product.originalPrice}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            <Footer />
        </div>
    );
};

export default Home;
