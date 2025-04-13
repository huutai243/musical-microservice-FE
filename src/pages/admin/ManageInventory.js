import React, { useState, useEffect } from "react";
import {
  Box, Typography, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Tooltip, Pagination, Modal, FormControl, InputLabel, Select, MenuItem, Snackbar, Alert,
} from "@mui/material";
import { Search, Add, Edit } from "@mui/icons-material";
import { motion } from "framer-motion";
import AdminLayout from "./AdminLayout";
import api from '../../utils/api';

const ManageInventory = () => {
  const [inventory, setInventory] = useState([]);
  const [products, setProducts] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
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
    const fetchData = async () => {
      try {
        setLoading(true);
        // Lấy danh sách sản phẩm
        const productResponse = await api.get('/products/get-all');
        const productsData = productResponse.data || [];
        setProducts(productsData);

        // Lấy số lượng tồn kho cho từng sản phẩm
        const inventoryData = await Promise.all(
          productsData.map(async (product) => {
            try {
              const stock = await api.get(`/inventory/${product.id}`);
              return {
                id: product.id,
                productId: product.id,
                productName: product.name,
                quantity: stock.data || 0,
                lastUpdated: new Date().toISOString().split('T')[0], // Giả lập ngày cập nhật
              };
            } catch (err) {
              return null;
            }
          })
        );
        setInventory(inventoryData.filter(item => item !== null));
      } catch (error) {
        setError("Không thể tải dữ liệu kho hàng");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleOpenModal = (item = null) => {
    setEditItem(item || { productId: "", productName: "", quantity: 0 });
    setOpenModal(true);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      // Cập nhật số lượng tồn kho
      await api.post(`/inventory/${editItem.productId}/update-quantity`, null, {
        params: { quantity: editItem.quantity },
      });

      // Cập nhật danh sách client-side
      if (inventory.find(i => i.productId === editItem.productId)) {
        setInventory(
          inventory.map(i =>
            i.productId === editItem.productId
              ? { ...i, quantity: editItem.quantity, lastUpdated: new Date().toISOString().split('T')[0] }
              : i
          )
        );
        setSnackbarMessage("Số lượng tồn kho đã được cập nhật thành công!");
      } else {
        const product = products.find(p => p.id === editItem.productId);
        setInventory([
          ...inventory,
          {
            id: editItem.productId,
            productId: editItem.productId,
            productName: product?.name || "Unknown",
            quantity: editItem.quantity,
            lastUpdated: new Date().toISOString().split('T')[0],
          },
        ]);
        setSnackbarMessage("Sản phẩm đã được thêm vào kho thành công!");
      }

      setOpenModal(false);
      setSnackbarSeverity("success");
    } catch (error) {
      setSnackbarMessage(error.response?.data?.message || "Không thể cập nhật kho hàng!");
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

  const filteredInventory = inventory.filter(i =>
    i.productName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalItems = filteredInventory.length;
  const totalPages = Math.ceil(totalItems / size);
  const startIndex = (page - 1) * size;
  const endIndex = startIndex + size;
  const currentInventory = filteredInventory.slice(startIndex, endIndex);

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
            Quản Lý Kho Hàng
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
              Thêm Vào Kho
            </Button>
          </Box>
        </Box>

        {/* Bảng kho hàng */}
        {loading ? (
          <Typography sx={{ color: '#993300', textAlign: 'center' }}>
            Đang tải kho hàng...
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
                    <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Sản Phẩm</TableCell>
                    <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Số Lượng</TableCell>
                    <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Cập Nhật Lần Cuối</TableCell>
                    <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Hành Động</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {currentInventory.map((item) => (
                    <motion.tr
                      key={item.id}
                      whileHover={{ backgroundColor: 'rgba(179, 89, 0, 0.1)', scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <TableCell>{item.id}</TableCell>
                      <TableCell>{item.productName}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{item.lastUpdated}</TableCell>
                      <TableCell>
                        <Tooltip title="Chỉnh sửa">
                          <IconButton
                            onClick={() => handleOpenModal(item)}
                            sx={{ color: '#993300' }}
                          >
                            <Edit />
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

        {/* Modal thêm/chỉnh sửa kho hàng */}
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
              {editItem?.id ? 'Cập Nhật Tồn Kho' : 'Thêm Vào Kho'}
            </Typography>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel sx={{ color: '#993300' }}>Sản Phẩm</InputLabel>
              <Select
                value={editItem?.productId || ""}
                onChange={(e) => {
                  const product = products.find(p => p.id === e.target.value);
                  setEditItem({
                    ...editItem,
                    productId: e.target.value,
                    productName: product?.name || "",
                  });
                }}
                disabled={editItem?.id}
                sx={{
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#993300' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#b35900' },
                }}
              >
                {products.map((product) => (
                  <MenuItem key={product.id} value={product.id}>
                    {product.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Số Lượng"
              type="number"
              value={editItem?.quantity || 0}
              onChange={(e) => setEditItem({ ...editItem, quantity: parseInt(e.target.value) || 0 })}
              fullWidth
              sx={{ mb: 2 }}
            />
            <Box display="flex" justifyContent="flex-end" gap={2}>
              <Button
                variant="contained"
                onClick={handleSave}
                disabled={saving || !editItem?.productId || editItem?.quantity < 0}
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

export default ManageInventory;