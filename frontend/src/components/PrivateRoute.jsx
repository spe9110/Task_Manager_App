import React from 'react';
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from 'react-redux';

const PrivateRoute = ({ allowedRoles }) => {
  const { userData } = useSelector((state) => state.auth);

  // If no user, redirect to signin
  if (!userData) {
    return <Navigate to="/login" replace />;
  }

  // Optional: role-based protection
  if (allowedRoles && !allowedRoles.includes(userData.role)) {
    return <Navigate to="/" replace />; // redirect if role not allowed
  }

  return <Outlet />;
};

export default PrivateRoute;