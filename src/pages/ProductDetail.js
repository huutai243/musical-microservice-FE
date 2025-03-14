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
} from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import Header from "../components/Header";
import Footer from "../components/Footer";
import api from "../utils/api"; 
import { useCart } from "../context/CartContext";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import PaymentIcon from "@mui/icons-material/Payment";
import InventoryIcon from "@mui/icons-material/Inventory";
import AutorenewIcon from "@mui/icons-material/Autorenew";

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
  const [inventory, setInventory] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${id}`);
        setProduct(response.data);
        setSelectedImage(response.data.imageUrls[0] || "");
      } catch (error) {
        setError("Không thể tải chi tiết sản phẩm.");
      } finally {
        setLoading(false);
      }
    };

    const fetchInventory = async () => {
      try {
        const response = await api.get(`/inventory/${id}`);
        setInventory(response.data);
      } catch (error) {
        console.error("Lỗi lấy tồn kho:", error);
      }
    };

    fetchProduct();
    fetchInventory();
  }, [id]);

  const increaseQuantity = () => setQuantity(prev => (prev < inventory ? prev + 1 : prev));
  const decreaseQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : prev));

  const addToCartHandler = async () => {
    try {
      await addToCart(id, quantity);
      await fetchCart(); 
      setSnackbarMessage(" Sản phẩm đã được thêm vào giỏ hàng!");
      setSnackbarSeverity("success");
    } catch (error) {
      console.error(" Lỗi khi thêm vào giỏ hàng:", error);
      setSnackbarMessage(" Lỗi khi thêm sản phẩm vào giỏ hàng!");
      setSnackbarSeverity("error");
    }
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  if (loading) return <Typography sx={{ textAlign: "center", py: 5 }}>Đang tải...</Typography>;
  if (error) return <Typography sx={{ textAlign: "center", py: 5 }} color="error">Lỗi: {error}</Typography>;

  return (
    <div>
      <Header />
      <Container>
        <Box sx={{ display: "flex", gap: 4, py: 4, flexWrap: "wrap" }}>
          <Box sx={{ maxWidth: 500, flex: "1 1 40%" }}>
            <Card sx={{ mb: 2, aspectRatio: "1 / 1", display: "flex", justifyContent: "center", alignItems: "center" }}>
              <CardMedia component="img" image={selectedImage} alt={product.name} sx={{ width: "100%", height: "100%", objectFit: "contain" }} />
            </Card>
          </Box>

          <Box sx={{ flex: "1 1 50%", p: 3 }}>
            <Typography variant="h4" fontWeight="bold">{product.name}</Typography>
            <Typography variant="h6" color="error" fontWeight="bold">{product.price.toLocaleString("vi-VN")} VND</Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 2 }}>
              <IconButton onClick={decreaseQuantity} disabled={quantity <= 1}><Remove /></IconButton>
              <Typography variant="h6">{quantity}</Typography>
              <IconButton onClick={increaseQuantity} disabled={quantity >= inventory}><Add /></IconButton>
            </Box>

            <Button variant="contained" color="primary" onClick={addToCartHandler}>Thêm vào giỏ hàng</Button>
          </Box>
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
