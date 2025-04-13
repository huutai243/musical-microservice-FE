import React, { useState, useEffect } from "react";
import {
  Box, Typography, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Tooltip, Pagination, Modal, FormControl, InputLabel, Select, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert,
} from "@mui/material";
import { Search, Add, Edit, Delete } from "@mui/icons-material";
import { motion } from "framer-motion";
import AdminLayout from "./AdminLayout";
import api from '../../utils/api';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const size = 6;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        // Giả định API lấy danh sách người dùng
        const response = await api.get('/users/all');
        setUsers(response.data || []);
      } catch (error) {
        setError("Không thể tải danh sách người dùng");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleOpenModal = (item = null) => {
    setEditItem(item || { username: "", email: "", password: "", role: "User", status: "Active" });
    setOpenModal(true);
  };

  const handleSave = async () => {
    // Kiểm tra dữ liệu cơ bản
    if (!editItem.username || !editItem.email) {
      setSnackbarMessage("Vui lòng nhập tên người dùng và email!");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }
    if (!editItem.id && !editItem.password) {
      setSnackbarMessage("Vui lòng nhập mật khẩu khi tạo người dùng mới!");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }
    // Kiểm tra định dạng email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editItem.email)) {
      setSnackbarMessage("Email không hợp lệ!");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    try {
      setSaving(true);
      let response;
      if (editItem.id) {
        // Cập nhật người dùng (giả định API)
        response = await api.put(`/users/${editItem.id}`, {
          username: editItem.username,
          email: editItem.email,
          role: editItem.role,
          status: editItem.status,
        });
        setUsers(users.map(u => (u.id === editItem.id ? response.data : u)));
        setSnackbarMessage("Người dùng đã được cập nhật thành công!");
      } else {
        // Tạo người dùng mới
        response = await api.post("/users/create", {
          username: editItem.username,
          email: editItem.email,
          password: editItem.password,
          role: editItem.role,
          status: editItem.status,
        });
        setUsers([...users, response.data]);
        setSnackbarMessage("Người dùng đã được tạo thành công!");
      }

      setOpenModal(false);
      setSnackbarSeverity("success");
    } catch (error) {
      setSnackbarMessage(error.response?.data?.message || "Không thể lưu người dùng!");
      setSnackbarSeverity("error");
    } finally {
      setSaving(false);
      setSnackbarOpen(true);
    }
  };

  const handleOpenConfirmDelete = (user) => {
    setUserToDelete(user);
    setConfirmDeleteOpen(true);
  };

  const handleCloseConfirmDelete = () => {
    setConfirmDeleteOpen(false);
    setUserToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;

    try {
      // Giả định API xóa người dùng
      await api.delete(`/users/${userToDelete.id}`);
      setUsers(users.filter(u => u.id !== userToDelete.id));
      setSnackbarMessage("Người dùng đã được xóa thành công!");
      setSnackbarSeverity("success");
    } catch (error) {
      setSnackbarMessage(error.response?.data?.message || "Không thể xóa người dùng!");
      setSnackbarSeverity("error");
    } finally {
      setConfirmDeleteOpen(false);
      setUserToDelete(null);
      setSnackbarOpen(true);
    }
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const filteredUsers = users.filter(u =>
    u.username.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalItems = filteredUsers.length;
  const totalPages = Math.ceil(totalItems / size);
  const startIndex = (page - 1) * size;
  const endIndex = startIndex + size;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={{ minHeight: '100vh', padding: '20px' }}
      >
        {/* Tiêu đề và tìm kiếm */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" sx={{ color: '#993300', fontWeight: 'bold' }}>
            Quản Lý Người Dùng
          </Typography>
          <Box display="flex" gap={2} alignItems="center">
            <TextField
              variant="outlined"
              placeholder="Tìm kiếm người dùng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ color: '#993300' }} />,
                sx: {
                  backgroundColor: '#fff',
                  borderRadius: '20px',
                  '& .MuiOutlinedInput-root': { borderRadius: '20px' },
                  '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.9)' },
                },
              }}
              sx={{ width: '300px' }}
            />
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => handleOpenModal()}
              sx={{
                backgroundColor: '#993300',
                color: 'white',
                borderRadius: '25px',
                padding: '10px 20px',
                textTransform: 'none',
                fontSize: '1rem',
                '&:hover': { backgroundColor: '#b35900' },
                transition: 'background-color 0.3s ease',
              }}
            >
              Thêm Người Dùng
            </Button>
          </Box>
        </Box>

        {/* Bảng người dùng */}
        {loading ? (
          <Typography sx={{ color: '#993300', textAlign: 'center' }}>
            Đang tải người dùng...
          </Typography>
        ) : error ? (
          <Typography sx={{ color: '#993300', textAlign: 'center' }}>
            Lỗi: {error}
          </Typography>
        ) : (
          <>
            <TableContainer
              component={Paper}
              sx={{
                borderRadius: '12px',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                backgroundColor: '#fff',
              }}
            >
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#993300' }}>
                    <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>ID</TableCell>
                    <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Tên Người Dùng</TableCell>
                    <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Email</TableCell>
                    <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Vai Trò</TableCell>
                    <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Trạng Thái</TableCell>
                    <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Hành Động</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {currentUsers.map((user) => (
                    <motion.tr
                      key={user.id}
                      whileHover={{ backgroundColor: 'rgba(179, 89, 0, 0.1)', scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <TableCell>{user.id}</TableCell>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>{user.status}</TableCell>
                      <TableCell>
                        <Tooltip title="Chỉnh sửa">
                          <IconButton
                            onClick={() => handleOpenModal(user)}
                            sx={{ color: '#993300' }}
                          >
                            <Edit />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Xóa">
                          <IconButton
                            onClick={() => handleOpenConfirmDelete(user)}
                            sx={{ color: '#e74c3c' }}
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

            {/* Phân trang */}
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                mt: 4,
                '& .MuiPaginationItem-root': {
                  color: '#993300',
                  borderColor: '#993300',
                },
                '& .Mui-selected': {
                  backgroundColor: '#993300 !important',
                  color: 'white !important',
                },
                '& .MuiPaginationItem-root:hover': {
                  backgroundColor: '#b35900',
                  color: 'white',
                },
              }}
            />
          </>
        )}

        {/* Modal thêm/chỉnh sửa người dùng */}
        <Modal
          open={openModal}
          onClose={() => setOpenModal(false)}
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Box
            sx={{
              backgroundColor: '#fff',
              borderRadius: '12px',
              p: 4,
              width: '400px',
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
            }}
          >
            <Typography
              variant="h5"
              sx={{ mb: 2, color: '#993300', fontWeight: 'bold' }}
            >
              {editItem?.id ? 'Chỉnh Sửa Người Dùng' : 'Thêm Người Dùng'}
            </Typography>
            <TextField
              label="Tên Người Dùng"
              value={editItem?.username || ""}
              onChange={(e) => setEditItem({ ...editItem, username: e.target.value })}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Email"
              type="email"
              value={editItem?.email || ""}
              onChange={(e) => setEditItem({ ...editItem, email: e.target.value })}
              fullWidth
              sx={{ mb: 2 }}
            />
            {!editItem?.id && (
              <TextField
                label="Mật Khẩu"
                type="password"
                value={editItem?.password || ""}
                onChange={(e) => setEditItem({ ...editItem, password: e.target.value })}
                fullWidth
                sx={{ mb: 2 }}
              />
            )}
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel sx={{ color: '#993300' }}>Vai Trò</InputLabel>
              <Select
                value={editItem?.role || "User"}
                onChange={(e) => setEditItem({ ...editItem, role: e.target.value })}
                sx={{
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#993300' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#b35900' },
                }}
              >
                <MenuItem value="Admin">Admin</MenuItem>
                <MenuItem value="User">Người Dùng</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel sx={{ color: '#993300' }}>Trạng Thái</InputLabel>
              <Select
                value={editItem?.status || "Active"}
                onChange={(e) => setEditItem({ ...editItem, status: e.target.value })}
                sx={{
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#993300' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#b35900' },
                }}
              >
                <MenuItem value="Active">Hoạt động</MenuItem>
                <MenuItem value="Inactive">Không hoạt động</MenuItem>
              </Select>
            </FormControl>
            <Box display="flex" justifyContent="flex-end" gap={2}>
              <Button
                variant="contained"
                onClick={handleSave}
                disabled={saving}
                sx={{
                  backgroundColor: '#993300',
                  color: 'white',
                  borderRadius: '25px',
                  padding: '10px 20px',
                  '&:hover': { backgroundColor: '#b35900' },
                  transition: 'background-color 0.3s ease',
                }}
              >
                {saving ? 'Đang lưu...' : 'Lưu'}
              </Button>
              <Button
                variant="outlined"
                onClick={() => setOpenModal(false)}
                sx={{
                  borderColor: '#993300',
                  color: '#993300',
                  borderRadius: '25px',
                  padding: '10px 20px',
                  '&:hover': { backgroundColor: 'rgba(179, 89, 0, 0.1)' },
                  transition: 'background-color 0.3s ease',
                }}
              >
                Hủy
              </Button>
            </Box>
          </Box>
        </Modal>

        {/* Dialog xác nhận xóa */}
        <Dialog
          open={confirmDeleteOpen}
          onClose={handleCloseConfirmDelete}
          sx={{ '& .MuiDialog-paper': { borderRadius: '12px' } }}
        >
          <DialogTitle sx={{ color: '#993300', fontWeight: 'bold' }}>
            Xác Nhận Xóa Người Dùng
          </DialogTitle>
          <DialogContent>
            <Typography sx={{ color: '#333' }}>
              Bạn có chắc chắn muốn xóa người dùng{" "}
              <strong>{userToDelete?.username}</strong> không?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleCloseConfirmDelete}
              sx={{
                color: '#993300',
                textTransform: 'none',
                '&:hover': { backgroundColor: 'rgba(179, 89, 0, 0.1)' },
              }}
            >
              Không
            </Button>
            <Button
              onClick={handleConfirmDelete}
              variant="contained"
              sx={{
                backgroundColor: '#993300',
                color: 'white',
                borderRadius: '25px',
                textTransform: 'none',
                '&:hover': { backgroundColor: '#b35900' },
                transition: 'background-color 0.3s ease',
              }}
            >
              Có
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert
            severity={snackbarSeverity}
            sx={{
              width: '100%',
              '& .MuiAlert-message': { fontWeight: 'bold' },
              backgroundColor: snackbarSeverity === 'success' ? '#993300' : '#e74c3c',
              color: 'white',
            }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </motion.div>
    </AdminLayout>
  );
};

export default ManageUsers;