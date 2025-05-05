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
  IconButton,
  Divider,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../utils/api";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PaymentIcon from "@mui/icons-material/Payment";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useCart } from "../../context/CartContext";

const OrderPage = () => {
  const { correlationId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmEnabled, setConfirmEnabled] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [fetchingOrder, setFetchingOrder] = useState(false);
  const { removeFromCart, fetchCart } = useCart();
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

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

  // Fetch order details
  const fetchOrderDetails = async () => {
    try {
      const response = await api.get(`/orders/get-by-correlation/${correlationId}`);
      console.log("✅ Dữ liệu order trả về:", response.data);
      setOrder(response.data);

      // TỰ ĐỘNG KÍCH HOẠT XÁC NHẬN NẾU ĐÃ THANH TOÁN
      if (response.data.status === "PAYMENT_SUCCESS") {
        setConfirmEnabled(true);
        setPaymentModalOpen(false); // Đóng modal nếu đang mở
      }
      await fetchCart();
    } catch (error) {
      console.error("[fetchOrderDetails] Lỗi:", error);
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  // Fetch user profile when payment modal opens
  const fetchUserProfile = async () => {
    console.log("[fetchUserProfile] Bắt đầu lấy thông tin người dùng");
    try {
      const response = await api.get("/users/me");
      const userData = response.data;
      console.log("[fetchUserProfile] Dữ liệu người dùng nhận được:", userData);
      setUserInfo({
        fullName: userData.fullName || "",
        email: userData.email || "",
        phone: userData.phoneNumber || "",
      });
    } catch (error) {
      console.error("[fetchUserProfile] Lỗi:", error);
      setSnackbarMessage("Không thể tải thông tin cá nhân từ hồ sơ!");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };


  // useEffect(() => {
  //   fetchOrderDetails();
  //   const interval = setInterval(() => {
  //     fetchOrderDetails();
  //   }, 100);
  //   return () => clearInterval(interval);
  // }, [correlationId]);

  useEffect(() => {
    let interval;
    let lastStatus = null;
    let lastItemStatuses = "";
  
    const pollOrder = async () => {
      try {
        const res = await api.get(`/orders/get-by-correlation/${correlationId}`);
        const newOrder = res.data;
        const itemStatuses = newOrder.items.map(i => i.status).join(",");
  
        const isChanged = newOrder.status !== lastStatus || itemStatuses !== lastItemStatuses;
  
        if (isChanged) {
          setOrder(newOrder);
          lastStatus = newOrder.status;
          lastItemStatuses = itemStatuses;
        }
  
        if (newOrder.status === "PAYMENT_SUCCESS") {
          setConfirmEnabled(true);
          setPaymentModalOpen(false);
          await fetchCart();
          clearInterval(interval);
        }
      } catch (error) {
        console.error("Lỗi fetch đơn hàng:", error);
        setSnackbarMessage("Không thể lấy dữ liệu đơn hàng!");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      } finally {
        setLoading(false);
      }
    };
  
    pollOrder();
    interval = setInterval(pollOrder, 2000); // mỗi 2 giây
  
    return () => clearInterval(interval);
  }, [correlationId]);
  
  

  useEffect(() => {
    if (paymentModalOpen) {
      fetchUserProfile();
    }
  }, [paymentModalOpen]);

  const handleUserInfoChange = (e) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };

  const handlePaymentDetailChange = (e) => {
    setPaymentDetails({ ...paymentDetails, [e.target.name]: e.target.value });
  };

  const handleRemoveItem = async (productId) => {
    try {
      const itemToRemove = order.items.find(item => item.productId === productId);
      if (!itemToRemove) {
        throw new Error("Không tìm thấy sản phẩm trong đơn hàng!");
      }

      const orderId = order.orderId;
      const itemId = itemToRemove.id;

      await api.delete(`/orders/${orderId}/items/${itemId}`);
      await removeFromCart(productId);
      await fetchOrderDetails();

      setSnackbarMessage("Sản phẩm đã được xóa khỏi đơn hàng!");
      setSnackbarSeverity("success");
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
      setSnackbarMessage(error.response?.data?.message || "Không thể xóa sản phẩm!");
      setSnackbarSeverity("error");
    }
    setSnackbarOpen(true);
  };

  const handleOpenConfirmDelete = (productId) => {
    const item = order.items.find(item => item.productId === productId);
    if (item) {
      setItemToDelete(item);
      setConfirmDeleteOpen(true);
    }
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      const orderId = order.orderId;
      const itemId = itemToDelete.id;

      await api.delete(`/orders/${orderId}/items/${itemId}`);
      await removeFromCart(itemToDelete.productId);
      await fetchOrderDetails();

      setSnackbarMessage("Sản phẩm đã được xóa khỏi đơn hàng!");
      setSnackbarSeverity("success");
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
      setSnackbarMessage(error.response?.data?.message || "Không thể xóa sản phẩm!");
      setSnackbarSeverity("error");
    } finally {
      setConfirmDeleteOpen(false);
      setItemToDelete(null);
      setSnackbarOpen(true);
    }
  };

  const handleCloseConfirmDelete = () => {
    setConfirmDeleteOpen(false);
    setItemToDelete(null);
  };

  const isFormValid = () => {
    const basicInfoValid = userInfo.fullName && userInfo.email && userInfo.phone;
    if (!paymentMethod) return false;

    if (["COD", "BANK", "STRIPE", "PAYPAL"].includes(paymentMethod)) {
      return basicInfoValid;
    }

    if (["MOMO"].includes(paymentMethod)) {
      const cardDetailsValid = paymentDetails.cardNumber && paymentDetails.expiry && paymentDetails.cvv;
      return basicInfoValid && cardDetailsValid;
    }

    return false;
  };

  const handleOrder = async () => {
    if (!isFormValid()) {
      setSnackbarMessage("Vui lòng điền đầy đủ thông tin!");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    try {
      setFetchingOrder(true);

      const response = await api.post("/payment/initiate", { orderId: order.orderId, paymentMethod });

      if (paymentMethod === "STRIPE") {
        // Tính toán vị trí để cửa sổ popup hiển thị ở giữa màn hình
        const width = 600; // Chiều rộng cửa sổ popup
        const height = 700; // Chiều cao cửa sổ popup
        const left = (window.screen.width - width) / 2; // Vị trí left để căn giữa
        const top = (window.screen.height - height) / 2; // Vị trí top để căn giữa

        // Mở cửa sổ popup với kích thước và vị trí đã tính toán
        window.open(
          response.data,
          "StripePaymentWindow",
          `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=yes`
        );
      } else {
        setPaymentModalOpen(false);
        await fetchOrderDetails();
        await fetchCart();
        setSnackbarMessage("Đặt hàng thành công! Thông tin chi tiết đã được gửi vào email của bạn!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
      }
    } catch (error) {
      setSnackbarMessage(error.response?.data?.message || "Thanh toán thất bại!");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setFetchingOrder(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "PENDING_INVENTORY_VALIDATION":
        return "ĐANG KIỂM TRA TỒN KHO...";
      case "PENDING_PAYMENT":
        return "ĐANG CHỜ THANH TOÁN...";
      case "PAYMENT_SUCCESS":
        return "THANH TOÁN THÀNH CÔNG!";
      default:
        return "Không xác định";
    }
  };

  const getItemStatusLabel = (status) => {
    switch (status) {
      case "PENDING":
        return "Đang chờ xử lý";
      case "CONFIRMED":
        return "Đã xác nhận";
      case "OUT_OF_STOCK":
        return "Hết hàng";
      default:
        return "Không xác định";
    }
  };

  if (loading) {
    return (
      <div style={{ background: "linear-gradient(to right, #f0f0f0, #e0e0e0)", minHeight: "100vh" }}>
        <Header />
        <Container>
          <Box textAlign="center" sx={{ my: 5 }}>
            <CircularProgress style={{ color: "#993300" }} />
            <Typography variant="h6" sx={{ mt: 2, color: "#993300" }}>
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
      <div style={{ background: "linear-gradient(to right, #f0f0f0, #e0e0e0)", minHeight: "100vh" }}>
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
    <div style={{ background: "linear-gradient(to right, #f0f0f0, #e0e0e0)", minHeight: "100vh" }}>
      <Header />
      <Container sx={{ py: 5 }}>
        <Typography
          variant="h4"
          align="center"
          sx={{ mb: 5, fontWeight: "bold", color: "#993300" }}
        >
          Chi Tiết Đơn Hàng #{order.orderId}
        </Typography>

        {order?.status === "PENDING_INVENTORY_VALIDATION" && (
          <Alert severity="info" sx={{ mb: 3 }}>
            Đơn hàng của bạn đang được xác nhận tồn kho. Vui lòng chờ trong giây lát...
          </Alert>
        )}

        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Paper sx={{ p: 3, borderRadius: 2, boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)" }}>
                <Box display="flex" justifyContent="space-between" sx={{ mb: 3 }}>
                  <Typography variant="h6" fontWeight="bold" style={{ color: "#993300" }}>
                    Thông Tin Đơn Hàng
                  </Typography>
                  <Chip
                    label={getStatusLabel(order.status)}
                    sx={{
                      px: 2,
                      py: 1,
                      borderRadius: 1,
                      backgroundColor:
                        order.status === "PENDING_PAYMENT"
                          ? "#ff9800"
                          : order.status === "PAYMENT_SUCCESS"
                            ? "#007BFF"
                            : "#f44336",
                      color: "#fff",
                      fontWeight: "bold",
                    }}
                  />
                </Box>
                <Divider />
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow
                        sx={{ backgroundColor: "#f5f5f5", "& th": { fontWeight: "bold", color: "#993300" } }}
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
                            <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                              <Chip
                                label={getItemStatusLabel(item.status)}
                                sx={{
                                  backgroundColor:
                                    item.status === "CONFIRMED"
                                      ? "#4caf50"
                                      : item.status === "OUT_OF_STOCK"
                                        ? "#f44336"
                                        : "#ff9800",
                                  color: "#fff",
                                  fontWeight: "bold",
                                }}
                              />
                              {item.status === "OUT_OF_STOCK" && (
                                <IconButton
                                  onClick={() => handleOpenConfirmDelete(item.productId)}
                                  sx={{ color: "red" }}
                                  size="small"
                                >
                                  <Delete />
                                </IconButton>
                              )}
                            </Box>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </motion.div>
          </Grid>

          <Grid item xs={12} md={4}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Paper sx={{ p: 3, borderRadius: 2, boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)" }}>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, color: "#993300" }}>
                  Thanh Toán Đơn Hàng
                </Typography>
                <Divider />
                <Box display="flex" justifyContent="space-between" sx={{ my: 2 }}>
                  <Typography>Tổng tiền:</Typography>
                  <Typography fontWeight="bold" style={{ color: "#993300" }}>
                    {order.totalPrice.toLocaleString("vi-VN")} VND
                  </Typography>
                </Box>
                <motion.div whileHover={{ scale: order.status === "PAYMENT_SUCCESS" ? 1 : 1.02 }} transition={{ duration: 0.3 }}>
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => setPaymentModalOpen(true)}
                    disabled={order?.status === "PAYMENT_SUCCESS" || paymentLoading}
                    sx={{
                      py: 2,
                      fontSize: "0.8rem",
                      borderColor: order?.status === "PAYMENT_SUCCESS"
                        ? "#4CAF50"
                        : "#993300",
                      color: order?.status === "PAYMENT_SUCCESS"
                        ? "#4CAF50"
                        : "#993300",
                      "&:hover": {
                        borderColor: order?.status === "PAYMENT_SUCCESS"
                          ? "#45a049"
                          : "#993300",
                        backgroundColor: order?.status === "PAYMENT_SUCCESS"
                          ? "rgba(76, 175, 80, 0.05)"
                          : "rgba(153, 51, 0, 0.1)",
                      },
                      "&.Mui-disabled": {
                        borderColor: order?.status === "PAYMENT_SUCCESS"
                          ? "#4CAF50"
                          : "#bdbdbd",
                        color: order?.status === "PAYMENT_SUCCESS"
                          ? "#4CAF50 !important"
                          : "#bdbdbd !important",
                        opacity: 0.9
                      },
                      transition: "all 0.3s ease",
                    }}
                    startIcon={
                      order?.status === "PAYMENT_SUCCESS" ? (
                        <CheckCircleIcon sx={{ color: "#4CAF50" }} />
                      ) : (
                        <PaymentIcon />
                      )
                    }
                  >
                    {order?.status === "PAYMENT_SUCCESS"
                      ? "ĐÃ THANH TOÁN THÀNH CÔNG"
                      : "CHỌN PHƯƠNG THỨC THANH TOÁN"}
                  </Button>
                </motion.div>
              </Paper>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
      {(fetchingOrder) && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress sx={{ color: "#fff" }} />
          <Typography variant="h6" sx={{ ml: 2, color: "#fff" }}>
            Đang xử lý đơn hàng...
          </Typography>
        </Box>
      )}
      <Footer />

      {/* Modal Thanh Toán */}
      <Dialog
        open={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        key={order?.status}
      >
        <DialogTitle sx={{ color: "#993300" }}>Chọn Phương Thức Thanh Toán</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2, mb: 3 }}>
            <InputLabel sx={{ color: "#993300" }}>Phương thức thanh toán</InputLabel>
            <Select
              value={paymentMethod}
              label="Phương thức thanh toán"
              onChange={(e) => setPaymentMethod(e.target.value)}
              sx={{ "& .MuiOutlinedInput-notchedOutline": { borderColor: "#993300" } }}
            >
              <MenuItem value="COD">
                <Box display="flex" alignItems="center">
                  <LocalShippingIcon sx={{ mr: 1, color: "#993300" }} />
                  Thanh toán khi nhận hàng
                </Box>
              </MenuItem>
              <MenuItem value="MOMO">
                <Box display="flex" alignItems="center">
                  <PaymentIcon sx={{ mr: 1, color: "#993300" }} />
                  Thanh toán qua Momo
                </Box>
              </MenuItem>
              <MenuItem value="BANK">
                <Box display="flex" alignItems="center">
                  <AccountBalanceIcon sx={{ mr: 1, color: "#993300" }} />
                  Thanh toán qua Ngân hàng
                </Box>
              </MenuItem>
              <MenuItem value="PAYPAL">
                <Box display="flex" alignItems="center">
                  <CreditCardIcon sx={{ mr: 1, color: "#993300" }} />
                  Thanh toán qua Paypal
                </Box>
              </MenuItem>
              <MenuItem value="STRIPE">
                <Box display="flex" alignItems="center">
                  <CreditCardIcon sx={{ mr: 1, color: "#993300" }} />
                  Thanh toán qua Stripe
                </Box>
              </MenuItem>
            </Select>
          </FormControl>

          <Typography variant="h6" sx={{ mb: 2, color: "#993300" }}>
            Thông Tin Người Nhận
          </Typography>
          <TextField
            label="Họ và tên"
            name="fullName"
            value={userInfo.fullName}
            onChange={handleUserInfoChange}
            fullWidth
            sx={{ mb: 2, "& .MuiOutlinedInput-notchedOutline": { borderColor: "#993300" } }}
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            value={userInfo.email}
            onChange={handleUserInfoChange}
            fullWidth
            sx={{ mb: 2, "& .MuiOutlinedInput-notchedOutline": { borderColor: "#993300" } }}
          />
          <TextField
            label="Số điện thoại"
            name="phone"
            value={userInfo.phone}
            onChange={handleUserInfoChange}
            fullWidth
            sx={{ mb: 2, "& .MuiOutlinedInput-notchedOutline": { borderColor: "#993300" } }}
          />

          {["MOMO", "PAYPAL"].includes(paymentMethod) && (
            <>
              <Typography variant="h6" sx={{ mb: 2, color: "#993300" }}>
                Thông Tin Thanh Toán
              </Typography>
              <TextField
                label="Số thẻ"
                name="cardNumber"
                value={paymentDetails.cardNumber}
                onChange={handlePaymentDetailChange}
                fullWidth
                sx={{ mb: 2, "& .MuiOutlinedInput-notchedOutline": { borderColor: "#993300" } }}
              />
              <TextField
                label="Ngày hết hạn (MM/YY)"
                name="expiry"
                value={paymentDetails.expiry}
                onChange={handlePaymentDetailChange}
                fullWidth
                sx={{ mb: 2, "& .MuiOutlinedInput-notchedOutline": { borderColor: "#993300" } }}
              />
              <TextField
                label="CVV"
                name="cvv"
                value={paymentDetails.cvv}
                onChange={handlePaymentDetailChange}
                fullWidth
                sx={{ mb: 2, "& .MuiOutlinedInput-notchedOutline": { borderColor: "#993300" } }}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPaymentModalOpen(false)} sx={{ color: "#993300" }}>
            Hủy
          </Button>
          <Button
            variant="contained"
            onClick={handleOrder}
            disabled={!isFormValid() || paymentLoading}
            sx={{
              backgroundColor: isFormValid() ? "#993300" : "#bdbdbd",
              "&:hover": { backgroundColor: isFormValid() ? "#7a2900" : "#bdbdbd" },
              py: 1.5,
              px: 4,
            }}
            startIcon={<ShoppingCartIcon />}
          >
            {paymentLoading ? "Đang xử lý..." : "Đặt Hàng"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity={snackbarSeverity}
          sx={{
            width: "100%",
            "& .MuiAlert-message": { fontWeight: "bold" },
            backgroundColor: snackbarSeverity === "success" ? "#4CAF50" : "#f44336"
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <Dialog
        open={confirmDeleteOpen}
        onClose={handleCloseConfirmDelete}
      >
        <DialogTitle sx={{ color: "#993300" }}>Xác Nhận Xóa Sản Phẩm</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn xóa sản phẩm{" "}
            <strong>{itemToDelete?.name}</strong> khỏi đơn hàng không?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDelete} sx={{ color: "#993300" }}>
            Không
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            sx={{
              backgroundColor: "#993300",
              "&:hover": { backgroundColor: "#7a2900" },
            }}
          >
            Có
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default OrderPage;