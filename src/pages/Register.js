import React, { useState } from 'react';
import {
    Container,
    Typography,
    TextField,
    Button,
    Box,
    Link,
    Alert,
    Paper
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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
            setError(error.response?.data?.message || 'Đăng ký thất bại, thử lại.');
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #926EF0, #5535A0)',
                padding: 2
            }}
        >
            <Container maxWidth="sm">
                <Paper
                    elevation={6}
                    sx={{
                        padding: 4,
                        borderRadius: 3,
                        boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.2)',
                        backgroundColor: 'white',
                    }}
                >
                    <Typography
                        variant="h4"
                        component="h1"
                        align="center"
                        gutterBottom
                        sx={{ fontWeight: 'bold', color: '#3A246E' }}
                    >
                        Đăng ký tài khoản
                    </Typography>

                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
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
                            sx={{
                                mt: 3,
                                mb: 2,
                                backgroundColor: '#5535A0',
                                color: 'white',
                                fontWeight: 'bold',
                                '&:hover': { backgroundColor: '#3A246E' }
                            }}
                        >
                            Đăng ký ngay
                        </Button>
                    </form>

                    <Typography variant="body1" align="center" sx={{ mt: 2 }}>
                        Đã có tài khoản?{' '}
                        <Link href="/login" sx={{ fontWeight: 'bold', color: '#5535A0' }}>
                            Đăng nhập ngay
                        </Link>
                    </Typography>
                </Paper>
            </Container>
        </Box>
    );
};

export default Register;
