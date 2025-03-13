import React, { useState } from "react";
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
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Modal,
  Fade,
  Backdrop,
  LinearProgress,
  Tooltip,
} from "@mui/material";
import {
  Add,
  Remove,
  Delete,
  ShoppingCart,
  LocalShipping,
  Payment,
  CheckCircle,
} from "@mui/icons-material";
import { motion } from "framer-motion"; // Thêm animation
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const navigate = useNavigate();

  // Dữ liệu cứng cho giỏ hàng
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Đàn Guitar Yamaha C40",
      price: 2500000,
      originalPrice: 3000000,
      quantity: 1,
      image: "https://via.placeholder.com/150",
      category: "Guitar",
      stock: 10,
    },
    {
      id: 2,
      name: "Đàn Piano Casio PX-160",
      price: 12000000,
      originalPrice: 15000000,
      quantity: 2,
      image: "https://via.placeholder.com/150",
      category: "Piano",
      stock: 5,
    },
    {
      id: 3,
      name: "Đàn Ukulele Fender",
      price: 1500000,
      originalPrice: 1800000,
      quantity: 1,
      image: "https://via.placeholder.com/150",
      category: "Ukulele",
      stock: 15,
    },
  ]);

  const [openModal, setOpenModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // Tăng số lượng sản phẩm
  const increaseQuantity = (id) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === id && item.quantity < item.stock
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  // Giảm số lượng sản phẩm
  const decreaseQuantity = (id) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  // Mở modal xác nhận xóa
  const handleOpenModal = (id) => {
    setItemToDelete(id);
    setOpenModal(true);
  };

  // Đóng modal
  const handleCloseModal = () => {
    setOpenModal(false);
    setItemToDelete(null);
  };

  // Xóa sản phẩm
  const removeItem = () => {
    setCartItems(cartItems.filter((item) => item.id !== itemToDelete));
    handleCloseModal();
  };

  // Tính tổng tiền
  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const shippingFee = subtotal > 5000000 ? 0 : 50000; // Miễn phí vận chuyển nếu trên 5 triệu
  const totalPrice = subtotal + shippingFee;

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
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
        {/* Tiêu đề */}
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
            Giỏ Hàng Của Bạn
          </Typography>
          <Typography
            variant="subtitle1"
            align="center"
            style={{ color: "#666", marginBottom: 40 }}
          >
            Quản lý sản phẩm trong giỏ hàng của bạn một cách dễ dàng
          </Typography>
        </motion.div>

        {cartItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Box textAlign="center" py={10}>
              <ShoppingCart style={{ fontSize: 80, color: "#993300" }} />
              <Typography variant="h5" color="textSecondary" mt={2}>
                Giỏ hàng của bạn đang trống!
              </Typography>
              <Button
                variant="contained"
                style={{
                  backgroundColor: "#993300",
                  color: "#fff",
                  marginTop: 20,
                  padding: "10px 30px",
                  borderRadius: "25px",
                }}
                onClick={() => navigate("/")}
                whileHover={{ scale: 1.05 }}
                component={motion.button}
              >
                Tiếp tục mua sắm
              </Button>
            </Box>
          </motion.div>
        ) : (
          <Grid container spacing={4}>
            {/* Danh sách sản phẩm */}
            <Grid item xs={12} md={8}>
              <TableContainer
                component={Paper}
                elevation={5}
                style={{
                  borderRadius: "15px",
                  background: "linear-gradient(to bottom, #fff, #f9f9f9)",
                }}
              >
                <Table>
                  <TableHead>
                    <TableRow
                      style={{ backgroundColor: "#993300", color: "#fff" }}
                    >
                      <TableCell style={{ color: "#fff", fontWeight: "bold" }}>
                        Sản Phẩm
                      </TableCell>
                      <TableCell style={{ color: "#fff", fontWeight: "bold" }}>
                        Đơn Giá
                      </TableCell>
                      <TableCell style={{ color: "#fff", fontWeight: "bold" }}>
                        Số Lượng
                      </TableCell>
                      <TableCell style={{ color: "#fff", fontWeight: "bold" }}>
                        Thành Tiền
                      </TableCell>
                      <TableCell style={{ color: "#fff", fontWeight: "bold" }}>
                        Hành Động
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {cartItems.map((item) => (
                      <motion.tr
                        key={item.id}
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        whileHover={{ backgroundColor: "#f5f5f5" }}
                        style={{ transition: "background-color 0.3s ease" }}
                      >
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <CardMedia
                              component="img"
                              image={item.image}
                              alt={item.name}
                              style={{
                                width: 100,
                                height: 100,
                                borderRadius: "10px",
                                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                marginRight: 15,
                              }}
                            />
                            <Box>
                              <Typography variant="body1" fontWeight="bold">
                                {item.name}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="textSecondary"
                              >
                                Danh mục: {item.category}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography
                            variant="body1"
                            style={{ color: "#993300", fontWeight: "bold" }}
                          >
                            {item.price.toLocaleString("vi-VN")} VND
                          </Typography>
                          <Typography
                            variant="body2"
                            style={{ textDecoration: "line-through", color: "#999" }}
                          >
                            {item.originalPrice.toLocaleString("vi-VN")} VND
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={1}>
                            <IconButton
                              onClick={() => decreaseQuantity(item.id)}
                              style={{ color: "#993300" }}
                              disabled={item.quantity === 1}
                              component={motion.button}
                              whileHover={{ scale: 1.1 }}
                            >
                              <Remove />
                            </IconButton>
                            <Typography variant="body1" mx={2}>
                              {item.quantity}
                            </Typography>
                            <IconButton
                              onClick={() => increaseQuantity(item.id)}
                              style={{ color: "#993300" }}
                              disabled={item.quantity >= item.stock}
                              component={motion.button}
                              whileHover={{ scale: 1.1 }}
                            >
                              <Add />
                            </IconButton>
                          </Box>
                          <Typography variant="caption" color="textSecondary">
                            Còn {item.stock - item.quantity} sản phẩm
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography
                            variant="body1"
                            style={{ fontWeight: "bold", color: "#993300" }}
                          >
                            {(item.price * item.quantity).toLocaleString(
                              "vi-VN"
                            )}{" "}
                            VND
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Tooltip title="Xóa sản phẩm">
                            <IconButton
                              onClick={() => handleOpenModal(item.id)}
                              style={{ color: "#ff3333" }}
                              component={motion.button}
                              whileHover={{ scale: 1.2, rotate: 10 }}
                            >
                              <Delete />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>

            {/* Thông tin thanh toán */}
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
                  value={(subtotal / 5000000) * 100 > 100 ? 100 : (subtotal / 5000000) * 100}
                  style={{ marginBottom: 10 }}
                />
                <Typography variant="caption" color="textSecondary">
                  {subtotal >= 5000000
                    ? "Miễn phí vận chuyển!"
                    : `Mua thêm ${(5000000 - subtotal).toLocaleString(
                        "vi-VN"
                      )} VND để được miễn phí vận chuyển`}
                </Typography>
                <Button
                  variant="contained"
                  fullWidth
                  style={{
                    backgroundColor: "#993300",
                    color: "#fff",
                    padding: "12px",
                    borderRadius: "25px",
                    marginTop: 20,
                  }}
                  startIcon={<Payment />}
                  component={motion.button}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => alert("Chuyển đến trang thanh toán")}
                >
                  Thanh Toán Ngay
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  style={{
                    color: "#993300",
                    borderColor: "#993300",
                    padding: "12px",
                    borderRadius: "25px",
                    marginTop: 10,
                  }}
                  startIcon={<ShoppingCart />}
                  component={motion.button}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => navigate("/")}
                >
                  Tiếp Tục Mua Sắm
                </Button>
              </Paper>

              {/* Quy trình thanh toán */}
              <Paper
                elevation={5}
                style={{
                  marginTop: 20,
                  padding: "20px",
                  borderRadius: "15px",
                  background: "linear-gradient(to bottom, #fff, #f9f9f9)",
                }}
              >
                <Typography
                  variant="h6"
                  style={{ color: "#993300", fontWeight: "bold" }}
                >
                  Quy Trình Thanh Toán
                </Typography>
                <Box display="flex" justifyContent="space-between" mt={2}>
                  <Box textAlign="center">
                    <ShoppingCart style={{ color: "#993300", fontSize: 30 }} />
                    <Typography variant="caption">Giỏ Hàng</Typography>
                  </Box>
                  <Box textAlign="center">
                    <LocalShipping style={{ color: "#999", fontSize: 30 }} />
                    <Typography variant="caption">Vận Chuyển</Typography>
                  </Box>
                  <Box textAlign="center">
                    <Payment style={{ color: "#999", fontSize: 30 }} />
                    <Typography variant="caption">Thanh Toán</Typography>
                  </Box>
                  <Box textAlign="center">
                    <CheckCircle style={{ color: "#999", fontSize: 30 }} />
                    <Typography variant="caption">Hoàn Tất</Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        )}

        {/* Modal xác nhận xóa */}
        <Modal
          open={openModal}
          onClose={handleCloseModal}
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
                width: 400,
                backgroundColor: "#fff",
                borderRadius: "15px",
                boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
                padding: "20px",
              }}
            >
              <Typography variant="h6" gutterBottom style={{ color: "#993300" }}>
                Xác Nhận Xóa
              </Typography>
              <Typography variant="body1" mb={3}>
                Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng không?
              </Typography>
              <Box display="flex" justifyContent="flex-end" gap={2}>
                <Button
                  variant="outlined"
                  style={{ color: "#993300", borderColor: "#993300" }}
                  onClick={handleCloseModal}
                >
                  Hủy
                </Button>
                <Button
                  variant="contained"
                  style={{ backgroundColor: "#ff3333", color: "#fff" }}
                  onClick={removeItem}
                >
                  Xóa
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

export default Cart;