import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Box, Paper, Alert } from '@mui/material';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../utils/api';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const { token } = useParams(); // Lấy token từ URL
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Kiểm tra mật khẩu và xác nhận mật khẩu có khớp nhau không
        if (password !== confirmPassword) {
            setError('Mật khẩu và xác nhận mật khẩu không khớp.');
            return;
        }

        try {
            // Gọi API reset-password
            const response = await api.post('/auth/reset-password', {
                token: token,
                newPassword: password,
            });

            if (response.status === 200) {
                setSuccess(true); // Hiển thị thông báo thành công
                setError(''); // Xóa thông báo lỗi nếu có

                // Chuyển hướng về trang đăng nhập sau 3 giây
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại.');
            setSuccess(false); // Ẩn thông báo thành công nếu có lỗi
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 2,
                background: 'linear-gradient(to bottom, #ffffff, #c07b50)',
            }}
        >
            <Container maxWidth="sm">
                <Paper elevation={6} sx={{ padding: 4, borderRadius: 4, backgroundColor: 'white' }}>
                    <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold', color: '#993300' }}>
                        Đặt lại mật khẩu
                    </Typography>

                    {/* Hiển thị thông báo lỗi */}
                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    {/* Hiển thị thông báo thành công */}
                    {success && (
                        <Alert severity="success" sx={{ mb: 2 }}>
                            Mật khẩu đã được đặt lại thành công. Bạn sẽ được chuyển hướng về trang đăng nhập sau 3 giây.
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            label="Mật khẩu mới"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            margin="normal"
                            required
                            sx={{
                                borderRadius: 6,
                                '& .MuiOutlinedInput-root': { borderRadius: 6 },
                            }}
                        />
                        <TextField
                            fullWidth
                            label="Xác nhận mật khẩu"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            margin="normal"
                            required
                            sx={{
                                borderRadius: 6,
                                '& .MuiOutlinedInput-root': { borderRadius: 6 },
                            }}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{
                                mt: 3,
                                mb: 2,
                                backgroundColor: '#993300',
                                color: 'white',
                                fontWeight: 'bold',
                                borderRadius: 4,
                                '&:hover': { backgroundColor: '#7A2600' }
                            }}
                        >
                            Xác nhận
                        </Button>
                    </form>
                </Paper>
            </Container>
        </Box>
    );
};

export default ResetPassword;