import React, { useState, useEffect } from 'react';
import {
    Container, Typography, Grid, Box, TextField, Button, Avatar, Paper, Divider
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import HomeIcon from '@mui/icons-material/Home';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Header from '../components/Header'; 
import api from '../utils/api'; 

const Profile = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phoneNumber: '',
        address: '',
    });

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
                });
            } catch (error) {
                console.error("Lỗi lấy thông tin user:", error);
                navigate('/login'); 
            }
        };

        fetchUserProfile();
    }, [navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.put('/users/me', { 
                phoneNumber: formData.phoneNumber,
                address: formData.address,
            });
            alert('Thông tin đã được cập nhật!');
        } catch (error) {
            console.error("Lỗi cập nhật thông tin:", error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <>
            <Header /> {/* Header */}
            <Container maxWidth="md" sx={{ mt: 6, mb: 6 }}>
                {user ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
                        <Paper elevation={4} sx={{ p: 4, borderRadius: '12px', boxShadow: '0px 4px 12px rgba(0,0,0,0.1)' }}>
                            
                            {/* Nút Trở về Home */}
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
                                    <Avatar
                                        src={user.avatarUrl || '/default-avatar.png'}
                                        alt={user.fullName}
                                        sx={{
                                            width: 120, height: 120,
                                            boxShadow: '0px 4px 12px rgba(0,0,0,0.2)',
                                            transition: 'transform 0.3s',
                                            '&:hover': { transform: 'scale(1.1)' }
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={9}>
                                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#993300' }}>
                                        {user.fullName}
                                    </Typography>
                                    <Typography variant="body1" sx={{ color: '#666' }}>
                                        Email: {user.email}
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
                                                    '&:hover': { boxShadow: '0px 4px 8px rgba(0,0,0,0.1)' }
                                                }
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
                                                    '&:hover': { boxShadow: '0px 4px 8px rgba(0,0,0,0.1)' }
                                                }
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sx={{ textAlign: 'center', mt: 3 }}>
                                        <motion.div whileHover={{ scale: 1.05 }}>
                                            <Button variant="contained" type="submit" sx={{ bgcolor: '#993300', borderRadius: '8px', '&:hover': { bgcolor: '#7a2600' } }}>
                                                Lưu thay đổi
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
        </>
    );
};

export default Profile;
