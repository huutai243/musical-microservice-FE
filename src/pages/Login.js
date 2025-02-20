// src/pages/Login.js
import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Box } from '@mui/material';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Gửi dữ liệu đăng nhập đến backend
        console.log('Email:', email, 'Password:', password);
    };

    return (
        <div>
            <Header />
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
                </Box>
            </Container>
            <Footer />
        </div>
    );
};

export default Login;