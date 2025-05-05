import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardMedia,
  Paper,
  IconButton,
  Snackbar,
  Alert,
  Rating,
  TextField,
  Divider,
  Pagination,
} from "@mui/material";
import { Add, Remove, StarBorder } from "@mui/icons-material";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import PaymentIcon from "@mui/icons-material/Payment";
import InventoryIcon from "@mui/icons-material/Inventory";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import { useCart } from "../../context/CartContext";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';

const deliveryItems = [
  { icon: <CheckCircleIcon color="primary" fontSize="large" />, text: "Cam kết 100% chính hãng" },
  { icon: <MonetizationOnIcon color="secondary" fontSize="large" />, text: "Miễn phí giao hàng cho đơn hàng trên 1 triệu VNĐ tại HCM" },
  { icon: <SupportAgentIcon color="success" fontSize="large" />, text: "Hỗ trợ từ 9h sáng đến 6h chiều" },
  { icon: <PaymentIcon color="warning" fontSize="large" />, text: "Thanh Toán Đa Dạng" },
  { icon: <InventoryIcon color="error" fontSize="large" />, text: "Mở hộp kiểm tra nhận hàng" },
  { icon: <AutorenewIcon color="info" fontSize="large" />, text: "Đổi trả trong 2 ngày" },
];

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart, fetchCart } = useCart();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [inventory, setInventory] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 0, comment: "" });
  const [userId, setUserId] = useState("");
  const [page, setPage] = useState(1); // Trang bắt đầu từ 1 như SearchResults
  const size = 5; // 5 đánh giá mỗi trang
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchProductAndReviews = async () => {
      try {
        const [productRes, inventoryRes, reviewsRes] = await Promise.all([
          api.get(`/products/${id}`),
          api.get(`/inventory/${id}`),
          api.get(`/reviews/product/${id}`, { params: { page: page - 1, size } }), // Thêm params cho phân trang
        ]);
        setProduct(productRes.data);
        setSelectedImage(productRes.data.imageUrls[0] || "");
        setInventory(inventoryRes.data);
        setReviews(reviewsRes.data.content); // Lấy mảng content từ response
        setTotalPages(reviewsRes.data.totalPages); // Cập nhật tổng số trang

        const user = JSON.parse(localStorage.getItem("user"));
        setUserId(user ? user.id : "");
      } catch (error) {
        setError("Không thể tải chi tiết sản phẩm hoặc đánh giá");
      } finally {
        setLoading(false);
      }
    };

    fetchProductAndReviews();
  }, [id, page]); // Thêm page vào dependency để fetch lại khi đổi trang

  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    phoneNumber: '',
    address: '',
  });
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Kiểm tra xem có token trong localStorage hay không
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
          setUser(null); // Nếu không có token, đặt user là null
          return;
        }
  
        const response = await api.get('/users/me');
        setUser(response.data);
        setFormData({
          fullName: response.data.fullName || '',
          username: response.data.username || '',
          email: response.data.email || '',
          phoneNumber: response.data.phoneNumber || '',
          address: response.data.address || '',
        });
      } catch (error) {
        if (error.response && error.response.status === 401) {
          setUser(null); // Xử lý lỗi 401: người dùng chưa đăng nhập
        } else {
          console.error("Lỗi lấy thông tin user:", error);
          setUser(null);
        }
      }
    };
  
    fetchUserProfile();
  }, []);

  const increaseQuantity = () => setQuantity((prev) => (prev < inventory ? prev + 1 : prev));
  const decreaseQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : prev));

  const addToCartHandler = async () => {
    if (inventory === 0) return;
  
    // Kiểm tra xem người dùng đã đăng nhập chưa
    const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
      setSnackbarMessage("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!");
      setSnackbarSeverity("warning");
      setSnackbarOpen(true);
      return;
    }
  
    try {
      await addToCart(id, quantity);
      await fetchCart();
      setSnackbarMessage("Sản phẩm đã được thêm vào giỏ hàng!");
      setSnackbarSeverity("success");
    } catch (error) {
      setSnackbarMessage("Lỗi khi thêm sản phẩm vào giỏ hàng!");
      setSnackbarSeverity("error");
    }
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => setSnackbarOpen(false);

  const handleReviewSubmit = async () => {
    if (!userId) {
      setSnackbarMessage("Vui lòng đăng nhập để gửi đánh giá!");
      setSnackbarSeverity("warning");
      setSnackbarOpen(true);
      return;
    }

    const reviewData = {
      userId,
      productId: id,
      comment: newReview.comment,
      rating: newReview.rating,
    };

    try {
      await api.post(`/reviews`, reviewData);
      const reviewsRes = await api.get(`/reviews/product/${id}`, { params: { page: page - 1, size } });
      setReviews(reviewsRes.data.content);
      setTotalPages(reviewsRes.data.totalPages);
      setNewReview({ rating: 0, comment: "" });
      setSnackbarMessage("Đánh giá của bạn đã được gửi!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMessage("Lỗi khi gửi đánh giá!");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handlePageChange = (event, value) => {
    setPage(value); // Cập nhật trang trực tiếp (từ 1 trở lên)
  };

  const [currentIndex, setCurrentIndex] = useState(0);
  const thumbnailsPerPage = 3;

  const nextThumbnails = () => {
    if (currentIndex + thumbnailsPerPage < product.imageUrls.length) {
      setCurrentIndex((prev) => prev + thumbnailsPerPage);
    }
  };

  const prevThumbnails = () => {
    if (currentIndex - thumbnailsPerPage >= 0) {
      setCurrentIndex((prev) => prev - thumbnailsPerPage);
    }
  };

  if (loading) return <Typography sx={{ textAlign: "center", py: 5 }}>Đang tải...</Typography>;
  if (error) return <Typography sx={{ textAlign: "center", py: 5 }} color="error">Lỗi: {error}</Typography>;

  const isOutOfStock = inventory === 0;

  return (
    <div>
      <Header />
      <Container sx={{ py: 6 }}>
        <Box sx={{ display: "flex", gap: 4, flexWrap: "wrap", bgcolor: "#f9f9f9", p: 3, borderRadius: 2 }}>
          <Box sx={{ maxWidth: 500, flex: "1 1 40%" }}>
            <Card sx={{ mb: 2, boxShadow: 3, borderRadius: 2, overflow: "hidden" }}>
              <CardMedia
                component="img"
                image={selectedImage}
                alt={product.name}
                sx={{ width: "100%", height: 400, objectFit: "contain" }}
              />
            </Card>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <IconButton onClick={prevThumbnails} disabled={currentIndex === 0}>
                <ArrowBackIos />
              </IconButton>
              <Grid container spacing={1} sx={{ flex: 1 }}>
                {product.imageUrls.slice(currentIndex, currentIndex + thumbnailsPerPage).map((img, index) => (
                  <Grid item xs={4} key={index}>
                    <Card
                      sx={{
                        cursor: "pointer",
                        border: selectedImage === img ? "2px solid #993300" : "1px solid #ddd",
                        borderRadius: 1,
                        overflow: "hidden",
                        transition: "all 0.3s ease",
                        "&:hover": { borderColor: "#993300" },
                      }}
                      onClick={() => setSelectedImage(img)}
                    >
                      <CardMedia
                        component="img"
                        image={img}
                        alt={`Thumbnail ${index + 1}`}
                        sx={{ width: "100%", height: 80, objectFit: "cover" }}
                      />
                    </Card>
                  </Grid>
                ))}
              </Grid>
              <IconButton onClick={nextThumbnails} disabled={currentIndex + thumbnailsPerPage >= product.imageUrls.length}>
                <ArrowForwardIos />
              </IconButton>
            </Box>
          </Box>

          <Box sx={{ flex: "1 1 50%", p: 3 }}>
            <Typography variant="h4" fontWeight="bold" color="#333">{product.name}</Typography>
            <Typography variant="h5" color="error" fontWeight="bold" sx={{ mt: 1 }}>
              {product.price.toLocaleString("vi-VN")} VND
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>{product.description}</Typography>

            <Box sx={{ mt: 3, display: "flex", alignItems: "center", gap: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <IconButton onClick={decreaseQuantity} disabled={quantity <= 1 || isOutOfStock}>
                  <Remove />
                </IconButton>
                <Typography variant="h6">{quantity}</Typography>
                <IconButton onClick={increaseQuantity} disabled={quantity >= inventory || isOutOfStock}>
                  <Add />
                </IconButton>
              </Box>
              <Typography variant="body2" color={isOutOfStock ? "error.main" : "success.main"}>
                {isOutOfStock ? "Hết hàng" : `Tồn kho: ${inventory} sản phẩm`}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={addToCartHandler}
                disabled={isOutOfStock}
                sx={{ px: 4, py: 1.5, bgcolor: isOutOfStock ? "grey.500" : "primary.main" }}
              >
                Thêm vào giỏ hàng
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                disabled={isOutOfStock}
                sx={{ px: 4, py: 1.5, color: isOutOfStock ? "grey.500" : "secondary.main", borderColor: isOutOfStock ? "grey.500" : "secondary.main" }}
              >
                Mua ngay
              </Button>
            </Box>

            {/* Chính sách giao hàng */}
            <Box sx={{ mt: 4 }}>
              <Grid container spacing={2}>
                {deliveryItems.map((item, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index} sx={{ display: "flex" }}>
                    <Paper sx={{ p: 2, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flex: 1, textAlign: "center" }}>
                      {item.icon}
                      <Typography variant="body1">{item.text}</Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Box>
        </Box>

        {/* Product Details */}
        <Box sx={{ mt: 6, p: 4, bgcolor: "#fff", borderRadius: 2, boxShadow: 2 }}>
          <Typography variant="h5" fontWeight="bold" color="#993300" sx={{ mb: 3, textAlign: "center" }}>
            Chi Tiết Sản Phẩm
          </Typography>
          <Typography variant="h4" fontWeight="bold">{product.name}</Typography>
          <Typography variant="h6" fontWeight="bold" sx={{ mt: 3 }}>Tính Năng Nổi Bật</Typography>
          <ul style={{ paddingLeft: 20 }}>
            {["Long-term warranty: 2 years", "Impact resistance", "Premium materials", "Secure data", "Dedicated support"].map((feature, idx) => (
              <li key={idx}><Typography variant="body1">✅ {feature}</Typography></li>
            ))}
          </ul>
        </Box>

        {/* Reviews Section */}
        <Box sx={{ mt: 6, p: 4, bgcolor: "#f9f9f9", borderRadius: 2, boxShadow: 2 }}>
          <Typography variant="h5" fontWeight="bold" color="#993300" sx={{ mb: 3, textAlign: "center" }}>
            Đánh Giá Sản Phẩm
          </Typography>

          {/* Add New Review */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" fontWeight="bold">Thêm Đánh Giá Của Bạn</Typography>
            <Rating
              value={newReview.rating}
              onChange={(e, newValue) => setNewReview({ ...newReview, rating: newValue })}
              precision={1}
              emptyIcon={<StarBorder fontSize="inherit" />}
              sx={{ mt: 1 }}
            />
            <TextField
              fullWidth
              multiline
              rows={3}
              value={newReview.comment}
              onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
              placeholder="Viết đánh giá của bạn..."
              sx={{ mt: 2 }}
            />
            <Button variant="contained" color="primary" onClick={handleReviewSubmit} sx={{ mt: 2 }}>
              Gửi Đánh Giá
            </Button>
          </Box>

          {/* Display Reviews */}
          <Divider sx={{ mb: 3 }} />
          {reviews.length > 0 ? (
            <>
              {reviews.map((review) => (
                <Box key={review.id} sx={{ mb: 3 }}>
                  <Rating value={review.rating} readOnly precision={1} />
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>{review.comment}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {/* {user.email} -  */}
                    {new Date().toLocaleDateString("vi-VN")} 
                  </Typography>
                </Box>
              ))}
              <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
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
              </Box>
            </>
          ) : (
            <Typography variant="body1" color="text.secondary">Chưa có đánh giá nào cho sản phẩm này.</Typography>
          )}
        </Box>
      </Container>
      <Footer />

      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ProductDetail;