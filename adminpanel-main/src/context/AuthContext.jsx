import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, getToken, getRefreshToken, getAdmin, getRole } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(authService.isAuthenticated() ? getToken() : null);
  const [role, setRole] = useState(authService.isAuthenticated() ? getRole() : null);
  const [admin, setAdmin] = useState(authService.isAuthenticated() ? getAdmin() : null);
  const [refreshToken, setRefreshToken] = useState(authService.isAuthenticated() ? getRefreshToken() : null);

  useEffect(() => {
    // synchronize from localStorage on mount
    if (authService.isAuthenticated()) {
      setToken(getToken());
      setRole(getRole());
      setAdmin(getAdmin());
      setRefreshToken(getRefreshToken());
    }
  }, []);

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    setToken(data.token);
    setRole(getRole()); // decode from token
    setAdmin(data.admin);
    setRefreshToken(data.refreshToken);
    return data;
  };

  const logout = () => {
    authService.logout();
    setToken(null);
    setRole(null);
    setAdmin(null);
    setRefreshToken(null);
  };

  const isAuthenticated = () => !!token;

  return (
    <AuthContext.Provider value={{ token, role, admin, refreshToken, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
