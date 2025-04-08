import React, { useState } from "react";
import {
  Container, Typography, TextField, Button, Box, Alert, Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import backgroundImage from "../../image/background.jpg"; // Giả định có ảnh nền
import api from "../../utils/api";
import { jwtDecode } from "jwt-decode";
import { motion } from "framer-motion";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Vui lòng nhập tên đăng nhập và mật khẩu.");
      return;
    }

    try {
      const response = await api.post("/auth/login", { username, password });
      const decoded = jwtDecode(response.data.accessToken);
      if (decoded.role !== "Admin") {
        setError("Bạn không có quyền truy cập trang quản trị!");
        return;
      }
      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("refreshToken", response.data.refreshToken);
      localStorage.setItem("user", JSON.stringify({ id: decoded.id, username: decoded.username, role: decoded.role }));
      navigate("/admin/dashboard");
    } catch (error) {
      setError(error.response?.data?.message || "Đăng nhập thất bại!");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Container maxWidth="xs">
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <Paper
            elevation={10}
            sx={{
              p: 4,
              borderRadius: "15px",
              background: "rgba(255, 255, 255, 0.95)",
              boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
            }}
          >
            <Typography variant="h5" align="center" gutterBottom sx={{ fontWeight: "bold", color: "#2c3e50" }}>
              Đăng Nhập Quản Trị
            </Typography>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Tên đăng nhập"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                margin="normal"
                required
                variant="outlined"
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
              />
              <TextField
                fullWidth
                label="Mật khẩu"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                margin="normal"
                required
                variant="outlined"
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
              />
              <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, backgroundColor: "#2c3e50", "&:hover": { backgroundColor: "#1a252f" }, borderRadius: "10px" }}
                >
                  Đăng Nhập
                </Button>
              </motion.div>
            </form>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default AdminLogin;