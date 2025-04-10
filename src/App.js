import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/user/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import VerifyEmail from './pages/auth/VerifyEmail';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import ProductDetail from './pages/product/ProductDetail';
import Profile from './pages/user/Profile';
import Cart from './pages/user/Cart';
import Payment from './pages/user/Payment';
import Contact from './pages/user/Contact';
import About from './pages/user/About';
import Product from './pages/product/Product';
import Discount from './pages/user/Discount';
import SearchResults from './pages/product/SearchResults';
import OrderPage from './pages/user/OrderPage';
import Test from './pages/Test';

// Import các thành phần admin
import AdminLogin from './pages/admin/AdminLogin';
import Dashboard from './pages/admin/Dashboard';
import ManageUsers from './pages/admin/ManageUsers';
import ManageProducts from './pages/admin/ManageProducts';
import ManageCategories from './pages/admin/ManageCategories';
import ManageOrders from './pages/admin/ManageOrders';
import ManageInventory from './pages/admin/ManageInventory';

// Import ProtectedAdminRoute
import ProtectedAdminRoute from './components/ProtectedAdminRoute';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Các route dành cho người dùng thông thường */}
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
        <Route path="/product" element={<Product />} />
        <Route path="/discount" element={<Discount />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/order/:correlationId" element={<OrderPage />} />
        <Route path="/test" element={<Test />} />

        {/* Route dành cho admin login (không cần bảo vệ) */}
        <Route path="/admin" element={<AdminLogin />} />

        {/* Các route dành cho admin (cần bảo vệ) */}
        <Route element={<ProtectedAdminRoute />}>
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/users" element={<ManageUsers />} />
          <Route path="/admin/products" element={<ManageProducts />} />
          <Route path="/admin/categories" element={<ManageCategories />} />
          <Route path="/admin/orders" element={<ManageOrders />} />
          <Route path="/admin/inventory" element={<ManageInventory />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;