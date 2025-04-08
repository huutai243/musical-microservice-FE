import React, { useState } from "react";
import { Box, Container } from "@mui/material";
import Sidebar from "./Sidebar";

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", background: "linear-gradient(to bottom, #ecf0f1, #bdc3c7)" }}>
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          ml: { xs: 0, sm: sidebarOpen ? "260px" : "70px" }, // Điều chỉnh marginLeft dựa trên trạng thái sidebar
          transition: "margin-left 0.3s ease-in-out", // Animation mượt mà cho nội dung
        }}
      >
        <Container maxWidth="xl">{children}</Container>
      </Box>
    </Box>
  );
};

export default AdminLayout;