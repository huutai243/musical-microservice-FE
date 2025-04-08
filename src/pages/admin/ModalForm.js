import React from "react";
import {
  Modal, Box, Typography, TextField, Button, FormControl, InputLabel, Select, MenuItem,
} from "@mui/material";
import { motion } from "framer-motion";

const ModalForm = ({ open, onClose, onSave, type, initialData }) => {
  const [formData, setFormData] = React.useState(initialData || {});

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    onSave(formData);
  };

  const renderFields = () => {
    switch (type) {
      case "product":
        return (
          <>
            <TextField label="Tên" name="name" value={formData.name || ""} onChange={handleChange} fullWidth margin="normal" />
            <TextField label="Giá (VND)" name="price" type="number" value={formData.price || ""} onChange={handleChange} fullWidth margin="normal" />
            <TextField label="Tồn Kho" name="stock" type="number" value={formData.stock || ""} onChange={handleChange} fullWidth margin="normal" />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          backgroundColor: "#fff",
          padding: 20,
          borderRadius: "15px",
        }}
      >
        <Typography variant="h5" gutterBottom>
          {initialData ? "Chỉnh Sửa" : "Thêm"} {type === "product" ? "Sản Phẩm" : ""}
        </Typography>
        {renderFields()}
        <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
          <Button onClick={onClose} sx={{ color: "#e74c3c" }}>Hủy</Button>
          <Button onClick={handleSubmit} variant="contained" sx={{ backgroundColor: "#3498db" }}>Lưu</Button>
        </Box>
      </motion.div>
    </Modal>
  );
};

export default ModalForm;