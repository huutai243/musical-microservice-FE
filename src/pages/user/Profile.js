import React, { useState, useEffect } from 'react';
import {
    Container, Typography, Grid, Box, TextField, Button, Avatar, Paper, Divider, IconButton, Snackbar, Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import HomeIcon from '@mui/icons-material/Home';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import Header from '../../components/Header';
import api from '../../utils/api';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState('');
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phoneNumber: '',
        address: '',
        avatarUrl: '',
        avatarFile: null,
    });
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [saving, setSaving] = useState(false);

    // Hàm giải mã JWT
    const decodeJWT = (token) => {
        try {
            const base64Url = token.split('.')[1]; // Lấy phần payload
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
                atob(base64)
                    .split('')
                    .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                    .join('')
            );
            return JSON.parse(jsonPayload);
        } catch (error) {
            console.error('Lỗi giải mã JWT:', error);
            return null;
        }
    };

    // Hàm chuẩn hóa vai trò
    const normalizeRole = (role) => {
        if (role.toUpperCase().includes('USER')) return 'Người Dùng';
        if (role.toUpperCase().includes('ADMIN')) return 'Admin';
        return role;
    };

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await api.get('/users/me');
                setUser(response.data);
                setFormData({
                    fullName: response.data.fullName || '',
                    email: response.data.email || '',
                    phoneNumber: response.data.phoneNumber || '',
                    address: response.data.address || '',
                    avatarUrl: response.data.avatarUrl || '/default-avatar.png',
                    avatarFile: null,
                });

                // Lấy vai trò từ JWT
                const token = localStorage.getItem('accessToken');
                if (token) {
                    const payload = decodeJWT(token);
                    if (payload) {
                        // Kiểm tra trường roles (mảng) hoặc role (chuỗi)
                        const userRole = payload.roles?.[0] || payload.role || 'USER';
                        setRole(normalizeRole(userRole));
                    } else {
                        setRole('Người Dùng'); // Mặc định nếu không giải mã được
                    }
                } else {
                    setRole('Người Dùng'); // Mặc định nếu không có token
                }
            } catch (error) {
                console.error('Lỗi lấy thông tin user:', error);
                navigate('/login');
            }
        };

        fetchUserProfile();
    }, [navigate]);

    useEffect(() => {
        return () => {
            if (formData.avatarUrl && formData.avatarUrl.startsWith('blob:')) {
                URL.revokeObjectURL(formData.avatarUrl);
            }
        };
    }, [formData.avatarUrl]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (['image/jpeg', 'image/png'].includes(file.type)) {
                const tempUrl = URL.createObjectURL(file);
                setFormData({
                    ...formData,
                    avatarFile: file,
                    avatarUrl: tempUrl,
                });
            } else {
                setSnackbarMessage('Vui lòng chọn file ảnh JPEG hoặc PNG!');
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user?.id) {
            setSnackbarMessage('Không thể xác định người dùng. Vui lòng đăng nhập lại!');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            return;
        }

        try {
            setSaving(true);

            // Cập nhật phoneNumber và address
            await api.put(`/users/update-profile/${user.id}`, {
                phoneNumber: formData.phoneNumber,
                address: formData.address,
            });

            // Cập nhật avatar nếu có
            if (formData.avatarFile) {
                const formDataApi = new FormData();
                formDataApi.append('image', formData.avatarFile);
                formDataApi.append('userId', user.id.toString());
                await api.put('/users/update-avatar', formDataApi);
            }

            // Lấy lại thông tin người dùng để cập nhật giao diện
            const response = await api.get('/users/me');
            setUser(response.data);
            setFormData({
                fullName: response.data.fullName || '',
                email: response.data.email || '',
                phoneNumber: response.data.phoneNumber || '',
                address: response.data.address || '',
                avatarUrl: response.data.avatarUrl || '/default-avatar.png',
                avatarFile: null,
            });

            setSnackbarMessage('Thông tin đã được cập nhật!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
        } catch (error) {
            console.error('Lỗi cập nhật thông tin:', error);
            let errorMessage = 'Không thể cập nhật thông tin! Vui lòng thử lại.';
            if (error.response) {
                if (error.response.status === 403) {
                    errorMessage = 'Bạn không có quyền thực hiện hành động này!';
                } else if (error.response.status === 400) {
                    errorMessage = error.response.data.message || 'Dữ liệu không hợp lệ! Vui lòng kiểm tra lại.';
                }
            }
            setSnackbarMessage(errorMessage);
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        } finally {
            setSaving(false);
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <>
            <Header />
            <Container maxWidth="md" sx={{ mt: 6, mb: 6 }}>
                {user ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
                        <Paper elevation={4} sx={{ p: 4, borderRadius: '12px', boxShadow: '0px 4px 12px rgba(0,0,0,0.1)' }}>
                            {/* Nút Trở về Home và Đăng xuất */}
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                <motion.div whileHover={{ scale: 1.1 }}>
                                    <Button
                                        onClick={() => navigate('/')}
                                        startIcon={<HomeIcon />}
                                        sx={{ bgcolor: '#993300', color: 'white', '&:hover': { bgcolor: '#7a2600' } }}
                                    >
                                        Trang chủ
                                    </Button>
                                </motion.div>
                                <motion.div whileHover={{ scale: 1.1 }}>
                                    <Button
                                        onClick={handleLogout}
                                        startIcon={<ArrowBackIcon />}
                                        variant="outlined"
                                        color="error"
                                    >
                                        Đăng xuất
                                    </Button>
                                </motion.div>
                            </Box>

                            {/* Avatar và Thông tin cơ bản */}
                            <Grid container spacing={3} alignItems="center">
                                <Grid item xs={12} md={3} sx={{ textAlign: 'center' }}>
                                    <Box
                                        sx={{
                                            position: 'relative',
                                            width: 120,
                                            height: 120,
                                            '&:hover .edit-icon': { opacity: 1 },
                                        }}
                                    >
                                        <Avatar
                                            src={formData.avatarUrl}
                                            alt={user.fullName}
                                            sx={{
                                                width: 120,
                                                height: 120,
                                                boxShadow: '0px 4px 12px rgba(0,0,0,0.2)',
                                                transition: 'transform 0.3s',
                                                '&:hover': { transform: 'scale(1.1)' },
                                            }}
                                        />
                                        <IconButton
                                            className="edit-icon"
                                            sx={{
                                                position: 'absolute',
                                                top: '50%',
                                                left: '50%',
                                                transform: 'translate(-50%, -50%)',
                                                opacity: 0,
                                                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                                color: 'white',
                                                transition: 'opacity 0.2s ease-in-out',
                                                '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.7)' },
                                            }}
                                            onClick={() => document.getElementById('avatar-input').click()}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <input
                                            type="file"
                                            id="avatar-input"
                                            hidden
                                            accept="image/jpeg,image/png"
                                            onChange={handleAvatarChange}
                                        />
                                    </Box>
                                </Grid>
                                <Grid item xs={12} md={9}>
                                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#993300' }}>
                                        {user.fullName}
                                    </Typography>
                                    <Typography variant="body1" sx={{ color: '#666' }}>
                                        Email: {user.email}
                                    </Typography>
                                    <Typography variant="body1" sx={{ color: '#666' }}>
                                        Vai trò: {role}
                                    </Typography>
                                </Grid>
                            </Grid>

                            <Divider sx={{ my: 3 }} />

                            {/* Form cập nhật thông tin */}
                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#993300', mb: 2 }}>
                                Cập nhật thông tin cá nhân
                            </Typography>
                            <Box component="form" onSubmit={handleSubmit}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            label="Số điện thoại"
                                            name="phoneNumber"
                                            value={formData.phoneNumber}
                                            onChange={handleChange}
                                            fullWidth
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: '8px',
                                                    '&:hover': { boxShadow: '0px 4px 8px rgba(0,0,0,0.1)' },
                                                },
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            label="Địa chỉ"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            fullWidth
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: '8px',
                                                    '&:hover': { boxShadow: '0px 4px 8px rgba(0,0,0,0.1)' },
                                                },
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sx={{ textAlign: 'center', mt: 3 }}>
                                        <motion.div whileHover={{ scale: 1.05 }}>
                                            <Button
                                                variant="contained"
                                                type="submit"
                                                disabled={saving}
                                                sx={{
                                                    bgcolor: '#993300',
                                                    borderRadius: '8px',
                                                    '&:hover': { bgcolor: '#7a2600' },
                                                }}
                                            >
                                                {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                                            </Button>
                                        </motion.div>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Paper>
                    </motion.div>
                ) : (
                    <Typography variant="h5" sx={{ textAlign: 'center', color: '#993300', fontWeight: 'bold' }}>
                        Đang tải thông tin...
                    </Typography>
                )}
            </Container>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={4000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    severity={snackbarSeverity}
                    sx={{
                        width: '100%',
                        '& .MuiAlert-message': { fontWeight: 'bold' },
                        backgroundColor: snackbarSeverity === 'success' ? '#993300' : '#e74c3c',
                        color: 'white',
                    }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </>
    );
};

export default Profile;