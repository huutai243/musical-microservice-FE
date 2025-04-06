import React from "react";
import { Box, Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { keyframes } from "@emotion/react";

// Animation keyframes
const zoomIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.5);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const SuccessPopup = ({ message, onClose }) => {
  return (
    <Box
      sx={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)", // Căn giữa màn hình
        width: "400px",
        height:"250px",
        backgroundColor: "white",
        borderRadius: "16px",
        boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "12px",
        zIndex: 1300,
      }}
    >
      {/* Icon dấu tích */}
      <CheckCircleIcon
        sx={{
          fontSize: "48px",
          color: "#4CAF50", // Màu xanh dương giống hình
          animation: "bounce 0.5s ease", // Hiệu ứng nảy lên
          "@keyframes bounce": {
            "0%": { transform: "translateY(0)" },
            "50%": { transform: "translateY(-10px)" },
            "100%": { transform: "translateY(0)" },
          },
        }}
      />

      {/* Nội dung thông báo */}
      <Typography
        variant="h6"
        sx={{
          color: "#333",
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        {message || "Completed"}
      </Typography>
    </Box>
  );
};

export default SuccessPopup;