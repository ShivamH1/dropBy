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
