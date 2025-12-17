// frontend/src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; // You need to install this: npm install jwt-decode

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const decodedUser = jwtDecode(token);
        // Check if token is expired
        if (decodedUser.exp * 1000 > Date.now()) {
          setUser({
            id: decodedUser.id,
            role: decodedUser.role,
            // Add other user details you might have stored in the token
          });
        } else {
          // Token expired, clear it
          localStorage.removeItem("token");
        }
      }
    } catch (error) {
      console.error("Failed to decode token:", error);
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (token) => {
    try {
      localStorage.setItem("token", token);
      const decodedUser = jwtDecode(token);
      setUser({
        id: decodedUser.id,
        role: decodedUser.role,
      });
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    // Redirect to login page
    window.location.href = '/login';
  };

  const authValue = {
    user,
    setUser,
    login,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={authValue}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};