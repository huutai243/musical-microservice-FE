// src/pages/Register.js
import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Box, Link } from '@mui/material';
import axios from 'axios';
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
    
        if (password !== confirmPassword) {
            setError('Mật khẩu và xác nhận mật khẩu không khớp.');
            return;
        }
    
        try {
            const response = await axios.post(
                'http://localhost:9000/api/auth/register',
                { username, email, password }
            );
            
            if (response.status === 200 && response.data.message) {
                alert(response.data.message);
                navigate('/login');
            } else {
                setError('Đăng ký thất bại. Server không trả về dữ liệu mong đợi.');
            }
        } catch (error) {
            console.error('Lỗi đăng ký:', error);
            setError(error.response?.data?.message || "Đăng ký thất bại, thử lại.");
        }
    };
    
    

    return (
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
    );
};

export default Register;
