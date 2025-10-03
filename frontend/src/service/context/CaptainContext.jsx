import React, { createContext, useState, useContext, useEffect } from "react";
import { captainProfile } from "../API/captainAPIs";
import { getToken, removeToken, setToken, getUserType, setUserType, clearAuth } from "../../utils/cookieUtils";

export const CaptainData = createContext();

function CaptainContext({ children }) {
  const [captain, setCaptain] = useState({
    email: "",
    fullName: {
      firstName: "",
      lastName: "",
    },
    _id: "",
    vehicle: {
      color: "",
      plateNumber: "",
      capacity: 0,
      vehicleType: "",
    },
    status: "inactive", // inactive, active, busy
    location: {
      ltd: null,
      lng: null,
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [rides, setRides] = useState([]); // Store ride requests/history
  const [activeRide, setActiveRide] = useState(null); // Current active ride

  // Initialize captain on app start - check if token exists and fetch profile
  useEffect(() => {
    const initializeCaptain = async () => {
      const token = getToken();
      const userType = getUserType();
      
      // Only initialize if token exists AND user type is 'captain'
      if (token && userType === 'captain') {
        try {
          setIsLoading(true);
          const response = await captainProfile();
          if (response && response.captain) {
            setCaptain(response.captain);
            setIsAuthenticated(true);
          }
        } catch (error) {
          console.error("Failed to fetch captain profile:", error);
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

    initializeCaptain();
  }, []);

  // Login captain
  const loginCaptain = (captainData, token) => {
    setCaptain(captainData);
    setIsAuthenticated(true);
    setError(null);
    if (token) {
      setToken(token);
      setUserType('captain'); // Set user type as 'captain'
    }
  };

  // Logout captain
  const logoutCaptain = () => {
    setCaptain({
      email: "",
      fullName: {
        firstName: "",
        lastName: "",
      },
      _id: "",
      vehicle: {
        color: "",
        plateNumber: "",
        capacity: 0,
        vehicleType: "",
      },
      status: "inactive",
      location: {
        ltd: null,
        lng: null,
      },
    });
    setIsAuthenticated(false);
    setError(null);
    setActiveRide(null);
    setRides([]);
    clearAuth(); // Clear both token and user type
  };

  // Update captain profile
  const updateCaptain = (captainData) => {
    setCaptain(prevCaptain => ({
      ...prevCaptain,
      ...captainData
    }));
  };

  // Update captain status
  const updateStatus = (status) => {
    setCaptain(prevCaptain => ({
      ...prevCaptain,
      status
    }));
  };

  // Update captain location
  const updateLocation = (location) => {
    setCaptain(prevCaptain => ({
      ...prevCaptain,
      location
    }));
  };

  // Update vehicle information
  const updateVehicle = (vehicleData) => {
    setCaptain(prevCaptain => ({
      ...prevCaptain,
      vehicle: {
        ...prevCaptain.vehicle,
        ...vehicleData
      }
    }));
  };

  // Add a new ride
  const addRide = (rideData) => {
    setRides(prevRides => [rideData, ...prevRides]);
  };

  // Set active ride
  const setActiveRideData = (rideData) => {
    setActiveRide(rideData);
    updateStatus("busy");
  };

  // Complete active ride
  const completeRide = () => {
    if (activeRide) {
      setRides(prevRides => 
        prevRides.map(ride => 
          ride._id === activeRide._id 
            ? { ...ride, status: "completed" }
            : ride
        )
      );
      setActiveRide(null);
      updateStatus("active");
    }
  };

  // Accept ride request
  const acceptRide = (rideData) => {
    setActiveRideData(rideData);
    addRide({ ...rideData, status: "accepted" });
  };

  // Reject ride request
  const rejectRide = (rideId) => {
    // Remove from pending rides if exists
    setRides(prevRides => 
      prevRides.filter(ride => ride._id !== rideId)
    );
  };

  // Set error message
  const setCaptainError = (errorMessage) => {
    setError(errorMessage);
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  // Check if captain is logged in
  const isLoggedIn = () => {
    return isAuthenticated && getToken();
  };

  // Get captain full name
  const getCaptainFullName = () => {
    return `${captain.fullName.firstName} ${captain.fullName.lastName}`.trim();
  };

  // Get vehicle info string
  const getVehicleInfo = () => {
    const { vehicleType, color, plateNumber } = captain.vehicle;
    return `${color} ${vehicleType} (${plateNumber})`.trim();
  };

  // Check if captain is available for rides
  const isAvailable = () => {
    return captain.status === "active" && !activeRide;
  };

  const value = {
    captain,
    setCaptain,
    isLoading,
    setIsLoading,
    error,
    setError: setCaptainError,
    clearError,
    isAuthenticated,
    setIsAuthenticated,
    isInitialized,
    rides,
    setRides,
    activeRide,
    setActiveRide: setActiveRideData,
    loginCaptain,
    logoutCaptain,
    updateCaptain,
    updateStatus,
    updateLocation,
    updateVehicle,
    addRide,
    completeRide,
    acceptRide,
    rejectRide,
    isLoggedIn,
    getCaptainFullName,
    getVehicleInfo,
    isAvailable,
  };

  return (
    <CaptainData.Provider value={value}>
      {children}
    </CaptainData.Provider>
  );
}

// Custom hook to use Captain Context
export const useCaptain = () => {
  const context = useContext(CaptainData);
  if (!context) {
    throw new Error("useCaptain must be used within a CaptainContext");
  }
  return context;
};

export default CaptainContext;
