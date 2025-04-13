import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Pagination,
  Modal,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  Chip,
} from "@mui/material";
import { Search, Edit, Visibility } from "@mui/icons-material";
import { motion } from "framer-motion";
import AdminLayout from "./AdminLayout";
import api from "../../utils/api";

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const size = 6;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await api.get("/orders/get-all");
        setOrders(response.data || []);
      } catch (error) {
        setError("Không thể tải danh sách đơn hàng");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleOpenModal = (order) => {
    setEditItem(order);
    setOpenModal(true);
  };

  const handleOpenDetailModal = (order) => {
    if (!order || !order.orderId) {
      setSnackbarMessage("Đơn hàng không hợp lệ!");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }
    setSelectedOrder(order);
    setOpenDetailModal(true);
  };

  const handleSearchByCorrelationId = async () => {
    if (!searchTerm) {
      setSnackbarMessage("Vui lòng nhập Correlation ID!");
      setSnackbarSeverity("warning");
      setSnackbarOpen(true);
      return;
    }
    try {
      setLoading(true);
      const response = await api.get(`/orders/get-by-correlation/${searchTerm}`);
      setSelectedOrder(response.data);
      setOpenDetailModal(true);
      setSearchTerm("");
    } catch (error) {
      setSnackbarMessage("Không tìm thấy đơn hàng với Correlation ID này!");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!editItem.status) {
      setSnackbarMessage("Vui lòng chọn trạng thái!");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    try {
      setSaving(true);
      let apiUrl;
      switch (editItem.status) {
        case "PENDING_INVENTORY_VALIDATION":
        case "PENDING_PAYMENT":
          apiUrl = `/orders/confirm/${editItem.orderId}`;
          break;
        case "SHIPPED":
          apiUrl = `/orders/ship/${editItem.orderId}`;
          break;
        case "DELIVERED":
          apiUrl = `/orders/deliver/${editItem.orderId}`;
          break;
        case "CANCELLED":
          apiUrl = `/orders/cancel/${editItem.orderId}`;
          break;
        default:
          throw new Error("Trạng thái không hợp lệ");
      }

      await api.put(apiUrl);
      setOrders(
        orders.map((o) =>
          o.orderId === editItem.orderId ? { ...o, status: editItem.status } : o
        )
      );
      setSnackbarMessage("Trạng thái đơn hàng đã được cập nhật!");
      setSnackbarSeverity("success");
      setOpenModal(false);
    } catch (error) {
      setSnackbarMessage(
        error.response?.data?.message || "Không thể cập nhật trạng thái!"
      );
      setSnackbarSeverity("error");
    } finally {
      setSaving(false);
      setSnackbarOpen(true);
    }
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "PENDING_INVENTORY_VALIDATION":
        return "Đang kiểm tra tồn kho";
      case "PENDING_PAYMENT":
        return "Đang chờ thanh toán";
      case "PAYMENT_SUCCESS":
        return "Thanh toán thành công";
      case "SHIPPED":
        return "Đã giao";
      case "DELIVERED":
        return "Đã nhận";
      case "CANCELLED":
        return "Đã hủy";
      default:
        return "Không xác định";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING_INVENTORY_VALIDATION":
      case "PENDING_PAYMENT":
        return "#ff9800";
      case "PAYMENT_SUCCESS":
        return "#007BFF";
      case "SHIPPED":
      case "DELIVERED":
        return "#4caf50";
      case "CANCELLED":
        return "#f44336";
      default:
        return "#757575";
    }
  };

  const getItemStatusLabel = (status) => {
    switch (status) {
      case "PENDING":
        return "Đang chờ";
      case "CONFIRMED":
        return "Đã xác nhận";
      case "OUT_OF_STOCK":
        return "Hết hàng";
      default:
        return "Không xác định";
    }
  };

  const filteredOrders = orders.filter(
    (o) =>
      o &&
      o.orderId &&
      ((o.orderId.toString().includes(searchTerm)) ||
        (o.userId && o.userId.toString().includes(searchTerm)))
  );

  const totalItems = filteredOrders.length;
  const totalPages = Math.ceil(totalItems / size);
  const startIndex = (page - 1) * size;
  const endIndex = startIndex + size;
  const currentOrders = filteredOrders.slice(startIndex, endIndex);

  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={{ minHeight: "100vh", padding: "20px" }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" sx={{ color: "#993300", fontWeight: "bold" }}>
            Quản Lý Đơn Hàng
          </Typography>
          <Box display="flex" gap={2} alignItems="center">
            <TextField
              variant="outlined"
              placeholder="Tìm kiếm ID đơn hàng, người dùng hoặc Correlation ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ color: "#993300" }} />,
                sx: {
                  backgroundColor: "#fff",
                  borderRadius: "20px",
                  "& .MuiOutlinedInput-root": { borderRadius: "20px" },
                  "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.9)" },
                },
              }}
              sx={{ width: "300px" }}
            />
            <Button
              variant="contained"
              onClick={handleSearchByCorrelationId}
              sx={{
                backgroundColor: "#993300",
                "&:hover": { backgroundColor: "#b35900" },
                borderRadius: "20px",
              }}
            >
              Tìm bằng Correlation ID
            </Button>
          </Box>
        </Box>

        {loading ? (
          <Typography sx={{ color: "#993300", textAlign: "center" }}>
            Đang tải đơn hàng...
          </Typography>
        ) : error ? (
          <Typography sx={{ color: "#993300", textAlign: "center" }}>
            Lỗi: {error}
          </Typography>
        ) : (
          <>
            <TableContainer
              component={Paper}
              sx={{
                borderRadius: "12px",
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                backgroundColor: "#fff",
              }}
            >
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#993300" }}>
                    <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>ID</TableCell>
                    <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Người Dùng</TableCell>
                    <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Tổng Tiền</TableCell>
                    <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Trạng Thái</TableCell>
                    <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Hành Động</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {currentOrders.map((order) =>
                    order && order.orderId ? (
                      <motion.tr
                        key={order.orderId}
                        whileHover={{ backgroundColor: "rgba(179, 89, 0, 0.1)", scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                      >
                        <TableCell>{order.orderId}</TableCell>
                        <TableCell>{order.userId}</TableCell>
                        <TableCell>{order.totalPrice.toLocaleString("vi-VN")} VND</TableCell>
                        <TableCell>
                          <Chip
                            label={getStatusLabel(order.status)}
                            sx={{
                              backgroundColor: getStatusColor(order.status),
                              color: "#fff",
                              fontWeight: "bold",
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Tooltip title="Chỉnh sửa trạng thái">
                            <IconButton
                              onClick={() => handleOpenModal(order)}
                              sx={{ color: "#993300" }}
                            >
                              <Edit />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Xem chi tiết">
                            <IconButton
                              onClick={() => handleOpenDetailModal(order)}
                              sx={{ color: "#993300" }}
                            >
                              <Visibility />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </motion.tr>
                    ) : null
                  )}
                </TableBody>
              </Table>
            </TableContainer>

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

        <Modal
          open={openModal}
          onClose={() => setOpenModal(false)}
          sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <Box
            sx={{
              backgroundColor: "#fff",
              borderRadius: "12px",
              p: 4,
              width: "400px",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Typography
              variant="h5"
              sx={{ mb: 2, color: "#993300", fontWeight: "bold" }}
            >
              Cập Nhật Trạng Thái Đơn Hàng
            </Typography>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel sx={{ color: "#993300" }}>Trạng Thái</InputLabel>
              <Select
                value={editItem?.status || ""}
                onChange={(e) => setEditItem({ ...editItem, status: e.target.value })}
                sx={{
                  "& .MuiOutlinedInput-notchedOutline": { borderColor: "#993300" },
                  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#b35900" },
                }}
              >
                <MenuItem value="PENDING_INVENTORY_VALIDATION">Đang kiểm tra tồn kho</MenuItem>
                <MenuItem value="PENDING_PAYMENT">Đang chờ thanh toán</MenuItem>
                <MenuItem value="PAYMENT_SUCCESS">Thanh toán thành công</MenuItem>
                <MenuItem value="SHIPPED">Đã giao</MenuItem>
                <MenuItem value="DELIVERED">Đã nhận</MenuItem>
                <MenuItem value="CANCELLED">Đã hủy</MenuItem>
              </Select>
            </FormControl>
            <Box display="flex" justifyContent="flex-end" gap={2}>
              <Button
                variant="contained"
                onClick={handleSave}
                disabled={saving}
                sx={{
                  backgroundColor: "#993300",
                  color: "white",
                  borderRadius: "25px",
                  padding: "10px 20px",
                  "&:hover": { backgroundColor: "#b35900" },
                  transition: "background-color 0.3s ease",
                }}
              >
                {saving ? "Đang lưu..." : "Lưu"}
              </Button>
              <Button
                variant="outlined"
                onClick={() => setOpenModal(false)}
                sx={{
                  borderColor: "#993300",
                  color: "#993300",
                  borderRadius: "25px",
                  padding: "10px 20px",
                  "&:hover": { backgroundColor: "rgba(179, 89, 0, 0.1)" },
                  transition: "background-color 0.3s ease",
                }}
              >
                Hủy
              </Button>
            </Box>
          </Box>
        </Modal>

        <Modal
          open={openDetailModal}
          onClose={() => setOpenDetailModal(false)}
          sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <Box
            sx={{
              backgroundColor: "#fff",
              borderRadius: "12px",
              p: 4,
              width: "600px",
              maxHeight: "80vh",
              overflowY: "auto",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Typography
              variant="h5"
              sx={{ mb: 2, color: "#993300", fontWeight: "bold" }}
            >
              Chi Tiết Đơn Hàng #{selectedOrder?.orderId}
            </Typography>
            {selectedOrder ? (
              <>
                <Box display="flex" justifyContent="space-between" sx={{ mb: 2 }}>
                  <Typography>Tổng tiền:</Typography>
                  <Typography sx={{ color: "#993300", fontWeight: "bold" }}>
                    {selectedOrder.totalPrice.toLocaleString("vi-VN")} VND
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" sx={{ mb: 2 }}>
                  <Typography>Trạng thái:</Typography>
                  <Chip
                    label={getStatusLabel(selectedOrder.status)}
                    sx={{
                      backgroundColor: getStatusColor(selectedOrder.status),
                      color: "#fff",
                      fontWeight: "bold",
                    }}
                  />
                </Box>
                <TableContainer sx={{ borderRadius: "8px" }}>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                        <TableCell sx={{ fontWeight: "bold", color: "#993300" }}>
                          Sản Phẩm
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold", color: "#993300" }} align="center">
                          Đơn Giá
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold", color: "#993300" }} align="center">
                          Số Lượng
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold", color: "#993300" }} align="center">
                          Thành Tiền
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold", color: "#993300" }} align="center">
                          Trạng Thái
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedOrder.items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <Box display="flex" alignItems="center">
                              <img
                                src={item.imageUrl}
                                alt={item.name}
                                width="40"
                                height="40"
                                style={{ borderRadius: "4px", objectFit: "cover" }}
                              />
                              <Typography sx={{ ml: 1 }}>{item.name}</Typography>
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
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            ) : (
              <Typography sx={{ color: "#993300" }}>
                Không có thông tin đơn hàng.
              </Typography>
            )}
            <Box display="flex" justifyContent="flex-end" mt={2}>
              <Button
                variant="outlined"
                onClick={() => setOpenDetailModal(false)}
                sx={{
                  borderColor: "#993300",
                  color: "#993300",
                  borderRadius: "25px",
                  padding: "10px 20px",
                  "&:hover": { backgroundColor: "rgba(179, 89, 0, 0.1)" },
                }}
              >
                Đóng
              </Button>
            </Box>
          </Box>
        </Modal>

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
              backgroundColor: snackbarSeverity === "success" ? "#993300" : "#e74c3c",
              color: "white",
            }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </motion.div>
    </AdminLayout>
  );
};

export default ManageOrders;