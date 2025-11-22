
import React from 'react';
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from 'react-redux';

const PrivateRoute = ({ allowedRoles = [] }) => {
  const { userData } = useSelector((state) => state.auth);

  // Prevent redirect until we know auth status
  const localStored = localStorage.getItem("userData");
  const sessionLoading = localStored && !userData;

  if (sessionLoading) {
    // Auth state still loading: show nothing or a loader
    return <div className="p-6 text-center">Loading session...</div>;
  }

  if (!userData) {
    // Not authenticated → redirect to login
    return <Navigate to="/login" replace />;
  }

  const userRole = userData.role;
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  if (userRole === "admin") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // Authenticated user with allowed role → show the route
  return <Outlet />;
};

export default PrivateRoute;

/*


import React from 'react';
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from 'react-redux';

const PrivateRoute = ({ allowedRoles = [] }) => {
  const { userData } = useSelector((state) => state.auth);

  // ⛔ Non connecté → login
  if (!userData) {
    return <Navigate to="/login" replace />;
  }

  const userRole = userData.role;

  // 🎯 Si des rôles autorisés sont définis et que l'utilisateur n'est pas dedans
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  // ⭐ Redirection automatique si admin
  if (userRole === "admin") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // ✅ Pour les utilisateurs normaux → afficher la page
  return <Outlet />;
};

export default PrivateRoute;

*/