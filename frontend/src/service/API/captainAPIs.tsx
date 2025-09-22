import { getToken, removeToken } from "@/utils/cookieUtils";
import axios from "axios";

export const captainRegister = async (captainData: {
  fullName: { firstName: string; lastName: string };
  email: string;
  password: string;
  vehicle: {
    color: string;
    plateNumber: string;
    capacity: number;
    vehicleType: string;
  };
}) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_BASE_URL}/api/captains/register`,
      captainData
    );
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const captainLogin = async (captainData: {
  email: string;
  password: string;
}) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_BASE_URL}/api/captains/login`,
      captainData
    );
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const captainProfile = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_BASE_URL}/api/captains/profile`,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const captainLogout = async () => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_BASE_URL}/api/captains/logout`,
      {},
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );
    if (response.status === 200) {
      removeToken();
      return response.data;
    } else {
      throw new Error(response.data.error);
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};
