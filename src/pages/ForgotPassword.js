import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Box, Link, Paper, Modal, CircularProgress } from '@mui/material';
import axios from 'axios';
import api from '../utils/api';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [openModal, setOpenModal] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/auth/forgot-password', { email });
            setOpenModal(true);
            setTimeout(() => setOpenModal(false), 4000);
        } catch (error) {
            console.error('Lỗi gửi yêu cầu quên mật khẩu:', error);
        } finally {
            setLoading(false);
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
                        Quên Mật Khẩu
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
                            sx={{
                                borderRadius: 6,
                                '& .MuiOutlinedInput-root': { borderRadius: 6 },
                            }}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={loading}
                            sx={{
                                mt: 3,
                                mb: 2,
                                backgroundColor: '#993300',
                                color: 'white',
                                fontWeight: 'bold',
                                borderRadius: 6,
                                '&:hover': { backgroundColor: '#7A2600' }
                            }}
                        >
                            {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Xác nhận'}
                        </Button>
                    </form>
                    <Box display="flex" justifyContent="flex-end">
                        <Link href="/login" sx={{ fontWeight: 'bold', color: '#993300' }}>
                            Quay lại
                        </Link>
                    </Box>
                </Paper>
            </Container>
            {/* Modal thông báo */}
            <Modal
                open={openModal}
                onClose={() => setOpenModal(false)}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Paper
                    elevation={6}
                    sx={{
                        padding: 4,
                        borderRadius: 4,
                        textAlign: 'center',
                        backgroundColor: 'white',
                        width: '400px',
                    }}
                >
                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#993300', mb: 2 }}>
                        Thông Báo
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2, fontSize: '1.1rem' }}>
                        Vui lòng kiểm tra email để thay đổi mật khẩu.
                    </Typography>
                </Paper>
            </Modal>
        </Box>
    );
};

export default ForgotPassword;