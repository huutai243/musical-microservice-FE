import React from "react";
import {
  Drawer, Box, Typography, IconButton, Divider, List, ListItem, ListItemIcon, ListItemText,
} from "@mui/material";
import { Dashboard as DashboardIcon, Store, Category, ShoppingCart, Inventory, People, ArrowForwardIos, ArrowBackIos } from "@mui/icons-material";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const sidebarVariants = {
    open: { width: 260, transition: { type: "spring", stiffness: 300, damping: 30 } },
    closed: { width: 70, transition: { type: "spring", stiffness: 300, damping: 30 } },
  };

  const titleVariants = {
    open: { opacity: 1, x: 0, transition: { delay: 0.1, duration: 0.3 } },
    closed: { opacity: 0, x: -20, transition: { duration: 0.2 } },
  };

  const listItemVariants = {
    open: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    closed: { opacity: 0, x: -20, transition: { duration: 0.2 } },
  };

  const menuItems = [
    { text: "Tổng Quan", icon: <DashboardIcon />, path: "/admin/dashboard" },
    { text: "Sản Phẩm", icon: <Store />, path: "/admin/products" },
    { text: "Danh Mục", icon: <Category />, path: "/admin/categories" },
    { text: "Đơn Hàng", icon: <ShoppingCart />, path: "/admin/orders" },
    { text: "Kho Hàng", icon: <Inventory />, path: "/admin/inventory" },
    { text: "Người Dùng", icon: <People />, path: "/admin/users" },
  ];

  return (
    <motion.div
      initial="open"
      animate={sidebarOpen ? "open" : "closed"}
      variants={sidebarVariants}
      style={{ height: "100vh", position: "fixed" }} // Giữ cố định và cao bằng màn hình
    >
      <Drawer
        variant="permanent"
        sx={{
          "& .MuiDrawer-paper": { 
            width: "inherit", // Kế thừa chiều rộng từ motion.div (260px hoặc 70px)
            backgroundColor: "#F8EDE3", 
            color: "#993300", 
            //borderRadius: "0 20px 20px 0",
            overflowX: "hidden",
            //boxShadow: "2px 0 10px rgba(0,0,0,0.3)",
            height: "100%", // Đảm bảo Drawer cao bằng motion.div
          },
        }}
      >
        <Box p={2} display="flex" justifyContent="space-between" alignItems="center">
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div
                variants={titleVariants}
                initial="closed"
                animate="open"
                exit="closed"
              >
                <Typography variant="h6" fontWeight="bold" sx={{ color: "#993300" }}>
                  Admin Dashboard
                </Typography>
              </motion.div>
            )}
          </AnimatePresence>
          <IconButton
            onClick={toggleSidebar}
            sx={{ color: "#993300" }}
          >
            {sidebarOpen ? <ArrowBackIos /> : <ArrowForwardIos />}
          </IconButton>
        </Box>
        <Divider sx={{ backgroundColor: "rgba(255,255,255,0.2)" }} />
        <List>
          {menuItems.map((item) => (
            <motion.div
              key={item.text}
              whileHover={{ scale: 1.05, x: 5 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <ListItem
                button
                component={NavLink}
                to={item.path}
                sx={{
                  "&:hover": { backgroundColor: "#DFD3C3" }, // Màu hover: nâu nhạt
                  "&.active": { backgroundColor: "#D0B8A8" },
                  padding: "12px 16px",
                }}
              >
                <ListItemIcon sx={{ color: "#993300", minWidth: "40px" }}>{item.icon}</ListItemIcon>
                <AnimatePresence>
                  {sidebarOpen && (
                    <motion.div
                      variants={listItemVariants}
                      initial="closed"
                      animate="open"
                      exit="closed"
                    >
                      <ListItemText primary={item.text} sx={{ color: "#993300" }} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </ListItem>
            </motion.div>
          ))}
        </List>
      </Drawer>
    </motion.div>
  );
};

export default Sidebar;