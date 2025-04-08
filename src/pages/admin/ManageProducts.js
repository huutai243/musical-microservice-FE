import React, { useState } from "react";
import {
  Box, Typography, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Tooltip,
} from "@mui/material";
import { Search, Add, Edit, Delete } from "@mui/icons-material";
import { motion } from "framer-motion";
import AdminLayout from "./AdminLayout";
import ModalForm from "./ModalForm";

const initialProducts = [
  { id: 1, name: "Đàn Guitar Yamaha C40", price: 2500000, stock: 10, categoryId: 1, sales: 50, status: "Active" },
  { id: 2, name: "Đàn Piano Casio PX-160", price: 12000000, stock: 5, categoryId: 2, sales: 20, status: "Active" },
];

const ManageProducts = () => {
  const [products, setProducts] = useState(initialProducts);
  const [openModal, setOpenModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleOpenModal = (item = null) => {
    setEditItem(item);
    setOpenModal(true);
  };

  const handleSave = (formData) => {
    const newItem = { id: editItem ? editItem.id : products.length + 1, ...formData };
    setProducts(editItem ? products.map(p => p.id === editItem.id ? newItem : p) : [...products, newItem]);
    setOpenModal(false);
  };

  const handleDelete = (id) => setProducts(products.filter(p => p.id !== id));

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <AdminLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <Box display="flex" justifyContent="space-between" mb={3}>
          <Typography variant="h4" style={{ color: "#2c3e50" }}>Quản Lý Sản Phẩm</Typography>
          <Box display="flex" gap={2}>
            <TextField
              variant="outlined"
              placeholder="Tìm kiếm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{ startAdornment: <Search /> }}
            />
            <Button variant="contained" startIcon={<Add />} onClick={() => handleOpenModal()} sx={{ backgroundColor: "#3498db" }}>
              Thêm Sản Phẩm
            </Button>
          </Box>
        </Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#2c3e50" }}>
                <TableCell sx={{ color: "#fff" }}>ID</TableCell>
                <TableCell sx={{ color: "#fff" }}>Tên</TableCell>
                <TableCell sx={{ color: "#fff" }}>Giá</TableCell>
                <TableCell sx={{ color: "#fff" }}>Tồn Kho</TableCell>
                <TableCell sx={{ color: "#fff" }}>Hành Động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProducts.map((product) => (
                <motion.tr key={product.id} whileHover={{ scale: 1.02 }}>
                  <TableCell>{product.id}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.price.toLocaleString("vi-VN")} VND</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>
                    <Tooltip title="Chỉnh sửa">
                      <IconButton onClick={() => handleOpenModal(product)}><Edit /></IconButton>
                    </Tooltip>
                    <Tooltip title="Xóa">
                      <IconButton onClick={() => handleDelete(product.id)} sx={{ color: "#e74c3c" }}><Delete /></IconButton>
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
          type="product"
          initialData={editItem}
        />
      </motion.div>
    </AdminLayout>
  );
};

export default ManageProducts;