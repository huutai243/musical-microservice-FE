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

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, addToCart, removeFromCart, fetchCart } = useCart();

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  useEffect(() => {
    fetchCart();
  }, []);

  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shippingFee = subtotal > 5000000 ? 0 : 50000;
  const totalPrice = subtotal + shippingFee;

  const handleRemoveItem = async (productId) => {
  try {
    await removeFromCart(productId);
    setSnackbarMessage(" Sản phẩm đã được xóa khỏi giỏ hàng!");
    setSnackbarSeverity("success");
  } catch (error) {
    console.error(" Lỗi khi xóa sản phẩm:", error);
    setSnackbarMessage(" Không thể xóa sản phẩm khỏi giỏ hàng!");
    setSnackbarSeverity("error");
  }
  setSnackbarOpen(true);
};


  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
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
                <Button variant="contained" fullWidth sx={{ mt: 3 }} onClick={() => alert("Mua hàng")}>
                  Thanh Toán
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
    </div>
  );
};

export default Cart;
