import React, { useState } from "react";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Pagination,
  Chip,
  Switch,
  FormControlLabel,
} from "@mui/material";
import {
  Discount as DiscountIcon,
  Edit,
  Delete,
  Search,
  Add,
  FilterList,
  Info,
} from "@mui/icons-material";
import { motion } from "framer-motion";

// Dữ liệu cứng
const initialDiscounts = [
  { id: 1, code: "SUMMER2025", discount: 20, type: "Percent", startDate: "2025-06-01", endDate: "2025-08-31", status: "Active", maxUses: 100, used: 45 },
  { id: 2, code: "WINTERSALE", discount: 500000, type: "Fixed", startDate: "2025-12-01", endDate: "2025-12-31", status: "Inactive", maxUses: 50, used: 10 },
  { id: 3, code: "FREESHIP", discount: 100, type: "Percent", startDate: "2025-03-01", endDate: "2025-03-31", status: "Active", maxUses: 200, used: 150 },
];

const Discount = () => {
  const [discounts, setDiscounts] = useState(initialDiscounts);
  const [openModal, setOpenModal] = useState(false);
  const [modalType, setModalType] = useState("add");
  const [editItem, setEditItem] = useState(null);
  const [formData, setFormData] = useState({
    code: "",
    discount: "",
    type: "Percent",
    startDate: "",
    endDate: "",
    status: "Active",
    maxUses: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(5);

  // Animation variants
  const cardVariants = { hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } } };
  const rowVariants = { hover: { scale: 1.02, backgroundColor: "#f5f5f5", transition: { duration: 0.2 } } };
  const buttonVariants = { hover: { scale: 1.05, transition: { duration: 0.2 } } };

  // Xử lý form
  const handleFormChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // Mở modal
  const handleOpenModal = (type, item = null) => {
    setModalType(type);
    setEditItem(item);
    setFormData(item || { code: "", discount: "", type: "Percent", startDate: "", endDate: "", status: "Active", maxUses: "" });
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditItem(null);
    setModalType("");
  };

  // Lưu dữ liệu
  const handleSave = () => {
    const newItem = {
      id: editItem ? editItem.id : discounts.length + 1,
      ...formData,
      discount: Number(formData.discount),
      maxUses: Number(formData.maxUses),
      used: editItem ? editItem.used : 0,
    };
    if (modalType === "add") {
      setDiscounts([...discounts, newItem]);
    } else {
      setDiscounts(discounts.map(d => d.id === editItem.id ? newItem : d));
    }
    handleCloseModal();
  };

  // Xóa mã giảm giá
  const handleDelete = (id) => {
    setDiscounts(discounts.filter(d => d.id !== id));
  };

  // Tìm kiếm và lọc
  const filterData = () => {
    return discounts.filter(d =>
      d.code.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterStatus === "All" || d.status === filterStatus)
    );
  };

  // Phân trang
  const paginate = (data) => {
    const startIndex = (page - 1) * rowsPerPage;
    return data.slice(startIndex, startIndex + rowsPerPage);
  };

  const filteredDiscounts = paginate(filterData());

  return (
    <Box sx={{ minHeight: "100vh", background: "linear-gradient(to bottom, #e0f7fa, #b2ebf2)", p: 3 }}>
      <Container maxWidth="lg">
        <motion.div initial="hidden" animate="visible" variants={cardVariants}>
          {/* Header */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
            <Typography variant="h4" style={{ color: "#00695c", fontWeight: "bold", textShadow: "1px 1px 2px rgba(0,0,0,0.1)" }}>
              Quản Lý Mã Giảm Giá
            </Typography>
            <Box display="flex" gap={2}>
              <TextField
                variant="outlined"
                placeholder="Tìm kiếm mã..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{ startAdornment: <Search style={{ color: "#00695c" }} /> }}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "25px", backgroundColor: "#fff" } }}
              />
              <FormControl variant="outlined" sx={{ minWidth: 120 }}>
                <InputLabel>Trạng Thái</InputLabel>
                <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                  <MenuItem value="All">Tất Cả</MenuItem>
                  <MenuItem value="Active">Hoạt Động</MenuItem>
                  <MenuItem value="Inactive">Không Hoạt Động</MenuItem>
                </Select>
              </FormControl>
              <Button
                variant="contained"
                style={{ backgroundColor: "#00695c", color: "#fff", borderRadius: "25px" }}
                startIcon={<Add />}
                onClick={() => handleOpenModal("add")}
                component={motion.button}
                variants={buttonVariants}
                whileHover="hover"
              >
                Thêm Mã
              </Button>
            </Box>
          </Box>

          {/* Table */}
          <TableContainer component={Paper} elevation={5} style={{ borderRadius: "20px", background: "linear-gradient(to bottom, #fff, #f1f2f6)" }}>
            <Table>
              <TableHead>
                <TableRow style={{ backgroundColor: "#00695c" }}>
                  <TableCell style={{ color: "#fff", fontWeight: "bold" }}>ID</TableCell>
                  <TableCell style={{ color: "#fff", fontWeight: "bold" }}>Mã</TableCell>
                  <TableCell style={{ color: "#fff", fontWeight: "bold" }}>Giảm Giá</TableCell>
                  <TableCell style={{ color: "#fff", fontWeight: "bold" }}>Loại</TableCell>
                  <TableCell style={{ color: "#fff", fontWeight: "bold" }}>Bắt Đầu</TableCell>
                  <TableCell style={{ color: "#fff", fontWeight: "bold" }}>Kết Thúc</TableCell>
                  <TableCell style={{ color: "#fff", fontWeight: "bold" }}>Trạng Thái</TableCell>
                  <TableCell style={{ color: "#fff", fontWeight: "bold" }}>Sử Dụng/Tối Đa</TableCell>
                  <TableCell style={{ color: "#fff", fontWeight: "bold" }}>Hành Động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredDiscounts.map((discount) => (
                  <motion.tr key={discount.id} variants={rowVariants} whileHover="hover">
                    <TableCell>{discount.id}</TableCell>
                    <TableCell>{discount.code}</TableCell>
                    <TableCell>
                      {discount.type === "Percent" ? `${discount.discount}%` : `${discount.discount.toLocaleString("vi-VN")} VND`}
                    </TableCell>
                    <TableCell>{discount.type === "Percent" ? "Phần Trăm" : "Cố Định"}</TableCell>
                    <TableCell>{discount.startDate}</TableCell>
                    <TableCell>{discount.endDate}</TableCell>
                    <TableCell>
                      <Chip
                        label={discount.status}
                        color={discount.status === "Active" ? "success" : "error"}
                        size="small"
                        sx={{ fontWeight: "bold" }}
                      />
                    </TableCell>
                    <TableCell>{`${discount.used}/${discount.maxUses}`}</TableCell>
                    <TableCell>
                      <Tooltip title="Chỉnh sửa">
                        <IconButton
                          onClick={() => handleOpenModal("edit", discount)}
                          style={{ color: "#0288d1" }}
                          component={motion.button}
                          whileHover={{ scale: 1.2 }}
                        >
                          <Edit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Xóa">
                        <IconButton
                          onClick={() => handleDelete(discount.id)}
                          style={{ color: "#d32f2f" }}
                          component={motion.button}
                          whileHover={{ scale: 1.2 }}
                        >
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          <Pagination
            count={Math.ceil(filterData().length / rowsPerPage)}
            page={page}
            onChange={(e, value) => setPage(value)}
            sx={{ mt: 3, display: "flex", justifyContent: "center" }}
            color="primary"
          />
        </motion.div>

        {/* Modal */}
        <Modal open={openModal} onClose={handleCloseModal} closeAfterTransition BackdropComponent={Backdrop} BackdropProps={{ timeout: 500 }}>
          <Fade in={openModal}>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 450,
                bgcolor: "#fff",
                borderRadius: "20px",
                p: 4,
                boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
              }}
            >
              <Typography variant="h5" gutterBottom style={{ color: "#00695c", fontWeight: "bold", textShadow: "1px 1px 2px rgba(0,0,0,0.1)" }}>
                {modalType === "add" ? "Thêm Mã Giảm Giá" : "Chỉnh Sửa Mã Giảm Giá"}
              </Typography>
              <TextField
                label="Mã Giảm Giá"
                name="code"
                value={formData.code}
                onChange={handleFormChange}
                fullWidth
                margin="normal"
                variant="outlined"
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
              />
              <TextField
                label="Giá Trị Giảm"
                name="discount"
                type="number"
                value={formData.discount}
                onChange={handleFormChange}
                fullWidth
                margin="normal"
                variant="outlined"
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>Loại Giảm Giá</InputLabel>
                <Select name="type" value={formData.type} onChange={handleFormChange}>
                  <MenuItem value="Percent">Phần Trăm</MenuItem>
                  <MenuItem value="Fixed">Cố Định</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Ngày Bắt Đầu"
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleFormChange}
                fullWidth
                margin="normal"
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
              />
              <TextField
                label="Ngày Kết Thúc"
                name="endDate"
                type="date"
                value={formData.endDate}
                onChange={handleFormChange}
                fullWidth
                margin="normal"
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>Trạng Thái</InputLabel>
                <Select name="status" value={formData.status} onChange={handleFormChange}>
                  <MenuItem value="Active">Hoạt Động</MenuItem>
                  <MenuItem value="Inactive">Không Hoạt Động</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Số Lần Sử Dụng Tối Đa"
                name="maxUses"
                type="number"
                value={formData.maxUses}
                onChange={handleFormChange}
                fullWidth
                margin="normal"
                variant="outlined"
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
              />
              <Box display="flex" justifyContent="flex-end" gap={2} mt={3}>
                <Button
                  onClick={handleCloseModal}
                  style={{ color: "#d32f2f", borderRadius: "25px" }}
                  component={motion.button}
                  variants={buttonVariants}
                  whileHover="hover"
                >
                  Hủy
                </Button>
                <Button
                  onClick={handleSave}
                  variant="contained"
                  style={{ backgroundColor: "#00695c", color: "#fff", borderRadius: "25px" }}
                  component={motion.button}
                  variants={buttonVariants}
                  whileHover="hover"
                >
                  Lưu
                </Button>
              </Box>
            </Box>
          </Fade>
        </Modal>
      </Container>
    </Box>
  );
};

export default Discount;