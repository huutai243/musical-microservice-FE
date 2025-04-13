import React, { useState, useEffect } from "react";
import {
  Box, Typography, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Tooltip, Pagination, Modal, FormControl, InputLabel, Select, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert,
} from "@mui/material";
import { Search, Add, Edit, Delete } from "@mui/icons-material";
import { motion } from "framer-motion";
import AdminLayout from "./AdminLayout";
import api from '../../utils/api';

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const size = 6;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await api.get('/categories/get-all');
        setCategories(response.data || []);
      } catch (error) {
        setError("Không thể tải danh mục");
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleOpenModal = (item = null) => {
    setEditItem(item || { name: "", description: "", status: "Active" });
    setOpenModal(true);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const categoryData = {
        name: editItem.name,
        description: editItem.description,
        status: editItem.status,
      };

      let response;
      if (editItem.id) {
        // Cập nhật danh mục
        response = await api.put(`/categories/${editItem.id}`, categoryData);
        setCategories(categories.map(c => (c.id === editItem.id ? response.data : c)));
        setSnackbarMessage("Danh mục đã được cập nhật thành công!");
      } else {
        // Thêm danh mục mới
        response = await api.post("/categories/add", categoryData);
        setCategories([...categories, response.data]);
        setSnackbarMessage("Danh mục đã được thêm thành công!");
      }

      setOpenModal(false);
      setSnackbarSeverity("success");
    } catch (error) {
      setSnackbarMessage(error.response?.data?.message || "Không thể lưu danh mục!");
      setSnackbarSeverity("error");
    } finally {
      setSaving(false);
      setSnackbarOpen(true);
    }
  };

  const handleOpenConfirmDelete = (category) => {
    setCategoryToDelete(category);
    setConfirmDeleteOpen(true);
  };

  const handleCloseConfirmDelete = () => {
    setConfirmDeleteOpen(false);
    setCategoryToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;

    try {
      await api.delete(`/categories/${categoryToDelete.id}`);
      setCategories(categories.filter(c => c.id !== categoryToDelete.id));
      setSnackbarMessage("Danh mục đã được xóa thành công!");
      setSnackbarSeverity("success");
    } catch (error) {
      setSnackbarMessage(error.response?.data?.message || "Không thể xóa danh mục!");
      setSnackbarSeverity("error");
    } finally {
      setConfirmDeleteOpen(false);
      setCategoryToDelete(null);
      setSnackbarOpen(true);
    }
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const filteredCategories = categories.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const totalItems = filteredCategories.length;
  const totalPages = Math.ceil(totalItems / size);
  const startIndex = (page - 1) * size;
  const endIndex = startIndex + size;
  const currentCategories = filteredCategories.slice(startIndex, endIndex);

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
            Quản Lý Danh Mục
          </Typography>
          <Box display="flex" gap={2} alignItems="center">
            <TextField
              variant="outlined"
              placeholder="Tìm kiếm danh mục..."
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
              Thêm Danh Mục
            </Button>
          </Box>
        </Box>

        {/* Bảng danh mục */}
        {loading ? (
          <Typography sx={{ color: '#993300', textAlign: 'center' }}>
            Đang tải danh mục...
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
                    <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Tên</TableCell>
                    <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Mô Tả</TableCell>
                    <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Trạng Thái</TableCell>
                    <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Hành Động</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {currentCategories.map((category) => (
                    <motion.tr
                      key={category.id}
                      whileHover={{ backgroundColor: 'rgba(179, 89, 0, 0.1)', scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <TableCell>{category.id}</TableCell>
                      <TableCell>{category.name}</TableCell>
                      <TableCell>{category.description}</TableCell>
                      <TableCell>{category.status}</TableCell>
                      <TableCell>
                        <Tooltip title="Chỉnh sửa">
                          <IconButton
                            onClick={() => handleOpenModal(category)}
                            sx={{ color: '#993300' }}
                          >
                            <Edit />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Xóa">
                          <IconButton
                            onClick={() => handleOpenConfirmDelete(category)}
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

        {/* Modal thêm/chỉnh sửa danh mục */}
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
              {editItem?.id ? 'Chỉnh Sửa Danh Mục' : 'Thêm Danh Mục'}
            </Typography>
            <TextField
              label="Tên Danh Mục"
              value={editItem?.name || ""}
              onChange={(e) => setEditItem({ ...editItem, name: e.target.value })}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Mô Tả"
              value={editItem?.description || ""}
              onChange={(e) => setEditItem({ ...editItem, description: e.target.value })}
              fullWidth
              multiline
              rows={3}
              sx={{ mb: 2 }}
            />
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
            Xác Nhận Xóa Danh Mục
          </DialogTitle>
          <DialogContent>
            <Typography sx={{ color: '#333' }}>
              Bạn có chắc chắn muốn xóa danh mục{" "}
              <strong>{categoryToDelete?.name}</strong> không?
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

        {/* Snackbar thông báo */}
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

export default ManageCategories;