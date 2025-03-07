import React from 'react';
import { Box, Typography, Grid, TextField, Button, IconButton } from '@mui/material';
import CreditCardIcon from '@mui/icons-material/CreditCard'; // Visa, Mastercard, AMEX
import PaymentIcon from '@mui/icons-material/Payment'; // Paypal
import GoogleIcon from '@mui/icons-material/Google'; // Google Pay
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';

const Footer = () => {
    return (
        <Box sx={{ bgcolor: 'white', color: '#993300', p: 4, boxShadow: '0px 4px 10px rgba(1, 1, 1, 1)', marginTop: 4 }}>
            <Grid container spacing={4}>
                <Grid item xs={12} sm={3}>
                    <Typography variant="h6">Nhạc cụ Việt Nam</Typography>
                    <Typography variant="body2">(704) 555-0127</Typography>
                    <Typography variant="body2">ungnhophu@gamil.com</Typography>
                    <Typography variant="body2">Hồ Chí Minh</Typography>
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
                        <TextField variant="outlined" size="small" placeholder="Your Email" sx={{ mr: 1, flexGrow: 1, color: 'white' }} />
                        <Button variant="contained">→</Button>
                    </Box>
                </Grid>
            </Grid>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 4 }}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <img src="/visa.jpg" alt="Visa" style={{ height: '24px' }} />
                        <img src="/oo.jpg" alt="Mastercard" style={{ height: '24px' }} />
                        <img src="/paypal.png" alt="Google Pay" style={{ height: '24px' }} />
                        <img src="/ggpay.png" alt="American Express" style={{ height: '24px' }} />
                    </Box>
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