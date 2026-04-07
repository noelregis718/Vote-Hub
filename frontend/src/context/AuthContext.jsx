import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '@/lib/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = JSON.parse(localStorage.getItem('user'));
    if (savedToken && savedUser) {
      setUser(savedUser);
      setToken(savedToken);
    }
    setLoading(false);
  }, []);

  const setAuth = React.useCallback((userData, authToken) => {
    localStorage.setItem('token', authToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setToken(authToken);
  }, []);

  const login = React.useCallback(async (emailOrUser, passwordOrToken) => {
    // Check if it's a social login (user object + token string)
    if (typeof emailOrUser === 'object' && typeof passwordOrToken === 'string') {
      setAuth(emailOrUser, passwordOrToken);
      return emailOrUser;
    }

    // Regular email/password login
    const res = await api.post('/api/auth/login', { 
      email: emailOrUser, 
      password: passwordOrToken 
    });
    const { token, user: userData } = res.data;
    setAuth(userData, token);
    return userData;
  }, [setAuth]);

  const register = React.useCallback(async (name, email, password) => {
    const res = await api.post('/api/auth/register', { name, email, password });
    const { token, user: userData } = res.data;
    setAuth(userData, token);
    return userData;
  }, [setAuth]);

  const logout = React.useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setToken(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
