import { createContext, useState, useContext } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (credentials) => {
    try {
      const response = await axios.post('http://localhost:3001/api/auth/login', credentials);

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        setUser({
          email: credentials.email,
          role: credentials.email === 'proveedor@example.com' ? 'proveedor' : 'cliente'
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isProveedor: user?.role === 'proveedor',
    isCliente: user?.role === 'cliente',
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);