// src/pages/Register.js
import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Box, Link } from '@mui/material';
import axios from 'axios'; // Sử dụng axios để gọi API
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Kiểm tra mật khẩu và xác nhận mật khẩu
        if (password !== confirmPassword) {
            setError('Mật khẩu và xác nhận mật khẩu không khớp.');
            return;
        }

        try {
            // Gọi API đăng ký
            const response = await axios.post('http://localhost:8080/api/auth/register', {
                userName: username,
                email: email,
                password: password,
            });

            // Xử lý kết quả thành công
            if (response.status === 201) {
                alert(response.data); // Hiển thị thông báo thành công
                navigate('/login'); // Chuyển hướng đến trang đăng nhập
            }
        } catch (error) {
            // Xử lý lỗi từ API
            setError(error.response?.data || 'Đăng ký thất bại. Vui lòng thử lại.');
        }
    };

    return (
        <div>
            <Container maxWidth="sm">
                <Box sx={{ mt: 8, mb: 4 }}>
                    <Typography variant="h4" component="h1" align="center" gutterBottom>
                        Đăng ký
                    </Typography>
                    {error && (
                        <Typography variant="body1" color="error" align="center" sx={{ mb: 2 }}>
                            {error}
                        </Typography>
                    )}
                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            label="Tên đăng nhập"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            margin="normal"
                            required
                        />
                        <TextField
                            fullWidth
                            label="Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            margin="normal"
                            required
                        />
                        <TextField
                            fullWidth
                            label="Mật khẩu"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            margin="normal"
                            required
                        />
                        <TextField
                            fullWidth
                            label="Xác nhận mật khẩu"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            margin="normal"
                            required
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Đăng ký
                        </Button>
                    </form>
                    <Typography variant="body1" align="center" sx={{ mt: 3 }}>
                        Đã có tài khoản? <Link href="/login">Đăng nhập ngay</Link>
                    </Typography>
                </Box>
            </Container>
        </div>
    );
};

export default Register;