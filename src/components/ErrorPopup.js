import React from "react";
import { Box, Typography } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
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

const ErrorPopup = ({ message, onClose }) => {
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
      {/* Icon dấu X */}
      <CancelIcon
        sx={{
          fontSize: "48px",
          color: "#f44336", // Màu đỏ
          animation: "shake 0.5s ease", // Hiệu ứng rung
          "@keyframes shake": {
            "0%": { transform: "rotate(0deg)" },
            "25%": { transform: "rotate(-10deg)" },
            "50%": { transform: "rotate(10deg)" },
            "75%": { transform: "rotate(-10deg)" },
            "100%": { transform: "rotate(0deg)" },
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
        {message || "Error"}
      </Typography>
    </Box>
  );
};

export default ErrorPopup;