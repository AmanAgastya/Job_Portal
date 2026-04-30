import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('jp_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('jp_user');
    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('jp_user');
        localStorage.removeItem('jp_token');
        setToken(null);
      }
    }
    setLoading(false);
  }, []);

  // login: calls backend, stores token+user, returns user
  const login = async (email, password) => {
    const { data } = await api.post('/api/auth/login', { email, password });
    const { token: authToken, user: userData } = data;
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('jp_user', JSON.stringify(userData));
    localStorage.setItem('jp_token', authToken);
    return userData;
  };

  // register: calls backend, stores token+user, returns user
  const register = async (formData) => {
    const { data } = await api.post('/api/auth/register', formData);
    const { token: authToken, user: userData } = data;
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('jp_user', JSON.stringify(userData));
    localStorage.setItem('jp_token', authToken);
    return userData;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('jp_user');
    localStorage.removeItem('jp_token');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export default AuthContext;
