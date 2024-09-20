import axiosClient from "./axiosClient";

// Fetch daily average price data from the API
export const fetchDailyAveragePrice = async (productTypeId:number) => {
  const response = await axiosClient.get(`/api/ProductTypePrice/daily-average/${productTypeId}`);
  return response.data;
};