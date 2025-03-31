import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  Divider,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  TextField,
  Zoom,
  Fade,
  Snackbar,
  Alert,
  Chip,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Payment, CreditCard, LocalShipping, AccountBalanceWallet } from "@mui/icons-material";
import api from "../utils/api";

const ModalBox = styled(Box)(({ theme }) => ({
  width: "90%",
  maxWidth: 800,
  backgroundColor: "#fff",
  borderRadius: "16px",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
  padding: theme.spacing(4),
  outline: "none",
  maxHeight: "90vh",
  overflowY: "auto",
  display: "flex",
  flexDirection: "column",
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: "bold",
  color: "#993300",
  marginBottom: theme.spacing(2),
}));

const Order = ({ open, handleClose, cartItems, totalPrice }) => {
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    address: "",
  });
  const [cardInfo, setCardInfo] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });
  const [paypalEmail, setPaypalEmail] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [loading, setLoading] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [correlationId, setCorrelationId] = useState(null);

  // Lấy correlationId từ localStorage khi component mount
  useEffect(() => {
    const savedCorrelationId = localStorage.getItem("correlationId");
    if (savedCorrelationId) {
      setCorrelationId(savedCorrelationId);
    }
  }, []);

  // Fetch order details khi modal mở và có correlationId
  useEffect(() => {
    if (open && correlationId) {
      const fetchOrderDetails = async () => {
        try {
          const response = await api.get(`/orders/get-by-correlation/${correlationId}`);
          setOrderDetails(response.data);
        } catch (error) {
          console.error("Failed to fetch order details:", error);
        }
      };
      fetchOrderDetails();
    }
  }, [open, correlationId]);

  useEffect(() => {
    if (open) {
      const fetchUserProfile = async () => {
        try {
          const response = await api.get("/users/me");
          const userData = response.data;
          setCustomerInfo({
            name: userData.fullName || "",
            phone: userData.phoneNumber || "",
            address: userData.address || "",
          });
          setPaypalEmail(userData.email || "");
        } catch (error) {
          console.error("Lỗi lấy thông tin user:", error);
          setSnackbarMessage("Không thể tải thông tin giao hàng từ hồ sơ!");
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
        }
      };
      fetchUserProfile();
    }
  }, [open]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleCardInputChange = (e) => {
    const { name, value } = e.target;
    setCardInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaypalEmailChange = (e) => {
    setPaypalEmail(e.target.value);
  };

  const handlePaymentChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  const handleOrderSubmit = async () => {
    setLoading(true);
    try {
      const paymentData = {
        correlationId,
        paymentMethod,
        customerInfo,
        ...(paymentMethod === "CARD" && { cardInfo }),
        ...(paymentMethod === "PAYPAL" && { paypalEmail }),
      };

      await api.post("/orders/process-payment", paymentData);

      setSnackbarMessage("Đặt hàng thành công! Đơn hàng đang được xử lý.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (error) {
      console.error("Lỗi khi đặt hàng:", error);
      setSnackbarMessage(error.response?.data?.message || "Đặt hàng thất bại! Vui lòng thử lại.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const getStatusText = (status) => {
    switch (status) {
      case "PENDING_PAYMENT":
        return "Đang chờ thanh toán";
      case "PAID":
        return "Đã thanh toán";
      case "COMPLETED":
        return "Hoàn thành";
      case "FAILED":
        return "Thất bại";
      default:
        return status;
    }
  };

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        closeAfterTransition
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1300,
        }}
      >
        <Fade in={open} timeout={500}>
          <ModalBox>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h5" sx={{ color: "#993300" }}>
                Xác Nhận Đơn Hàng
              </Typography>
              {orderDetails?.status && (
                <Chip
                  label={orderDetails.status === "PENDING_PAYMENT" ? "Đang chờ thanh toán" : getStatusText(orderDetails.status)}
                  color={
                    orderDetails.status === "PENDING_PAYMENT" ? "warning" :
                      orderDetails.status === "COMPLETED" ? "success" :
                        orderDetails.status === "FAILED" ? "error" : "info"
                  }
                  variant="outlined"
                  sx={{
                    fontWeight: 600,
                    borderWidth: 2,
                    "& .MuiChip-label": {
                      fontSize: "0.875rem"
                    }
                  }}
                />
              )}
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* Customer Information */}
            <Fade in={open} timeout={800}>
              <Box>
                <SectionTitle variant="h6">Thông Tin Giao Hàng</SectionTitle>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Họ và Tên"
                      name="name"
                      value={customerInfo.name}
                      onChange={handleInputChange}
                      variant="outlined"
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Số Điện Thoại"
                      name="phone"
                      value={customerInfo.phone}
                      onChange={handleInputChange}
                      variant="outlined"
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Địa Chỉ Giao Hàng"
                      name="address"
                      value={customerInfo.address}
                      onChange={handleInputChange}
                      variant="outlined"
                      multiline
                      rows={2}
                      required
                    />
                  </Grid>
                </Grid>
              </Box>
            </Fade>

            {/* Order Summary */}
            <Fade in={open} timeout={1000}>
              <Box mt={4}>
                <SectionTitle variant="h6">Chi Tiết Đơn Hàng</SectionTitle>
                {(orderDetails?.items || cartItems)?.map((item) => (
                  <Box
                    key={item.productId}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={2}
                    sx={{ borderBottom: "1px solid #eee", pb: 1 }}
                  >
                    <Box display="flex" alignItems="center">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        width="50"
                        height="50"
                        style={{ borderRadius: "8px", objectFit: "cover", marginRight: 12 }}
                      />
                      <Box>
                        <Typography>{item.name}</Typography>
                        <Typography variant="body2" color="textSecondary">
                          Số lượng: {item.quantity} x {item.price?.toLocaleString("vi-VN")} VND
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Trạng thái: {item.status === "CONFIRMED" ? "Đã xác nhận" : "Chờ xử lý"}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography>
                      {(item.price * item.quantity)?.toLocaleString("vi-VN")} VND
                    </Typography>
                  </Box>
                ))}
                <Box display="flex" justifyContent="space-between" mt={2}>
                  <Typography variant="h6">Tổng Cộng:</Typography>
                  <Typography variant="h6" sx={{ color: "#993300" }}>
                    {(orderDetails?.totalPrice || totalPrice)?.toLocaleString("vi-VN")} VND
                  </Typography>
                </Box>
              </Box>
            </Fade>

            {/* Payment Method */}
            <Fade in={open} timeout={1200}>
              <Box mt={4}>
                <SectionTitle variant="h6">Phương Thức Thanh Toán</SectionTitle>
                <FormControl component="fieldset" fullWidth>
                  <RadioGroup
                    value={paymentMethod}
                    onChange={handlePaymentChange}
                    name="payment-method"
                  >
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Paper
                          elevation={paymentMethod === "COD" ? 3 : 1}
                          sx={{
                            p: 2,
                            borderRadius: "12px",
                            border: paymentMethod === "COD" ? "2px solid #993300" : "1px solid #ddd",
                            cursor: "pointer",
                          }}
                          onClick={() => setPaymentMethod("COD")}
                        >
                          <FormControlLabel
                            value="COD"
                            control={<Radio color="primary" />}
                            label={
                              <Box display="flex" alignItems="center">
                                <LocalShipping sx={{ mr: 1, color: "#993300" }} />
                                <Typography>Thanh toán khi nhận hàng (COD)</Typography>
                              </Box>
                            }
                          />
                        </Paper>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Paper
                          elevation={paymentMethod === "CARD" ? 3 : 1}
                          sx={{
                            p: 2,
                            borderRadius: "12px",
                            border: paymentMethod === "CARD" ? "2px solid #993300" : "1px solid #ddd",
                            cursor: "pointer",
                          }}
                          onClick={() => setPaymentMethod("CARD")}
                        >
                          <FormControlLabel
                            value="CARD"
                            control={<Radio color="primary" />}
                            label={
                              <Box display="flex" alignItems="center">
                                <CreditCard sx={{ mr: 1, color: "#993300" }} />
                                <Typography>Thẻ tín dụng/Thẻ ghi nợ</Typography>
                              </Box>
                            }
                          />
                        </Paper>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Paper
                          elevation={paymentMethod === "STRIPE" ? 3 : 1}
                          sx={{
                            p: 2,
                            borderRadius: "12px",
                            border: paymentMethod === "STRIPE" ? "2px solid #993300" : "1px solid #ddd",
                            cursor: "pointer",
                          }}
                          onClick={() => setPaymentMethod("STRIPE")}
                        >
                          <FormControlLabel
                            value="STRIPE"
                            control={<Radio color="primary" />}
                            label={
                              <Box display="flex" alignItems="center">
                                <CreditCard sx={{ mr: 1, color: "#993300" }} />
                                <Typography>Stripe</Typography>
                              </Box>
                            }
                          />
                        </Paper>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Paper
                          elevation={paymentMethod === "PAYPAL" ? 3 : 1}
                          sx={{
                            p: 2,
                            borderRadius: "12px",
                            border: paymentMethod === "PAYPAL" ? "2px solid #993300" : "1px solid #ddd",
                            cursor: "pointer",
                          }}
                          onClick={() => setPaymentMethod("PAYPAL")}
                        >
                          <FormControlLabel
                            value="PAYPAL"
                            control={<Radio color="primary" />}
                            label={
                              <Box display="flex" alignItems="center">
                                <AccountBalanceWallet sx={{ mr: 1, color: "#993300" }} />
                                <Typography>PayPal</Typography>
                              </Box>
                            }
                          />
                        </Paper>
                      </Grid>
                    </Grid>
                  </RadioGroup>

                  {paymentMethod === "CARD" && (
                    <Zoom in={paymentMethod === "CARD"} timeout={400}>
                      <Box mt={3} p={2} border="1px solid #ddd" borderRadius="12px">
                        <Typography variant="subtitle1" mb={2}>
                          Thông Tin Thẻ
                        </Typography>
                        <TextField
                          fullWidth
                          label="Số Thẻ"
                          name="cardNumber"
                          value={cardInfo.cardNumber}
                          onChange={handleCardInputChange}
                          variant="outlined"
                          margin="normal"
                          required
                        />
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <TextField
                              fullWidth
                              label="Ngày Hết Hạn (MM/YY)"
                              name="expiryDate"
                              value={cardInfo.expiryDate}
                              onChange={handleCardInputChange}
                              variant="outlined"
                              margin="normal"
                              required
                            />
                          </Grid>
                          <Grid item xs={6}>
                            <TextField
                              fullWidth
                              label="Mã CVV"
                              name="cvv"
                              value={cardInfo.cvv}
                              onChange={handleCardInputChange}
                              variant="outlined"
                              margin="normal"
                              required
                            />
                          </Grid>
                        </Grid>
                      </Box>
                    </Zoom>
                  )}

                  {paymentMethod === "STRIPE" && (
                    <Zoom in={paymentMethod === "STRIPE"} timeout={400}>
                      <Box mt={3} p={2} border="1px solid #ddd" borderRadius="12px">
                        <Typography variant="subtitle1" mb={2}>
                          Thanh toán bằng Stripe
                        </Typography>
                        <Typography color="textSecondary">
                          Bạn sẽ được chuyển hướng đến trang thanh toán Stripe sau khi nhấn Đặt hàng
                        </Typography>
                      </Box>
                    </Zoom>
                  )}

                  {paymentMethod === "PAYPAL" && (
                    <Zoom in={paymentMethod === "PAYPAL"} timeout={400}>
                      <Box mt={3} p={2} border="1px solid #ddd" borderRadius="12px">
                        <Typography variant="subtitle1" mb={2}>
                          Thông Tin PayPal
                        </Typography>
                        <TextField
                          fullWidth
                          label="Email PayPal"
                          value={paypalEmail}
                          onChange={handlePaypalEmailChange}
                          variant="outlined"
                          margin="normal"
                          required
                        />
                      </Box>
                    </Zoom>
                  )}
                </FormControl>
              </Box>
            </Fade>

            {/* Buttons Section */}
            <Zoom in={open} timeout={1400}>
              <Box mt={4} display="flex" justifyContent="center" gap={2}>
                <Button
                  variant="outlined"
                  onClick={handleClose}
                  sx={{
                    color: "#993300",
                    borderColor: "#993300",
                    "&:hover": { borderColor: "#cc4400" },
                    px: 4,
                    py: 1.5,
                  }}
                >
                  Quay lại
                </Button>
                <Button
                  variant="contained"
                  onClick={handleOrderSubmit}
                  disabled={!paymentMethod || loading}
                  sx={{
                    backgroundColor: "#993300",
                    "&:hover": { backgroundColor: "#cc4400" },
                    px: 4,
                    py: 1.5,
                  }}
                >
                  {loading ? "Đang xử lý..." : "Đặt Hàng"}
                </Button>
              </Box>
            </Zoom>
          </ModalBox>
        </Fade>
      </Modal>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Order;