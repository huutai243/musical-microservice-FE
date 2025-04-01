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
import AdminDashboard from './pages/AdminDashBoard';
import Product from './pages/Product';
import Discount from './pages/Discount';
import Piano from './pages/Piano';
import Organ from './pages/Organ';
import Drum from './pages/Drum';
import Guitar from './pages/Guitar';
import SearchResults from './pages/SearchResults';
import OrderPage from './pages/OrderPage';




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
                    <Route path="/admin-dashboard" element={<AdminDashboard />} />
                    <Route path="/product" element={<Product />} />
                    <Route path="/discount" element={<Discount />} />
                    <Route path="/piano" element={<Piano />} />
                    <Route path="/organ" element={<Organ />} />
                    <Route path="/drum" element={<Drum />} />
                    <Route path="/guitar" element={<Guitar />} />
                    <Route path="/search" element={<SearchResults />} />
                    <Route path="/order/:correlationId" element={<OrderPage />} /> 
                </Routes>
        </Router>
    );
};

export default App;




