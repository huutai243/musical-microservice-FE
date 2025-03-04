import React from 'react';
import { Box, Divider, Typography, Grid, TextField, Button, IconButton } from '@mui/material';
import VisaIcon from '@mui/icons-material/CreditCard'; // Thay thế bằng biểu tượng VISA thực tế
import MasterCardIcon from '@mui/icons-material/Payment'; // Thay thế bằng biểu tượng MasterCard thực tế
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';

const Footer = () => {
    return (
        <Box sx={{ bgcolor: 'white', color: '#993300' }}>
            <Divider sx={{ mb: 2, borderColor: "#993300", borderWidth: 2 }} />
            <Grid sx={{ p: 4 }} container spacing={4}>
                <Grid  item xs={12} sm={3}>
                    <Typography variant="h6">Krist</Typography>
                    <Typography variant="body2">(704) 555-0127</Typography>
                    <Typography variant="body2">krist@example.com</Typography>
                    <Typography variant="body2">3891 Ranchview Dr. Richardson, California 62639</Typography>
                </Grid>
                <Grid item xs={12} sm={3}>
                    <Typography variant="subtitle1">Information</Typography>
                    <Typography variant="body2">My Account</Typography>
                    <Typography variant="body2">Login</Typography>
                    <Typography variant="body2">My Cart</Typography>
                    <Typography variant="body2">My Wishlist</Typography>
                    <Typography variant="body2">Checkout</Typography>
                </Grid>
                <Grid item xs={12} sm={3}>
                    <Typography variant="subtitle1">Service</Typography>
                    <Typography variant="body2">About Us</Typography>
                    <Typography variant="body2">Careers</Typography>
                    <Typography variant="body2">Delivery Information</Typography>
                    <Typography variant="body2">Privacy Policy</Typography>
                    <Typography variant="body2">Terms & Conditions</Typography>
                </Grid>
                <Grid item xs={12} sm={3}>
                    <Typography variant="subtitle1">Subscribe</Typography>
                    <Typography variant="body2">Enter your email below to be the first to know about new collections and product launches.</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                        <TextField variant="outlined" size="small" placeholder="Your Email" sx={{ mr: 1, flexGrow: 1, color : 'white' }} />
                        <Button variant="contained">→</Button>
                    </Box>
                </Grid>
            </Grid>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 4 }}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton color="inherit"><VisaIcon /></IconButton>
                    <IconButton color="inherit"><MasterCardIcon /></IconButton>
                    {/* Thêm các biểu tượng thanh toán khác nếu cần */}
                </Box>

                <Typography variant="body2">
                    &copy; 2025 Nhóm 9 KTTKMP
                </Typography>

                <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton color="inherit"><FacebookIcon /></IconButton>
                    <IconButton color="inherit"><InstagramIcon /></IconButton>
                </Box>
            </Box>
        </Box>
    );
};

export default Footer;