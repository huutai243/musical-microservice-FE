import React from "react";
import { Grid, Card, CardContent, Typography, Box, Paper } from "@mui/material";
import { ArrowUpward, Store, ShoppingCart, People } from "@mui/icons-material";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, Legend, BarChart as RechartsBarChart, Bar } from "recharts";
import AdminLayout from "./AdminLayout";

const salesData = [
  { month: "Jan", revenue: 40000000, orders: 15 },
  { month: "Feb", revenue: 30000000, orders: 10 },
  { month: "Mar", revenue: 50000000, orders: 20 },
];

const Dashboard = () => {
  const cardVariants = { hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0 } };

  return (
    <AdminLayout>
      <motion.div initial="hidden" animate="visible" variants={cardVariants}>
        <Typography variant="h4" gutterBottom style={{ color: "#2c3e50", fontWeight: "bold" }}>
          Tổng Quan
        </Typography>
        <Grid container spacing={3}>
          {[
            { title: "Doanh Thu", value: `${salesData.reduce((sum, d) => sum + d.revenue, 0).toLocaleString("vi-VN")} VND`, icon: <ArrowUpward style={{ color: "#27ae60" }} /> },
            { title: "Sản Phẩm", value: 50, icon: <Store style={{ color: "#2980b9" }} /> },
            { title: "Đơn Hàng", value: 30, icon: <ShoppingCart style={{ color: "#e67e22" }} /> },
            { title: "Người Dùng", value: 100, icon: <People style={{ color: "#8e44ad" }} /> },
          ].map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card component={motion.div} whileHover={{ scale: 1.05 }} style={{ borderRadius: "20px" }}>
                <CardContent>
                  <Box display="flex" justifyContent="space-between">
                    <Box>
                      <Typography variant="h6">{stat.title}</Typography>
                      <Typography variant="h5" style={{ color: "#34495e" }}>{stat.value}</Typography>
                    </Box>
                    {stat.icon}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
          <Grid item xs={12} md={6}>
            <Paper elevation={5} sx={{ p: 2, borderRadius: "20px" }}>
              <Typography variant="h6">Doanh Thu Theo Tháng</Typography>
              <LineChart width={500} height={300} data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#3498db" strokeWidth={3} />
              </LineChart>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={5} sx={{ p: 2, borderRadius: "20px" }}>
              <Typography variant="h6">Đơn Hàng Theo Tháng</Typography>
              <RechartsBarChart width={500} height={300} data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip />
                <Legend />
                <Bar dataKey="orders" fill="#e67e22" radius={[10, 10, 0, 0]} />
              </RechartsBarChart>
            </Paper>
          </Grid>
        </Grid>
      </motion.div>
    </AdminLayout>
  );
};

export default Dashboard;