import React, { useState, useEffect } from "react";
import {
  Box, Typography, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Tooltip, Pagination, Modal, Grid, CardMedia, Select, MenuItem, InputLabel, FormControl, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert,
} from "@mui/material";
import { Search, Add, Edit, Delete } from "@mui/icons-material";
import { motion } from "framer-motion";
import AdminLayout from "./AdminLayout";
import api from '../../utils/api';

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [newImageFiles, setNewImageFiles] = useState([]);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const size = 6;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const productResponse = await api.get('/products/get-all');
        setProducts(productResponse.data || []);
        const categoryResponse = await api.get('/categories/get-all');
        setCategories(categoryResponse.data || []);
      } catch (error) {
        setError("Không thể tải dữ liệu");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleOpenModal = (item = null) => {
    if (item) {
      // Chế độ chỉnh sửa
      setEditItem(item);
    } else {
      // Chế độ thêm mới
      setEditItem({
        name: "",
        description: "",
        price: 0,
        categoryId: "",
        imageUrls: [],
      });
    }
    setNewImageFiles([]);
    setOpenModal(true);
  };

  const handleOpenConfirmDelete = (product) => {
    setProductToDelete(product);
    setConfirmDeleteOpen(true);
  };

  const handleCloseConfirmDelete = () => {
    setConfirmDeleteOpen(false);
    setProductToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;

    try {
      await api.delete(`/products/delete/${productToDelete.id}`);
      setProducts(products.filter(p => p.id !== productToDelete.id));
      setSnackbarMessage("Sản phẩm đã được xóa thành công!");
      setSnackbarSeverity("success");
    } catch (error) {
      setSnackbarMessage(error.response?.data?.message || "Không thể xóa sản phẩm!");
      setSnackbarSeverity("error");
    } finally {
      setConfirmDeleteOpen(false);
      setProductToDelete(null);
      setSnackbarOpen(true);
    }
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleImageUpload = (e, index = null) => {
    const files = Array.from(e.target.files);
    const newUrls = files.map(file => URL.createObjectURL(file));
    const updatedImageUrls = [...(editItem.imageUrls || [])];
    const updatedFiles = [...newImageFiles];

    if (index !== null) {
      // Thay thế ảnh tại vị trí index
      updatedImageUrls[index] = newUrls[0];
      updatedFiles[index] = files[0];
    } else {
      // Thêm nhiều ảnh mới
      updatedImageUrls.push(...newUrls);
      updatedFiles.push(...files);
    }

    setEditItem({ ...editItem, imageUrls: updatedImageUrls });
    setNewImageFiles(updatedFiles);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const productRequest = {
        name: editItem.name,
        description: editItem.description,
        price: parseFloat(editItem.price),
        categoryId: parseInt(editItem.categoryId),
        retainedImageUrls: (editItem.imageUrls || [] ).filter(url=> !url.startsWith("blob:")),
      };

      const formData = new FormData();
      formData.append("product", JSON.stringify(productRequest));

      newImageFiles.forEach((file) => {
        if (file) {
          formData.append("images", file);
        }
      });

      let response;
      if (editItem.id) {
        // Cập nhật sản phẩm
        response = await api.put(`/products/update/${editItem.id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setProducts(products.map(p => (p.id === editItem.id ? response.data : p)));
        setSnackbarMessage("Sản phẩm đã được cập nhật thành công!");
      } else {
        // Thêm sản phẩm mới
        response = await api.post("/products/add", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setProducts([...products, response.data]);
        setSnackbarMessage("Sản phẩm đã được thêm thành công!");
      }

      setOpenModal(false);
      setSnackbarSeverity("success");
    } catch (error) {
      setSnackbarMessage(error.response?.data?.message || "Không thể lưu sản phẩm!");
      setSnackbarSeverity("error");
    } finally {
      setSaving(false);
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / size);
  const startIndex = (page - 1) * size;
  const endIndex = startIndex + size;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : "Không xác định";
  };

  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={{ minHeight: '100vh' }}
      >
        {/* Tiêu đề và tìm kiếm */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" sx={{ color: '#993300', fontWeight: 'bold' }}>
            Quản Lý Sản Phẩm
          </Typography>
          <Box display="flex" gap={2} alignItems="center">
            <TextField
              variant="outlined"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ color: '#993300' }} />,
                sx: {
                  backgroundColor: '#fff',
                  borderRadius: '100px',
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
              Thêm Sản Phẩm
            </Button>
          </Box>
        </Box>

        {/* Bảng sản phẩm */}
        {loading ? (
          <Typography sx={{ color: '#993300', textAlign: 'center' }}>
            Đang tải sản phẩm...
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
                    <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Hình Ảnh</TableCell>
                    <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Tên</TableCell>
                    <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Giá</TableCell>
                    <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Danh Mục</TableCell>
                    <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Hành Động</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {currentProducts.map((product) => (
                    <motion.tr
                      key={product.id}
                      whileHover={{ backgroundColor: 'rgba(179, 89, 0, 0.1)' }}
                      sx={{ '&:hover': { '& td': { fontWeight: 'medium' } } }}
                    >
                      <TableCell>{product.id}</TableCell>
                      <TableCell>
                        {product.imageUrls && product.imageUrls.length > 0 ? (
                          <img
                            src={product.imageUrls[0]}
                            alt={product.name}
                            style={{
                              width: '50px',
                              height: '50px',
                              objectFit: 'cover',
                              borderRadius: '5px',
                            }}
                          />
                        ) : (
                          "Không có hình ảnh"
                        )}
                      </TableCell>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.price.toLocaleString("vi-VN")} VND</TableCell>
                      <TableCell>{getCategoryName(product.categoryId)}</TableCell>
                      <TableCell>
                        <Tooltip title="Chỉnh sửa">
                          <IconButton
                            onClick={() => handleOpenModal(product)}
                            sx={{ color: '#993300' }}
                          >
                            <Edit />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Xóa">
                          <IconButton
                            onClick={() => handleOpenConfirmDelete(product)}
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

        {/* Modal thêm/chỉnh sửa sản phẩm */}
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
              width: '600px',
              maxHeight: '80vh',
              overflowY: 'auto',
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
            }}
          >
            <Typography
              variant="h5"
              sx={{ mb: 2, color: '#993300', fontWeight: 'bold' }}
            >
              {editItem?.id ? 'Chỉnh Sửa Sản Phẩm' : 'Thêm Sản Phẩm'}
            </Typography>
            <Box>
              {editItem?.id && (
                <TextField
                  label="ID"
                  value={editItem.id}
                  fullWidth
                  disabled
                  sx={{ mb: 2, backgroundColor: '#f5f5f5', borderRadius: '5px' }}
                />
              )}
              <TextField
                label="Tên Sản Phẩm"
                value={editItem?.name || ""}
                fullWidth
                sx={{ mb: 2 }}
                onChange={(e) => setEditItem({ ...editItem, name: e.target.value })}
              />
              <TextField
                label="Mô Tả"
                value={editItem?.description || ""}
                fullWidth
                multiline
                rows={3}
                sx={{ mb: 2 }}
                onChange={(e) => setEditItem({ ...editItem, description: e.target.value })}
              />
              <TextField
                label="Giá (VND)"
                value={editItem?.price}
                fullWidth
                type="number"
                sx={{ mb: 2 }}
                onChange={(e) => setEditItem({ ...editItem, price: parseFloat(e.target.value) })}
              />
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel sx={{ color: '#993300' }}>Danh Mục</InputLabel>
                <Select
                  value={editItem?.categoryId || ""}
                  label="Danh Mục"
                  onChange={(e) => setEditItem({ ...editItem, categoryId: e.target.value })}
                  sx={{
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#993300' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#b35900' },
                  }}
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Typography variant="h6" sx={{ mb: 1, color: '#993300' }}>
                Hình Ảnh
              </Typography>
              <Grid container spacing={2} sx={{ mb: 2 }}>
                {editItem?.imageUrls?.length > 0 ? (
                  editItem.imageUrls.map((url, index) => (
                    <Grid item xs={4} key={index}>
                      <Box
                        sx={{
                          position: 'relative',
                          width: '100%',
                          height: '100px',
                          '&:hover .edit-icon': { opacity: 1 },
                        }}
                      >
                        <CardMedia
                          component="img"
                          image={url}
                          alt={`Hình ảnh ${index + 1}`}
                          sx={{
                            width: '100%',
                            height: '100px',
                            objectFit: 'cover',
                            borderRadius: '5px',
                            cursor: 'pointer',
                          }}
                          onClick={() => document.getElementById(`replace-image-${index}`).click()}
                        />
                        <IconButton
                          className="edit-icon"
                          sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            opacity: 0,
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            color: 'white',
                            transition: 'opacity 0.2s ease-in-out',
                            '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.7)' },
                          }}
                          onClick={() => document.getElementById(`replace-image-${index}`).click()}
                        >
                          <Edit />
                        </IconButton>
                        <input
                          type="file"
                          id={`replace-image-${index}`}
                          style={{ display: 'none' }}
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, index)}
                        />
                      </Box>
                    </Grid>
                  ))
                ) : (
                  <Typography sx={{ color: '#993300' }}>Không có hình ảnh</Typography>
                )}
                <Grid item xs={4}>
                  <Box
                    sx={{
                      width: '100%',
                      height: '100px',
                      border: '2px dashed #993300',
                      borderRadius: '5px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      '&:hover': { backgroundColor: 'rgba(179, 89, 0, 0.1)' },
                    }}
                    onClick={() => document.getElementById('add-image').click()}
                  >
                    <Add sx={{ fontSize: 40, color: '#993300' }} />
                  </Box>
                  <input
                    type="file"
                    id="add-image"
                    multiple
                    style={{ display: 'none' }}
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e)}
                  />
                </Grid>
              </Grid>
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
          </Box>
        </Modal>

        {/* Dialog xác nhận xóa */}
        <Dialog
          open={confirmDeleteOpen}
          onClose={handleCloseConfirmDelete}
          sx={{ '& .MuiDialog-paper': { borderRadius: '12px' } }}
        >
          <DialogTitle sx={{ color: '#993300', fontWeight: 'bold' }}>
            Xác Nhận Xóa Sản Phẩm
          </DialogTitle>
          <DialogContent>
            <Typography sx={{ color: '#333' }}>
              Bạn có chắc chắn muốn xóa sản phẩm{" "}
              <strong>{productToDelete?.name}</strong> không?
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

export default ManageProducts;