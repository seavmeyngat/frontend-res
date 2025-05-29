// components/ProtectAdminRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectAdminRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  const location = useLocation();

  if (!token || !user || user.role !== 'admin') {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
};

export default ProtectAdminRoute;
