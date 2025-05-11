import React, { useEffect, useState } from "react";
import {
  Grid, Card, CardContent, Typography, Box, Paper, MenuItem, Select, FormControl, InputLabel
} from "@mui/material";
import {
  ArrowUpward, Store, ShoppingCart, People, Star, Category, MonetizationOn, Repeat
} from "@mui/icons-material";
import { motion } from "framer-motion";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, Legend,
  BarChart as RechartsBarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer
} from "recharts";
import AdminLayout from "./AdminLayout";
import api from "../../utils/api";

const Dashboard = () => {
  const [filter, setFilter] = useState("monthly");
  const [data, setData] = useState({
    revenue: [],
    orders: [],
    users: 0,
    products: 0,
    categories: 0,
    topProducts: [],
    inventory: [],
    reviews: 0,
    aov: 0,
    topCategories: [],
    retentionRate: 0,
    stockStatus: []
  });

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF"];

  const fetchData = async () => {
    try {
      const [ordersRes, productsRes, usersRes, categoriesRes] = await Promise.all([
        api.get("/orders/get-all"),
        api.get("/products/get-all"),
        api.get("/users/all"),
        api.get("/categories/get-all")
      ]);

      const orders = ordersRes.data || [];
      const products = productsRes.data || [];
      const users = usersRes.data || [];
      const categories = categoriesRes.data || [];

      const now = new Date();
      let filteredOrders = orders;
      if (filter === "today") {
        filteredOrders = orders.filter(order => new Date(order.createdAt).toDateString() === now.toDateString());
      } else if (filter === "7days") {
        const sevenDaysAgo = new Date(now.setDate(now.getDate() - 7));
        filteredOrders = orders.filter(order => new Date(order.createdAt) >= sevenDaysAgo);
      } else if (filter === "month") {
        filteredOrders = orders.filter(order => {
          const orderDate = new Date(order.createdAt);
          return orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear();
        });
      } else if (filter === "quarter") {
        const quarterStart = new Date(now.setMonth(Math.floor(now.getMonth() / 3) * 3, 1));
        filteredOrders = orders.filter(order => new Date(order.createdAt) >= quarterStart);
      } else if (filter === "year") {
        filteredOrders = orders.filter(order => new Date(order.createdAt).getFullYear() === now.getFullYear());
      }

      const revenueMap = new Map();
      const orderMap = new Map();
      filteredOrders.forEach(order => {
        const date = new Date(order.createdAt);
        let label = filter === "today" ? `${date.getHours()}:00` : 
                    filter === "7days" ? `${date.getDate()}/${date.getMonth() + 1}` : 
                    `${date.getMonth() + 1}/${date.getFullYear()}`;
        revenueMap.set(label, (revenueMap.get(label) || 0) + order.totalPrice);
        orderMap.set(label, (orderMap.get(label) || 0) + 1);
      });
      const revenue = Array.from(revenueMap.entries()).map(([label, amount]) => ({ label, amount }));
      const orderStats = Array.from(orderMap.entries()).map(([label, count]) => ({ label, count }));

      // Fix for inventory fetching
      const inventoryPromises = products.map(async (p) => {
        try {
          const res = await api.get(`/inventory/${p.id}`);
          return { name: p.name, quantity: res.data || 0, categoryId: p.categoryId };
        } catch {
          return null;
        }
      });
      const inventory = (await Promise.all(inventoryPromises)).filter(Boolean);

      const topProducts = products
        .map(p => ({ name: p.name, quantity: Math.floor(Math.random() * 100) }))
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 5);

      let totalReviews = 0;
      await Promise.all(products.map(async (p) => {
        try { const res = await api.get(`/reviews/product/${p.id}`); totalReviews += res.data?.content?.length || 0; } catch {}
      }));

      const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.totalPrice, 0);
      const orderCount = filteredOrders.length;
      const aov = orderCount > 0 ? (totalRevenue / orderCount).toFixed(2) : 0;

      const categorySales = new Map();
      filteredOrders.forEach(order => {
        order.items?.forEach(item => {
          const product = products.find(p => p.id === item.productId);
          if (product?.categoryId) {
            const category = categories.find(c => c.id === product.categoryId);
            if (category) {
              categorySales.set(category.name, (categorySales.get(category.name) || 0) + (item.quantity * (item.price || 0)));
            }
          }
        });
      });
      const topCategories = Array.from(categorySales.entries())
        .map(([name, revenue]) => ({ name, revenue }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

      const customerOrders = new Map();
      filteredOrders.forEach(order => customerOrders.set(order.userId, (customerOrders.get(order.userId) || 0) + 1));
      const totalCustomers = customerOrders.size;
      const returningCustomers = Array.from(customerOrders.values()).filter(count => count > 1).length;
      const retentionRate = totalCustomers > 0 ? ((returningCustomers / totalCustomers) * 100).toFixed(2) : 0;

      const stockStatus = [
        { name: "In Stock", value: inventory.filter(item => item.quantity >= 5).length },
        { name: "Low Stock", value: inventory.filter(item => item.quantity > 0 && item.quantity < 5).length },
        { name: "Out of Stock", value: inventory.filter(item => item.quantity === 0).length }
      ].filter(status => status.value > 0);

      setData({ revenue, orders: orderStats, users: users.length, products: products.length, categories: categories.length, 
                topProducts, inventory, reviews: totalReviews, aov, topCategories, retentionRate, stockStatus });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  useEffect(() => { fetchData(); }, [filter]);

  const cardVariants = { hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0 } };
  const totalRevenue = data.revenue.reduce((sum, d) => sum + d.amount, 0);

  return (
    <AdminLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} style={{ padding: "20px" }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" sx={{ color: "#993300", fontWeight: "bold" }}>Thống Kê Tổng Quan</Typography>
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel sx={{ color: "#993300" }}>Lọc theo</InputLabel>
            <Select value={filter} onChange={(e) => setFilter(e.target.value)} sx={{
              borderRadius: "20px", backgroundColor: "#fff", "& .MuiOutlinedInput-notchedOutline": { borderColor: "#993300" },
              "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#b35900" }
            }}>
              <MenuItem value="today">Hôm nay</MenuItem>
              <MenuItem value="7days">7 ngày</MenuItem>
              <MenuItem value="month">Tháng này</MenuItem>
              <MenuItem value="quarter">Quý</MenuItem>
              <MenuItem value="year">Năm</MenuItem>
              <MenuItem value="monthly">Hằng tháng</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Grid container spacing={3}>
          {/* Summary Cards */}
          <Grid container spacing={2}>
            {[
              { title: "Doanh Thu", value: `${totalRevenue.toLocaleString("vi-VN")} VND`, icon: <ArrowUpward sx={{ color: "#27ae60" }} /> },
              { title: "Sản Phẩm", value: data.products, icon: <Store sx={{ color: "#2980b9" }} /> },
              { title: "Đơn Hàng", value: data.orders.reduce((sum, d) => sum + d.count, 0), icon: <ShoppingCart sx={{ color: "#e67e22" }} /> },
              { title: "Người Dùng", value: data.users, icon: <People sx={{ color: "#8e44ad" }} /> },
              { title: "Đánh Giá", value: data.reviews, icon: <Star sx={{ color: "#f1c40f" }} /> },
              { title: "Danh Mục", value: data.categories, icon: <Category sx={{ color: "#d35400" }} /> },
              { title: "Giá Trị Đơn Trung Bình", value: `${data.aov.toLocaleString("vi-VN")} VND`, icon: <MonetizationOn sx={{ color: "#16a085" }} /> },
              { title: "Tỷ Lệ Giữ Chân", value: `${data.retentionRate}%`, icon: <Repeat sx={{ color: "#c0392b" }} /> }
            ].map((stat, index) => (
              <Grid item key={index} xs={6} sm={4} md={3}>
                <Card component={motion.div} whileHover={{ scale: 1.05}} sx={{ borderRadius: "12px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)", backgroundColor: "#fff" }}>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Box>
                        <Typography variant="h6" sx={{ color: "#993300" }}>{stat.title}</Typography>
                        <Typography variant="h5" sx={{ color: "#34495e", fontWeight: "bold" }}>{stat.value}</Typography>
                      </Box>
                      {stat.icon}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* First Row: Charts */}
          <Grid container spacing={3} sx={{ mt: 3 }}>
            <Grid item xs={12} md={4}>
              <Paper elevation={5} sx={{ p: 2, borderRadius: "12px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)", backgroundColor: "#fff", height: 300, width: 300 }}>
                <Typography variant="h6" sx={{ color: "#993300", mb: 2, fontWeight: "bold" }}>Doanh Thu Theo Thời Gian</Typography>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={data.revenue}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" />
                    <YAxis />
                    <ChartTooltip />
                    <Legend />
                    <Line type="monotone" dataKey="amount" stroke="#3498db" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper elevation={5} sx={{ p: 2, borderRadius: "12px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)", backgroundColor: "#fff", height: 300, width: 300 }}>
                <Typography variant="h6" sx={{ color: "#993300", mb: 2, fontWeight: "bold" }}>Top Danh Mục Bán Chạy</Typography>
                <ResponsiveContainer width="100%" height={250}>
                  <RechartsBarChart data={data.topCategories}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip />
                    <Legend />
                    <Bar dataKey="revenue" fill="#9b59b6" radius={[10, 10, 0, 0]} />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper elevation={5} sx={{ p: 2, borderRadius: "12px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)", backgroundColor: "#fff", height: 300, width: 300 }}>
                <Typography variant="h6" sx={{ color: "#993300", mb: 2, fontWeight: "bold" }}>Top Sản Phẩm Bán Chạy</Typography>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie data={data.topProducts} dataKey="quantity" nameKey="name" outerRadius={100} label>
                      {data.topProducts.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                    </Pie>
                    <ChartTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
          </Grid>

          {/* Second Row: Charts and List */}
          <Grid container spacing={3} sx={{ mt: 3 }}>
            <Grid item xs={12} md={4}>
              <Paper elevation={5} sx={{ p: 2, borderRadius: "12px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)", backgroundColor: "#fff", height: 300, width: 300 }}>
                <Typography variant="h6" sx={{ color: "#993300", mb: 2, fontWeight: "bold" }}>Số Lượng Đơn Hàng</Typography>
                <ResponsiveContainer width="100%" height={250}>
                  <RechartsBarChart data={data.orders}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" />
                    <YAxis />
                    <ChartTooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#e67e22" radius={[10, 10, 0, 0]} />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper elevation={5} sx={{ p: 2, borderRadius: "12px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)", backgroundColor: "#fff", height: 300, width: 300, overflow: "hidden" }}>
                <Typography variant="h6" sx={{ color: "#993300", mb: 2, fontWeight: "bold" }}>Sản Phẩm Tồn Kho Thấp</Typography>
                {data.inventory.length === 0 ? (
                  <Typography sx={{ color: "#993300" }}>Không có sản phẩm tồn kho thấp</Typography>
                ) : (
                  <Box sx={{ maxHeight: 250, overflowY: "auto" }}>
                    <ul style={{ paddingLeft: 20, margin: 0 }}>
                      {data.inventory.filter(item => item.quantity < 5).map((item, index) => (
                        <li key={index} style={{ color: "#34495e", marginBottom: 8 }}>{item.name} - {item.quantity} cái</li>
                      ))}
                    </ul>
                  </Box>
                )}
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper elevation={5} sx={{ p: 2, borderRadius: "12px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)", backgroundColor: "#fff", height: 300, width: 300 }}>
                <Typography variant="h6" sx={{ color: "#993300", mb: 2, fontWeight: "bold" }}>Trạng Thái Tồn Kho</Typography>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie data={data.stockStatus} dataKey="value" nameKey="name" outerRadius={100} label>
                      {data.stockStatus.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                    </Pie>
                    <ChartTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </motion.div>
    </AdminLayout>
  );
};

export default Dashboard;