import { getToken } from "@/utils/cookieUtils";
import axios from "axios";

// Create a new ride
export const createRide = async (rideData: {
  pickup: string;
  destination: string;
  vehicleType: "auto" | "car" | "moto";
}) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_BASE_URL}/api/rides/create`,
      rideData,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Create ride error:", error);
    throw error;
  }
};

// Get fare estimates for all vehicle types
export const getFare = async (fareData: {
  pickup: string;
  destination: string;
}) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_BASE_URL}/api/rides/get-fare`,
      fareData,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Get fare error:", error);
    throw error;
  }
};

// Confirm ride (Captain accepts the ride)
export const confirmRide = async (rideId: string) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_BASE_URL}/api/rides/confirm`,
      { rideId },
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Confirm ride error:", error);
    throw error;
  }
};

// Start ride (Captain starts the ride with OTP)
export const startRide = async (rideId: string, otp: string) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_BASE_URL}/api/rides/start`,
      { rideId, otp },
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Start ride error:", error);
    throw error;
  }
};

// End ride (Captain completes the ride)
export const endRide = async (rideId: string) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_BASE_URL}/api/rides/end`,
      { rideId },
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );
    return response;
  } catch (error) {
    console.error("End ride error:", error);
    throw error;
  }
};