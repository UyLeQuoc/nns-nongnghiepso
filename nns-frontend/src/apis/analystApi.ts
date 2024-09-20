import axiosClient from "./axiosClient";

// Fetch daily average price data from the API
export const fetchDailyAveragePrice = async (productTypeId:number) => {
  const response = await axiosClient.get(`/api/AgentProductPreference/daily-average/${productTypeId}`);
  return response.data;
};