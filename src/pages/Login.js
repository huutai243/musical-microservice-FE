// src/pages/Login.js
import React, { useState } from 'react';
import {
    Container,
    Typography,
    TextField,
    Button,
    Box,
    Grid,
    Link,
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:9000/api/auth/login', {
                username: email,
                password: password,
            });

            localStorage.setItem('accessToken', response.data.accessToken);
            localStorage.setItem('refreshToken', response.data.refreshToken);

            const user = { email };
            localStorage.setItem('user', JSON.stringify(user));

            navigate('/');
        } catch (error) {
            setError(error.response?.data || 'Đăng nhập thất bại. Vui lòng thử lại.');
        }
    };

    const handleGoogleLogin = async (e) => {
        e.preventDefault();
        // Logic đăng nhập Google
    };

    const handleFacebookLogin = async (e) => {
        e.preventDefault();
        // Logic đăng nhập Facebook
    };

    return (
        <div>
            <Container maxWidth="sm">
                <Box sx={{ mt: 8, mb: 4 }}>
                    <Typography variant="h4" component="h1" align="center" gutterBottom>
                        Đăng nhập
                    </Typography>
                    {error && (
                        <Typography variant="body1" color="error" align="center" sx={{ mb: 2 }}>
                            {error}
                        </Typography>
                    )}
                    <form onSubmit={handleSubmit}>
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
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Đăng nhập
                        </Button>
                    </form>
                    <Grid container spacing={2} justifyContent="center" sx={{ mt: 3 }}>
                        <Grid item>
                            <Button
                                type="button"
                                variant="contained"
                                sx={{ backgroundColor: '#DB4437', color: 'white', '&:hover': { backgroundColor: '#C1351D' }, minWidth: 'auto', padding: '10px' }}
                                onClick={handleGoogleLogin}
                            >
                                <GoogleIcon />
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button
                                type="button"
                                variant="contained"
                                sx={{ backgroundColor: '#1877F2', color: 'white', '&:hover': { backgroundColor: '#1466C0' }, minWidth: 'auto', padding: '10px' }}
                                onClick={handleFacebookLogin}
                            >
                                <FacebookIcon />
                            </Button>
                        </Grid>
                    </Grid>
                    <Typography variant="body1" align="center" sx={{ mt: 3 }}>
                        Chưa có tài khoản? <Link href="/register">Đăng ký ngay</Link>
                    </Typography>
                </Box>
            </Container>
        </div>
    );
};

export default Login;