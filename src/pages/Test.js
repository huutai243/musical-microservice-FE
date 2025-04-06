import React, { useState } from "react";
import { Box, Button, Container, Typography } from "@mui/material";
import SuccessPopup from "../components/SuccessPopup"; // Đường dẫn tới file SuccessPopup
import ErrorPopup from "../components/ErrorPopup"; // Đường dẫn tới file ErrorPopup

const Test = () => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  // Hàm xử lý khi nhấn nút Success
  const handleShowSuccess = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000); // Tự động ẩn sau 3 giây
  };

  // Hàm xử lý khi nhấn nút Error
  const handleShowError = () => {
    setShowError(true);
    setTimeout(() => setShowError(false), 3000); // Tự động ẩn sau 3 giây
  };

  return (
    <Container
      maxWidth="lg"
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(to right, #f0f0f0, #e0e0e0)", // Giữ phong cách với Home
      }}
    >
      {/* Tiêu đề */}
      <Typography variant="h4" sx={{ color: "#993300", marginBottom: "40px" }}>
        Test Popup Components
      </Typography>

      {/* Hai nút */}
      <Box sx={{ display: "flex", gap: "20px" }}>
        <Button
          variant="contained"
          onClick={handleShowSuccess}
          sx={{
            backgroundColor: "#4CAF50", // Màu xanh lá
            color: "white",
            padding: "10px 20px",
            borderRadius: "8px",
            "&:hover": {
              backgroundColor: "#45a049",
              transform: "scale(1.05)", // Phóng to nhẹ khi hover
              transition: "transform 0.3s ease",
            },
          }}
        >
          Show Success Popup
        </Button>

        <Button
          variant="contained"
          onClick={handleShowError}
          sx={{
            backgroundColor: "#f44336", // Màu đỏ
            color: "white",
            padding: "10px 20px",
            borderRadius: "8px",
            "&:hover": {
              backgroundColor: "#d32f2f",
              transform: "scale(1.05)", // Phóng to nhẹ khi hover
              transition: "transform 0.3s ease",
            },
          }}
        >
          Show Error Popup
        </Button>
      </Box>

      {/* Hiển thị Popup */}
      {showSuccess && (
        <SuccessPopup
          message="Thành công!"
          onClose={() => setShowSuccess(false)}
        />
      )}
      {showError && (
        <ErrorPopup
          message="Lỗi! Có vấn đề xảy ra."
          onClose={() => setShowError(false)}
        />
      )}
    </Container>
  );
};

export default Test;