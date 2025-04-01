import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  CircularProgress,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  Chip,
} from "@mui/material";
import { motion } from "framer-motion"; // Thêm Framer Motion để tạo animation
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";
import Header from "../components/Header";
import Footer from "../components/Footer";

const OrderPage = () => {
  const { correlationId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmEnabled, setConfirmEnabled] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [userInfo, setUserInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
  });
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  // Lấy thông tin đơn hàng
  const fetchOrderDetails = async () => {
    try {
      const response = await api.get(`/orders/get-by-correlation/${correlationId}`);
      setOrder(response.data);
      if (response.data.status === "PAID") {
        setConfirmEnabled(true);
      }
    } catch (error) {
      console.error("Lỗi lấy thông tin đơn hàng:", error);
      setSnackbarMessage("Không thể lấy thông tin đơn hàng!");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
    const interval = setInterval(() => {
      fetchOrderDetails();
    }, 4000);
    return () => clearInterval(interval);
  }, [correlationId]);

  // Xử lý nhập thông tin người dùng
  const handleUserInfoChange = (e) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };

  // Xử lý nhập thông tin thanh toán
  const handlePaymentDetailChange = (e) => {
    setPaymentDetails({ ...paymentDetails, [e.target.name]: e.target.value });
  };

  // Xử lý thanh toán
  const handlePayment = async () => {
    // Kiểm tra thông tin người dùng
    if (!userInfo.fullName || !userInfo.email || !userInfo.phone) {
      setSnackbarMessage("Vui lòng nhập đầy đủ thông tin người dùng!");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    // Nếu chọn Online, kiểm tra thông tin thẻ
    if (paymentMethod === "online" && (!paymentDetails.cardNumber || !paymentDetails.expiry || !paymentDetails.cvv)) {
      setSnackbarMessage("Vui lòng nhập đầy đủ thông tin thanh toán!");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    try {
      setPaymentLoading(true);
      const response = await api.post("/payment/checkout", {
        orderId: order.orderId,
        amount: order.totalPrice,
        paymentMethod,
        userInfo,
        paymentDetails: paymentMethod === "online" ? paymentDetails : null,
      });

      if (response.data.status === "payment_completed") {
        setConfirmEnabled(true);
        setPaymentModalOpen(false);
        setSnackbarMessage("Thanh toán thành công!");
        setSnackbarSeverity("success");
      } else {
        throw new Error("Thanh toán thất bại!");
      }
    } catch (error) {
      console.error("Thanh toán lỗi:", error);
      setSnackbarMessage(error.response?.data?.message || "Thanh toán thất bại!");
      setSnackbarSeverity("error");
    } finally {
      setPaymentLoading(false);
      setSnackbarOpen(true);
    }
  };

  // Xử lý xác nhận đơn hàng
  const handleConfirm = async () => {
    try {
      const response = await api.post("/orders/confirm", { orderId: order.orderId });
      if (response.data.success) {
        setSnackbarMessage("Đặt hàng thành công!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);

        // Gửi notification
        await api.post("/notifications/send", {
          userId: order.userId,
          message: `Đơn hàng #${order.orderId} đã được xác nhận!`,
        });

        // Chuyển hướng về trang cảm ơn
        setTimeout(() => navigate("/thank-you"), 2000);
      }
    } catch (error) {
      console.error("Lỗi xác nhận đơn hàng:", error);
      setSnackbarMessage("Không thể xác nhận đơn hàng!");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  if (loading) {
    return (
      <div>
        <Header />
        <Container>
          <Box textAlign="center" sx={{ my: 5 }}>
            <CircularProgress />
            <Typography variant="h6" sx={{ mt: 2 }}>
              Đang tải thông tin đơn hàng...
            </Typography>
          </Box>
        </Container>
        <Footer />
      </div>
    );
  }

  if (!order) {
    return (
      <div>
        <Header />
        <Container>
          <Typography color="error" variant="h6" align="center" sx={{ my: 4 }}>
            Không tìm thấy đơn hàng.
          </Typography>
        </Container>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Header />
      <Container sx={{ py: 5 }}>
        <Typography
          variant="h4"
          align="center"
          sx={{ mb: 5, fontWeight: "bold", color: "#333" }}
        >
          Chi Tiết Đơn Hàng #{order.orderId}
        </Typography>

        <Grid container spacing={4}>
          {/* Bên trái: Thông tin đơn hàng */}
          <Grid item xs={12} md={8}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
                <Box display="flex" justifyContent="space-between" sx={{ mb: 3 }}>
                  <Typography variant="h6" fontWeight="bold">
                    Thông Tin Đơn Hàng
                  </Typography>
                  <Chip
                    label={order.status}
                    sx={{
                      px: 2,
                      py: 1,
                      borderRadius: 1,
                      backgroundColor:
                        order.status === "PENDING_PAYMENT"
                          ? "#ff9800"
                          : order.status === "PAID"
                          ? "#4caf50"
                          : "#f44336",
                      color: "#fff",
                      fontWeight: "bold",
                    }}
                  />
                </Box>

                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow
                        sx={{ backgroundColor: "#f5f5f5", "& th": { fontWeight: "bold" } }}
                      >
                        <TableCell>Sản Phẩm</TableCell>
                        <TableCell align="center">Đơn Giá</TableCell>
                        <TableCell align="center">Số Lượng</TableCell>
                        <TableCell align="center">Thành Tiền</TableCell>
                        <TableCell align="center">Trạng Thái</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {order.items.map((item) => (
                        <motion.tr
                          key={item.productId}
                          whileHover={{ backgroundColor: "#f9f9f9" }}
                          transition={{ duration: 0.2 }}
                        >
                          <TableCell>
                            <Box display="flex" alignItems="center">
                              <motion.img
                                src={item.imageUrl}
                                alt={item.name}
                                width="60"
                                height="60"
                                style={{ borderRadius: "8px", objectFit: "cover" }}
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.3 }}
                              />
                              <Typography sx={{ ml: 2, fontWeight: "medium" }}>
                                {item.name}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell align="center">
                            {item.price.toLocaleString("vi-VN")} VND
                          </TableCell>
                          <TableCell align="center">{item.quantity}</TableCell>
                          <TableCell align="center">
                            {(item.price * item.quantity).toLocaleString("vi-VN")} VND
                          </TableCell>
                          <TableCell align="center">
                            <Chip
                              label={item.status}
                              sx={{
                                backgroundColor:
                                  item.status === "CONFIRMED" ? "#4caf50" : "#ff9800",
                                color: "#fff",
                                fontWeight: "bold",
                              }}
                            />
                          </TableCell>
                        </motion.tr>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </motion.div>
          </Grid>

          {/* Bên phải: Tùy chọn thanh toán */}
          <Grid item xs={12} md={4}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
                  Thanh Toán Đơn Hàng
                </Typography>

                <Box display="flex" justifyContent="space-between" sx={{ mb: 2 }}>
                  <Typography>Tổng tiền:</Typography>
                  <Typography fontWeight="bold">
                    {order.totalPrice.toLocaleString("vi-VN")} VND
                  </Typography>
                </Box>

                <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.3 }}>
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => setPaymentModalOpen(true)}
                    disabled={confirmEnabled || paymentLoading}
                    sx={{
                      py: 1.5,
                      fontSize: "1rem",
                      borderColor: "#4caf50",
                      color: "#4caf50",
                      "&:hover": {
                        borderColor: "#45a049",
                        backgroundColor: "#f0f9f0",
                      },
                    }}
                  >
                    Chọn Phương Thức Thanh Toán
                  </Button>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                  style={{ marginTop: "20px" }}
                >
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={handleConfirm}
                    disabled={!confirmEnabled}
                    sx={{
                      py: 1.5,
                      fontSize: "1.1rem",
                      backgroundColor: confirmEnabled ? "#4caf50" : "#bdbdbd",
                      "&:hover": {
                        backgroundColor: confirmEnabled ? "#45a049" : "#bdbdbd",
                      },
                    }}
                  >
                    Đặt Hàng
                  </Button>
                </motion.div>
              </Paper>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
      <Footer />

      {/* Modal Thanh Toán */}
      <Dialog open={paymentModalOpen} onClose={() => setPaymentModalOpen(false)}>
        <DialogTitle>Chọn Phương Thức Thanh Toán</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2, mb: 3 }}>
            <InputLabel>Phương thức thanh toán</InputLabel>
            <Select
              value={paymentMethod}
              label="Phương thức thanh toán"
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <MenuItem value="cod">Thanh toán khi nhận hàng</MenuItem>
              <MenuItem value="online">Thanh toán online</MenuItem>
            </Select>
          </FormControl>

          {/* Form thông tin người dùng */}
          <Typography variant="h6" sx={{ mb: 2 }}>
            Thông Tin Người Nhận
          </Typography>
          <TextField
            label="Họ và tên"
            name="fullName"
            value={userInfo.fullName}
            onChange={handleUserInfoChange}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            value={userInfo.email}
            onChange={handleUserInfoChange}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Số điện thoại"
            name="phone"
            value={userInfo.phone}
            onChange={handleUserInfoChange}
            fullWidth
            sx={{ mb: 2 }}
          />

          {/* Form thông tin thanh toán */}
          {paymentMethod === "online" && (
            <>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Thông Tin Thanh Toán
              </Typography>
              <TextField
                label="Số thẻ"
                name="cardNumber"
                value={paymentDetails.cardNumber}
                onChange={handlePaymentDetailChange}
                fullWidth
                sx={{ mb: 2 }}
              />
              <TextField
                label="Ngày hết hạn (MM/YY)"
                name="expiry"
                value={paymentDetails.expiry}
                onChange={handlePaymentDetailChange}
                fullWidth
                sx={{ mb: 2 }}
              />
              <TextField
                label="CVV"
                name="cvv"
                value  = {paymentDetails.cvv}
                onChange={handlePaymentDetailChange}
                fullWidth
                sx={{ mb: 2 }}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPaymentModalOpen(false)}>Hủy</Button>
          <Button onClick={handlePayment} disabled={paymentLoading}>
            {paymentLoading ? "Đang xử lý..." : "Xác nhận Thanh Toán"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default OrderPage;