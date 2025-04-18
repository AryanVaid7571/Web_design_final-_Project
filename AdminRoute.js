import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
 
const AdminRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth);

  // Check if user is logged in and has admin role
  if (!user || user.role !== 'admin') {
    // Redirect to login if not logged in, or to home if not admin
    return <Navigate to={user ? '/' : '/login'} />;
  }

  return children;
};

export default AdminRoute;
