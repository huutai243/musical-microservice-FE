import React from "react";
import { Box, Typography, Grid, TextField, Button, IconButton } from "@mui/material";
import { motion } from "framer-motion";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";

const footerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const Footer = () => {
  return (
    <motion.div variants={footerVariants} initial="hidden" animate="visible">
      <Box sx={{ bgcolor: "#1a1a1a", color: "white", p: 6, boxShadow: "0px -4px 10px rgba(0, 0, 0, 0.1)", mt: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={3}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
              Muscical-instrumment
            </Typography>
            <Typography variant="body2">(704) 555-0127</Typography>
            <Typography variant="body2">Musical-instrucment@gmail.com</Typography>
            <Typography variant="body2">Hồ Chí Minh</Typography>
          </Grid>

          <Grid item xs={12} sm={3}>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
              Thông tin
            </Typography>
            {["Tài khoản của tôi", "Đăng nhập", "Giỏ hàng", "Danh sách của tôi", "Thanh toán"].map((item, index) => (
              <Typography key={index} variant="body2" sx={{ cursor: "pointer", transition: "0.3s", "&:hover": { color: "#f4a261" } }}>
                {item}
              </Typography>
            ))}
          </Grid>

          <Grid item xs={12} sm={3}>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
              Dịch vụ
            </Typography>
            {[
              "Về chứng tôi",
              "Đào tạo",
              "Thông tin giao hàng",
              "Chính sách bảo mật",
              "Điều khoản & Điều kiện",
            ].map((item, index) => (
              <Typography key={index} variant="body2" sx={{ cursor: "pointer", transition: "0.3s", "&:hover": { color: "#f4a261" } }}>
                {item}
              </Typography>
            ))}
          </Grid>

          <Grid item xs={12} sm={3}>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
              Đăng kí nhận thông tin
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
             Nhập email của bạn để nhận được ưu đãi mới nhất
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <TextField
                variant="outlined"
                size="small"
                placeholder="Email của bạn"
                sx={{
                  flexGrow: 1,
                  bgcolor: "white",
                  borderRadius: "5px",
                }}
              />
              <Button
                variant="contained"
                sx={{ ml: 1, bgcolor: "#f4a261", "&:hover": { bgcolor: "#e76f51" } }}
              >
                →
              </Button>
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 4, flexWrap: "wrap" }}>
          <Box sx={{ display: "flex", gap: 1 }}>
            {["/visa.jpg", "/mastercard.jpg", "/paypal.png", "/ggpay.png"].map((src, index) => (
              <motion.img
                key={index}
                src={src}
                alt="Payment Method"
                style={{ height: "30px" }}
                whileHover={{ scale: 1.1 }}
              />
            ))}
          </Box>

          <Typography variant="body2">&copy; 2025 Nhóm 9 KTTKMP</Typography>

          <Box sx={{ display: "flex", gap: 1 }}>
            {[FacebookIcon, InstagramIcon].map((Icon, index) => (
              <motion.div key={index} whileHover={{ scale: 1.2 }}>
                <IconButton sx={{ color: "white", "&:hover": { color: "#f4a261" } }}>
                  <Icon />
                </IconButton>
              </motion.div>
            ))}
          </Box>
        </Box>
      </Box>
    </motion.div>
  );
};

export default Footer;