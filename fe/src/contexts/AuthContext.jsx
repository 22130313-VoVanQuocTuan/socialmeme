// src/contexts/AuthContext.jsx
import { createContext, useState, useEffect } from 'react';
import { login as loginApi, register as registerApi } from '../service/authApi' ;
import toast from 'react-hot-toast';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const data = await loginApi(email, password);
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('user', JSON.stringify({
        id: data.user_id,
        username: data.username,
      }));
      setUser({ id: data.user_id, username: data.username });
      toast.success('Đăng nhập thành công!');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Đăng nhập thất bại');
      return false;
    }
  };

  const register = async (username, email, password) => {
    try {
      const data = await registerApi(username, email, password);
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('user', JSON.stringify({
        id: data.user_id,
        username: data.username,
      }));
      setUser({ id: data.user_id, username: data.username });
      toast.success('Đăng ký thành công!');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Đăng ký thất bại');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    setUser(null);
    toast.success('Đã đăng xuất');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};