import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Thêm useNavigate để điều hướng
import Header from "../components/Header";
import Footer from "../components/Footer";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Button,
  Divider,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { ArrowBackIos, ArrowForwardIos, FilterList as FilterListIcon } from "@mui/icons-material";

const productCategories = [1, 2, 3, 4, 5, 6, 7, 8];
const banners = ["/banner1.jpg", "/banner2.jpg", "/banner3.jpg"];

const Home = () => {
  const [startIndex, setStartIndex] = useState(0);
  const itemsPerPage = 5;
  const [bannerIndex, setBannerIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [bestSellingProducts, setBestSellingProducts] = useState([]);
  const [newProducts, setNewProducts] = useState([]);
  const [loadingBestSelling, setLoadingBestSelling] = useState(true);
  const [loadingNewProducts, setLoadingNewProducts] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Hook để điều hướng

  // Xử lý banner tự động chuyển
  useEffect(() => {
    const interval = setInterval(() => {
      setBannerIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Lấy dữ liệu sản phẩm bán chạy từ API
  useEffect(() => {
    const fetchBestSellingProducts = async () => {
      try {
        const response = await fetch("http://localhost:9000/api/products/page?page=1&size=10");
        if (!response.ok) throw new Error("Không thể tải sản phẩm bán chạy");
        const data = await response.json();
        setBestSellingProducts(data);
        setLoadingBestSelling(false);
      } catch (error) {
        setError(error.message);
        setLoadingBestSelling(false);
      }
    };
    fetchBestSellingProducts();
  }, []);

  // Lấy dữ liệu sản phẩm mới từ API
  useEffect(() => {
    const fetchNewProducts = async () => {
      try {
        const response = await fetch("http://localhost:9000/api/products/page?page=1&size=5");
        if (!response.ok) throw new Error("Không thể tải sản phẩm mới");
        const data = await response.json();
        setNewProducts(data);
        setLoadingNewProducts(false);
      } catch (error) {
        setError(error.message);
        setLoadingNewProducts(false);
      }
    };
    fetchNewProducts();
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

  // Hàm điều hướng đến trang chi tiết sản phẩm
  const handleProductClick = (id) => {
    navigate(`/product/${id}`);
  };

  return (
    <div style={{ background: "linear-gradient(to right, #f0f0f0, #e0e0e0)", minHeight: "100vh" }}>
      <div>
        <Header />

        {/* Banner */}
        <Container
          maxWidth="lg"
          style={{ marginTop: 20, textAlign: "center", position: "relative", overflow: "hidden" }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <div
            style={{
              display: "flex",
              transition: "transform 0.7s ease-in-out",
              transform: `translateX(-${bannerIndex * 100}%)`,
            }}
          >
            {banners.map((banner, index) => (
              <Card
                key={index}
                style={{ minWidth: "100%", height: 300, position: "relative", backgroundColor: "#ddd" }}
              >
                <CardMedia component="img" height="300" image={banner} alt="Banner" />
              </Card>
            ))}
          </div>

          <Box
            sx={{
              marginTop: "50px",
              backgroundColor: "#e0e0e0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "10px",
            }}
          >
            <IconButton sx={{ color: "black" }}>
              <FilterListIcon />
            </IconButton>
            <Typography variant="body1" sx={{ fontWeight: "bold", marginRight: "20px" }}>
              BỘ LỌC
            </Typography>
            <FormControl variant="outlined" sx={{ minWidth: 350, marginRight: "10px" }}>
              <InputLabel id="price-filter-label">Lọc giá</InputLabel>
              <Select labelId="price-filter-label" id="price-filter" label="Lọc giá">
                <MenuItem value="">Tất cả</MenuItem>
                <MenuItem value="low">Giá thấp đến cao</MenuItem>
                <MenuItem value="high">Giá cao đến thấp</MenuItem>
              </Select>
            </FormControl>
            <FormControl variant="outlined" sx={{ minWidth: 350, marginRight: "10px" }}>
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
              <IconButton
                onClick={() => setBannerIndex((bannerIndex - 1 + banners.length) % banners.length)}
                style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#993300" }}
              >
                <ArrowBackIos />
              </IconButton>
              <IconButton
                onClick={() => setBannerIndex((bannerIndex + 1) % banners.length)}
                style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", color: "#993300" }}
              >
                <ArrowForwardIos />
              </IconButton>
            </>
          )}
        </Container>

        {/* Danh mục sản phẩm */}
        <Container maxWidth="lg" style={{ marginTop: 40, position: "relative" }}>
          <Typography variant="h5" gutterBottom style={{ color: "#993300" }}>
            Danh Mục Sản Phẩm
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <Card
                style={{ transition: "0.3s", cursor: "pointer", borderRadius: "12px" }}
                onMouseOver={(e) => (e.currentTarget.style.boxShadow = "0 4px 8px rgba(153, 51, 0, 0.5)")}
                onMouseOut={(e) => (e.currentTarget.style.boxShadow = "none")}
              >
                <CardMedia
                  component="img"
                  height="240"
                  image="/guitar.jpg"
                  alt="Đàn Guitar"
                  style={{ borderRadius: "12px 12px 0 0" }}
                />
                <CardContent
                  style={{ backgroundColor: "#8B4513", color: "#fff", textAlign: "center", borderRadius: "0 0 12px 12px" }}
                >
                  <Typography variant="subtitle1">Đàn Guitar</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <Card
                style={{ transition: "0.3s", cursor: "pointer", borderRadius: "12px" }}
                onMouseOver={(e) => (e.currentTarget.style.boxShadow = "0 4px 8px rgba(153, 51, 0, 0.5)")}
                onMouseOut={(e) => (e.currentTarget.style.boxShadow = "none")}
              >
                <CardMedia
                  component="img"
                  height="240"
                  image="/Pino.jpg"
                  alt="Đàn Piano"
                  style={{ borderRadius: "12px 12px 0 0" }}
                />
                <CardContent
                  style={{ backgroundColor: "#8B4513", color: "#fff", textAlign: "center", borderRadius: "0 0 12px 12px" }}
                >
                  <Typography variant="subtitle1">Đàn Piano</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <Card
                style={{ transition: "0.3s", cursor: "pointer", borderRadius: "12px" }}
                onMouseOver={(e) => (e.currentTarget.style.boxShadow = "0 4px 8px rgba(153, 51, 0, 0.5)")}
                onMouseOut={(e) => (e.currentTarget.style.boxShadow = "none")}
              >
                <CardMedia
                  component="img"
                  height="240"
                  image="/ukulele.jpg"
                  alt="Đàn Ukulele"
                  style={{ borderRadius: "12px 12px 0 0" }}
                />
                <CardContent
                  style={{ backgroundColor: "#8B4513", color: "#fff", textAlign: "center", borderRadius: "0 0 12px 12px" }}
                >
                  <Typography variant="subtitle1">Đàn Ukulele</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <Card
                style={{ transition: "0.3s", cursor: "pointer", borderRadius: "12px" }}
                onMouseOver={(e) => (e.currentTarget.style.boxShadow = "0 4px 8px rgba(153, 51, 0, 0.5)")}
                onMouseOut={(e) => (e.currentTarget.style.boxShadow = "none")}
              >
                <CardMedia
                  component="img"
                  height="240"
                  image="/Violin.jpg"
                  alt="Đàn Violin"
                  style={{ borderRadius: "12px 12px 0 0" }}
                />
                <CardContent
                  style={{ backgroundColor: "#8B4513", color: "#fff", textAlign: "center", borderRadius: "0 0 12px 12px" }}
                >
                  <Typography variant="subtitle1">Đàn Violin</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>

        {/* Sản phẩm bán chạy */}
        <Container maxWidth="lg" style={{ marginTop: 40 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h5" style={{ color: "#993300" }}>
              Sản Phẩm Bán Chạy
            </Typography>
            <Button variant="outlined" style={{ color: "#993300", borderColor: "#993300" }}>
              Xem thêm
            </Button>
          </div>
          {loadingBestSelling ? (
            <Typography>Đang tải sản phẩm bán chạy...</Typography>
          ) : error ? (
            <Typography color="error">Lỗi: {error}</Typography>
          ) : (
            <Grid container spacing={4}>
              {bestSellingProducts.map((product) => (
                <Grid item xs={2.4} key={product.id}>
                  <Card
                    style={{
                      borderRadius: "12px",
                      transition: "0.3s",
                      cursor: "pointer",
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                    }}
                    onClick={() => handleProductClick(product.id)} // Điều hướng khi nhấp
                  >
                    <CardMedia
                      component="img"
                      height="240"
                      image={product.imageUrls[0]}
                      alt={product.name}
                    />
                    <Divider />
                    <CardContent>
                      <Typography variant="subtitle1">{product.name}</Typography>
                      <Typography variant="body1" style={{ fontWeight: "bold", color: "#993300" }}>
                        {product.price.toLocaleString("vi-VN")} VND
                      </Typography>
                      <Typography variant="body2" style={{ textDecoration: "line-through", color: "#999" }}>
                        {(product.price * 1.2).toLocaleString("vi-VN")} VND
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
          )}
        </Container>

        {/* Sản phẩm mới */}
        <Container maxWidth="lg" style={{ marginTop: 40 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h5" style={{ color: "#993300" }}>
              Sản Phẩm Mới
            </Typography>
            <Button variant="outlined" style={{ color: "#993300", borderColor: "#993300" }}>
              Xem thêm
            </Button>
          </div>
          {loadingNewProducts ? (
            <Typography>Đang tải sản phẩm mới...</Typography>
          ) : error ? (
            <Typography color="error">Lỗi: {error}</Typography>
          ) : (
            <Grid container spacing={4}>
              {newProducts.map((product) => (
                <Grid item xs={2.4} key={product.id}>
                  <Card
                    style={{
                      borderRadius: "12px",
                      transition: "0.3s",
                      cursor: "pointer",
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                    }}
                    onClick={() => handleProductClick(product.id)} // Điều hướng khi nhấp
                  >
                    <CardMedia
                      component="img"
                      height="240"
                      image={product.imageUrls[0]}
                      alt={product.name}
                    />
                    <Divider />
                    <CardContent>
                      <Typography variant="subtitle1">{product.name}</Typography>
                      <Typography variant="body1" style={{ fontWeight: "bold", color: "#993300" }}>
                        {product.price.toLocaleString("vi-VN")} VND
                      </Typography>
                      <Typography variant="body2" style={{ textDecoration: "line-through", color: "#999" }}>
                        {(product.price * 1.2).toLocaleString("vi-VN")} VND
                      </Typography>
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
          )}
        </Container>

        <Footer />
      </div>
    </div>
  );
};

export default Home;