import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Pagination,
  Modal,
  Snackbar,
  Alert,
  Rating,
  CardMedia,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Search, Add, Edit, Delete, Visibility } from "@mui/icons-material";
import { motion } from "framer-motion";
import AdminLayout from "./AdminLayout";
import api from "../../utils/api";

const ManageReviews = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [reviewPage, setReviewPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalReviewPages, setTotalReviewPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [openReviewModal, setOpenReviewModal] = useState(false);
  const [openUserModal, setOpenUserModal] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [reviewToDelete, setReviewToDelete] = useState(null);
  const [saving, setSaving] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [size] = useState(6);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch all reviews to get products with reviews
        const reviewResponse = await api.get("/reviews", {
          params: { page: 0, size: 1000 }, // Fetch a large number to get all reviews
        });
        const allReviews = reviewResponse.data.content || [];

        // Extract unique product IDs
        const productIds = [...new Set(allReviews.map((r) => r.productId))];

        // Fetch product details
        const productPromises = productIds.map((id) =>
          api.get(`/products/${id}`).then((res) => ({
            id,
            name: res.data.name,
            categoryId: res.data.categoryId,
            imageUrl: res.data.imageUrls?.[0] || "/default-product.png", // Assume imageUrl field
            reviewCount: allReviews.filter((r) => r.productId === id).length,
          }))
        );
        const productsData = await Promise.all(productPromises);

        // Fetch categories
        const categoryResponse = await api.get("/categories/get-all");
        setCategories(categoryResponse.data || []);

        setProducts(productsData);
      } catch (error) {
        setError("Không thể tải danh sách sản phẩm");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleOpenModal = (review = null) => {
    if (review) {
      setEditItem(review);
    } else {
      setEditItem({ rating: 0, comment: "", productId: "", userId: "" });
    }
    setOpenModal(true);
  };

  const handleOpenReviewModal = async (product) => {
    try {
      setSelectedProduct(product);
      setReviewPage(1);
      const response = await api.get(`/reviews/product/${product.id}`, {
        params: { page: 0, size },
      });
      setReviews(response.data.content || []);
      setTotalReviewPages(response.data.totalPages || 1);
      setOpenReviewModal(true);
    } catch (error) {
      setSnackbarMessage("Không thể tải đánh giá!");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleOpenUserModal = async (userId) => {
    try {
      // Kiểm tra userId hợp lệ
      if (!userId || isNaN(userId)) {
        throw new Error("ID người dùng không hợp lệ");
      }

      // Fetch user details
      const userResponse = await api.get(`/users/${userId}`);
      // Fetch user role
      const roleResponse = await api.get(`/auth/user/${userId}/role`);
      const roles = roleResponse.data.roles || [];
      const role = roles.length > 0 ? normalizeRole(roles[0]) : "User";

      setSelectedUser({
        id: userResponse.data.id,
        username: userResponse.data.username,
        email: userResponse.data.email,
        phoneNumber: userResponse.data.phoneNumber || "",
        address: userResponse.data.address || "",
        avatarUrl: userResponse.data.avatarUrl || "/default-avatar.png",
        role,
      });
      setOpenUserModal(true);
    } catch (error) {
      console.error("Lỗi khi lấy thông tin người dùng:", error);
      let errorMessage = "Không thể tải thông tin người dùng!";
      if (error.response?.status === 404) {
        errorMessage = "Người dùng không tồn tại!";
      } else if (error.message === "ID người dùng không hợp lệ") {
        errorMessage = "ID người dùng không hợp lệ!";
      }
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const normalizeRole = (role) => {
    if (role.toUpperCase() === "USER") return "User";
    if (role.toUpperCase() === "ADMIN") return "Admin";
    return role;
  };

  const handleReviewPageChange = async (event, value) => {
    try {
      setReviewPage(value);
      const response = await api.get(`/reviews/product/${selectedProduct.id}`, {
        params: { page: value - 1, size },
      });
      setReviews(response.data.content || []);
    } catch (error) {
      setSnackbarMessage("Không thể tải đánh giá!");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleSave = async () => {
    if (!editItem.rating || !editItem.comment) {
      setSnackbarMessage("Vui lòng điền đầy đủ thông tin!");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    try {
      setSaving(true);
      let response;
      if (editItem.id) {
        response = await api.put(`/reviews/${editItem.id}`, {
          rating: editItem.rating,
          comment: editItem.comment,
          productId: editItem.productId,
          userId: editItem.userId,
        });
        setReviews(reviews.map((r) => (r.id === editItem.id ? response.data : r)));
        setSnackbarMessage("Đánh giá đã được cập nhật!");
      } else {
        response = await api.post("/reviews", {
          rating: editItem.rating,
          comment: editItem.comment,
          productId: editItem.productId,
          userId: editItem.userId,
        });
        setReviews([...reviews, response.data]);
        setSnackbarMessage("Đánh giá đã được thêm!");
        // Update product review count
        setProducts(
          products.map((p) =>
            p.id === editItem.productId ? { ...p, reviewCount: p.reviewCount + 1 } : p
          )
        );
      }
      setOpenModal(false);
      setSnackbarSeverity("success");
    } catch (error) {
      setSnackbarMessage(error.response?.data?.message || "Không thể lưu đánh giá!");
      setSnackbarSeverity("error");
    } finally {
      setSaving(false);
      setSnackbarOpen(true);
    }
  };

  const handleOpenConfirmDelete = (reviewId) => {
    setReviewToDelete(reviewId);
    setConfirmDeleteOpen(true);
  };

  const handleCloseConfirmDelete = () => {
    setConfirmDeleteOpen(false);
    setReviewToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!reviewToDelete) return;

    try {
      await handleDelete(reviewToDelete);
      setConfirmDeleteOpen(false);
      setReviewToDelete(null);
    } catch (error) {
      console.error("Lỗi khi xóa đánh giá:", error);
      setSnackbarMessage(error.response?.data?.message || "Không thể xóa đánh giá!");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleDelete = async (reviewId) => {
    try {
      const review = reviews.find((r) => r.id === reviewId);
      await api.delete(`/reviews/${reviewId}`);
      setReviews(reviews.filter((r) => r.id !== reviewId));
      // Update product review count
      setProducts(
        products.map((p) =>
          p.id === review.productId
            ? { ...p, reviewCount: p.reviewCount - 1 }
            : p
        ).filter((p) => p.reviewCount > 0)
      );
      setSnackbarMessage("Đánh giá đã được xóa!");
      setSnackbarSeverity("success");
    } catch (error) {
      throw error; // Ném lỗi để handleConfirmDelete xử lý
    } finally {
      setSnackbarOpen(true);
    }
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toString().includes(searchTerm)
  );

  const totalItems = filteredProducts.length;
  const totalPagesCalc = Math.ceil(totalItems / size);
  const startIndex = (page - 1) * size;
  const endIndex = startIndex + size;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : "Không xác định";
  };

  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={{ minHeight: "100vh", padding: "20px" }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" sx={{ color: "#993300", fontWeight: "bold" }}>
            Quản Lý Đánh Giá
          </Typography>
          <Box display="flex" gap={2} alignItems="center">
            <TextField
              variant="outlined"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ color: "#993300" }} />,
                sx: {
                  backgroundColor: "#fff",
                  borderRadius: "20px",
                  "& .MuiOutlinedInput-root": { borderRadius: "20px" },
                  "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.9)" },
                },
              }}
              sx={{ width: "300px" }}
            />
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => handleOpenModal()}
              sx={{
                backgroundColor: "#993300",
                color: "white",
                borderRadius: "25px",
                padding: "10px 20px",
                "&:hover": { backgroundColor: "#b35900" },
              }}
            >
              Thêm Đánh Giá
            </Button>
          </Box>
        </Box>

        {loading ? (
          <Typography sx={{ color: "#993300", textAlign: "center" }}>
            Đang tải sản phẩm...
          </Typography>
        ) : error ? (
          <Typography sx={{ color: "#993300", textAlign: "center" }}>
            Lỗi: {error}
          </Typography>
        ) : (
          <>
            <TableContainer
              component={Paper}
              sx={{
                borderRadius: "12px",
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                backgroundColor: "#fff",
              }}
            >
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#993300" }}>
                    <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Hình Ảnh</TableCell>
                    <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>ID</TableCell>
                    <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Tên Sản Phẩm</TableCell>
                    <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Danh Mục</TableCell>
                    <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Số Đánh Giá</TableCell>
                    <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Hành Động</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {currentProducts.map((product) => (
                    <motion.tr
                      key={product.id}
                      whileHover={{ backgroundColor: "rgba(179, 89, 0, 0.1)", scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <TableCell>
                        <CardMedia
                          component="img"
                          image={product.imageUrl}
                          alt={product.name}
                          sx={{ width: 40, height: 40, borderRadius: "8px", objectFit: "cover" }}
                        />
                      </TableCell>
                      <TableCell>{product.id}</TableCell>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{getCategoryName(product.categoryId)}</TableCell>
                      <TableCell>{product.reviewCount}</TableCell>
                      <TableCell>
                        <Tooltip title="Xem đánh giá">
                          <IconButton
                            onClick={() => handleOpenReviewModal(product)}
                            sx={{ color: "#993300" }}
                          >
                            <Visibility />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Pagination
              count={totalPagesCalc}
              page={page}
              onChange={handlePageChange}
              sx={{
                display: "flex",
                justifyContent: "center",
                mt: 4,
                "& .MuiPaginationItem-root": {
                  color: "#993300",
                  borderColor: "#993300",
                },
                "& .Mui-selected": {
                  backgroundColor: "#993300 !important",
                  color: "white !important",
                },
                "& .MuiPaginationItem-root:hover": {
                  backgroundColor: "#b35900",
                  color: "white",
                },
              }}
            />
          </>
        )}

        {/* Modal thêm/chỉnh sửa đánh giá */}
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
              width: "500px",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Typography
              variant="h5"
              sx={{ mb: 2, color: "#993300", fontWeight: "bold" }}
            >
              {editItem?.id ? "Chỉnh Sửa Đánh Giá" : "Thêm Đánh Giá"}
            </Typography>
            <TextField
              label="ID Sản Phẩm"
              value={editItem?.productId || ""}
              fullWidth
              sx={{ mb: 2 }}
              onChange={(e) => setEditItem({ ...editItem, productId: e.target.value })}
            />
            <TextField
              label="ID Người Dùng"
              value={editItem?.userId || ""}
              fullWidth
              sx={{ mb: 2 }}
              onChange={(e) => setEditItem({ ...editItem, userId: e.target.value })}
            />
            <Rating
              value={editItem?.rating || 0}
              onChange={(e, newValue) => setEditItem({ ...editItem, rating: newValue })}
              precision={1}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Nội Dung"
              value={editItem?.comment || ""}
              fullWidth
              multiline
              rows={3}
              sx={{ mb: 2, minWidth: 200 }}
              onChange={(e) => setEditItem({ ...editItem, comment: e.target.value })}
            />
            <Box display="flex" justifyContent="flex-end" gap={2}>
              <Button
                variant="contained"
                onClick={handleSave}
                disabled={saving}
                sx={{
                  backgroundColor: "#993300",
                  color: "white",
                  borderRadius: "25px",
                  padding: "10px 20px",
                  "&:hover": { backgroundColor: "#b35900" },
                }}
              >
                {saving ? "Đang lưu..." : "Lưu"}
              </Button>
              <Button
                variant="outlined"
                onClick={() => setOpenModal(false)}
                sx={{
                  borderColor: "#993300",
                  color: "#993300",
                  borderRadius: "25px",
                  padding: "10px 20px",
                  "&:hover": { backgroundColor: "rgba(179, 89, 0, 0.1)" },
                }}
              >
                Hủy
              </Button>
            </Box>
          </Box>
        </Modal>

        {/* Modal hiển thị danh sách đánh giá */}
        <Modal
          open={openReviewModal}
          onClose={() => setOpenReviewModal(false)}
          sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <Box
            sx={{
              backgroundColor: "#fff",
              borderRadius: "12px",
              p: 4,
              width: "1000px",
              maxHeight: "80vh",
              overflowY: "auto",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Typography
              variant="h5"
              sx={{ mb: 2, color: "#993300", fontWeight: "bold" }}
            >
              Đánh Giá Sản Phẩm #{selectedProduct?.id}
            </Typography>
            {reviews.length > 0 ? (
              <>
                <TableContainer sx={{ borderRadius: "8px" }}>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                        <TableCell sx={{ fontWeight: "bold", color: "#993300" }}>
                          Người Dùng
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold", color: "#993300" }}>
                          Điểm
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold", color: "#993300" }}>
                          Nội Dung
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold", color: "#993300" }}>
                          Hành Động
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {reviews.map((review) => (
                        <TableRow key={review.id}>
                          <TableCell>
                            {review.userId}
                            <Tooltip title="Xem chi tiết người dùng">
                              <IconButton
                                onClick={() => handleOpenUserModal(review.userId)}
                                sx={{ color: "#993300", ml: 1 }}
                              >
                                <Visibility />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                          <TableCell>
                            <Rating value={review.rating} readOnly precision={1} />
                          </TableCell>
                          <TableCell>{review.comment}</TableCell>
                          <TableCell>
                            <Tooltip title="Chỉnh sửa">
                              <IconButton
                                onClick={() => {
                                  setOpenReviewModal(false);
                                  handleOpenModal(review);
                                }}
                                sx={{ color: "#993300" }}
                              >
                                <Edit />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Xóa">
                              <IconButton
                                onClick={() => handleOpenConfirmDelete(review.id)}
                                sx={{ color: "#e74c3c" }}
                              >
                                <Delete />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <Pagination
                  count={totalReviewPages}
                  page={reviewPage}
                  onChange={handleReviewPageChange}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    mt: 3,
                    "& .MuiPaginationItem-root": {
                      color: "#993300",
                      borderColor: "#993300",
                    },
                    "& .Mui-selected": {
                      backgroundColor: "#993300 !important",
                      color: "white !important",
                    },
                    "& .MuiPaginationItem-root:hover": {
                      backgroundColor: "#b35900",
                      color: "white",
                    },
                  }}
                />
              </>
            ) : (
              <Typography sx={{ color: "#993300" }}>
                Chưa có đánh giá nào cho sản phẩm này.
              </Typography>
            )}
            <Box display="flex" justifyContent="flex-end" mt={2}>
              <Button
                variant="outlined"
                onClick={() => setOpenReviewModal(false)}
                sx={{
                  borderColor: "#993300",
                  color: "#993300",
                  borderRadius: "25px",
                  padding: "10px 20px",
                  "&:hover": { backgroundColor: "rgba(179, 89, 0, 0.1)" },
                }}
              >
                Đóng
              </Button>
            </Box>
          </Box>
        </Modal>

        {/* Modal xác nhận xóa đánh giá */}
        <Dialog
          open={confirmDeleteOpen}
          onClose={handleCloseConfirmDelete}
          sx={{ "& .MuiDialog-paper": { borderRadius: "12px" } }}
        >
          <DialogTitle sx={{ color: "#993300", fontWeight: "bold" }}>
            Xác Nhận Xóa Đánh Giá
          </DialogTitle>
          <DialogContent>
            <Typography sx={{ color: "#333" }}>
              Bạn có chắc chắn muốn xóa đánh giá này không?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleCloseConfirmDelete}
              sx={{
                color: "#993300",
                textTransform: "none",
                "&:hover": { backgroundColor: "rgba(179, 89, 0, 0.1)" },
              }}
            >
              Không
            </Button>
            <Button
              onClick={handleConfirmDelete}
              variant="contained"
              sx={{
                backgroundColor: "#993300",
                color: "white",
                borderRadius: "25px",
                textTransform: "none",
                "&:hover": { backgroundColor: "#b35900" },
                transition: "background-color 0.3s ease",
              }}
            >
              Có
            </Button>
          </DialogActions>
        </Dialog>

        {/* Modal hiển thị chi tiết người dùng */}
        <Modal
          open={openUserModal}
          onClose={() => setOpenUserModal(false)}
          sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <Box
            sx={{
              backgroundColor: "#fff",
              borderRadius: "12px",
              p: 4,
              width: "400px",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Typography
              variant="h5"
              sx={{ mb: 2, color: "#993300", fontWeight: "bold" }}
            >
              Chi Tiết Người Dùng
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
              <CardMedia
                component="img"
                image={selectedUser?.avatarUrl}
                alt={selectedUser?.username}
                sx={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover" }}
              />
            </Box>
            <TextField
              label="ID"
              value={selectedUser?.id || ""}
              InputProps={{ readOnly: true }}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Tên Người Dùng"
              value={selectedUser?.username || ""}
              InputProps={{ readOnly: true }}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Email"
              value={selectedUser?.email || ""}
              InputProps={{ readOnly: true }}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Số Điện Thoại"
              value={selectedUser?.phoneNumber || ""}
              InputProps={{ readOnly: true }}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Địa Chỉ"
              value={selectedUser?.address || ""}
              InputProps={{ readOnly: true }}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Vai Trò"
              value={selectedUser?.role || ""}
              InputProps={{ readOnly: true }}
              fullWidth
              sx={{ mb: 2 }}
            />
            <Box display="flex" justifyContent="flex-end">
              <Button
                variant="outlined"
                onClick={() => setOpenUserModal(false)}
                sx={{
                  borderColor: "#993300",
                  color: "#993300",
                  borderRadius: "25px",
                  padding: "10px 20px",
                  "&:hover": { backgroundColor: "rgba(179, 89, 0, 0.1)" },
                }}
              >
                Đóng
              </Button>
            </Box>
          </Box>
        </Modal>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            severity={snackbarSeverity}
            sx={{
              width: "100%",
              "& .MuiAlert-message": { fontWeight: "bold" },
              backgroundColor: snackbarSeverity === "success" ? "#993300" : "#e74c3c",
              color: "white",
            }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </motion.div>
    </AdminLayout>
  );
};

export default ManageReviews;