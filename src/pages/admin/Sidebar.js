import React, { useState, useRef } from "react";
import {
  Drawer, Box, Typography, IconButton, Divider, List, ListItem, ListItemIcon, ListItemText,
  Modal, Paper, MenuItem,
} from "@mui/material";
import { Dashboard as DashboardIcon, Store, Category, ShoppingCart, Inventory, People, ArrowForwardIos, ArrowBackIos, Settings as SettingsIcon } from "@mui/icons-material";
import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from '../../utils/api';

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const navigate = useNavigate();
  const settingsRef = useRef(null); // Ref để lấy vị trí của menu item "Cài đặt"

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

  // Thêm menu item "Cài đặt"
  const settingsItem = { text: "Cài đặt", icon: <SettingsIcon />, action: () => setSettingsModalOpen(true) };

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      await api.post('/auth/logout', { refreshToken });

      localStorage.clear();
      navigate('/admin'); // Điều hướng về trang đăng nhập sau khi đăng xuất
      setSettingsModalOpen(false); // Đóng modal
    } catch (error) {
      console.error('Lỗi đăng xuất:', error);
    }
  };

  // Lấy vị trí của menu item "Cài đặt" để đặt modal
  const getModalPosition = () => {
    if (settingsRef.current) {
      const rect = settingsRef.current.getBoundingClientRect();
      return {
        top: rect.top, // Đặt modal ở vị trí top của menu item
        left: sidebarOpen ? 260 : 70, // Đặt modal ngay cạnh sidebar
      };
    }
    return { top: 0, left: sidebarOpen ? 260 : 70 };
  };

  return (
    <>
      <motion.div
        initial="open"
        animate={sidebarOpen ? "open" : "closed"}
        variants={sidebarVariants}
        style={{ height: "100vh", position: "fixed" }}
      >
        <Drawer
          variant="permanent"
          sx={{
            "& .MuiDrawer-paper": {
              width: "inherit",
              backgroundColor: "#F8EDE3",
              color: "#993300",
              overflowX: "hidden",
              height: "100%",
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
          <List sx={{ flexGrow: 1 }}>
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
                    "&:hover": { backgroundColor: "#DFD3C3" },
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

          {/* Menu item "Cài đặt" ở dưới cùng */}
          <List sx={{ marginTop: "auto" }}>
            <motion.div
              whileHover={{ scale: 1.05, x: 5 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <ListItem
                button
                onClick={settingsItem.action}
                sx={{
                  "&:hover": { backgroundColor: "#DFD3C3" },
                  padding: "12px 16px",
                }}
                ref={settingsRef} // Gắn ref để lấy vị trí
              >
                <ListItemIcon sx={{ color: "#993300", minWidth: "40px" }}>{settingsItem.icon}</ListItemIcon>
                <AnimatePresence>
                  {sidebarOpen && (
                    <motion.div
                      variants={listItemVariants}
                      initial="closed"
                      animate="open"
                      exit="closed"
                    >
                      <ListItemText primary={settingsItem.text} sx={{ color: "#993300" }} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </ListItem>
            </motion.div>
          </List>
        </Drawer>
      </motion.div>

      {/* Modal hiển thị khi bấm vào "Cài đặt" */}
      <Modal
        open={settingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
        sx={{ display: "flex", alignItems: "flex-end", justifyContent: "flex-start" }}
      >
        <Paper
          sx={{
            position: "absolute",
            marginBottom: "5%",
            width: 200,
            p: 2,
            backgroundColor: "#fff",
            boxShadow: "none", // Bỏ viền đen (boxShadow)
            border: "none", // Đảm bảo không có viền
          }}
        >
          <MenuItem
            onClick={handleLogout}
            sx={{
              color: "#993300",
              "&:hover": { backgroundColor: "#f5f5f5" },
              borderRadius: "4px",
            }}
          >
            Đăng xuất
          </MenuItem>
        </Paper>
      </Modal>
    </>
  );
};

export default Sidebar;