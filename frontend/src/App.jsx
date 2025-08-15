import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

// Import screens
import LandingPage from './screens/LandingPage';
import Login from './screens/Login';
import Register from './screens/Register';
import Dashboard from './screens/Dashboard';
import OfficerDashboard from './screens/OfficerDashboard';
import AdminDashboard from './screens/AdminDashboard';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected routes - Citizens */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute requiredRole="CITIZEN">
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* Protected routes - Officers */}
        <Route 
          path="/officer" 
          element={
            <ProtectedRoute requiredRole="OFFICER">
              <OfficerDashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* Protected routes - Admins */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
