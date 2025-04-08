import React, { useState } from "react";
import {
  Box, Typography, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Tooltip,
} from "@mui/material";
import { Search, Add, Edit, Delete } from "@mui/icons-material";
import { motion } from "framer-motion";
import AdminLayout from "./AdminLayout";
import ModalForm from "./ModalForm";

const initialUsers = [
  { id: 101, username: "admin1", email: "admin1@example.com", role: "Admin", status: "Active" },
  { id: 102, username: "user1", email: "user1@example.com", role: "User", status: "Active" },
  { id: 103, username: "user2", email: "user2@example.com", role: "User", status: "Inactive" },
];

const ManageUsers = () => {
  const [users, setUsers] = useState(initialUsers);
  const [openModal, setOpenModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleOpenModal = (item = null) => {
    setEditItem(item);
    setOpenModal(true);
  };

  const handleSave = (formData) => {
    const newItem = { id: editItem ? editItem.id : users.length + 1, ...formData };
    setUsers(editItem ? users.map(u => u.id === editItem.id ? newItem : u) : [...users, newItem]);
    setOpenModal(false);
  };

  const handleDelete = (id) => setUsers(users.filter(u => u.id !== id));

  const filteredUsers = users.filter(u => u.username.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <AdminLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <Box display="flex" justifyContent="space-between" mb={3}>
          <Typography variant="h4" style={{ color: "#2c3e50" }}>Quản Lý Người Dùng</Typography>
          <Box display="flex" gap={2}>
            <TextField
              variant="outlined"
              placeholder="Tìm kiếm người dùng..."
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
              Thêm Người Dùng
            </Button>
          </Box>
        </Box>
        <TableContainer component={Paper} sx={{ borderRadius: "15px", boxShadow: "0 5px 15px rgba(0,0,0,0.1)" }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#2c3e50" }}>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>ID</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Tên Người Dùng</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Email</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Vai Trò</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Trạng Thái</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Hành Động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.map((user) => (
                <motion.tr key={user.id} whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{user.status}</TableCell>
                  <TableCell>
                    <Tooltip title="Chỉnh sửa">
                      <IconButton onClick={() => handleOpenModal(user)} sx={{ color: "#3498db" }}>
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Xóa">
                      <IconButton onClick={() => handleDelete(user.id)} sx={{ color: "#e74c3c" }}>
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
          type="user"
          initialData={editItem}
        />
      </motion.div>
    </AdminLayout>
  );
};

// Cập nhật ModalForm để hỗ trợ người dùng
const updatedModalFormCodeForUsers = `
import React from "react";
import {
  Modal, Box, Typography, TextField, Button, FormControl, InputLabel, Select, MenuItem,
} from "@mui/material";
import { motion } from "framer-motion";

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
      case "inventory": /* Giữ nguyên từ trước */
      case "user":
        return (
          <>
            <TextField label="Tên Người Dùng" name="username" value={formData.username || ""} onChange={handleChange} fullWidth margin="normal" />
            <TextField label="Email" name="email" type="email" value={formData.email || ""} onChange={handleChange} fullWidth margin="normal" />
            <FormControl fullWidth margin="normal">
              <InputLabel>Vai Trò</InputLabel>
              <Select name="role" value={formData.role || "User"} onChange={handleChange}>
                <MenuItem value="Admin">Admin</MenuItem>
                <MenuItem value="User">Người Dùng</MenuItem>
              </Select>
            </FormControl>
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

  return (
    <Modal open={open} onClose={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          backgroundColor: "#fff",
          padding: 20,
          borderRadius: "15px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
        }}
      >
        <Typography variant="h5" gutterBottom sx={{ color: "#2c3e50", fontWeight: "bold" }}>
          {initialData ? "Chỉnh Sửa" : "Thêm"} {type === "user" ? "Người Dùng" : type === "product" ? "Sản Phẩm" : type === "category" ? "Danh Mục" : type === "order" ? "Đơn Hàng" : "Kho Hàng"}
        </Typography>
        {renderFields()}
        <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
          <Button onClick={onClose} sx={{ color: "#e74c3c" }}>Hủy</Button>
          <Button onClick={handleSubmit} variant="contained" sx={{ backgroundColor: "#3498db", "&:hover": { backgroundColor: "#2980b9" } }}>
            Lưu
          </Button>
        </Box>
      </motion.div>
    </Modal>
  );
};

export default ModalForm;
`;

export default ManageUsers;