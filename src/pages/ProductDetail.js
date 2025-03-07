import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardMedia,
  Paper,
} from "@mui/material";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import PaymentIcon from "@mui/icons-material/Payment";
import InventoryIcon from "@mui/icons-material/Inventory";
import AutorenewIcon from "@mui/icons-material/Autorenew";

const deliveryItems = [
  { icon: <CheckCircleIcon color="primary" fontSize="large" />, text: "Cam kết 100% chính hãng" },
  { icon: <MonetizationOnIcon color="secondary" fontSize="large" />, text: "Miễn phí giao hàng cho đơn hàng trên 1 triệu VNĐ tại HCM" },
  { icon: <SupportAgentIcon color="success" fontSize="large" />, text: "Hỗ trợ từ 9h sáng đến 6h chiều" },
  { icon: <PaymentIcon color="warning" fontSize="large" />, text: "Thanh Toán Đa Dạng" },
  { icon: <InventoryIcon color="error" fontSize="large" />, text: "Mở hộp kiểm tra nhận hàng" },
  { icon: <AutorenewIcon color="info" fontSize="large" />, text: "Đổi trả trong 2 ngày" },
];

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:9000/api/products/${id}`);
        if (!response.ok) throw new Error("Không thể tải chi tiết sản phẩm");
        const data = await response.json();
        setProduct(data);
        setSelectedImage(data.imageUrls[0] || "");
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <Typography sx={{ textAlign: "center", py: 5 }}>Đang tải...</Typography>;
  if (error) return <Typography sx={{ textAlign: "center", py: 5 }} color="error">Lỗi: {error}</Typography>;

  return (
    <div>
      <Header />
      <Container>
        <Box sx={{ display: "flex", gap: 4, py: 4, flexWrap: "wrap" }}>
          {/* Hình ảnh sản phẩm */}
          <Box sx={{ maxWidth: 500, flex: "1 1 40%" }}>
  {/* Hình ảnh chính */}
  <Card sx={{ mb: 2, aspectRatio: "1 / 1", display: "flex", justifyContent: "center", alignItems: "center" }}>
    <CardMedia 
      component="img" 
      image={selectedImage} 
      alt={product.name} 
      sx={{ width: "100%", height: "100%", objectFit: "contain", borderRadius: "8px" }} 
    />
  </Card>

  {/* Danh sách hình ảnh nhỏ */}
  <Grid container spacing={1}>
    {product.imageUrls.slice(0, 3).map((img, index) => (
      <Grid item xs={4} key={index}>
        <Card
          sx={{
            cursor: "pointer",
            aspectRatio: "1 / 1",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            border: selectedImage === img ? "2px solid #993300" : "none",
            borderRadius: "8px",
            overflow: "hidden"
          }}
          onClick={() => setSelectedImage(img)}
        >
          <CardMedia 
            component="img" 
            image={img} 
            alt={product.name} 
            sx={{ width: "100%", height: "100%", objectFit: "cover" }} 
          />
        </Card>
      </Grid>
    ))}
  </Grid>
</Box>

          {/* Thông tin sản phẩm */}
          <Box sx={{ flex: "1 1 50%", p: 3 }}>
            <Typography variant="h4" fontWeight="bold">{product.name}</Typography>
            <Typography variant="h6" color="error" fontWeight="bold">
              {product.price.toLocaleString("vi-VN")} VND
            </Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>{product.description}</Typography>
            <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
              <Button variant="contained" color="primary">Thêm vào giỏ hàng</Button>
              <Button variant="outlined" color="secondary">Mua ngay</Button>
            </Box>

            {/* Chính sách giao hàng */}
            <Box sx={{ mt: 4 }}>
              <Grid container spacing={2}>
                {deliveryItems.map((item, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index} sx={{ display: "flex" }}>
                    <Paper
                      sx={{
                        p: 2,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        flex: 1,
                        textAlign: "center",
                      }}
                    >
                      {item.icon}
                      <Typography variant="body1">{item.text}</Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Box>
        </Box>

        {/* Chi tiết sản phẩm */}
        <Box sx={{ mt: 4, p: 2 }}>
          <Typography
            variant="h5"
            fontWeight="bold"
            sx={{ mb: 2, textAlign: "center", textDecoration: "underline", color: "#993300" }}
          >
            Chi Tiết Sản Phẩm
          </Typography>
          <Typography variant="h4" fontWeight="bold">{product.name}</Typography>
          <Typography variant="h6" fontWeight="bold" sx={{ mt: 3 }}>
            Tính Năng Nổi Bật
          </Typography>
          <ul>
            <li>✅ Long-term warranty: 2 years</li>
            <li>✅ Impact resistance: Designed to withstand collisions</li>
            <li>✅ Premium materials: High-quality construction</li>
            <li>✅ Secure data: Protects user information</li>
            <li>✅ Dedicated support: Professional customer service</li>
          </ul>

          {/* Ảnh chi tiết sản phẩm */}
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, textAlign: "center" }}>
                <img
                  src="https://cdn.shopify.com/s/files/1/0644/6546/9590/files/s2_0108410c-c2d6-4bef-9ec0-491d75473a9d.webp?v=1716864090"
                  alt="Product feature"
                  width="100%"
                  style={{ borderRadius: "8px" }}
                />
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" fontWeight="bold">Product Supreme Quality</Typography>
              <Typography variant="body1">
                Labore omnis sint totam maxime. Reprehenderit eaque consectetur consequuntur.
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Container>
      <Footer />
    </div>
  );
};

export default ProductDetail;