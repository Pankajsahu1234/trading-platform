import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// When used inside routes, it will render children if authenticated, otherwise redirect to login
export const ProtectedRoute = ({ redirectTo = '/auth/login' }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated() ? <Outlet /> : <Navigate to={redirectTo} replace />;
};
