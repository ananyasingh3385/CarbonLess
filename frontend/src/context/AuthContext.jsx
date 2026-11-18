import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { api } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('carbonless_token'));
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Trigger celebration confetti
  const fireConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#059669', '#34d399', '#f59e0b', '#3b82f6'],
      });
    } catch (e) {
      // safe fallback
    }
  };

  // Show toast notification
  const showNotification = (message, type = 'success', duration = 4000) => {
    setToast({ message, type });
    if (type === 'success') {
      fireConfetti();
    }
    setTimeout(() => {
      setToast((prev) => (prev && prev.message === message ? null : prev));
    }, duration);
  };

  const closeNotification = () => setToast(null);

  // Load user on mount or token change
  useEffect(() => {
    async function loadUser() {
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }
      try {
        const data = await api.getMe();
        setUser(data.user);
      } catch (err) {
        console.warn('Session expired or invalid:', err);
        logout();
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, [token]);

  const login = async (email, password) => {
    const data = await api.login({ email, password });
    localStorage.setItem('carbonless_token', data.token);
    setToken(data.token);
    setUser(data.user);
    showNotification(data.message || 'Logged in successfully!');
    return data;
  };

  const demoLogin = async () => {
    const data = await api.demoLogin();
    localStorage.setItem('carbonless_token', data.token);
    setToken(data.token);
    setUser(data.user);
    showNotification('Welcome, Alex Green! Demo account loaded.', 'success');
    return data;
  };

  const register = async (name, email, password) => {
    const data = await api.register({ name, email, password });
    localStorage.setItem('carbonless_token', data.token);
    setToken(data.token);
    setUser(data.user);
    showNotification(data.message || 'Welcome to CarbonLess!');
    return data;
  };

  const logout = () => {
    localStorage.removeItem('carbonless_token');
    setToken(null);
    setUser(null);
    showNotification('You have logged out.', 'info');
  };

  const refreshUser = async () => {
    if (!token) return;
    try {
      const data = await api.getMe();
      setUser(data.user);
    } catch (e) {
      console.error('Failed to refresh user:', e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        demoLogin,
        register,
        logout,
        refreshUser,
        toast,
        showNotification,
        closeNotification,
        fireConfetti,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
