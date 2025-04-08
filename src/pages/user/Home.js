import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Thêm useNavigate để điều hướng
import Header from "../../components/Header";
import Footer from "../../components/Footer";
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
} from "@mui/material";
import { ArrowBackIos, ArrowForwardIos, FilterList as FilterListIcon } from "@mui/icons-material";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SearchIcon from '@mui/icons-material/Search';
import Tooltip from '@mui/material/Tooltip';
import api from '../../utils/api';

const productCategories = [1, 2, 3, 4, 5, 6, 7, 8];
const banners = ["/banner1.png", "/banner2.png", "/banner3.png"];

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
        const response = await api.get('/products/page', {
          params: { page: 1, size: 10 }
        });
  
        setBestSellingProducts(response.data);
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
        const response = await api.get('/products/page', {
          params: { page: 1, size: 5 }
        });
  
        setNewProducts(response.data);
        setLoadingNewProducts(false);
      } catch (error) {
        setError(error.message);
        setLoadingNewProducts(false);
      }
    };
  
    fetchNewProducts();
  }, []);

  const addToCart = (productId) => {
    console.log(`Thêm sản phẩm ${productId} vào giỏ hàng`);
    // Thêm logic lưu vào Redux hoặc localStorage nếu cần
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
        <div
          style={{
            width: '100%', // Full chiều ngang màn hình
            height: 400, // Chiều cao banner (có thể điều chỉnh)
            position: "relative",
            overflow: "hidden",
            marginTop: 0, // Sát lên trên cùng
          }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <div
            style={{
              display: "flex",
              width: `${banners.length * 100}vw`, // Đảm bảo tất cả banner nằm trong một hàng
              height: "100%",
              transition: "transform 1s ease-in-out", // Animation mượt mà
              transform: `translateX(-${bannerIndex * 100}vw)`, // Dịch chuyển theo chiều ngang full màn hình
            }}
          >
            {banners.map((banner, index) => (
              <div
                key={index}
                style={{
                  width: "100vw", // Mỗi banner chiếm full chiều ngang
                  height: "100%",
                  flexShrink: 0, // Ngăn banner bị co lại
                }}
              >
                <img
                  src={banner}
                  alt={`Banner ${index + 1}`}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover", // Ảnh full banner
                  }}
                />
              </div>
            ))}
          </div>

          {/* Nút điều hướng */}
          {hovered && (
            <>
              <IconButton
                onClick={() => setBannerIndex((bannerIndex - 1 + banners.length) % banners.length)}
                style={{
                  position: "absolute",
                  left: 20, // Nằm cách mép trái một chút
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "white",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  transition: "background-color 0.3s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.8)")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.5)")}
              >
                <ArrowBackIos />
              </IconButton>
              <IconButton
                onClick={() => setBannerIndex((bannerIndex + 1) % banners.length)}
                style={{
                  position: "absolute",
                  right: 20, // Nằm cách mép phải một chút
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "white",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  transition: "background-color 0.3s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.8)")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.5)")}
              >
                <ArrowForwardIos />
              </IconButton>
            </>
          )}

          {/* Dấu chấm (Dots) */}
          <div
            style={{
              position: "absolute",
              bottom: 20, // Cách đáy banner 20px
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              gap: "10px", // Khoảng cách giữa các dấu chấm
            }}
          >
            {banners.map((_, index) => (
              <div
                key={index}
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  backgroundColor: bannerIndex === index ? "#993300" : "rgba(255, 255, 255, 0.5)", // Màu nổi bật cho chấm đang active
                  cursor: "pointer",
                  transition: "background-color 0.3s ease", // Hiệu ứng chuyển màu mượt mà
                }}
                onClick={() => setBannerIndex(index)} // Nhấp vào dấu chấm để chuyển ảnh
              />
            ))}
          </div>
        </div>

        {/* Giới thiệu */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            height: "100px",
            color: "#993300",
            paddingTop: "10px",
          }}
        >
          <Typography variant="h5" fontWeight="bold">
            Music Store - Đại Lý Phân Phối Nhạc Cụ Uy Tín
          </Typography>
          <Typography variant="body1">
            Music Store chuyên bán các loại nhạc cụ trên toàn quốc và đặc biệt tại TPHCM
          </Typography>
        </Box>

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
              {bestSellingProducts.map((product) => {
                const isDiscounted = product.price < product.price * 1.2; // Kiểm tra nếu có giảm giá

                return (
                  <Grid item xs={2.4} key={product.id}>
                    <Card
                      style={{
                        borderRadius: "12px",
                        transition: "0.3s",
                        cursor: "pointer",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                        position: "relative",
                        overflow: "hidden",
                      }}
                      onClick={() => handleProductClick(product.id)}
                      onMouseEnter={(e) => e.currentTarget.querySelector('.hover-icons').style.opacity = 1}
                      onMouseLeave={(e) => e.currentTarget.querySelector('.hover-icons').style.opacity = 0}
                    >
                      {/* Tag Giảm Giá (Nằm xéo ở góc trên bên phải) */}
                      {isDiscounted && (
                        <div
                          style={{
                            position: "absolute",
                            top: "0",
                            right: "0",
                            backgroundColor: "#ff3333",
                            color: "white",
                            padding: "5px 50px",
                            fontSize: "12px",
                            fontWeight: "bold",
                            transform: "rotate(45deg) translate(50%, 80%)",
                            transformOrigin: "top right",
                            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
                          }}
                        >
                          Sale
                        </div>
                      )}

                      <CardMedia
                        component="img"
                        height="240"
                        image={product.imageUrls?.[0]}
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

                      {/* Icons Hiển Thị Khi Hover */}
                      <div className="hover-icons"
                        style={{
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                          display: "flex",
                          gap: "10px",
                          opacity: 0,
                          transition: "opacity 0.3s ease-in-out",
                        }}
                      >
                        <Tooltip title="Thêm vào giỏ hàng">
                          <div
                            style={{
                              width: "40px",
                              height: "40px",
                              backgroundColor: "white",
                              borderRadius: "50%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              cursor: "pointer",
                              boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
                            }}
                            onClick={(e) => { e.stopPropagation(); addToCart(product.id); }}
                          >
                            <ShoppingCartIcon style={{ color: "#993300" }} />
                          </div>
                        </Tooltip>

                        <Tooltip title="Xem chi tiết">
                          <div
                            style={{
                              width: "40px",
                              height: "40px",
                              backgroundColor: "white",
                              borderRadius: "50%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              cursor: "pointer",
                              boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
                            }}
                            onClick={(e) => { e.stopPropagation(); handleProductClick(product.id); }}
                          >
                            <SearchIcon style={{ color: "#993300" }} />
                          </div>
                        </Tooltip>
                      </div>
                    </Card>
                  </Grid>
                );
              })}
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
                      position: "relative", // Cho icon hiển thị đúng vị trí
                      overflow: "hidden"
                    }}
                    onClick={() => handleProductClick(product.id)}
                    onMouseEnter={(e) => e.currentTarget.querySelector('.hover-icons').style.opacity = 1}
                    onMouseLeave={(e) => e.currentTarget.querySelector('.hover-icons').style.opacity = 0}
                  >
                    <CardMedia
                      component="img"
                      height="240"
                      image={product.imageUrls?.[0]}
                      alt={product.name}
                    />
                    <Divider />
                    <CardContent>
                      <Typography variant="subtitle1">{product.name}</Typography>
                      <Typography variant="body1" style={{ fontWeight: "bold", color: "#993300" }}>
                        {product.price.toLocaleString("vi-VN")} VND
                      </Typography>
                    </CardContent>

                    {/* Icons Hiển Thị Khi Hover */}
                    <div className="hover-icons"
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        display: "flex",
                        gap: "10px",
                        opacity: 0, // Ẩn ban đầu
                        transition: "opacity 0.3s ease-in-out"
                      }}
                    >
                      <Tooltip title="Thêm vào giỏ hàng">
                        <div
                          style={{
                            width: "40px",
                            height: "40px",
                            backgroundColor: "white",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)"
                          }}
                          onClick={(e) => { e.stopPropagation(); addToCart(product.id); }} // Ngăn click vào card
                        >
                          <ShoppingCartIcon style={{ color: "#993300" }} />
                        </div>
                      </Tooltip>

                      <Tooltip title="Xem chi tiết">
                        <div
                          style={{
                            width: "40px",
                            height: "40px",
                            backgroundColor: "white",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)"
                          }}
                          onClick={(e) => { e.stopPropagation(); handleProductClick(product.id); }} // Ngăn click vào card
                        >
                          <SearchIcon style={{ color: "#993300" }} />
                        </div>
                      </Tooltip>
                    </div>
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