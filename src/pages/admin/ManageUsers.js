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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  CardMedia,
} from "@mui/material";
import { Search, Add, Edit, Delete } from "@mui/icons-material";
import { motion } from "framer-motion";
import AdminLayout from "./AdminLayout";
import api from "../../utils/api";

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

  const normalizeRole = (role) => {
    if (role.toUpperCase() === "USER") return "User";
    if (role.toUpperCase() === "ADMIN") return "Admin";
    return role;
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await api.get("/users/all");
        console.log("Danh sách người dùng:", response.data);

        // Lấy vai trò cho từng người dùng
        const usersWithRoles = await Promise.all(
          response.data.map(async (user) => {
            try {
              const roleResponse = await api.get(`/auth/user/${user.id}/role`);
              const roles = roleResponse.data.roles || [];
              // Lấy vai trò đầu tiên (giả sử mỗi người dùng chỉ có 1 vai trò)
              const role = roles.length > 0 ? normalizeRole(roles[0]) : "User";
              return { ...user, role };
            } catch (error) {
              console.error(`Lỗi khi lấy vai trò cho người dùng ${user.id}:`, error);
              return { ...user, role: "User" }; // Giá trị mặc định nếu lỗi
            }
          })
        );

        setUsers(usersWithRoles || []);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách người dùng:", error);
        setError("Không thể tải danh sách người dùng");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    return () => {
      if (editItem?.avatarUrl && editItem.avatarUrl.startsWith("blob:")) {
        URL.revokeObjectURL(editItem.avatarUrl);
      }
    };
  }, [editItem]);

  const handleOpenModal = async (item = null) => {
    if (item && item.id) {
      try {
        // Lấy thông tin người dùng
        const userResponse = await api.get(`/users/${item.id}`);
        console.log("Thông tin người dùng:", userResponse.data);

        // Lấy vai trò của người dùng
        const roleResponse = await api.get(`/auth/user/${item.id}/role`);
        const roles = roleResponse.data.roles || [];
        const role = roles.length > 0 ? normalizeRole(roles[0]) : "User";

        setEditItem({
          id: userResponse.data.id,
          username: userResponse.data.username,
          email: userResponse.data.email,
          phoneNumber: userResponse.data.phoneNumber || "",
          address: userResponse.data.address || "",
          avatarUrl: userResponse.data.avatarUrl || "",
          role: role,
          avatarFile: null,
        });
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng hoặc vai trò:", error);
        setSnackbarMessage("Không thể tải thông tin người dùng!");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        return;
      }
    } else {
      setEditItem({
        username: "",
        email: "",
        password: "",
        phoneNumber: "",
        address: "",
        avatarUrl: "",
        role: "User",
        avatarFile: null,
      });
    }
    setOpenModal(true);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (["image/jpeg", "image/png"].includes(file.type)) {
        const tempUrl = URL.createObjectURL(file);
        setEditItem({
          ...editItem,
          avatarFile: file,
          avatarUrl: tempUrl,
        });
      } else {
        setSnackbarMessage("Vui lòng chọn file ảnh JPEG hoặc PNG!");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    }
  };

  const handleSave = async () => {
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
      console.log("Dữ liệu gửi đi:", editItem);
      const apiRole = editItem.role.toUpperCase();
      if (editItem.id) {
        // Cập nhật profile của user (phoneNumber, address)
        await api.put(`/users/update-profile/${editItem.id}`, {
          phoneNumber: editItem.phoneNumber,
          address: editItem.address,
        });

        // Cập nhật vai trò của user
        await api.put(`/auth/users/change-role`, {
          userId: editItem.id,
          newRole: apiRole,
        });

        // Cập nhật avatar của user
        if (editItem.avatarFile) {
          const formData = new FormData();
          formData.append("image", editItem.avatarFile);
          formData.append("userId", editItem.id.toString()); // Gửi userId dưới dạng chuỗi
          console.log("FormData gửi đi:", [...formData.entries()]); // Log nội dung FormData
          response = await api.put(`/users/update-avatar`, formData); // Loại bỏ header Content-Type
          console.log("Phản hồi từ update-avatar:", response.data);
        } else {
          response = await api.get(`/users/${editItem.id}`);
        }

        console.log("Dữ liệu người dùng sau cập nhật:", response.data);
        setUsers(users.map((u) => (u.id === editItem.id ? { ...response.data, role: editItem.role } : u)));
        setSnackbarMessage("Người dùng đã được cập nhật thành công!");
      } else {
        // Tạo người dùng mới
        response = await api.post("/users/create", {
          username: editItem.username,
          email: editItem.email,
          password: editItem.password,
          role: apiRole,
        });

        // Cập nhật vai trò cho người dùng mới
        await api.post(`/auth/users/change-role`, {
          userId: response.data.id,
          newRole: apiRole,
        });

        // Cập nhật avatar cho người dùng mới
        if (editItem.avatarFile) {
          const formData = new FormData();
          formData.append("image", editItem.avatarFile);
          formData.append("userId", response.data.id.toString()); // Gửi userId dưới dạng chuỗi
          console.log("FormData gửi đi:", [...formData.entries()]); // Log nội dung FormData
          await api.put(`/users/update-avatar`, formData); // Loại bỏ header Content-Type
        }

        const newUserResponse = await api.get(`/users/${response.data.id}`);
        console.log("Người dùng mới:", newUserResponse.data);
        setUsers([...users, { ...newUserResponse.data, role: editItem.role }]);
        setSnackbarMessage("Người dùng đã được tạo thành công!");
      }

      setOpenModal(false);
      setSnackbarSeverity("success");
    } catch (error) {
      console.error("Lỗi khi lưu người dùng:", error);
      console.error("Chi tiết lỗi:", error.response?.data);
      let errorMessage = "Không thể lưu người dùng! Vui lòng thử lại.";
      if (error.response) {
        if (error.response.status === 403) {
          errorMessage = "Bạn không có quyền thực hiện hành động này!";
        } else if (error.response.status === 400) {
          errorMessage = error.response.data.message || "Dữ liệu không hợp lệ!";
        } else if (error.response.status === 404) {
          errorMessage = "Người dùng không tồn tại!";
        }
      }
      setSnackbarMessage(errorMessage);
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
      console.log("Xóa người dùng:", userToDelete);
      await api.delete(`/users/${userToDelete.id}`);
      setUsers(users.filter((u) => u.id !== userToDelete.id));
      setSnackbarMessage("Người dùng đã được xóa thành công!");
      setSnackbarSeverity("success");
    } catch (error) {
      console.error("Lỗi khi xóa người dùng:", error);
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

  const filteredUsers = users.filter((u) =>
    u.username.toLowerCase().includes(searchTerm.toLowerCase())
  );
  console.log("Danh sách người dùng sau lọc:", filteredUsers);
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
        style={{ minHeight: "100vh", padding: "20px" }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" sx={{ color: "#993300", fontWeight: "bold" }}>
            Quản Lý Người Dùng
          </Typography>
          <Box display="flex" gap={2} alignItems="center">
            <TextField
              variant="outlined"
              placeholder="Tìm kiếm người dùng..."
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
                textTransform: "none",
                fontSize: "1rem",
                "&:hover": { backgroundColor: "#b35900" },
                transition: "background-color 0.3s ease",
              }}
            >
              Thêm Người Dùng
            </Button>
          </Box>
        </Box>

        {loading ? (
          <Typography sx={{ color: "#993300", textAlign: "center" }}>
            Đang tải người dùng...
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
                    <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Avatar</TableCell>
                    <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                      Tên Người Dùng
                    </TableCell>
                    <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Email</TableCell>
                    <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Vai Trò</TableCell>
                    <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Hành Động</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {currentUsers.map((user) => (
                    <motion.tr
                      key={user.id}
                      whileHover={{ backgroundColor: "rgba(179, 89, 0, 0.1)", scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <TableCell>
                        <CardMedia
                          component="img"
                          image={user.avatarUrl || "/default-avatar.png"}
                          alt={user.username}
                          sx={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover" }}
                        />
                      </TableCell>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>
                        <Tooltip title="Chỉnh sửa">
                          <IconButton
                            onClick={() => handleOpenModal(user)}
                            sx={{ color: "#993300" }}
                          >
                            <Edit />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Xóa">
                          <IconButton
                            onClick={() => handleOpenConfirmDelete(user)}
                            sx={{ color: "#e74c3c" }}
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

            <Pagination
              count={totalPages}
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
              width: "400px",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Typography
              variant="h5"
              sx={{ mb: 2, color: "#993300", fontWeight: "bold" }}
            >
              {editItem?.id ? "Chỉnh Sửa Người Dùng" : "Thêm Người Dùng"}
            </Typography>
            {editItem?.id && (
              <TextField
                label="ID"
                value={editItem?.id || ""}
                InputProps={{ readOnly: true }}
                fullWidth
                sx={{ mb: 2 }}
              />
            )}
            <Box
              sx={{
                position: "relative",
                width: 80,
                height: 80,
                mb: 2,
                "&:hover .edit-icon": { opacity: 1 },
              }}
            >
              <CardMedia
                component="img"
                image={editItem?.avatarUrl || "/default-avatar.png"}
                alt={editItem?.username || "User"}
                sx={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover" }}
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
                onClick={() => document.getElementById("avatar-input").click()}
              >
                <Edit />
              </IconButton>
              <input
                type="file"
                id="avatar-input"
                hidden
                accept="image/jpeg,image/png"
                onChange={handleAvatarChange}
              />
            </Box>
            <TextField
              label="Tên Người Dùng"
              value={editItem?.username || ""}
              onChange={(e) => setEditItem({ ...editItem, username: e.target.value })}
              fullWidth
              sx={{ mb: 2 }}
              disabled={editItem?.id}
            />
            <TextField
              label="Email"
              type="email"
              value={editItem?.email || ""}
              onChange={(e) => setEditItem({ ...editItem, email: e.target.value })}
              fullWidth
              sx={{ mb: 2 }}
              disabled={editItem?.id}
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
            <TextField
              label="Số Điện Thoại"
              value={editItem?.phoneNumber || ""}
              onChange={(e) => setEditItem({ ...editItem, phoneNumber: e.target.value })}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Địa Chỉ"
              value={editItem?.address || ""}
              onChange={(e) => setEditItem({ ...editItem, address: e.target.value })}
              fullWidth
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel sx={{ color: "#993300" }}>Vai Trò</InputLabel>
              <Select
                value={editItem?.role || "User"}
                onChange={(e) => setEditItem({ ...editItem, role: e.target.value })}
                sx={{
                  "& .MuiOutlinedInput-notchedOutline": { borderColor: "#993300" },
                  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#b35900" },
                }}
              >
                <MenuItem value="Admin">Admin</MenuItem>
                <MenuItem value="User">Người Dùng</MenuItem>
              </Select>
            </FormControl>
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
                  transition: "background-color 0.3s ease",
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
                  transition: "background-color 0.3s ease",
                }}
              >
                Hủy
              </Button>
            </Box>
          </Box>
        </Modal>

        <Dialog
          open={confirmDeleteOpen}
          onClose={handleCloseConfirmDelete}
          sx={{ "& .MuiDialog-paper": { borderRadius: "12px" } }}
        >
          <DialogTitle sx={{ color: "#993300", fontWeight: "bold" }}>
            Xác Nhận Xóa Người Dùng
          </DialogTitle>
          <DialogContent>
            <Typography sx={{ color: "#333" }}>
              Bạn có chắc chắn muốn xóa người dùng{" "}
              <strong>{userToDelete?.username}</strong> không?
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

export default ManageUsers;