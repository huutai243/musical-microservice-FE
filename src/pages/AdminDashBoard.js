import React, { useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Box,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Modal,
  Fade,
  Backdrop,
  IconButton,
  Tooltip,
  Badge,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Pagination,
  Switch,
  FormControlLabel,
  Chip,
  Avatar,
  LinearProgress,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  Store,
  Category,
  ShoppingCart,
  Inventory,
  People,
  BarChart as BarChartIcon,
  Edit,
  Delete,
  Menu as MenuIcon,
  Close,
  Search,
  Add,
  ArrowUpward,
  ArrowDownward,
  FilterList,
  Info,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, Legend, BarChart as RechartsBarChart, Bar } from "recharts";

// Dữ liệu cứng
const initialProducts = [
  { id: 1, name: "Đàn Guitar Yamaha C40", price: 2500000, stock: 10, categoryId: 1, sales: 50, status: "Active", description: "Đàn Guitar chất lượng cao", image: "https://via.placeholder.com/50" },
  { id: 2, name: "Đàn Piano Casio PX-160", price: 12000000, stock: 5, categoryId: 2, sales: 20, status: "Active", description: "Piano điện tử cao cấp", image: "https://via.placeholder.com/50" },
  { id: 3, name: "Đàn Ukulele Fender", price: 1500000, stock: 15, categoryId: 3, sales: 30, status: "Inactive", description: "Ukulele nhỏ gọn", image: "https://via.placeholder.com/50" },
];

const initialCategories = [
  { id: 1, name: "Guitar", description: "Các loại đàn Guitar" },
  { id: 2, name: "Piano", description: "Các loại đàn Piano" },
  { id: 3, name: "Ukulele", description: "Các loại đàn Ukulele" },
];

const initialOrders = [
  { id: 1, userId: 1, total: 5000000, status: "Pending", date: "2025-03-10", items: [{ productId: 1, quantity: 2, price: 2500000 }] },
  { id: 2, userId: 2, total: 12000000, status: "Shipped", date: "2025-03-11", items: [{ productId: 2, quantity: 1, price: 12000000 }] },
];

const initialInventory = [
  { id: 1, productId: 1, quantity: 10, location: "Kho HCM", lastUpdated: "2025-03-10" },
  { id: 2, productId: 2, quantity: 5, location: "Kho HN", lastUpdated: "2025-03-11" },
];

const initialUsers = [
  { id: 1, name: "Nguyễn Văn A", email: "nva@example.com", role: "Customer", status: "Active", avatar: "https://via.placeholder.com/40" },
  { id: 2, name: "Trần Thị B", email: "ttb@example.com", role: "Admin", status: "Active", avatar: "https://via.placeholder.com/40" },
];

const salesData = [
  { month: "Jan", revenue: 40000000, orders: 15 },
  { month: "Feb", revenue: 30000000, orders: 10 },
  { month: "Mar", revenue: 50000000, orders: 20 },
];

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [products, setProducts] = useState(initialProducts);
  const [categories, setCategories] = useState(initialCategories);
  const [orders, setOrders] = useState(initialOrders);
  const [inventory, setInventory] = useState(initialInventory);
  const [users, setUsers] = useState(initialUsers);
  const [openModal, setOpenModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [editItem, setEditItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(5);
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortOrder, setSortOrder] = useState("asc");

  // Animation variants
  const cardVariants = { hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } } };
  const sidebarVariants = { open: { x: 0, transition: { duration: 0.3 } }, closed: { x: "-100%", transition: { duration: 0.3 } } };
  const rowVariants = { hover: { scale: 1.02, backgroundColor: "#f5f5f5", transition: { duration: 0.2 } } };

  // Xử lý sidebar
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Xử lý form
  const handleFormChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // Mở modal
  const handleOpenModal = (type, item = null) => {
    setModalType(type);
    setEditItem(item);
    setFormData(item || (type === "product" ? { name: "", price: "", stock: "", categoryId: "", status: "Active", description: "", image: "" } :
                         type === "category" ? { name: "", description: "" } :
                         type === "order" ? { userId: "", total: "", status: "Pending", items: [] } :
                         type === "inventory" ? { productId: "", quantity: "", location: "" } :
                         { name: "", email: "", role: "Customer", status: "Active", avatar: "" }));
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditItem(null);
    setModalType("");
  };

  // Lưu dữ liệu
  const handleSave = () => {
    const newItem = { id: editItem ? editItem.id : (modalType === "product" ? products : modalType === "category" ? categories : modalType === "order" ? orders : modalType === "inventory" ? inventory : users).length + 1, ...formData };
    if (modalType === "product") {
      newItem.price = Number(newItem.price);
      newItem.stock = Number(newItem.stock);
      newItem.categoryId = Number(newItem.categoryId);
      setProducts(editItem ? products.map(p => p.id === editItem.id ? newItem : p) : [...products, { ...newItem, sales: 0 }]);
    } else if (modalType === "category") {
      setCategories(editItem ? categories.map(c => c.id === editItem.id ? newItem : c) : [...categories, newItem]);
    } else if (modalType === "order") {
      newItem.total = Number(newItem.total);
      setOrders(editItem ? orders.map(o => o.id === editItem.id ? newItem : o) : [...orders, { ...newItem, date: new Date().toISOString().split("T")[0] }]);
    } else if (modalType === "inventory") {
      newItem.quantity = Number(newItem.quantity);
      newItem.lastUpdated = new Date().toISOString().split("T")[0];
      setInventory(editItem ? inventory.map(i => i.id === editItem.id ? newItem : i) : [...inventory, newItem]);
    } else if (modalType === "user") {
      setUsers(editItem ? users.map(u => u.id === editItem.id ? newItem : u) : [...users, newItem]);
    }
    handleCloseModal();
  };

  // Xóa item
  const handleDelete = (type, id) => {
    if (type === "product") setProducts(products.filter(p => p.id !== id));
    else if (type === "category") setCategories(categories.filter(c => c.id !== id));
    else if (type === "order") setOrders(orders.filter(o => o.id !== id));
    else if (type === "inventory") setInventory(inventory.filter(i => i.id !== id));
    else if (type === "user") setUsers(users.filter(u => u.id !== id));
  };

  // Tìm kiếm và lọc
  const filterData = (data, key) => {
    return data.filter(item => 
      (item[key] || item.name || item.email).toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterStatus === "All" || item.status === filterStatus)
    ).sort((a, b) => sortOrder === "asc" ? a[key].localeCompare(b[key]) : b[key].localeCompare(a[key]));
  };

  // Phân trang
  const paginate = (data) => {
    const startIndex = (page - 1) * rowsPerPage;
    return data.slice(startIndex, startIndex + rowsPerPage);
  };

  // Nội dung từng tab
  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <motion.div initial="hidden" animate="visible" variants={cardVariants}>
            <Typography variant="h4" gutterBottom style={{ color: "#2c3e50", fontWeight: "bold", textShadow: "1px 1px 2px rgba(0,0,0,0.1)" }}>
              Tổng Quan
            </Typography>
            <Grid container spacing={3}>
              {[
                { title: "Doanh Thu", value: `${salesData.reduce((sum, d) => sum + d.revenue, 0).toLocaleString("vi-VN")} VND`, icon: <ArrowUpward style={{ color: "#27ae60" }} />, gradient: "linear-gradient(to bottom, #ecf0f1, #bdc3c7)" },
                { title: "Sản Phẩm", value: products.length, icon: <Store style={{ color: "#2980b9" }} />, gradient: "linear-gradient(to bottom, #ecf0f1, #bdc3c7)" },
                { title: "Đơn Hàng", value: orders.length, icon: <ShoppingCart style={{ color: "#e67e22" }} />, gradient: "linear-gradient(to bottom, #ecf0f1, #bdc3c7)" },
                { title: "Người Dùng", value: users.length, icon: <People style={{ color: "#8e44ad" }} />, gradient: "linear-gradient(to bottom, #ecf0f1, #bdc3c7)" },
              ].map((stat, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Card component={motion.div} whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(0,0,0,0.2)" }} style={{ borderRadius: "20px", background: stat.gradient }}>
                    <CardContent>
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box>
                          <Typography variant="h6" style={{ color: "#2c3e50" }}>{stat.title}</Typography>
                          <Typography variant="h5" style={{ fontWeight: "bold", color: "#34495e" }}>{stat.value}</Typography>
                        </Box>
                        {stat.icon}
                      </Box>
                      <LinearProgress variant="determinate" value={Math.min((stat.value / 100) * 10, 100)} sx={{ mt: 2, backgroundColor: "#dfe6e9", "& .MuiLinearProgress-bar": { backgroundColor: "#3498db" } }} />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
              <Grid item xs={12} md={6}>
                <Paper elevation={5} style={{ padding: "20px", borderRadius: "20px", background: "linear-gradient(to bottom, #fff, #f1f2f6)" }}>
                  <Typography variant="h6" style={{ color: "#2c3e50" }}>Doanh Thu Theo Tháng</Typography>
                  <LineChart width={500} height={300} data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#dfe6e9" />
                    <XAxis dataKey="month" stroke="#2c3e50" />
                    <YAxis stroke="#2c3e50" />
                    <ChartTooltip contentStyle={{ backgroundColor: "#fff", borderRadius: "10px" }} />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" stroke="#3498db" strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 8 }} />
                  </LineChart>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper elevation={5} style={{ padding: "20px", borderRadius: "20px", background: "linear-gradient(to bottom, #fff, #f1f2f6)" }}>
                  <Typography variant="h6" style={{ color: "#2c3e50" }}>Đơn Hàng Theo Tháng</Typography>
                  <RechartsBarChart width={500} height={300} data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#dfe6e9" />
                    <XAxis dataKey="month" stroke="#2c3e50" />
                    <YAxis stroke="#2c3e50" />
                    <ChartTooltip contentStyle={{ backgroundColor: "#fff", borderRadius: "10px" }} />
                    <Legend />
                    <Bar dataKey="orders" fill="#e67e22" radius={[10, 10, 0, 0]} />
                  </RechartsBarChart>
                </Paper>
              </Grid>
            </Grid>
          </motion.div>
        );
      case "products":
        const filteredProducts = paginate(filterData(products, "name"));
        return (
          <motion.div initial="hidden" animate="visible" variants={cardVariants}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h4" style={{ color: "#2c3e50", fontWeight: "bold", textShadow: "1px 1px 2px rgba(0,0,0,0.1)" }}>Quản Lý Sản Phẩm</Typography>
              <Box display="flex" gap={2}>
                <TextField variant="outlined" placeholder="Tìm kiếm..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} InputProps={{ startAdornment: <Search /> }} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "25px" } }} />
                <FormControl variant="outlined" sx={{ minWidth: 120 }}>
                  <InputLabel>Trạng Thái</InputLabel>
                  <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                    <MenuItem value="All">Tất Cả</MenuItem>
                    <MenuItem value="Active">Hoạt Động</MenuItem>
                    <MenuItem value="Inactive">Không Hoạt Động</MenuItem>
                  </Select>
                </FormControl>
                <Button variant="contained" style={{ backgroundColor: "#3498db", color: "#fff", borderRadius: "25px" }} startIcon={<Add />} onClick={() => handleOpenModal("product")} component={motion.button} whileHover={{ scale: 1.05 }}>
                  Thêm Sản Phẩm
                </Button>
              </Box>
            </Box>
            <TableContainer component={Paper} elevation={5} style={{ borderRadius: "20px", background: "linear-gradient(to bottom, #fff, #f1f2f6)" }}>
              <Table>
                <TableHead>
                  <TableRow style={{ backgroundColor: "#2c3e50" }}>
                    <TableCell style={{ color: "#fff" }}>Hình Ảnh</TableCell>
                    <TableCell style={{ color: "#fff" }}>ID</TableCell>
                    <TableCell style={{ color: "#fff" }}>Tên</TableCell>
                    <TableCell style={{ color: "#fff" }}>Giá</TableCell>
                    <TableCell style={{ color: "#fff" }}>Tồn Kho</TableCell>
                    <TableCell style={{ color: "#fff" }}>Danh Mục</TableCell>
                    <TableCell style={{ color: "#fff" }}>Doanh Số</TableCell>
                    <TableCell style={{ color: "#fff" }}>Trạng Thái</TableCell>
                    <TableCell style={{ color: "#fff" }}>Hành Động</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <motion.tr key={product.id} variants={rowVariants} whileHover="hover">
                      <TableCell><Avatar src={product.image} /></TableCell>
                      <TableCell>{product.id}</TableCell>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.price.toLocaleString("vi-VN")} VND</TableCell>
                      <TableCell><Badge badgeContent={product.stock} color={product.stock > 5 ? "success" : "error"} /></TableCell>
                      <TableCell>{categories.find(c => c.id === product.categoryId)?.name}</TableCell>
                      <TableCell>{product.sales}</TableCell>
                      <TableCell><Chip label={product.status} color={product.status === "Active" ? "success" : "error"} size="small" /></TableCell>
                      <TableCell>
                        <Tooltip title="Chỉnh sửa"><IconButton onClick={() => handleOpenModal("product", product)} style={{ color: "#3498db" }} component={motion.button} whileHover={{ scale: 1.2 }}><Edit /></IconButton></Tooltip>
                        <Tooltip title="Xóa"><IconButton onClick={() => handleDelete("product", product.id)} style={{ color: "#e74c3c" }} component={motion.button} whileHover={{ scale: 1.2 }}><Delete /></IconButton></Tooltip>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Pagination count={Math.ceil(filterData(products, "name").length / rowsPerPage)} page={page} onChange={(e, value) => setPage(value)} sx={{ mt: 2, display: "flex", justifyContent: "center" }} />
          </motion.div>
        );
      case "categories":
        const filteredCategories = paginate(filterData(categories, "name"));
        return (
          <motion.div initial="hidden" animate="visible" variants={cardVariants}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h4" style={{ color: "#2c3e50", fontWeight: "bold", textShadow: "1px 1px 2px rgba(0,0,0,0.1)" }}>Quản Lý Danh Mục</Typography>
              <Box display="flex" gap={2}>
                <TextField variant="outlined" placeholder="Tìm kiếm..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} InputProps={{ startAdornment: <Search /> }} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "25px" } }} />
                <Button variant="contained" style={{ backgroundColor: "#3498db", color: "#fff", borderRadius: "25px" }} startIcon={<Add />} onClick={() => handleOpenModal("category")} component={motion.button} whileHover={{ scale: 1.05 }}>
                  Thêm Danh Mục
                </Button>
              </Box>
            </Box>
            <TableContainer component={Paper} elevation={5} style={{ borderRadius: "20px", background: "linear-gradient(to bottom, #fff, #f1f2f6)" }}>
              <Table>
                <TableHead>
                  <TableRow style={{ backgroundColor: "#2c3e50" }}>
                    <TableCell style={{ color: "#fff" }}>ID</TableCell>
                    <TableCell style={{ color: "#fff" }}>Tên</TableCell>
                    <TableCell style={{ color: "#fff" }}>Mô Tả</TableCell>
                    <TableCell style={{ color: "#fff" }}>Hành Động</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredCategories.map((category) => (
                    <motion.tr key={category.id} variants={rowVariants} whileHover="hover">
                      <TableCell>{category.id}</TableCell>
                      <TableCell>{category.name}</TableCell>
                      <TableCell>{category.description}</TableCell>
                      <TableCell>
                        <Tooltip title="Chỉnh sửa"><IconButton onClick={() => handleOpenModal("category", category)} style={{ color: "#3498db" }} component={motion.button} whileHover={{ scale: 1.2 }}><Edit /></IconButton></Tooltip>
                        <Tooltip title="Xóa"><IconButton onClick={() => handleDelete("category", category.id)} style={{ color: "#e74c3c" }} component={motion.button} whileHover={{ scale: 1.2 }}><Delete /></IconButton></Tooltip>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Pagination count={Math.ceil(filterData(categories, "name").length / rowsPerPage)} page={page} onChange={(e, value) => setPage(value)} sx={{ mt: 2, display: "flex", justifyContent: "center" }} />
          </motion.div>
        );
      case "orders":
        const filteredOrders = paginate(filterData(orders, "status"));
        return (
          <motion.div initial="hidden" animate="visible" variants={cardVariants}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h4" style={{ color: "#2c3e50", fontWeight: "bold", textShadow: "1px 1px 2px rgba(0,0,0,0.1)" }}>Quản Lý Đơn Hàng</Typography>
              <Box display="flex" gap={2}>
                <TextField variant="outlined" placeholder="Tìm kiếm..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} InputProps={{ startAdornment: <Search /> }} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "25px" } }} />
                <FormControl variant="outlined" sx={{ minWidth: 120 }}>
                  <InputLabel>Trạng Thái</InputLabel>
                  <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                    <MenuItem value="All">Tất Cả</MenuItem>
                    <MenuItem value="Pending">Chờ Xử Lý</MenuItem>
                    <MenuItem value="Shipped">Đã Gửi</MenuItem>
                    <MenuItem value="Delivered">Đã Giao</MenuItem>
                  </Select>
                </FormControl>
                <Button variant="contained" style={{ backgroundColor: "#3498db", color: "#fff", borderRadius: "25px" }} startIcon={<Add />} onClick={() => handleOpenModal("order")} component={motion.button} whileHover={{ scale: 1.05 }}>
                  Thêm Đơn Hàng
                </Button>
              </Box>
            </Box>
            <TableContainer component={Paper} elevation={5} style={{ borderRadius: "20px", background: "linear-gradient(to bottom, #fff, #f1f2f6)" }}>
              <Table>
                <TableHead>
                  <TableRow style={{ backgroundColor: "#2c3e50" }}>
                    <TableCell style={{ color: "#fff" }}>ID</TableCell>
                    <TableCell style={{ color: "#fff" }}>User ID</TableCell>
                    <TableCell style={{ color: "#fff" }}>Tổng Tiền</TableCell>
                    <TableCell style={{ color: "#fff" }}>Trạng Thái</TableCell>
                    <TableCell style={{ color: "#fff" }}>Ngày</TableCell>
                    <TableCell style={{ color: "#fff" }}>Chi Tiết</TableCell>
                    <TableCell style={{ color: "#fff" }}>Hành Động</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <motion.tr key={order.id} variants={rowVariants} whileHover="hover">
                      <TableCell>{order.id}</TableCell>
                      <TableCell>{order.userId}</TableCell>
                      <TableCell>{order.total.toLocaleString("vi-VN")} VND</TableCell>
                      <TableCell><Chip label={order.status} color={order.status === "Pending" ? "warning" : order.status === "Shipped" ? "primary" : "success"} size="small" /></TableCell>
                      <TableCell>{order.date}</TableCell>
                      <TableCell>
                        <Tooltip title="Xem chi tiết"><IconButton style={{ color: "#3498db" }} component={motion.button} whileHover={{ scale: 1.2 }}><Info /></IconButton></Tooltip>
                      </TableCell>
                      <TableCell>
                        <Tooltip title="Chỉnh sửa"><IconButton onClick={() => handleOpenModal("order", order)} style={{ color: "#3498db" }} component={motion.button} whileHover={{ scale: 1.2 }}><Edit /></IconButton></Tooltip>
                        <Tooltip title="Xóa"><IconButton onClick={() => handleDelete("order", order.id)} style={{ color: "#e74c3c" }} component={motion.button} whileHover={{ scale: 1.2 }}><Delete /></IconButton></Tooltip>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Pagination count={Math.ceil(filterData(orders, "status").length / rowsPerPage)} page={page} onChange={(e, value) => setPage(value)} sx={{ mt: 2, display: "flex", justifyContent: "center" }} />
          </motion.div>
        );
      case "inventory":
        const filteredInventory = paginate(filterData(inventory, "productId"));
        return (
          <motion.div initial="hidden" animate="visible" variants={cardVariants}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h4" style={{ color: "#2c3e50", fontWeight: "bold", textShadow: "1px 1px 2px rgba(0,0,0,0.1)" }}>Quản Lý Kho Hàng</Typography>
              <Box display="flex" gap={2}>
                <TextField variant="outlined" placeholder="Tìm kiếm..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} InputProps={{ startAdornment: <Search /> }} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "25px" } }} />
                <Button variant="contained" style={{ backgroundColor: "#3498db", color: "#fff", borderRadius: "25px" }} startIcon={<Add />} onClick={() => handleOpenModal("inventory")} component={motion.button} whileHover={{ scale: 1.05 }}>
                  Thêm Kho
                </Button>
              </Box>
            </Box>
            <TableContainer component={Paper} elevation={5} style={{ borderRadius: "20px", background: "linear-gradient(to bottom, #fff, #f1f2f6)" }}>
              <Table>
                <TableHead>
                  <TableRow style={{ backgroundColor: "#2c3e50" }}>
                    <TableCell style={{ color: "#fff" }}>ID</TableCell>
                    <TableCell style={{ color: "#fff" }}>Sản Phẩm</TableCell>
                    <TableCell style={{ color: "#fff" }}>Số Lượng</TableCell>
                    <TableCell style={{ color: "#fff" }}>Vị Trí</TableCell>
                    <TableCell style={{ color: "#fff" }}>Cập Nhật</TableCell>
                    <TableCell style={{ color: "#fff" }}>Hành Động</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredInventory.map((item) => (
                    <motion.tr key={item.id} variants={rowVariants} whileHover="hover">
                      <TableCell>{item.id}</TableCell>
                      <TableCell>{products.find(p => p.id === item.productId)?.name}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{item.location}</TableCell>
                      <TableCell>{item.lastUpdated}</TableCell>
                      <TableCell>
                        <Tooltip title="Chỉnh sửa"><IconButton onClick={() => handleOpenModal("inventory", item)} style={{ color: "#3498db" }} component={motion.button} whileHover={{ scale: 1.2 }}><Edit /></IconButton></Tooltip>
                        <Tooltip title="Xóa"><IconButton onClick={() => handleDelete("inventory", item.id)} style={{ color: "#e74c3c" }} component={motion.button} whileHover={{ scale: 1.2 }}><Delete /></IconButton></Tooltip>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Pagination count={Math.ceil(filterData(inventory, "productId").length / rowsPerPage)} page={page} onChange={(e, value) => setPage(value)} sx={{ mt: 2, display: "flex", justifyContent: "center" }} />
          </motion.div>
        );
      case "users":
        const filteredUsers = paginate(filterData(users, "email"));
        return (
          <motion.div initial="hidden" animate="visible" variants={cardVariants}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h4" style={{ color: "#2c3e50", fontWeight: "bold", textShadow: "1px 1px 2px rgba(0,0,0,0.1)" }}>Quản Lý Người Dùng</Typography>
              <Box display="flex" gap={2}>
                <TextField variant="outlined" placeholder="Tìm kiếm..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} InputProps={{ startAdornment: <Search /> }} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "25px" } }} />
                <FormControl variant="outlined" sx={{ minWidth: 120 }}>
                  <InputLabel>Trạng Thái</InputLabel>
                  <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                    <MenuItem value="All">Tất Cả</MenuItem>
                    <MenuItem value="Active">Hoạt Động</MenuItem>
                    <MenuItem value="Inactive">Không Hoạt Động</MenuItem>
                  </Select>
                </FormControl>
                <Button variant="contained" style={{ backgroundColor: "#3498db", color: "#fff", borderRadius: "25px" }} startIcon={<Add />} onClick={() => handleOpenModal("user")} component={motion.button} whileHover={{ scale: 1.05 }}>
                  Thêm Người Dùng
                </Button>
              </Box>
            </Box>
            <TableContainer component={Paper} elevation={5} style={{ borderRadius: "20px", background: "linear-gradient(to bottom, #fff, #f1f2f6)" }}>
              <Table>
                <TableHead>
                  <TableRow style={{ backgroundColor: "#2c3e50" }}>
                    <TableCell style={{ color: "#fff" }}>Avatar</TableCell>
                    <TableCell style={{ color: "#fff" }}>ID</TableCell>
                    <TableCell style={{ color: "#fff" }}>Tên</TableCell>
                    <TableCell style={{ color: "#fff" }}>Email</TableCell>
                    <TableCell style={{ color: "#fff" }}>Vai Trò</TableCell>
                    <TableCell style={{ color: "#fff" }}>Trạng Thái</TableCell>
                    <TableCell style={{ color: "#fff" }}>Hành Động</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <motion.tr key={user.id} variants={rowVariants} whileHover="hover">
                      <TableCell><Avatar src={user.avatar} /></TableCell>
                      <TableCell>{user.id}</TableCell>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell><Chip label={user.status} color={user.status === "Active" ? "success" : "error"} size="small" /></TableCell>
                      <TableCell>
                        <Tooltip title="Chỉnh sửa"><IconButton onClick={() => handleOpenModal("user", user)} style={{ color: "#3498db" }} component={motion.button} whileHover={{ scale: 1.2 }}><Edit /></IconButton></Tooltip>
                        <Tooltip title="Xóa"><IconButton onClick={() => handleDelete("user", user.id)} style={{ color: "#e74c3c" }} component={motion.button} whileHover={{ scale: 1.2 }}><Delete /></IconButton></Tooltip>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Pagination count={Math.ceil(filterData(users, "email").length / rowsPerPage)} page={page} onChange={(e, value) => setPage(value)} sx={{ mt: 2, display: "flex", justifyContent: "center" }} />
          </motion.div>
        );
      default:
        return null;
    }
  };

  // Modal form
  const renderModalContent = () => {
    switch (modalType) {
      case "product":
        return (
          <>
            <TextField label="Tên Sản Phẩm" name="name" value={formData.name} onChange={handleFormChange} fullWidth margin="normal" variant="outlined" sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }} />
            <TextField label="Giá (VND)" name="price" type="number" value={formData.price} onChange={handleFormChange} fullWidth margin="normal" variant="outlined" sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }} />
            <TextField label="Tồn Kho" name="stock" type="number" value={formData.stock} onChange={handleFormChange} fullWidth margin="normal" variant="outlined" sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }} />
            <FormControl fullWidth margin="normal">
              <InputLabel>Danh Mục</InputLabel>
              <Select name="categoryId" value={formData.categoryId} onChange={handleFormChange}>
                {categories.map(c => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Trạng Thái</InputLabel>
              <Select name="status" value={formData.status} onChange={handleFormChange}>
                <MenuItem value="Active">Hoạt Động</MenuItem>
                <MenuItem value="Inactive">Không Hoạt Động</MenuItem>
              </Select>
            </FormControl>
            <TextField label="Mô Tả" name="description" value={formData.description} onChange={handleFormChange} fullWidth margin="normal" variant="outlined" multiline rows={3} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }} />
            <TextField label="URL Hình Ảnh" name="image" value={formData.image} onChange={handleFormChange} fullWidth margin="normal" variant="outlined" sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }} />
          </>
        );
      case "category":
        return (
          <>
            <TextField label="Tên Danh Mục" name="name" value={formData.name} onChange={handleFormChange} fullWidth margin="normal" variant="outlined" sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }} />
            <TextField label="Mô Tả" name="description" value={formData.description} onChange={handleFormChange} fullWidth margin="normal" variant="outlined" multiline rows={3} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }} />
          </>
        );
      case "order":
        return (
          <>
            <TextField label="User ID" name="userId" value={formData.userId} onChange={handleFormChange} fullWidth margin="normal" variant="outlined" sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }} />
            <TextField label="Tổng Tiền (VND)" name="total" type="number" value={formData.total} onChange={handleFormChange} fullWidth margin="normal" variant="outlined" sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }} />
            <FormControl fullWidth margin="normal">
              <InputLabel>Trạng Thái</InputLabel>
              <Select name="status" value={formData.status} onChange={handleFormChange}>
                <MenuItem value="Pending">Chờ Xử Lý</MenuItem>
                <MenuItem value="Shipped">Đã Gửi</MenuItem>
                <MenuItem value="Delivered">Đã Giao</MenuItem>
              </Select>
            </FormControl>
          </>
        );
      case "inventory":
        return (
          <>
            <FormControl fullWidth margin="normal">
              <InputLabel>Sản Phẩm</InputLabel>
              <Select name="productId" value={formData.productId} onChange={handleFormChange}>
                {products.map(p => <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>)}
              </Select>
            </FormControl>
            <TextField label="Số Lượng" name="quantity" type="number" value={formData.quantity} onChange={handleFormChange} fullWidth margin="normal" variant="outlined" sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }} />
            <TextField label="Vị Trí" name="location" value={formData.location} onChange={handleFormChange} fullWidth margin="normal" variant="outlined" sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }} />
          </>
        );
      case "user":
        return (
          <>
            <TextField label="Tên Người Dùng" name="name" value={formData.name} onChange={handleFormChange} fullWidth margin="normal" variant="outlined" sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }} />
            <TextField label="Email" name="email" value={formData.email} onChange={handleFormChange} fullWidth margin="normal" variant="outlined" sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }} />
            <FormControl fullWidth margin="normal">
              <InputLabel>Vai Trò</InputLabel>
              <Select name="role" value={formData.role} onChange={handleFormChange}>
                <MenuItem value="Customer">Khách Hàng</MenuItem>
                <MenuItem value="Admin">Quản Trị</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Trạng Thái</InputLabel>
              <Select name="status" value={formData.status} onChange={handleFormChange}>
                <MenuItem value="Active">Hoạt Động</MenuItem>
                <MenuItem value="Inactive">Không Hoạt Động</MenuItem>
              </Select>
            </FormControl>
            <TextField label="URL Avatar" name="avatar" value={formData.avatar} onChange={handleFormChange} fullWidth margin="normal" variant="outlined" sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }} />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", background: "linear-gradient(to bottom, #ecf0f1, #bdc3c7)" }}>
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: sidebarOpen ? 260 : 70,
          flexShrink: 0,
          "& .MuiDrawer-paper": { width: sidebarOpen ? 260 : 70, backgroundColor: "#2c3e50", color: "#fff", overflowX: "hidden", transition: "width 0.3s ease", borderRadius: "0 20px 20px 0" },
        }}
      >
        <motion.div variants={sidebarVariants} animate={sidebarOpen ? "open" : "closed"}>
          <Box p={2} display="flex" justifyContent="space-between" alignItems="center">
            {sidebarOpen && <Typography variant="h6" fontWeight="bold" style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.2)" }}>Admin Dashboard</Typography>}
            <IconButton onClick={toggleSidebar} style={{ color: "#fff" }} component={motion.button} whileHover={{ scale: 1.1 }}>
              {sidebarOpen ? <Close /> : <MenuIcon />}
            </IconButton>
          </Box>
          <Divider sx={{ backgroundColor: "rgba(255,255,255,0.2)" }} />
          <List>
            {[
              { text: "Tổng Quan", icon: <DashboardIcon />, tab: "dashboard" },
              { text: "Sản Phẩm", icon: <Store />, tab: "products" },
              { text: "Danh Mục", icon: <Category />, tab: "categories" },
              { text: "Đơn Hàng", icon: <ShoppingCart />, tab: "orders" },
              { text: "Kho Hàng", icon: <Inventory />, tab: "inventory" },
              { text: "Người Dùng", icon: <People />, tab: "users" },
            ].map((item) => (
              <ListItem
                button
                key={item.text}
                onClick={() => { setActiveTab(item.tab); setSearchTerm(""); setPage(1); setFilterStatus("All"); }}
                sx={{ "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" }, backgroundColor: activeTab === item.tab ? "rgba(255,255,255,0.2)" : "transparent", borderRadius: "0 20px 20px 0" }}
                component={motion.div}
                whileHover={{ x: 5 }}
              >
                <ListItemIcon sx={{ color: "#fff" }}>{item.icon}</ListItemIcon>
                {sidebarOpen && <ListItemText primary={item.text} />}
              </ListItem>
            ))}
          </List>
        </motion.div>
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Container maxWidth="xl">
          {renderContent()}
        </Container>
      </Box>

      {/* Modal */}
      <Modal open={openModal} onClose={handleCloseModal} closeAfterTransition BackdropComponent={Backdrop} BackdropProps={{ timeout: 500 }}>
        <Fade in={openModal}>
          <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 500, bgcolor: "#fff", borderRadius: "20px", p: 4, boxShadow: "0 10px 30px rgba(0,0,0,0.2)" }}>
            <Typography variant="h5" gutterBottom style={{ color: "#2c3e50", fontWeight: "bold", textShadow: "1px 1px 2px rgba(0,0,0,0.1)" }}>
              {editItem ? "Chỉnh Sửa" : "Thêm"} {modalType === "product" ? "Sản Phẩm" : modalType === "category" ? "Danh Mục" : modalType === "order" ? "Đơn Hàng" : modalType === "inventory" ? "Kho" : "Người Dùng"}
            </Typography>
            {renderModalContent()}
            <Box display="flex" justifyContent="flex-end" gap={2} mt={3}>
              <Button onClick={handleCloseModal} style={{ color: "#e74c3c", borderRadius: "25px" }} component={motion.button} whileHover={{ scale: 1.05 }}>Hủy</Button>
              <Button onClick={handleSave} variant="contained" style={{ backgroundColor: "#3498db", color: "#fff", borderRadius: "25px" }} component={motion.button} whileHover={{ scale: 1.05 }}>Lưu</Button>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
};

export default AdminDashboard;