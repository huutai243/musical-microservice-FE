import React, { useState } from "react";
import {
  Box, Typography, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Tooltip,
} from "@mui/material";
import { Search, Add, Edit, Delete } from "@mui/icons-material";
import { motion } from "framer-motion";
import AdminLayout from "./AdminLayout";
import ModalForm from "./ModalForm";

const initialInventory = [
  { id: 1, productId: 1, productName: "Đàn Guitar Yamaha C40", quantity: 10, lastUpdated: "2025-04-01" },
  { id: 2, productId: 2, productName: "Đàn Piano Casio PX-160", quantity: 5, lastUpdated: "2025-04-02" },
];

const ManageInventory = () => {
  const [inventory, setInventory] = useState(initialInventory);
  const [openModal, setOpenModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleOpenModal = (item = null) => {
    setEditItem(item);
    setOpenModal(true);
  };

  const handleSave = (formData) => {
    const newItem = { id: editItem ? editItem.id : inventory.length + 1, ...formData };
    setInventory(editItem ? inventory.map(i => i.id === editItem.id ? newItem : i) : [...inventory, newItem]);
    setOpenModal(false);
  };

  const handleDelete = (id) => setInventory(inventory.filter(i => i.id !== id));

  const filteredInventory = inventory.filter(i => i.productName.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <AdminLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <Box display="flex" justifyContent="space-between" mb={3}>
          <Typography variant="h4" style={{ color: "#2c3e50" }}>Quản Lý Kho Hàng</Typography>
          <Box display="flex" gap={2}>
            <TextField
              variant="outlined"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{ startAdornment: <Search /> }}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
            />
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => handleOpenModal()}
              sx={{ backgroundColor: "#3498db", "&:hover": { backgroundColor: "#2980b9" }, borderRadius: "10px" }}
            >
              Thêm Kho
            </Button>
          </Box>
        </Box>
        <TableContainer component={Paper} sx={{ borderRadius: "15px", boxShadow: "0 5px 15px rgba(0,0,0,0.1)" }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#2c3e50" }}>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>ID</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Sản Phẩm</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Số Lượng</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Cập Nhật Lần Cuối</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Hành Động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredInventory.map((item) => (
                <motion.tr key={item.id} whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.productName}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{item.lastUpdated}</TableCell>
                  <TableCell>
                    <Tooltip title="Chỉnh sửa">
                      <IconButton onClick={() => handleOpenModal(item)} sx={{ color: "#3498db" }}>
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Xóa">
                      <IconButton onClick={() => handleDelete(item.id)} sx={{ color: "#e74c3c" }}>
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
          type="inventory"
          initialData={editItem}
        />
      </motion.div>
    </AdminLayout>
  );
};

// Cập nhật ModalForm để hỗ trợ kho hàng
const updatedModalFormCodeForInventory = `
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
      case "order": /* Giữ nguyên từ trước */
      case "inventory":
        return (
          <>
            <TextField label="ID Sản Phẩm" name="productId" type="number" value={formData.productId || ""} onChange={handleChange} fullWidth margin="normal" />
            <TextField label="Tên Sản Phẩm" name="productName" value={formData.productName || ""} onChange={handleChange} fullWidth margin="normal" />
            <TextField label="Số Lượng" name="quantity" type="number" value={formData.quantity || ""} onChange={handleChange} fullWidth margin="normal" />
            <TextField label="Cập Nhật Lần Cuối" name="lastUpdated" type="date" value={formData.lastUpdated || ""} onChange={handleChange} fullWidth margin="normal" InputLabelProps={{ shrink: true }} />
          </>
        );
      default:
        return null;
    }
  };
  // Giữ nguyên phần còn lại của ModalForm...
}
`;

export default ManageInventory;