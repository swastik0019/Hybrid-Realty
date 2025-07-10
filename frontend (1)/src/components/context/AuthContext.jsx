import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { Backendurl } from "../App";

// Create the authentication context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Provider component that wraps the app and provides auth context
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if the user is already logged in on component mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem("token");
      
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${Backendurl}/api/user/profile`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.data.success) {
          setUser(response.data.user);
          setIsLoggedIn(true);
        } else {
          // Token is invalid or expired
          localStorage.removeItem("token");
        }
      } catch (err) {
        console.error("Error checking auth status:", err);
        setError("Authentication failed. Please try again.");
        localStorage.removeItem("token");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Login function
  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${Backendurl}/api/user/login`, {
        email,
        password
      });

      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        setUser(response.data.user);
        setIsLoggedIn(true);
        return { success: true };
      } else {
        setError(response.data.message || "Login failed. Please check your credentials.");
        return { success: false, message: response.data.message };
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Login failed. Please try again.";
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${Backendurl}/api/user/register`, userData);

      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        setUser(response.data.user);
        setIsLoggedIn(true);
        return { success: true };
      } else {
        setError(response.data.message || "Registration failed. Please try again.");
        return { success: false, message: response.data.message };
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Registration failed. Please try again.";
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsLoggedIn(false);
  };

  // Update user profile
  const updateProfile = async (updatedData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${Backendurl}/api/user/profile`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        setUser(response.data.user);
        return { success: true };
      } else {
        setError(response.data.message || "Profile update failed.");
        return { success: false, message: response.data.message };
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Profile update failed. Please try again.";
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  // Value object that will be provided to consumers of this context
  const value = {
    user,
    isLoggedIn,
    isLoading,
    error,
    login,
    register,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;