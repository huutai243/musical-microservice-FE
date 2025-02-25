import React, { useState } from 'react';
import {
    Container,
    Typography,
    TextField,
    Button,
    Box,
    Grid,
    Link,
    Alert,
    Paper
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!username || !password) {
            setError('Vui lòng nhập tên đăng nhập và mật khẩu.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:9000/api/auth/login', {
                username,
                password,
            });

            localStorage.setItem('accessToken', response.data.accessToken);
            localStorage.setItem('refreshToken', response.data.refreshToken);
            localStorage.setItem('user', JSON.stringify({ username }));

            navigate('/');
        } catch (error) {
            console.error("Lỗi đăng nhập:", error.response);
            setError(error.response?.data?.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
        }
    };

    const handleGoogleLogin = async (e) => {
        e.preventDefault();
        console.log("Đăng nhập bằng Google");
    };

    const handleFacebookLogin = async (e) => {
        e.preventDefault();
        console.log("Đăng nhập bằng Facebook");
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
                        Đăng nhập
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
                            label="Mật khẩu"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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
                            Đăng nhập
                        </Button>
                    </form>

                    {/* Đăng nhập bằng Google & Facebook */}
                    <Grid container spacing={2} justifyContent="center" sx={{ mt: 2 }}>
                        <Grid item>
                            <Button
                                type="button"
                                variant="contained"
                                sx={{
                                    backgroundColor: '#DB4437',
                                    color: 'white',
                                    minWidth: 'auto',
                                    padding: '10px',
                                    transition: 'transform 0.2s ease-in-out',
                                    '&:hover': { backgroundColor: '#C1351D', transform: 'scale(1.1)' }
                                }}
                                onClick={handleGoogleLogin}
                            >
                                <GoogleIcon />
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button
                                type="button"
                                variant="contained"
                                sx={{
                                    backgroundColor: '#1877F2',
                                    color: 'white',
                                    minWidth: 'auto',
                                    padding: '10px',
                                    transition: 'transform 0.2s ease-in-out',
                                    '&:hover': { backgroundColor: '#1466C0', transform: 'scale(1.1)' }
                                }}
                                onClick={handleFacebookLogin}
                            >
                                <FacebookIcon />
                            </Button>
                        </Grid>
                    </Grid>

                    <Typography variant="body1" align="center" sx={{ mt: 2 }}>
                        Chưa có tài khoản?{' '}
                        <Link href="/register" sx={{ fontWeight: 'bold', color: '#5535A0' }}>
                            Đăng ký ngay
                        </Link>
                    </Typography>
                </Paper>
            </Container>
        </Box>
    );
};

export default Login;
