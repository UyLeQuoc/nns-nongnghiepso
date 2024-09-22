//CRUD User

import axiosClient from "./axiosClient";

export const getUserById = async (userId: number) => {
    try {
      const response = await axiosClient.get(`/api/User/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching preferences:", error);
      throw error; 
    }
  };