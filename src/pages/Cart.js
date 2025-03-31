import React, { useEffect, useState } from "react";
import {
  Container, Typography, Grid, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, IconButton, Button, Box, Snackbar, Alert
} from "@mui/material";
import { Add, Remove, Delete, ShoppingCart } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Order from "../components/Order";
import api from "../utils/api";

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, addToCart, removeFromCart, fetchCart } = useCart();

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shippingFee = subtotal > 5000000 ? 0 : 50000;
  const totalPrice = subtotal + shippingFee;

  const handleRemoveItem = async (productId) => {
    try {
      await removeFromCart(productId);
      setSnackbarMessage("Sản phẩm đã được xóa khỏi giỏ hàng!");
      setSnackbarSeverity("success");
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
      setSnackbarMessage("Không thể xóa sản phẩm khỏi giỏ hàng!");
      setSnackbarSeverity("error");
    }
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const [correlationId, setCorrelationId] = useState(null);
const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user?.id) throw new Error("User not logged in");
  
      // Gọi API với đầy đủ headers và kiểm tra response
      const response = await api.post(
        "/cart/checkout",
        { userId: user.id },
        {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Lưu correlationId vào localStorage và state
    const newCorrelationId = response.data.correlationId;
    localStorage.setItem("correlationId", newCorrelationId);
    setCorrelationId(newCorrelationId);
  
      // Xử lý khi server trả về 200/201 nhưng logic thất bại
      if (response.data?.error) {
        throw new Error(response.data.message || "Checkout failed");
      }

      // Thành công
      setOrderData(response.data);
      setSnackbarMessage("Checkout thành công!");
      setSnackbarSeverity("success");
      setOrderModalOpen(true);
  
    } catch (error) {
      console.error("Checkout error:", error);
      
      // Hiển thị thông báo lỗi chi tiết từ server
      const errorMessage = error.response?.data?.message 
        || error.message 
        || "Lỗi không xác định";
      
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseOrderModal = () => {
    setOrderModalOpen(false);
    fetchCart(); // Cập nhật lại giỏ hàng sau khi đóng modal
  };

  return (
    <div>
      <Header />
      <Container>
        <Typography variant="h4" align="center" sx={{ my: 3 }}>Giỏ Hàng</Typography>

        {cartItems.length === 0 ? (
          <Box textAlign="center">
            <ShoppingCart sx={{ fontSize: 80, color: "#993300" }} />
            <Typography variant="h6" sx={{ my: 2 }}>Giỏ hàng trống!</Typography>
            <Button variant="contained" color="primary" onClick={() => navigate("/")}>
              Tiếp tục mua sắm
            </Button>
          </Box>
        ) : (
          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              <TableContainer component={Paper} elevation={3}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "#993300", color: "#fff" }}>
                      <TableCell sx={{ color: "#fff" }}>Sản Phẩm</TableCell>
                      <TableCell sx={{ color: "#fff" }}>Đơn Giá</TableCell>
                      <TableCell sx={{ color: "#fff" }}>Số Lượng</TableCell>
                      <TableCell sx={{ color: "#fff" }}>Thành Tiền</TableCell>
                      <TableCell sx={{ color: "#fff" }}>Hành Động</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {cartItems.map((item) => (
                      <TableRow key={item.productId}>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              width="80"
                              height="80"
                              style={{ borderRadius: "8px", objectFit: "cover" }}
                            />
                            <Typography sx={{ ml: 2 }}>{item.name}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{item.price.toLocaleString("vi-VN")} VND</TableCell>
                        <TableCell>
                          <IconButton onClick={() => addToCart(item.productId, -1)} disabled={item.quantity <= 1}>
                            <Remove />
                          </IconButton>
                          {item.quantity}
                          <IconButton onClick={() => addToCart(item.productId, 1)}>
                            <Add />
                          </IconButton>
                        </TableCell>
                        <TableCell>{(item.price * item.quantity).toLocaleString("vi-VN")} VND</TableCell>
                        <TableCell>
                          <IconButton onClick={() => handleRemoveItem(item.productId)} sx={{ color: "red" }}>
                            <Delete />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>

            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>Tóm Tắt Đơn Hàng</Typography>
                <Box display="flex" justifyContent="space-between">
                  <Typography>Tạm tính:</Typography>
                  <Typography>{subtotal.toLocaleString("vi-VN")} VND</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" sx={{ mt: 1 }}>
                  <Typography>Phí vận chuyển:</Typography>
                  <Typography>{shippingFee.toLocaleString("vi-VN")} VND</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" sx={{ mt: 2 }}>
                  <Typography variant="h6">Tổng cộng:</Typography>
                  <Typography variant="h6">{totalPrice.toLocaleString("vi-VN")} VND</Typography>
                </Box>
                <Button
                  variant="contained"
                  fullWidth
                  sx={{ mt: 3 }}
                  onClick={handleCheckout}
                  disabled={loading}
                >
                  {loading ? "Đang xử lý..." : "Thanh Toán"}
                </Button>
              </Paper>
            </Grid>
          </Grid>
        )}
      </Container>
      <Footer />

      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {/* Order Modal */}
      {orderData && (
        <Order
          open={orderModalOpen}
          handleClose={handleCloseOrderModal}
          cartItems={orderData.items}
          totalPrice={orderData.totalPrice}
          orderStatus={orderData.status}
          correlationId={orderData.correlationId}
        />
      )}
    </div>
  );
};

export default Cart;