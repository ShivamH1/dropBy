import React, { createContext, useState, useContext, useEffect } from "react";
import { userProfile } from "../API/userAPIs";
import { getToken, removeToken, setToken, getUserType, setUserType, clearAuth } from "../../utils/cookieUtils";

export const UserData = createContext();

function UserContext({ children }) {
  const [user, setUser] = useState({
    email: "",
    fullName: {
      firstName: "",
      lastName: "",
    },
    _id: "",
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize user on app start - check if token exists and fetch profile
  useEffect(() => {
    const initializeUser = async () => {
      const token = getToken();
      const userType = getUserType();
      
      // Only initialize if token exists AND user type is 'user'
      if (token && userType === 'user') {
        try {
          setIsLoading(true);
          const response = await userProfile();
          if (response.data) {
            setUser(response.data);
            setIsAuthenticated(true);
          }
        } catch (error) {
          console.error("Failed to fetch user profile:", error);
          // Token might be invalid, remove it
          removeToken();
          setIsAuthenticated(false);
          setError("Session expired. Please login again.");
        } finally {
          setIsLoading(false);
        }
      }
      setIsInitialized(true);
    };

    initializeUser();
  }, []);

  // Login user
  const loginUser = (userData, token) => {
    setUser(userData);
    setIsAuthenticated(true);
    setError(null);
    if (token) {
      setToken(token);
      setUserType('user'); // Set user type as 'user'
    }
  };

  // Logout user
  const logoutUser = () => {
    setUser({
      email: "",
      fullName: {
        firstName: "",
        lastName: "",
      },
      _id: "",
    });
    setIsAuthenticated(false);
    setError(null);
    clearAuth(); // Clear both token and user type
  };

  // Update user profile
  const updateUser = (userData) => {
    setUser(prevUser => ({
      ...prevUser,
      ...userData
    }));
  };

  // Set error message
  const setUserError = (errorMessage) => {
    setError(errorMessage);
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  // Check if user is logged in
  const isLoggedIn = () => {
    return isAuthenticated && getToken();
  };

  // Get user full name
  const getUserFullName = () => {
    return `${user.fullName.firstName} ${user.fullName.lastName}`.trim();
  };

  const value = {
    user,
    setUser,
    isLoading,
    setIsLoading,
    error,
    setError: setUserError,
    clearError,
    isAuthenticated,
    setIsAuthenticated,
    isInitialized,
    loginUser,
    logoutUser,
    updateUser,
    isLoggedIn,
    getUserFullName,
  };

  return (
    <UserData.Provider value={value}>
      {children}
    </UserData.Provider>
  );
}

// Custom hook to use User Context
export const useUser = () => {
  const context = useContext(UserData);
  if (!context) {
    throw new Error("useUser must be used within a UserContext");
  }
  return context;
};

export default UserContext;
