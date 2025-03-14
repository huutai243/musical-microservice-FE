import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyEmail from './pages/VerifyEmail';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ProductDetail from './pages/ProductDetail';
import Profile from './pages/Profile';
import Cart from './pages/Cart';
import Payment from './pages/Payment';
import Contact from './pages/Contact';
import About from './pages/About';

const App = () => {
    return (
        <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/verify-email" element={<VerifyEmail />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/product/:id" element={<ProductDetail />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/payment" element={<Payment />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/about" element={<About />} />
                </Routes>
        </Router>
    );
};

export default App;
