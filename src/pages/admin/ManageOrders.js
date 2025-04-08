import React, { useState } from "react";
import {
  Box, Typography, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Tooltip,
} from "@mui/material";
import { Search, Edit, Delete } from "@mui/icons-material";
import { motion } from "framer-motion";
import AdminLayout from "./AdminLayout";
import ModalForm from "./ModalForm";

const initialOrders = [
  { id: 1, userId: 101, total: 7500000, status: "Pending", createdAt: "2025-04-01" },
  { id: 2, userId: 102, total: 12000000, status: "Shipped", createdAt: "2025-04-02" },
  { id: 3, userId: 103, total: 3000000, status: "Delivered", createdAt: "2025-04-03" },
];

const ManageOrders = () => {
  const [orders, setOrders] = useState(initialOrders);
  const [openModal, setOpenModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleOpenModal = (item = null) => {
    setEditItem(item);
    setOpenModal(true);
  };

  const handleSave = (formData) => {
    const newItem = { id: editItem ? editItem.id : orders.length + 1, ...formData };
    setOrders(editItem ? orders.map(o => o.id === editItem.id ? newItem : o) : [...orders, newItem]);
    setOpenModal(false);
  };

  const handleDelete = (id) => setOrders(orders.filter(o => o.id !== id));

  const filteredOrders = orders.filter(o => o.id.toString().includes(searchTerm));

  return (
    <AdminLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <Box display="flex" justifyContent="space-between" mb={3}>
          <Typography variant="h4" style={{ color: "#2c3e50" }}>Quản Lý Đơn Hàng</Typography>
          <Box display="flex" gap={2}>
            <TextField
              variant="outlined"
              placeholder="Tìm kiếm ID đơn hàng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{ startAdornment: <Search /> }}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
            />
          </Box>
        </Box>
        <TableContainer component={Paper} sx={{ borderRadius: "15px", boxShadow: "0 5px 15px rgba(0,0,0,0.1)" }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#2c3e50" }}>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>ID</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Người Dùng</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Tổng Tiền</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Trạng Thái</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Ngày Tạo</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Hành Động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOrders.map((order) => (
                <motion.tr key={order.id} whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{order.userId}</TableCell>
                  <TableCell>{order.total.toLocaleString("vi-VN")} VND</TableCell>
                  <TableCell>{order.status}</TableCell>
                  <TableCell>{order.createdAt}</TableCell>
                  <TableCell>
                    <Tooltip title="Chỉnh sửa">
                      <IconButton onClick={() => handleOpenModal(order)} sx={{ color: "#3498db" }}>
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Xóa">
                      <IconButton onClick={() => handleDelete(order.id)} sx={{ color: "#e74c3c" }}>
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <ModalForm
          open={openModal}
          onClose={() => setOpenModal(false)}
          onSave={handleSave}
          type="order"
          initialData={editItem}
        />
      </motion.div>
    </AdminLayout>
  );
};

// Cập nhật ModalForm để hỗ trợ đơn hàng
const updatedModalFormCodeForOrders = `
const ModalForm = ({ open, onClose, onSave, type, initialData }) => {
  const [formData, setFormData] = React.useState(initialData || {});

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    onSave(formData);
  };

  const renderFields = () => {
    switch (type) {
      case "product": /* Giữ nguyên từ trước */
      case "category": /* Giữ nguyên từ trước */
      case "order":
        return (
          <>
            <TextField label="ID Người Dùng" name="userId" type="number" value={formData.userId || ""} onChange={handleChange} fullWidth margin="normal" />
            <TextField label="Tổng Tiền (VND)" name="total" type="number" value={formData.total || ""} onChange={handleChange} fullWidth margin="normal" />
            <FormControl fullWidth margin="normal">
              <InputLabel>Trạng Thái</InputLabel>
              <Select name="status" value={formData.status || "Pending"} onChange={handleChange}>
                <MenuItem value="Pending">Chờ xử lý</MenuItem>
                <MenuItem value="Shipped">Đã giao</MenuItem>
                <MenuItem value="Delivered">Đã nhận</MenuItem>
                <MenuItem value="Cancelled">Đã hủy</MenuItem>
              </Select>
            </FormControl>
            <TextField label="Ngày Tạo" name="createdAt" type="date" value={formData.createdAt || ""} onChange={handleChange} fullWidth margin="normal" InputLabelProps={{ shrink: true }} />
          </>
        );
      default:
        return null;
    }
  };
  // Giữ nguyên phần còn lại của ModalForm...
}
`;

export default ManageOrders;