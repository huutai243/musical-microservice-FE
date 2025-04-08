import React, { useState } from "react";
import {
  Box, Typography, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Tooltip,
} from "@mui/material";
import { Search, Add, Edit, Delete } from "@mui/icons-material";
import { motion } from "framer-motion";
import AdminLayout from "./AdminLayout";
import ModalForm from "./ModalForm";

const initialCategories = [
  { id: 1, name: "Guitar", description: "Đàn dây", status: "Active" },
  { id: 2, name: "Piano", description: "Đàn phím", status: "Active" },
  { id: 3, name: "Trống", description: "Nhạc cụ gõ", status: "Inactive" },
];

const ManageCategories = () => {
  const [categories, setCategories] = useState(initialCategories);
  const [openModal, setOpenModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleOpenModal = (item = null) => {
    setEditItem(item);
    setOpenModal(true);
  };

  const handleSave = (formData) => {
    const newItem = { id: editItem ? editItem.id : categories.length + 1, ...formData };
    setCategories(editItem ? categories.map(c => c.id === editItem.id ? newItem : c) : [...categories, newItem]);
    setOpenModal(false);
  };

  const handleDelete = (id) => setCategories(categories.filter(c => c.id !== id));

  const filteredCategories = categories.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <AdminLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <Box display="flex" justifyContent="space-between" mb={3}>
          <Typography variant="h4" style={{ color: "#2c3e50" }}>Quản Lý Danh Mục</Typography>
          <Box display="flex" gap={2}>
            <TextField
              variant="outlined"
              placeholder="Tìm kiếm danh mục..."
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
              Thêm Danh Mục
            </Button>
          </Box>
        </Box>
        <TableContainer component={Paper} sx={{ borderRadius: "15px", boxShadow: "0 5px 15px rgba(0,0,0,0.1)" }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#2c3e50" }}>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>ID</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Tên</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Mô Tả</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Trạng Thái</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Hành Động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCategories.map((category) => (
                <motion.tr key={category.id} whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                  <TableCell>{category.id}</TableCell>
                  <TableCell>{category.name}</TableCell>
                  <TableCell>{category.description}</TableCell>
                  <TableCell>{category.status}</TableCell>
                  <TableCell>
                    <Tooltip title="Chỉnh sửa">
                      <IconButton onClick={() => handleOpenModal(category)} sx={{ color: "#3498db" }}>
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Xóa">
                      <IconButton onClick={() => handleDelete(category.id)} sx={{ color: "#e74c3c" }}>
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
          type="category"
          initialData={editItem}
        />
      </motion.div>
    </AdminLayout>
  );
};

// Cập nhật ModalForm để hỗ trợ danh mục
const updatedModalFormCode = `
const ModalForm = ({ open, onClose, onSave, type, initialData }) => {
  const [formData, setFormData] = React.useState(initialData || {});

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    onSave(formData);
  };

  const renderFields = () => {
    switch (type) {
      case "product":
        return (
          <>
            <TextField label="Tên" name="name" value={formData.name || ""} onChange={handleChange} fullWidth margin="normal" />
            <TextField label="Giá (VND)" name="price" type="number" value={formData.price || ""} onChange={handleChange} fullWidth margin="normal" />
            <TextField label="Tồn Kho" name="stock" type="number" value={formData.stock || ""} onChange={handleChange} fullWidth margin="normal" />
          </>
        );
      case "category":
        return (
          <>
            <TextField label="Tên Danh Mục" name="name" value={formData.name || ""} onChange={handleChange} fullWidth margin="normal" />
            <TextField label="Mô Tả" name="description" value={formData.description || ""} onChange={handleChange} fullWidth margin="normal" />
            <FormControl fullWidth margin="normal">
              <InputLabel>Trạng Thái</InputLabel>
              <Select name="status" value={formData.status || "Active"} onChange={handleChange}>
                <MenuItem value="Active">Hoạt động</MenuItem>
                <MenuItem value="Inactive">Không hoạt động</MenuItem>
              </Select>
            </FormControl>
          </>
        );
      default:
        return null;
    }
  };
  // Giữ nguyên phần còn lại của ModalForm...
}
`;

export default ManageCategories;