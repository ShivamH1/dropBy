import { getToken, removeToken } from "@/utils/cookieUtils";
import axios from "axios";

export const userLogin = async (userData: {
  email: string;
  password: string;
}) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_BASE_URL}/api/users/login`,
      userData
    );
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const userSignup = async (userData: {
  fullName: { firstName: string; lastName: string };
  email: string;
  password: string;
}) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_BASE_URL}/api/users/register`,
      userData
    );
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const userLogout = async () => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_BASE_URL}/api/users/logout`,
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

export const userProfile = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_BASE_URL}/api/users/profile`,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
