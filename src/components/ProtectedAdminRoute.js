import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const ProtectedAdminRoute = () => {
  const accessToken = localStorage.getItem('accessToken');
  if (!accessToken) {
    return <Navigate to="/admin" replace />;
  }

  try {
    // Giải mã accessToken để lấy thông tin roles
    const decoded = jwtDecode(accessToken);
    const roles = decoded.roles || [];

    // Kiểm tra xem user có role "ADMIN" hay không
    if (!roles.includes('ADMIN')) {
      return <Navigate to="/admin" replace />;
    }

    // Nếu thỏa mãn điều kiện, cho phép truy cập route
    return <Outlet />;
  } catch (error) {
    console.error('Lỗi khi giải mã token:', error);
    return <Navigate to="/admin" replace />;
  }
};

export default ProtectedAdminRoute;