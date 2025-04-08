import React, { useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Box,
  Divider,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Radio,
  RadioGroup,
  FormControlLabel,
  Modal,
  Fade,
  Backdrop,
  LinearProgress,
  Tooltip,
} from "@mui/material";
import {
  ShoppingCart,
  LocalShipping,
  Payment as PaymentIcon,
  CheckCircle,
  CreditCard,
  AccountBalanceWallet,
  LocalAtm,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useNavigate } from "react-router-dom";

const Payment = () => {
  const navigate = useNavigate();

  // Dữ liệu cứng cho giỏ hàng
  const cartItems = [
    {
      id: 1,
      name: "Đàn Guitar Yamaha C40",
      price: 2500000,
      quantity: 1,
      image: "https://via.placeholder.com/150",
    },
    {
      id: 2,
      name: "Đàn Piano Casio PX-160",
      price: 12000000,
      quantity: 2,
      image: "https://via.placeholder.com/150",
    },
  ];

  const [activeStep, setActiveStep] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("creditCard");
  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const shippingFee = subtotal > 5000000 ? 0 : 50000;
  const totalPrice = subtotal + shippingFee;

  const steps = ["Thông tin giao hàng", "Phương thức thanh toán", "Xác nhận"];

  const stepVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    if (activeStep < steps.length - 1) setActiveStep(activeStep + 1);
    else setOpenModal(true); 
  };

  const handleBack = () => {
    if (activeStep > 0) setActiveStep(activeStep - 1);
  };

  const handleComplete = () => {
    setOpenModal(false);
    alert("Thanh toán thành công! Cảm ơn bạn đã mua sắm.");
    navigate("/");
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <motion.div variants={stepVariants} initial="hidden" animate="visible">
            <Typography variant="h6" gutterBottom style={{ color: "#993300" }}>
              Thông Tin Giao Hàng
            </Typography>
            <TextField
              label="Họ và tên"
              name="name"
              value={formData.name}
              onChange={handleFormChange}
              fullWidth
              margin="normal"
              variant="outlined"
              required
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
            />
            <TextField
              label="Địa chỉ"
              name="address"
              value={formData.address}
              onChange={handleFormChange}
              fullWidth
              margin="normal"
              variant="outlined"
              required
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
            />
            <TextField
              label="Số điện thoại"
              name="phone"
              value={formData.phone}
              onChange={handleFormChange}
              fullWidth
              margin="normal"
              variant="outlined"
              required
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
            />
          </motion.div>
        );
      case 1:
        return (
          <motion.div variants={stepVariants} initial="hidden" animate="visible">
            <Typography variant="h6" gutterBottom style={{ color: "#993300" }}>
              Chọn Phương Thức Thanh Toán
            </Typography>
            <RadioGroup value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
              <FormControlLabel
                value="creditCard"
                control={<Radio color="primary" />}
                label={
                  <Box display="flex" alignItems="center">
                    <CreditCard sx={{ mr: 1, color: "#993300" }} />
                    <Typography>Thẻ tín dụng / Thẻ ghi nợ</Typography>
                  </Box>
                }
              />
              {paymentMethod === "creditCard" && (
                <Box ml={4} mt={2}>
                  <TextField
                    label="Số thẻ"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleFormChange}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
                  />
                  <Box display="flex" gap={2}>
                    <TextField
                      label="Ngày hết hạn (MM/YY)"
                      name="expiry"
                      value={formData.expiry}
                      onChange={handleFormChange}
                      fullWidth
                      margin="normal"
                      variant="outlined"
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
                    />
                    <TextField
                      label="CVV"
                      name="cvv"
                      value={formData.cvv}
                      onChange={handleFormChange}
                      fullWidth
                      margin="normal"
                      variant="outlined"
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
                    />
                  </Box>
                </Box>
              )}
              <FormControlLabel
                value="cash"
                control={<Radio color="primary" />}
                label={
                  <Box display="flex" alignItems="center">
                    <LocalAtm sx={{ mr: 1, color: "#993300" }} />
                    <Typography>Thanh toán khi nhận hàng (COD)</Typography>
                  </Box>
                }
              />
              <FormControlLabel
                value="wallet"
                control={<Radio color="primary" />}
                label={
                  <Box display="flex" alignItems="center">
                    <AccountBalanceWallet sx={{ mr: 1, color: "#993300" }} />
                    <Typography>Ví điện tử (Momo, ZaloPay)</Typography>
                  </Box>
                }
              />
            </RadioGroup>
          </motion.div>
        );
      case 2:
        return (
          <motion.div variants={stepVariants} initial="hidden" animate="visible">
            <Typography variant="h6" gutterBottom style={{ color: "#993300" }}>
              Xác Nhận Đơn Hàng
            </Typography>
            <Box>
              <Typography variant="subtitle1">Thông tin giao hàng:</Typography>
              <Typography variant="body2">Họ tên: {formData.name}</Typography>
              <Typography variant="body2">Địa chỉ: {formData.address}</Typography>
              <Typography variant="body2">Số điện thoại: {formData.phone}</Typography>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1">Phương thức thanh toán:</Typography>
            <Typography variant="body2">
              {paymentMethod === "creditCard"
                ? "Thẻ tín dụng / Thẻ ghi nợ"
                : paymentMethod === "cash"
                ? "Thanh toán khi nhận hàng (COD)"
                : "Ví điện tử"}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1">Sản phẩm:</Typography>
            {cartItems.map((item) => (
              <Box key={item.id} display="flex" justifyContent="space-between" my={1}>
                <Typography variant="body2">
                  {item.name} (x{item.quantity})
                </Typography>
                <Typography variant="body2" style={{ color: "#993300" }}>
                  {(item.price * item.quantity).toLocaleString("vi-VN")} VND
                </Typography>
              </Box>
            ))}
          </motion.div>
        );
      default:
        return "Unknown step";
    }
  };

  return (
    <div
      style={{
        background: "linear-gradient(to bottom, #f7f0e9, #e0e0e0)",
        minHeight: "100vh",
        overflowX: "hidden",
      }}
    >
      <Header />
      <Container maxWidth="lg" style={{ marginTop: 60, marginBottom: 60 }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
        >
          <Typography
            variant="h3"
            align="center"
            gutterBottom
            style={{
              color: "#993300",
              fontWeight: "bold",
              textShadow: "2px 2px 4px rgba(0,0,0,0.2)",
            }}
          >
            Thanh Toán Đơn Hàng
          </Typography>
          <Typography
            variant="subtitle1"
            align="center"
            style={{ color: "#666", marginBottom: 40 }}
          >
            Hoàn tất đơn hàng của bạn trong vài bước đơn giản
          </Typography>
        </motion.div>

        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Paper
              elevation={5}
              style={{
                padding: "30px",
                borderRadius: "15px",
                background: "linear-gradient(to bottom, #fff, #f9f9f9)",
              }}
            >
              <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
                {steps.map((label, index) => (
                  <Step key={label}>
                    <StepLabel
                      StepIconComponent={() => (
                        <motion.div
                          whileHover={{ scale: 1.2 }}
                          animate={{
                            rotate: activeStep === index ? 360 : 0,
                            transition: { duration: 0.5 },
                          }}
                        >
                          {index === 0 ? (
                            <ShoppingCart sx={{ color: activeStep >= index ? "#993300" : "#999" }} />
                          ) : index === 1 ? (
                            <PaymentIcon sx={{ color: activeStep >= index ? "#993300" : "#999" }} />
                          ) : (
                            <CheckCircle sx={{ color: activeStep >= index ? "#993300" : "#999" }} />
                          )}
                        </motion.div>
                      )}
                    >
                      <Typography
                        variant="body1"
                        style={{ color: activeStep >= index ? "#993300" : "#999" }}
                      >
                        {label}
                      </Typography>
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>
              <Box>{getStepContent(activeStep)}</Box>
              <Box display="flex" justifyContent="space-between" mt={4}>
                <Button
                  variant="outlined"
                  style={{ color: "#993300", borderColor: "#993300", borderRadius: "25px" }}
                  onClick={handleBack}
                  disabled={activeStep === 0}
                  component={motion.button}
                  whileHover={{ scale: 1.05 }}
                >
                  Quay lại
                </Button>
                <Button
                  variant="contained"
                  style={{
                    backgroundColor: "#993300",
                    color: "#fff",
                    borderRadius: "25px",
                    padding: "10px 30px",
                  }}
                  onClick={handleNext}
                  component={motion.button}
                  whileHover={{ scale: 1.05 }}
                >
                  {activeStep === steps.length - 1 ? "Hoàn tất" : "Tiếp tục"}
                </Button>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper
              elevation={5}
              style={{
                padding: "20px",
                borderRadius: "15px",
                background: "linear-gradient(to bottom, #fff, #f9f9f9)",
              }}
            >
              <Typography
                variant="h5"
                gutterBottom
                style={{ color: "#993300", fontWeight: "bold" }}
              >
                Thông Tin Đơn Hàng
              </Typography>
              <Divider style={{ margin: "10px 0" }} />
              {cartItems.map((item) => (
                <Box key={item.id} display="flex" justifyContent="space-between" my={2}>
                  <Box display="flex" alignItems="center">
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{ width: 50, height: 50, borderRadius: "8px", marginRight: 10 }}
                    />
                    <Typography variant="body2">
                      {item.name} (x{item.quantity})
                    </Typography>
                  </Box>
                  <Typography variant="body2" style={{ color: "#993300" }}>
                    {(item.price * item.quantity).toLocaleString("vi-VN")} VND
                  </Typography>
                </Box>
              ))}
              <Divider style={{ margin: "10px 0" }} />
              <Box display="flex" justifyContent="space-between" mb={2}>
                <Typography variant="body1">Tạm tính:</Typography>
                <Typography variant="body1" style={{ color: "#993300" }}>
                  {subtotal.toLocaleString("vi-VN")} VND
                </Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" mb={2}>
                <Typography variant="body1">Phí vận chuyển:</Typography>
                <Typography variant="body1" style={{ color: "#993300" }}>
                  {shippingFee.toLocaleString("vi-VN")} VND
                </Typography>
              </Box>
              <Divider style={{ margin: "10px 0" }} />
              <Box display="flex" justifyContent="space-between" mb={3}>
                <Typography variant="h6" fontWeight="bold">
                  Tổng cộng:
                </Typography>
                <Typography
                  variant="h6"
                  style={{ color: "#993300", fontWeight: "bold" }}
                >
                  {totalPrice.toLocaleString("vi-VN")} VND
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={100} 
                style={{ marginBottom: 10 }}
                sx={{ "& .MuiLinearProgress-bar": { backgroundColor: "#993300" } }}
              />
              <Typography variant="caption" color="textSecondary">
                Đơn hàng của bạn đã sẵn sàng để thanh toán!
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        <Modal
          open={openModal}
          onClose={() => setOpenModal(false)}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{ timeout: 500 }}
        >
          <Fade in={openModal}>
            <Box
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 450,
                backgroundColor: "#fff",
                borderRadius: "15px",
                boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
                padding: "30px",
              }}
            >
              <Typography variant="h5" gutterBottom style={{ color: "#993300" }}>
                Xác Nhận Thanh Toán
              </Typography>
              <Typography variant="body1" mb={3}>
                Vui lòng kiểm tra kỹ thông tin trước khi hoàn tất thanh toán:
              </Typography>
              <Box mb={2}>
                <Typography variant="subtitle2">Thông tin giao hàng:</Typography>
                <Typography variant="body2">Họ tên: {formData.name}</Typography>
                <Typography variant="body2">Địa chỉ: {formData.address}</Typography>
                <Typography variant="body2">Số điện thoại: {formData.phone}</Typography>
              </Box>
              <Box mb={2}>
                <Typography variant="subtitle2">Tổng tiền:</Typography>
                <Typography variant="body1" style={{ color: "#993300", fontWeight: "bold" }}>
                  {totalPrice.toLocaleString("vi-VN")} VND
                </Typography>
              </Box>
              <Box display="flex" justifyContent="flex-end" gap={2}>
                <Button
                  variant="outlined"
                  style={{ color: "#993300", borderColor: "#993300" }}
                  onClick={() => setOpenModal(false)}
                  component={motion.button}
                  whileHover={{ scale: 1.05 }}
                >
                  Hủy
                </Button>
                <Button
                  variant="contained"
                  style={{ backgroundColor: "#993300", color: "#fff" }}
                  onClick={handleComplete}
                  component={motion.button}
                  whileHover={{ scale: 1.05 }}
                >
                  Xác nhận
                </Button>
              </Box>
            </Box>
          </Fade>
        </Modal>
      </Container>
      <Footer />
    </div>
  );
};

export default Payment;