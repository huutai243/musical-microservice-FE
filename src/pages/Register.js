import React, { useState } from 'react';
import {
    Container,
    Typography,
    TextField,
    Button,
    Box,
    Link,
    Alert,
    Paper,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
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
                setOpenDialog(true); // Mở Dialog
                setTimeout(() => {
                    setOpenDialog(false); // Đóng Dialog sau 4 giây
                    navigate('/login'); // Chuyển hướng sau khi đóng Dialog
                }, 4000);
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
                padding: 2
            }}
        >
            <Container maxWidth="sm">
                <Paper
                    elevation={6}
                    sx={{
                        padding: 4,
                        borderRadius: 3,
                        border: '2px solid #993300', // Viền màu #993300
                        backgroundColor: 'white',
                    }}
                >
                    <Typography
                        variant="h4"
                        component="h1"
                        align="center"
                        gutterBottom
                        sx={{ fontWeight: 'bold', color: '#993300' }}
                    >
                        Đăng Ký
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
                                backgroundColor: '#993300',
                                color: 'white',
                                fontWeight: 'bold',
                                '&:hover': { backgroundColor: '#7A2600' }
                            }}
                        >
                            Đăng ký ngay
                        </Button>
                    </form>

                    <Typography variant="body1" align="center" sx={{ mt: 2 }}>
                        Đã có tài khoản?{' '}
                        <Link href="/login" sx={{ fontWeight: 'bold', color: '#993300' }}>
                            Đăng nhập ngay
                        </Link>
                    </Typography>
                </Paper>
            </Container>

            {/* Dialog thông báo thành công */}
            <Dialog
                open={openDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                sx={{
                    '& .MuiPaper-root': {
                        backgroundColor: 'white',
                        color: '#993300',
                        textAlign: 'center',
                        borderRadius: 3,
                        padding: 2,
                        boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.3)',
                    }
                }}
            >
                <DialogTitle
                    id="alert-dialog-title"
                    sx={{
                        fontSize: '1.8rem',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        color: '#993300',
                    }}
                >
                    Thành Công!
                </DialogTitle>
                <DialogContent>
                    <DialogContentText
                        id="alert-dialog-description"
                        sx={{
                            color: '#993300',
                            fontSize: '1.2rem',
                            fontWeight: '500',
                        }}
                    >
                        Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.
                    </DialogContentText>
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default Register;
