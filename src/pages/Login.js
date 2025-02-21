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
import { auth, googleProvider, facebookProvider, signInWithPopup } from '../firebase';
import { useNavigate } from 'react-router-dom'; // Sử dụng useNavigate để chuyển hướng

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); // Khởi tạo useNavigate

    const handleSubmit = (e) => {
        e.preventDefault();
        // Xử lý đăng nhập bằng email/password
        console.log('Email:', email, 'Password:', password);
    };

    const handleGoogleLogin = async (e) => {
        e.preventDefault();
        try {
            await signInWithPopup(auth, googleProvider);
            console.log('Đăng nhập bằng Google thành công!');
            navigate('/'); // Chuyển hướng về trang chủ
        } catch (error) {
            console.error('Lỗi đăng nhập bằng Google:', error);
        }
    };

    const handleFacebookLogin = async (e) => {
        e.preventDefault();
        try {
            await signInWithPopup(auth, facebookProvider);
            console.log('Đăng nhập bằng Facebook thành công!');
            navigate('/'); // Chuyển hướng về trang chủ
        } catch (error) {
            console.error('Lỗi đăng nhập bằng Facebook:', error);
        }
    };

    return (
        <div>
            <Container maxWidth="sm">
                <Box sx={{ mt: 8, mb: 4 }}>
                    <Typography variant="h4" component="h1" align="center" gutterBottom>
                        Đăng nhập
                    </Typography>
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
                    {/* Nút đăng nhập bằng Google và Facebook */}
                    <Grid container spacing={2} justifyContent="center" sx={{ mt: 3 }}>
                        {/* Nút đăng nhập bằng Google */}
                        <Grid item>
                            <Button
                                type="button"
                                variant="contained"
                                sx={{
                                    backgroundColor: '#DB4437',
                                    color: 'white',
                                    '&:hover': { backgroundColor: '#C1351D' },
                                    minWidth: 'auto',
                                    padding: '10px',
                                }}
                                onClick={handleGoogleLogin}
                            >
                                <GoogleIcon />
                            </Button>
                        </Grid>
                        {/* Nút đăng nhập bằng Facebook */}
                        <Grid item>
                            <Button
                                type="button"
                                variant="contained"
                                sx={{
                                    backgroundColor: '#1877F2',
                                    color: 'white',
                                    '&:hover': { backgroundColor: '#1466C0' },
                                    minWidth: 'auto',
                                    padding: '10px',
                                }}
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