import axiosClient from "./axiosClient";

// Fetch daily average price data from the API
export const fetchDailyAveragePrice = async (productTypeId:number) => {
  const response = await axiosClient.get(`/api/AgentProductPreference/daily-average/${productTypeId}`);
  return response.data;
};

export const fetchPreferencesByUserId = async (userId: number) => {
  try {
    const response = await axiosClient.get(`/api/AgentProductPreference/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching preferences:", error);
    throw error; 
  }
};

export const fetchPriceDifferencesByUserId = async (userId: number) => {
  try {
    const response = await axiosClient.get(`/api/AgentProductPreference/prices-with-differences/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching preferences:", error);
    throw error; 
  }
};

export const updateAgentProductPreference = async (
  userId: number,
  productTypeId: number,
  data: { todayPrice: number; description: string }
) => {
  try {
    const response = await axiosClient.put(
      `/api/update-agent-product-price`,
      {
        userId,
        productTypeId,
        ...data,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating preference:", error);
    throw error; // Rethrow the error so it can be handled by the calling function
  }
};