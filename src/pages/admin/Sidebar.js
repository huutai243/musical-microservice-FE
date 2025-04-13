import React, { useState } from "react";
import {
  Drawer, Box, Typography, IconButton, Divider, List, ListItem, ListItemIcon, ListItemText, Modal, Paper, MenuItem,
} from "@mui/material";
import { Dashboard as DashboardIcon, Store, Category, ShoppingCart, Inventory, People, ArrowForwardIos, ArrowBackIos, Settings as SettingsIcon } from "@mui/icons-material";
import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from '../../utils/api';

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const navigate = useNavigate();

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

  const modalVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: 20, transition: { duration: 0.2 } },
  };

  const menuItems = [
    { text: "Tổng Quan", icon: <DashboardIcon />, path: "/admin/dashboard" },
    { text: "Sản Phẩm", icon: <Store />, path: "/admin/products" },
    { text: "Danh Mục", icon: <Category />, path: "/admin/categories" },
    { text: "Đơn Hàng", icon: <ShoppingCart />, path: "/admin/orders" },
    { text: "Kho Hàng", icon: <Inventory />, path: "/admin/inventory" },
    { text: "Người Dùng", icon: <People />, path: "/admin/users" },
  ];

  const settingsItem = { text: "Cài đặt", icon: <SettingsIcon />, action: () => setSettingsModalOpen(true) };

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      await api.post('/auth/logout', { refreshToken });
      localStorage.clear();
      navigate('/admin');
      setSettingsModalOpen(false);
    } catch (error) {
      console.error('Lỗi đăng xuất:', error);
    }
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
              backgroundColor: "",
              color: "#993300",
              overflowX: "hidden",
              height: "100%",
              borderRadius: "0 12px 12px 0",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
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
                  <Typography marginRight= "10px" variant="h7" fontWeight="bold" sx={{ color: "#993300" }}>
                    Admin Dashboard
                  </Typography>
                </motion.div>
              )}
            </AnimatePresence>
            <IconButton
              onClick={toggleSidebar}
              sx={{
                color: "#993300",
                "&:hover": { color: "#b35900", transform: "scale(1.1)" },
                transition: "color 0.3s ease, transform 0.3s ease",
              }}
            >
              {sidebarOpen ? <ArrowBackIos /> : <ArrowForwardIos />}
            </IconButton>
          </Box>
          <Divider sx={{ backgroundColor: "rgba(153, 51, 0, 0.2)" }} />
          <List sx={{ flexGrow: 1, pt: 1 }}>
            {menuItems.map((item) => (
              <motion.div
                key={item.text}
                whileHover={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <ListItem
                  button
                  component={NavLink}
                  to={item.path}
                  sx={{
                    "&:hover": {
                      backgroundColor: "rgba(179, 89, 0, 0.1)",
                      borderLeft: "4px solid #993300",
                    },
                    "&.active": {
                      backgroundColor: "#b35900",
                      color: "white",
                      "& .MuiListItemIcon-root": { color: "white" },
                      "& .MuiListItemText-primary": { color: "white" },
                    },
                    padding: "14px 16px",
                    borderRadius: "0 8px 8px 0",
                    mb: 0.5,
                  }}
                >
                  <ListItemIcon sx={{ color: "#993300", minWidth: "40px" }}>
                    {item.icon}
                  </ListItemIcon>
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
          <List sx={{ marginTop: "auto", pb: 2 }}>
            <motion.div
              whileHover={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <ListItem
                button
                onClick={settingsItem.action}
                sx={{
                  "&:hover": {
                    backgroundColor: "rgba(179, 89, 0, 0.1)",
                    borderLeft: "4px solid #993300",
                  },
                  padding: "14px 16px",
                  borderRadius: "0 8px 8px 0",
                }}
              >
                <ListItemIcon sx={{ color: "#993300", minWidth: "40px" }}>
                  {settingsItem.icon}
                </ListItemIcon>
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
        <motion.div
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <Paper
            sx={{
              position: "absolute",
              bottom: 80,
              left: sidebarOpen,
              width: 200,
              p: 1,
              backgroundColor: "#fff",
              borderRadius: "12px",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
            }}
          >
            <MenuItem
              onClick={handleLogout}
              sx={{
                color: "#993300",
                "&:hover": { backgroundColor: "rgba(179, 89, 0, 0.1)" },
                borderRadius: "8px",
                py: 1.5,
              }}
            >
              Đăng xuất
            </MenuItem>
          </Paper>
        </motion.div>
      </Modal>
    </>
  );
};

export default Sidebar;