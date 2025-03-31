import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Card, CardMedia, CardContent, Pagination, Divider, Tooltip, IconButton } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from "../components/Header";
import Footer from "../components/Footer";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SearchIcon from '@mui/icons-material/Search';
import api from '../utils/api';

const SearchResults = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);

    const keyword = searchParams.get("keyword") || "";
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [page, setPage] = useState(parseInt(searchParams.get("page")) || 1);
    const size = 15;
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await api.get('/products/search-paged', {
                    params: { keyword, page: page - 1, size }
                });

                setProducts(response.data.content || []);
                setTotalPages(response.data.totalPages || 1);
            } catch (error) {
                setError("Không thể tải sản phẩm");
            } finally {
                setLoading(false);
            }
        };

        if (keyword) fetchProducts();
    }, [keyword, page]);

    const handlePageChange = (event, value) => {
        setPage(value);
        navigate(`/search?keyword=${keyword}&page=${value}`);
    };

    const addToCart = (productId) => {
        console.log(`Thêm sản phẩm ${productId} vào giỏ hàng`);
    };

    const handleProductClick = (id) => {
        navigate(`/product/${id}`);
    };

    return (
        <div style={{ background: "linear-gradient(to right, #f0f0f0, #e0e0e0)", minHeight: "100vh" }}>
            <Header />
            <Container maxWidth="lg" sx={{ marginTop: '20px' }}>
                {keyword && (
                    <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2, color: "#993300" }}>
                        Kết quả tìm kiếm cho: "{keyword}"
                    </Typography>
                )}

                {loading ? (
                    <Typography>Đang tải sản phẩm...</Typography>
                ) : error ? (
                    <Typography color="error">{error}</Typography>
                ) : (
                    <>
                        {/* Danh sách sản phẩm */}
                        <Grid container spacing={4}>
                            {products.map((product) => {
                                const isDiscounted = product.price < product.price * 1.2;

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
                                            {/* Tag Giảm Giá */}
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

                        {/* Pagination */}
                        <Pagination
                            count={totalPages}
                            page={page}
                            onChange={handlePageChange}
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                mt: 4,
                                "& .MuiPaginationItem-root": {
                                    color: "#993300",
                                    borderColor: "#993300",
                                },
                                "& .Mui-selected": {
                                    backgroundColor: "#993300 !important",
                                    color: "white !important",
                                },
                                "& .MuiPaginationItem-root:hover": {
                                    backgroundColor: "#b35900",
                                    color: "white",
                                },
                            }}
                        />
                    </>
                )}
            </Container>
            <Footer />
        </div>
    );
};

export default SearchResults;
