import React, { useState } from "react";
import { jwtDecode } from "jwt-decode";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  Alert,
  Paper,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import backgroundImage from "../../image/background.jpg";
import api from "../../utils/api";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
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

      // Kiểm tra xem roles có chứa "ADMIN" không
      const roles = decoded.roles || []; // Đảm bảo roles là mảng, nếu không thì dùng mảng rỗng
      if (!roles.includes("ADMIN")) {
        setError("Bạn không có quyền truy cập trang quản trị!");
        return;
      }

      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("refreshToken", response.data.refreshToken);
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: decoded.id,
          username: decoded.username,
          roles: roles, // Lưu cả roles vào localStorage nếu cần
        })
      );

      navigate("/admin/dashboard");
    } catch (error) {
      console.error("Lỗi đăng nhập:", error.response);
      setError(error.response?.data?.message || "Đăng nhập thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 2,
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Container maxWidth="xs">
        <Paper
          elevation={6}
          sx={{
            padding: 4,
            borderRadius: "12px",
            backgroundColor: "white",
            maxWidth: "380px",
            boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.2)",
            transition: "all 0.3s ease-in-out",
            "&:hover": {
              transform: "scale(1.03)",
              boxShadow: "0px 12px 32px rgba(0, 0, 0, 0.3)",
            },
          }}
        >
          <Typography
            variant="h5"
            component="h1"
            align="center"
            gutterBottom
            sx={{ fontWeight: "bold", color: "#993300" }}
          >
            Đăng Nhập Quản Trị
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Tên đăng nhập"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              margin="normal"
              required
              sx={{
                borderRadius: 6,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 6,
                },
              }}
            />
            <TextField
              fullWidth
              label="Mật khẩu"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
              sx={{
                borderRadius: 6,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 6,
                },
              }}
            />

            <Grid container alignItems="center" justifyContent="space-between" sx={{ mt: 1, mb: 2 }}>
              <Grid item>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      sx={{ color: "#993300" }}
                    />
                  }
                  label="Ghi nhớ tôi"
                  sx={{ color: "#993300" }}
                />
              </Grid>
            </Grid>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 1,
                mb: 2,
                backgroundColor: "#993300",
                color: "white",
                fontWeight: "bold",
                borderRadius: 4,
                "&:hover": { backgroundColor: "#7A2600" },
              }}
            >
              Đăng Nhập
            </Button>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default AdminLogin;