import React, { useState, useEffect } from "react";
import {
  Box, Typography, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Tooltip, Pagination, Modal, Grid, CardMedia, Select, MenuItem, InputLabel, FormControl,
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
  const size = 6;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const productResponse = await api.get('/products/get-all');
        console.log("Danh sách sản phẩm:", productResponse.data);
        setProducts(productResponse.data || []);
        const categoryResponse = await api.get('/categories/get-all');
        console.log("Danh sách danh mục:", categoryResponse.data);
        setCategories(categoryResponse.data || []);
      } catch (error) {
        setError("Không thể tải dữ liệu");
        console.error("Lỗi khi lấy dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleOpenModal = (item = null) => {
    console.log("Mở modal với sản phẩm:", item);
    setEditItem(item);
    setNewImageFiles([]);
    setOpenModal(true);
  };

  const handleDelete = (id) => {
    console.log("Xóa sản phẩm với ID:", id);
    setProducts(products.filter(p => p.id !== id));
  };

  const handlePageChange = (event, value) => {
    console.log("Chuyển trang:", value);
    setPage(value);
  };

  const handleImageUpload = (e, index = null) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      console.log("Tải lên hình ảnh:", file.name, "tại vị trí:", index);
      const newImageUrls = [...(editItem.imageUrls || [])];
      const updatedFiles = [...newImageFiles];

      if (index !== null) {
        newImageUrls[index] = imageUrl;
        updatedFiles[index] = file;
      } else {
        newImageUrls.push(imageUrl);
        updatedFiles.push(file);
      }

      setEditItem({ ...editItem, imageUrls: newImageUrls });
      setNewImageFiles(updatedFiles);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      console.log("Bắt đầu lưu sản phẩm:", editItem);
  
      const productRequest = {
        name: editItem.name,
        description: editItem.description,
        price: parseFloat(editItem.price),
        categoryId: parseInt(editItem.categoryId),
        imageUrls: editItem.imageUrls.filter(url => !url.startsWith("blob:")), // Giữ URL cũ
      };
      console.log("Dữ liệu sản phẩm JSON:", productRequest);
  
      const formData = new FormData();
      formData.append("product", JSON.stringify(productRequest));
  
      // Thêm các tệp ảnh mới
      newImageFiles.forEach((file, index) => {
        if (file) {
          formData.append("images", file);
          console.log(`Hình ảnh mới ${index}:`, file.name);
        }
      });
  
      const response = await api.put(`/products/update/${editItem.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Kết quả từ API:", response.data);
  
      // Cập nhật state với dữ liệu từ server
      setProducts(products.map(p => (p.id === editItem.id ? response.data : p)));
      setOpenModal(false);
    } catch (error) {
      setError("Không thể cập nhật sản phẩm");
      console.error("Lỗi khi cập nhật sản phẩm:", error);
    } finally {
      setSaving(false);
      console.log("Hoàn tất quá trình lưu");
    }
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

        {loading ? (
          <Typography>Đang tải sản phẩm...</Typography>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#2c3e50" }}>
                    <TableCell sx={{ color: "#fff" }}>ID</TableCell>
                    <TableCell sx={{ color: "#fff" }}>Hình Ảnh</TableCell>
                    <TableCell sx={{ color: "#fff" }}>Tên</TableCell>
                    <TableCell sx={{ color: "#fff" }}>Giá</TableCell>
                    <TableCell sx={{ color: "#fff" }}>Danh Mục</TableCell>
                    <TableCell sx={{ color: "#fff" }}>Hành Động</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {currentProducts.map((product) => (
                    <motion.tr
                      key={product.id}
                      whileHover={{ backgroundColor: "#f5f5f5" }}
                      sx={{ "&:hover": { "& td": { fontWeight: "bold" } } }}
                    >
                      <TableCell>{product.id}</TableCell>
                      <TableCell>
                        {product.imageUrls && product.imageUrls.length > 0 ? (
                          <img
                            src={product.imageUrls[0]}
                            alt={product.name}
                            style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "4px" }}
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

            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              sx={{
                display: "flex",
                justifyContent: "center",
                mt: 4,
                "& .MuiPaginationItem-root": { color: "#993300", borderColor: "#993300" },
                "& .Mui-selected": { backgroundColor: "#993300 !important", color: "white !important" },
                "& .MuiPaginationItem-root:hover": { backgroundColor: "#b35900", color: "white" },
              }}
            />
          </>
        )}

        {/* Modal chỉnh sửa sản phẩm */}
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
              width: "600px",
              maxHeight: "80vh",
              overflowY: "auto",
              boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
            }}
          >
            <Typography variant="h5" sx={{ mb: 2, color: "#2c3e50", fontWeight: "bold" }}>
              {editItem ? "Chỉnh Sửa Sản Phẩm" : "Thêm Sản Phẩm"}
            </Typography>
            {editItem ? (
              <Box>
                <TextField
                  label="ID"
                  value={editItem.id}
                  fullWidth
                  disabled
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="Tên Sản Phẩm"
                  defaultValue={editItem.name}
                  fullWidth
                  sx={{ mb: 2 }}
                  onChange={(e) => setEditItem({ ...editItem, name: e.target.value })} // Sửa lỗi: dùng editItem thay vì item
                />
                <TextField
                  label="Mô Tả"
                  defaultValue={editItem.description}
                  fullWidth
                  multiline
                  rows={3}
                  sx={{ mb: 2 }}
                  onChange={(e) => setEditItem({ ...editItem, description: e.target.value })}
                />
                <TextField
                  label="Giá (VND)"
                  defaultValue={editItem.price}
                  fullWidth
                  type="number"
                  sx={{ mb: 2 }}
                  onChange={(e) => setEditItem({ ...editItem, price: parseFloat(e.target.value) })}
                />
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Danh Mục</InputLabel>
                  <Select
                    value={editItem.categoryId}
                    label="Danh Mục"
                    onChange={(e) => setEditItem({ ...editItem, categoryId: e.target.value })}
                  >
                    {categories.map((cat) => (
                      <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Typography variant="h6" sx={{ mb: 1, color: "#2c3e50" }}>
                  Hình Ảnh
                </Typography>
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  {editItem.imageUrls && editItem.imageUrls.length > 0 ? (
                    editItem.imageUrls.map((url, index) => (
                      <Grid item xs={4} key={index}>
                        <Box
                          sx={{
                            position: "relative",
                            width: "100%",
                            height: "100px",
                            "&:hover .edit-icon": { opacity: 1 },
                          }}
                        >
                          <CardMedia
                            component="img"
                            image={url}
                            alt={`Hình ảnh ${index + 1}`}
                            sx={{
                              width: "100%",
                              height: "100px",
                              objectFit: "cover",
                              borderRadius: "4px",
                              cursor: "pointer",
                            }}
                            onClick={() => document.getElementById(`replace-image-${index}`).click()}
                          />
                          <IconButton
                            className="edit-icon"
                            sx={{
                              position: "absolute",
                              top: "50%",
                              left: "50%",
                              transform: "translate(-50%, -50%)",
                              opacity: 0,
                              backgroundColor: "rgba(0, 0, 0, 0.5)",
                              color: "white",
                              transition: "opacity 0.2s ease-in-out",
                              "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.7)" },
                            }}
                            onClick={() => document.getElementById(`replace-image-${index}`).click()}
                          >
                            <Edit />
                          </IconButton>
                          <input
                            type="file"
                            id={`replace-image-${index}`}
                            style={{ display: "none" }}
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, index)}
                          />
                        </Box>
                      </Grid>
                    ))
                  ) : (
                    <Typography>Không có hình ảnh</Typography>
                  )}
                  <Grid item xs={4}>
                    <Box
                      sx={{
                        width: "100%",
                        height: "100px",
                        border: "2px dashed #ccc",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        borderRadius: "4px",
                      }}
                      onClick={() => document.getElementById("add-image").click()}
                    >
                      <Add sx={{ fontSize: 40, color: "#3498db" }} />
                    </Box>
                    <input
                      type="file"
                      id="add-image"
                      style={{ display: "none" }}
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e)}
                    />
                  </Grid>
                </Grid>
                <Box display="flex" justifyContent="flex-end" gap={2}>
                  <Button
                    variant="contained"
                    onClick={handleSave}
                    sx={{ backgroundColor: "#3498db" }}
                    disabled={saving}
                  >
                    {saving ? "Đang lưu..." : "Lưu"}
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => setOpenModal(false)}
                    sx={{ borderColor: "#e74c3c", color: "#e74c3c" }}
                  >
                    Hủy
                  </Button>
                </Box>
              </Box>
            ) : (
              <Typography>Chức năng thêm sản phẩm chưa được triển khai</Typography>
            )}
          </Box>
        </Modal>
      </motion.div>
    </AdminLayout>
  );
};

export default ManageProducts;