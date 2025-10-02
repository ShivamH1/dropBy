import { getToken } from "@/utils/cookieUtils";
import axios from "axios";

// Get address suggestions/autocomplete
export const getAddressSuggestions = async (suggestionData: {
  query: string;
  limit?: number;
  country?: string;
  proximity?: string;
  bbox?: string;
  language?: string;
}) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_BASE_URL}/api/maps/suggestions`,
      suggestionData,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Get address suggestions error:", error);
    throw error;
  }
};

// Get distance and time between two addresses
export const getDistanceAndTime = async (distanceData: {
  origin: string;
  destination: string;
}) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_BASE_URL}/api/maps/distance`,
      distanceData,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Get distance and time error:", error);
    throw error;
  }
};

// Geocode address to coordinates
export const geocodeAddress = async (geocodeData: {
  address: string;
}) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_BASE_URL}/api/maps/geocode`,
      geocodeData,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Geocode address error:", error);
    throw error;
  }
};

// Reverse geocode coordinates to address
export const reverseGeocode = async (reverseGeocodeData: {
  latitude: number;
  longitude: number;
}) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_BASE_URL}/api/maps/reverse-geocode`,
      reverseGeocodeData,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Reverse geocode error:", error);
    throw error;
  }
};
