import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import {
  Container,
  Typography,
  Grid,
  Box,
  Card,
  CardContent,
  CardMedia,
  Button,
  Divider,
  CircularProgress,
} from "@mui/material";
import { People, MusicNote, Star, ArrowForward } from "@mui/icons-material";
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

const zoomIn = keyframes`
  from {
    transform: scale(0.8);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
`;

const slideInRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(153, 51, 0, 0.7);
  }
  70% {
    box-shadow: 0 0 0 15px rgba(153, 51, 0, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(153, 51, 0, 0);
  }
`;

const bounce = keyframes`
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
`;

// Styled components
const AnimatedBox = styled(Box)`
  animation: ${fadeInUp} 0.8s ease-out;
`;

const AnimatedCard = styled(Card)`
  transition: transform 0.4s ease-in-out, box-shadow 0.4s ease-in-out;
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 15px 25px rgba(153, 51, 0, 0.2);
  }
`;

const StyledButton = styled(Button)`
  background: linear-gradient(45deg, #993300 30%, #ff6600 90%);
  transition: all 0.4s ease-in-out;
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 5px 15px rgba(153, 51, 0, 0.4);
    animation: ${pulse} 1.5s infinite;
  }
`;

const IconWrapper = styled(Box)`
  transition: transform 0.3s ease-in-out;
  &:hover {
    transform: scale(1.2);
    animation: ${bounce} 0.5s;
  }
`;

const About = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Giả lập loading để thấy hiệu ứng
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Box sx={{ background: "linear-gradient(to right, #f0f0f0, #e0e0e0)", minHeight: "100vh" }}>
      <Header />

      <Container maxWidth="lg" sx={{ py: 10 }}>
        {/* Tiêu đề chính */}
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
            Giới Thiệu Về Music Store
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
            Nơi mang âm nhạc đến gần hơn với cuộc sống của bạn
          </Typography>
        </AnimatedBox>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", my: 10 }}>
            <CircularProgress sx={{ color: "#993300" }} />
          </Box>
        ) : (
          <>
            {/* Phần giới thiệu chính */}
            <Grid container spacing={6} sx={{ mb: 8 }}>
              <Grid item xs={12} md={6}>
                <AnimatedBox sx={{ animationDelay: "0.2s" }}>
                  <CardMedia
                    component="img"
                    image="/about-us.jpg" // Thay bằng ảnh thực tế
                    alt="Music Store"
                    sx={{
                      borderRadius: "20px",
                      height: 400,
                      objectFit: "cover",
                      animation: `${zoomIn} 1s ease-out`,
                    }}
                  />
                </AnimatedBox>
              </Grid>
              <Grid item xs={12} md={6}>
                <AnimatedBox sx={{ animationDelay: "0.4s" }}>
                  <Typography
                    variant="h4"
                    sx={{ color: "#993300", fontWeight: "bold", mb: 3 }}
                  >
                    Chúng Tôi Là Ai?
                  </Typography>
                  <Typography variant="body1" sx={{ color: "#666", lineHeight: 1.8 }}>
                    Music Store là nhà phân phối nhạc cụ hàng đầu tại Việt Nam, với hơn 10 năm kinh nghiệm trong việc mang đến những sản phẩm chất lượng cao từ các thương hiệu nổi tiếng thế giới. Chúng tôi cam kết cung cấp không chỉ nhạc cụ mà còn là cảm hứng để bạn khám phá và sáng tạo âm nhạc của riêng mình.
                  </Typography>
                  <StyledButton
                    variant="contained"
                    size="large"
                    endIcon={<ArrowForward />}
                    sx={{ mt: 4, color: "white" }}
                    onClick={() => navigate("/contact")}
                  >
                    Liên Hệ Ngay
                  </StyledButton>
                </AnimatedBox>
              </Grid>
            </Grid>

            {/* Thành tựu */}
            <AnimatedBox sx={{ mb: 8, animationDelay: "0.6s" }}>
              <Typography
                variant="h4"
                sx={{ color: "#993300", textAlign: "center", fontWeight: "bold", mb: 6 }}
              >
                Thành Tựu Của Chúng Tôi
              </Typography>
              <Grid container spacing={4}>
                <Grid item xs={12} sm={4}>
                  <AnimatedCard sx={{ borderRadius: "16px", animation: `${zoomIn} 0.8s ease-out` }}>
                    <CardContent sx={{ textAlign: "center" }}>
                      <IconWrapper sx={{ color: "#993300", mb: 2 }}>
                        <People sx={{ fontSize: 60 }} />
                      </IconWrapper>
                      <Typography variant="h5" fontWeight="bold">10,000+</Typography>
                      <Typography variant="body2" sx={{ color: "#666" }}>
                        Khách hàng hài lòng
                      </Typography>
                    </CardContent>
                  </AnimatedCard>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <AnimatedCard sx={{ borderRadius: "16px", animation: `${zoomIn} 1s ease-out` }}>
                    <CardContent sx={{ textAlign: "center" }}>
                      <IconWrapper sx={{ color: "#993300", mb: 2 }}>
                        <MusicNote sx={{ fontSize: 60 }} />
                      </IconWrapper>
                      <Typography variant="h5" fontWeight="bold">5,000+</Typography>
                      <Typography variant="body2" sx={{ color: "#666" }}>
                        Sản phẩm đã bán
                      </Typography>
                    </CardContent>
                  </AnimatedCard>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <AnimatedCard sx={{ borderRadius: "16px", animation: `${zoomIn} 1.2s ease-out` }}>
                    <CardContent sx={{ textAlign: "center" }}>
                      <IconWrapper sx={{ color: "#993300", mb: 2 }}>
                        <Star sx={{ fontSize: 60 }} />
                      </IconWrapper>
                      <Typography variant="h5" fontWeight="bold">4.9/5</Typography>
                      <Typography variant="body2" sx={{ color: "#666" }}>
                        Đánh giá từ khách hàng
                      </Typography>
                    </CardContent>
                  </AnimatedCard>
                </Grid>
              </Grid>
            </AnimatedBox>

            {/* Nhiệm vụ và tầm nhìn */}
            <Grid container spacing={6} sx={{ mb: 8 }}>
              <Grid item xs={12} md={6}>
                <AnimatedBox sx={{ animationDelay: "0.8s" }}>
                  <AnimatedCard sx={{ p: 4, borderRadius: "20px" }}>
                    <CardContent>
                      <Typography
                        variant="h5"
                        sx={{ color: "#993300", fontWeight: "bold", mb: 3 }}
                      >
                        Nhiệm Vụ
                      </Typography>
                      <Typography variant="body1" sx={{ color: "#666", lineHeight: 1.8 }}>
                        Chúng tôi nỗ lực mang đến những nhạc cụ chất lượng nhất, cùng với dịch vụ khách hàng tận tâm để giúp bạn chạm đến giấc mơ âm nhạc của mình.
                      </Typography>
                    </CardContent>
                  </AnimatedCard>
                </AnimatedBox>
              </Grid>
              <Grid item xs={12} md={6}>
                <AnimatedBox sx={{ animationDelay: "1s" }}>
                  <AnimatedCard sx={{ p: 4, borderRadius: "20px" }}>
                    <CardContent>
                      <Typography
                        variant="h5"
                        sx={{ color: "#993300", fontWeight: "bold", mb: 3 }}
                      >
                        Tầm Nhìn
                      </Typography>
                      <Typography variant="body1" sx={{ color: "#666", lineHeight: 1.8 }}>
                        Trở thành thương hiệu nhạc cụ hàng đầu tại Việt Nam, nơi mọi người có thể tìm thấy niềm đam mê và sự sáng tạo qua âm nhạc.
                      </Typography>
                    </CardContent>
                  </AnimatedCard>
                </AnimatedBox>
              </Grid>
            </Grid>

            {/* Đội ngũ */}
            <AnimatedBox sx={{ mb: 8, animationDelay: "1.2s" }}>
              <Typography
                variant="h4"
                sx={{ color: "#993300", textAlign: "center", fontWeight: "bold", mb: 6 }}
              >
                Đội Ngũ Của Chúng Tôi
              </Typography>
              <Grid container spacing={4}>
                <Grid item xs={12} sm={4}>
                  <AnimatedCard sx={{ animation: `${slideInRight} 0.8s ease-out` }}>
                    <CardMedia
                      component="img"
                      image="/team1.jpg" // Thay bằng ảnh thực tế
                      alt="Team Member"
                      sx={{ height: 300, objectFit: "cover" }}
                    />
                    <CardContent sx={{ textAlign: "center" }}>
                      <Typography variant="h6" fontWeight="bold">Nguyễn Văn A</Typography>
                      <Typography variant="body2" sx={{ color: "#666" }}>
                        Quản lý bán hàng
                      </Typography>
                    </CardContent>
                  </AnimatedCard>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <AnimatedCard sx={{ animation: `${slideInRight} 1s ease-out` }}>
                    <CardMedia
                      component="img"
                      image="/team2.jpg" // Thay bằng ảnh thực tế
                      alt="Team Member"
                      sx={{ height: 300, objectFit: "cover" }}
                    />
                    <CardContent sx={{ textAlign: "center" }}>
                      <Typography variant="h6" fontWeight="bold">Trần Thị B</Typography>
                      <Typography variant="body2" sx={{ color: "#666" }}>
                        Chuyên gia tư vấn
                      </Typography>
                    </CardContent>
                  </AnimatedCard>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <AnimatedCard sx={{ animation: `${slideInRight} 1.2s ease-out` }}>
                    <CardMedia
                      component="img"
                      image="/team3.jpg" // Thay bằng ảnh thực tế
                      alt="Team Member"
                      sx={{ height: 300, objectFit: "cover" }}
                    />
                    <CardContent sx={{ textAlign: "center" }}>
                      <Typography variant="h6" fontWeight="bold">Lê Văn C</Typography>
                      <Typography variant="body2" sx={{ color: "#666" }}>
                        Kỹ thuật viên
                      </Typography>
                    </CardContent>
                  </AnimatedCard>
                </Grid>
              </Grid>
            </AnimatedBox>

            {/* Call to Action */}
            <AnimatedBox sx={{ textAlign: "center", animationDelay: "1.4s" }}>
              <Card
                sx={{
                  p: 6,
                  borderRadius: "20px",
                  background: "linear-gradient(45deg, #993300, #ff6600)",
                  color: "white",
                  transition: "transform 0.5s ease",
                  "&:hover": { transform: "scale(1.02)" },
                }}
              >
                <Typography variant="h4" fontWeight="bold">
                  Khám Phá Thế Giới Âm Nhạc Cùng Chúng Tôi
                </Typography>
                <Typography variant="body1" sx={{ mt: 2, mb: 4 }}>
                  Hãy đến với Music Store để trải nghiệm những sản phẩm và dịch vụ tốt nhất!
                </Typography>
                <StyledButton
                  variant="contained"
                  size="large"
                  sx={{ backgroundColor: "white", color: "#993300" }}
                  onClick={() => navigate("/")}
                >
                  Vào Trang Chủ
                </StyledButton>
              </Card>
            </AnimatedBox>
          </>
        )}
      </Container>

      <Footer />
    </Box>
  );
};

export default About;