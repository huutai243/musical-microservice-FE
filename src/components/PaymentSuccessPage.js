import React from "react";
import { Container, Box } from "@mui/material";
import SuccessPopup from "./SuccessPopup";

const PaymentSuccessPage = () => {
  return (
    <Box
      sx={{
        background: "linear-gradient(to right, #f0f0f0, #e0e0e0)",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      
      <Container sx={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", py: 5 }}>
        <SuccessPopup message="Bạn đã thanh toán và đặt hàng thành công" />
      </Container>
      
    </Box>
  );
};

export default PaymentSuccessPage;