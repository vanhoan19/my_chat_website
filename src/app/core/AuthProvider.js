import React, { createContext, useContext, useEffect, useState } from 'react';
 
// Tạo AuthContext
const AuthContext = createContext();

// Tạo AuthProvider Component
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = sessionStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!sessionStorage.getItem('user'));

  const login = (userData) => {
      setUser(userData);
      setIsAuthenticated(true);
      sessionStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
      setUser(null);
      setIsAuthenticated(false);
      sessionStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
