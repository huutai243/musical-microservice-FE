import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import {
  Container,
  Typography,
  Grid,
  TextField,
  Button,
  Box,
  Card,
  CardContent,
  IconButton,
  Divider,
  CircularProgress,
} from "@mui/material";
import { Email, Phone, LocationOn, Send, Facebook, Instagram, Twitter } from "@mui/icons-material";
import { styled } from "@mui/system";
import { keyframes } from "@emotion/react";

// Keyframes cho các hiệu ứng
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const bounce = keyframes`
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-15px);
  }
  60% {
    transform: translateY(-7px);
  }
`;

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(153, 51, 0, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(153, 51, 0, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(153, 51, 0, 0);
  }
`;

const slideInLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

// Styled components
const AnimatedBox = styled(Box)`
  animation: ${fadeInUp} 0.8s ease-out;
`;

const ContactIcon = styled(IconButton)`
  transition: transform 0.3s ease-in-out, color 0.3s ease-in-out;
  &:hover {
    transform: scale(1.3);
    color: #ff6600;
    animation: ${bounce} 0.5s;
  }
`;

const SocialIcon = styled(IconButton)`
  transition: all 0.4s ease-in-out;
  &:hover {
    transform: rotate(360deg) scale(1.2);
    background-color: #993300;
    color: white;
  }
`;

const StyledButton = styled(Button)`
  background: linear-gradient(45deg, #993300 30%, #ff6600 90%);
  transition: all 0.4s ease-in-out;
  &:hover {
    transform: translateY(-3px) scale(1.05);
    box-shadow: 0 5px 15px rgba(153, 51, 0, 0.4);
    animation: ${pulse} 1.5s infinite;
  }
`;

const AnimatedCard = styled(Card)`
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 10px 20px rgba(153, 51, 0, 0.2);
  }
`;

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  // Hiệu ứng loading giả lập
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      console.log("Form submitted:", formData);
      setLoading(false);
      setSuccess(true);
      setFormData({ name: "", email: "", phone: "", message: "" });
    }, 2000); // Giả lập API call
  };

  return (
    <Box sx={{ background: "linear-gradient(to right, #f0f0f0, #e0e0e0)", minHeight: "100vh" }}>
      <Header />

      <Container maxWidth="lg" sx={{ py: 10 }}>
        {/* Tiêu đề với hiệu ứng */}
        <AnimatedBox sx={{ textAlign: "center", mb: 8 }}>
          <Typography
            variant="h2"
            sx={{
              color: "#993300",
              fontWeight: "bold",
              textShadow: "3px 3px 6px rgba(0,0,0,0.2)",
              animation: `${fadeInUp} 1s ease-out`,
            }}
          >
            Liên Hệ Với Music Store
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "#666",
              mt: 2,
              fontSize: "1.2rem",
              animation: `${fadeInUp} 1.2s ease-out`,
            }}
          >
            Chúng tôi luôn sẵn sàng hỗ trợ bạn với mọi thắc mắc về nhạc cụ!
          </Typography>
        </AnimatedBox>

        <Grid container spacing={6}>
          {/* Form liên hệ */}
          <Grid item xs={12} md={6}>
            <AnimatedBox sx={{ animationDelay: "0.2s" }}>
              <AnimatedCard sx={{ p: 4, borderRadius: "20px" }}>
                <CardContent>
                  <Typography
                    variant="h5"
                    sx={{ color: "#993300", mb: 3, fontWeight: "bold" }}
                  >
                    Gửi Tin Nhắn Cho Chúng Tôi
                  </Typography>
                  <form onSubmit={handleSubmit}>
                    <TextField
                      fullWidth
                      label="Họ và Tên"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      margin="normal"
                      variant="outlined"
                      required
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          transition: "all 0.3s ease",
                          "&:hover fieldset": { borderColor: "#993300" },
                          "&.Mui-focused fieldset": { borderColor: "#993300" },
                        },
                      }}
                    />
                    <TextField
                      fullWidth
                      label="Email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      margin="normal"
                      variant="outlined"
                      required
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          transition: "all 0.3s ease",
                          "&:hover fieldset": { borderColor: "#993300" },
                          "&.Mui-focused fieldset": { borderColor: "#993300" },
                        },
                      }}
                    />
                    <TextField
                      fullWidth
                      label="Số Điện Thoại"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      margin="normal"
                      variant="outlined"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          transition: "all 0.3s ease",
                          "&:hover fieldset": { borderColor: "#993300" },
                          "&.Mui-focused fieldset": { borderColor: "#993300" },
                        },
                      }}
                    />
                    <TextField
                      fullWidth
                      label="Tin Nhắn"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      margin="normal"
                      variant="outlined"
                      multiline
                      rows={5}
                      required
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          transition: "all 0.3s ease",
                          "&:hover fieldset": { borderColor: "#993300" },
                          "&.Mui-focused fieldset": { borderColor: "#993300" },
                        },
                      }}
                    />
                    <StyledButton
                      type="submit"
                      variant="contained"
                      size="large"
                      endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Send />}
                      disabled={loading}
                      sx={{ mt: 3, color: "white", width: "100%", py: 1.5 }}
                    >
                      {loading ? "Đang Gửi..." : "Gửi Tin Nhắn"}
                    </StyledButton>
                  </form>
                  {success && (
                    <Typography
                      sx={{
                        color: "#993300",
                        mt: 2,
                        textAlign: "center",
                        animation: `${fadeInUp} 0.5s ease-out`,
                      }}
                    >
                      Tin nhắn của bạn đã được gửi thành công!
                    </Typography>
                  )}
                </CardContent>
              </AnimatedCard>
            </AnimatedBox>
          </Grid>

          {/* Thông tin liên hệ */}
          <Grid item xs={12} md={6}>
            <AnimatedBox sx={{ animationDelay: "0.4s" }}>
              <AnimatedCard sx={{ p: 4, borderRadius: "20px" }}>
                <CardContent>
                  <Typography
                    variant="h5"
                    sx={{ color: "#993300", mb: 4, fontWeight: "bold" }}
                  >
                    Thông Tin Liên Hệ
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: 4,
                      animation: `${slideInLeft} 0.8s ease-out`,
                    }}
                  >
                    <ContactIcon sx={{ color: "#993300", mr: 2 }}>
                      <Email />
                    </ContactIcon>
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold">
                        Email
                      </Typography>
                      <Typography variant="body2">support@musicstore.vn</Typography>
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: 4,
                      animation: `${slideInLeft} 1s ease-out`,
                    }}
                  >
                    <ContactIcon sx={{ color: "#993300", mr: 2 }}>
                      <Phone />
                    </ContactIcon>
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold">
                        Hotline
                      </Typography>
                      <Typography variant="body2">0123-456-789</Typography>
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: 4,
                      animation: `${slideInLeft} 1.2s ease-out`,
                    }}
                  >
                    <ContactIcon sx={{ color: "#993300", mr: 2 }}>
                      <LocationOn />
                    </ContactIcon>
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold">
                        Địa Chỉ
                      </Typography>
                      <Typography variant="body2">
                        123 Đường Nhạc Cụ, Quận 1, TP.HCM
                      </Typography>
                    </Box>
                  </Box>

                  <Divider sx={{ my: 3 }} />

                  {/* Mạng xã hội */}
                  <Typography
                    variant="h6"
                    sx={{ color: "#993300", mb: 3, fontWeight: "bold" }}
                  >
                    Theo Dõi Chúng Tôi
                  </Typography>
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <SocialIcon sx={{ color: "#993300" }}>
                      <Facebook />
                    </SocialIcon>
                    <SocialIcon sx={{ color: "#993300" }}>
                      <Instagram />
                    </SocialIcon>
                    <SocialIcon sx={{ color: "#993300" }}>
                      <Twitter />
                    </SocialIcon>
                  </Box>

                  {/* Bản đồ */}
                  <Box sx={{ mt: 4, borderRadius: "12px", overflow: "hidden" }}>
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.669563357123!2d106.69827931474896!3d10.759917092328846!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f38f9f65f9d%3A0x4b39e7c6768b8b8f!2sHo%20Chi%20Minh%20City!5e0!3m2!1sen!2s!4v1634567890123!5m2!1sen!2s"
                      width="100%"
                      height="250"
                      style={{ border: 0, transition: "all 0.3s ease" }}
                      allowFullScreen=""
                      loading="lazy"
                    ></iframe>
                  </Box>
                </CardContent>
              </AnimatedCard>
            </AnimatedBox>
          </Grid>
        </Grid>

        {/* Banner quảng cáo hoặc lời kêu gọi hành động */}
        <AnimatedBox sx={{ mt: 8, textAlign: "center", animationDelay: "0.6s" }}>
          <Card
            sx={{
              p: 4,
              borderRadius: "20px",
              background: "linear-gradient(45deg, #993300, #ff6600)",
              color: "white",
              transition: "transform 0.5s ease",
              "&:hover": { transform: "scale(1.02)" },
            }}
          >
            <Typography variant="h4" fontWeight="bold">
              Bạn Đã Sẵn Sàng Khám Phá Thế Giới Nhạc Cụ?
            </Typography>
            <Typography variant="body1" sx={{ mt: 2, mb: 3 }}>
              Liên hệ ngay để nhận tư vấn miễn phí từ đội ngũ chuyên gia của chúng tôi!
            </Typography>
            <StyledButton
              variant="contained"
              size="large"
              onClick={() => navigate("/")}
              sx={{ backgroundColor: "white", color: "#993300" }}
            >
              Khám Phá Ngay
            </StyledButton>
          </Card>
        </AnimatedBox>
      </Container>

      <Footer />
    </Box>
  );
};

export default Contact;