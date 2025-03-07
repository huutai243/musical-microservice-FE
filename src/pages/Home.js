import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Container, Typography, Grid, Card, CardContent, CardMedia, IconButton, Button, Divider, Box, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { ArrowBackIos, ArrowForwardIos, FilterList as FilterListIcon } from "@mui/icons-material";
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
        
        <div style={{ background: 'linear-gradient(to right, #f0f0f0, #e0e0e0)', minHeight: '100vh' }}>
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
                    
                    <Box sx={{ marginTop: '50px' ,backgroundColor: '#e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px' }}>
                        <IconButton sx={{ color: 'black' }}>
                            <FilterListIcon />
                        </IconButton>
                        <Typography variant="body1" sx={{ fontWeight: 'bold', marginRight: '20px' }}>
                            BỘ LỌC
                        </Typography>
                        <FormControl variant="outlined" sx={{ minWidth: 350, marginRight: '10px' }}>
                            <InputLabel id="price-filter-label">Lọc giá</InputLabel>
                            <Select labelId="price-filter-label" id="price-filter" label="Lọc giá">
                                <MenuItem value="">Tất cả</MenuItem>
                                <MenuItem value="low">Giá thấp đến cao</MenuItem>
                                <MenuItem value="high">Giá cao đến thấp</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl variant="outlined" sx={{ minWidth: 350, marginRight: '10px' }}>
                            <InputLabel id="category-filter-label">Danh mục</InputLabel>
                            <Select labelId="category-filter-label" id="category-filter" label="Danh mục">
                                <MenuItem value="">Tất cả</MenuItem>
                                <MenuItem value="guitar">Guitar</MenuItem>
                                <MenuItem value="piano">Piano</MenuItem>
                                <MenuItem value="ukulele">Ukulele</MenuItem>
                                <MenuItem value="violin">Violin</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl variant="outlined" sx={{ minWidth: 350 }}>
                            <InputLabel id="brand-filter-label">Thương hiệu</InputLabel>
                            <Select labelId="brand-filter-label" id="brand-filter" label="Thương hiệu">
                                <MenuItem value="">Tất cả</MenuItem>
                                <MenuItem value="fender">Fender</MenuItem>
                                <MenuItem value="yamaha">Yamaha</MenuItem>
                                <MenuItem value="casio">Casio</MenuItem>
                                <MenuItem value="suzuki">Suzuki</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>

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
                    <Typography variant="h5" gutterBottom style={{ color: "#993300" }}>Danh Mục Sản Phẩm</Typography>

                    <Grid container spacing={4}>
                        <Grid item xs={12} sm={6} md={4} lg={3}> {/* Điều chỉnh số lượng cột */}
                            <Card style={{ transition: "0.3s", cursor: "pointer", borderRadius: "12px" }}
                                onMouseOver={(e) => e.currentTarget.style.boxShadow = "0 4px 8px rgba(153, 51, 0, 0.5)"}
                                onMouseOut={(e) => e.currentTarget.style.boxShadow = "none"}>
                                <CardMedia component="img" height="240" image="/guitar.jpg" alt="Đàn Guitar" style={{ borderRadius: "12px 12px 0 0" }} />
                                <CardContent style={{ backgroundColor: "#8B4513", color: "#fff", textAlign: "center", borderRadius: "0 0 12px 12px" }}>
                                    <Typography variant="subtitle1">Đàn Guitar</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4} lg={3}> {/* Điều chỉnh số lượng cột */}
                            <Card style={{ transition: "0.3s", cursor: "pointer", borderRadius: "12px" }}
                                onMouseOver={(e) => e.currentTarget.style.boxShadow = "0 4px 8px rgba(153, 51, 0, 0.5)"}
                                onMouseOut={(e) => e.currentTarget.style.boxShadow = "none"}>
                                <CardMedia component="img" height="240" image="/Pino.jpg" alt="Đàn Guitar" style={{ borderRadius: "12px 12px 0 0" }} />
                                <CardContent style={{ backgroundColor: "#8B4513", color: "#fff", textAlign: "center", borderRadius: "0 0 12px 12px" }}>
                                    <Typography variant="subtitle1">Đàn Piano</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4} lg={3}> {/* Điều chỉnh số lượng cột */}
                            <Card style={{ transition: "0.3s", cursor: "pointer", borderRadius: "12px" }}
                                onMouseOver={(e) => e.currentTarget.style.boxShadow = "0 4px 8px rgba(153, 51, 0, 0.5)"}
                                onMouseOut={(e) => e.currentTarget.style.boxShadow = "none"}>
                                <CardMedia component="img" height="240" image="/ukulele.jpg" alt="Đàn Guitar" style={{ borderRadius: "12px 12px 0 0" }} />
                                <CardContent style={{ backgroundColor: "#8B4513", color: "#fff", textAlign: "center", borderRadius: "0 0 12px 12px" }}>
                                    <Typography variant="subtitle1">Đàn Ukulele</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4} lg={3}> {/* Điều chỉnh số lượng cột */}
                            <Card style={{ transition: "0.3s", cursor: "pointer", borderRadius: "12px" }}
                                onMouseOver={(e) => e.currentTarget.style.boxShadow = "0 4px 8px rgba(153, 51, 0, 0.5)"}
                                onMouseOut={(e) => e.currentTarget.style.boxShadow = "none"}>
                                <CardMedia component="img" height="240" image="/Violin.jpg" alt="Đàn Guitar" style={{ borderRadius: "12px 12px 0 0" }} />
                                <CardContent style={{ backgroundColor: "#8B4513", color: "#fff", textAlign: "center", borderRadius: "0 0 12px 12px" }}>
                                    <Typography variant="subtitle1">Đàn Violin</Typography>
                                </CardContent>
                            </Card>
                        </Grid>

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
                        <div style={{ marginTop: 40 }}>
                            <a href="/collections/">
                                <img
                                    className="ls-is-cached lazyloaded"
                                    data-src="//theme.hstatic.net/200000423875/1001138926/14/home_collection_1_image.jpg?v=1063"
                                    src="//theme.hstatic.net/200000423875/1001138926/14/home_collection_1_image.jpg?v=1063"
                                    alt="Sản Phẩm Bán Chạy"
                                />
                            </a>
                        </div>
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
                        <div style={{ marginTop: 40 }}>
                            <a href="/collections/#">
                                <img
                                    className="ls-is-cached lazyloaded"
                                    data-src="//theme.hstatic.net/200000423875/1001138926/14/home_collection_1_image.jpg?v=1063"
                                    src="//theme.hstatic.net/200000423875/1001138926/14/home_collection_1_image.jpg?v=1063"
                                    alt="Sản Phẩm Bán Chạy"
                                />
                            </a>
                        </div>
                    </Grid>
                </Container>

                <Footer />
            </div>
        </div>
    );
};

export default Home;