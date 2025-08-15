import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Check if user is authenticated
  if (!token || !user.id) {
    return <Navigate to="/login" replace />;
  }

  // Check role if specified
  if (requiredRole && user.role !== requiredRole) {
    // Redirect based on user's actual role
    switch (user.role) {
      case 'ADMIN':
        return <Navigate to="/admin" replace />;
      case 'OFFICER':
        return <Navigate to="/officer" replace />;
      case 'CITIZEN':
        return <Navigate to="/dashboard" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
