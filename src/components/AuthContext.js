import React, { createContext, useState } from 'react';
import {jwtDecode} from 'jwt-decode';
 
 
export const AuthContext = createContext();
 
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Store user details
  const [token, setToken] = useState(null); // Store JWT token
 
 
  const isTokenExpired = (token) => {
    const { exp } = jwtDecode(token); // exp is the expiration time
    return Date.now() >= exp * 1000;
  };
 
 
  const login = (token) => {
    setToken(token);
    const decodedUser = jwtDecode(token); // Extract user info
    setUser(decodedUser);
    localStorage.setItem('token', token); // Persist token
  };
 
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token'); // Remove token
  };
 
  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
 
 