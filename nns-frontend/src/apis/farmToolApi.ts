// src/apis/farmToolApi.ts

import axiosClient from "./axiosClient";

export interface FarmTool {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  userId?: number;
  createdAt: string;
}

const farmToolApi = {
  getAll: async (): Promise<FarmTool[]> => {
    const response = await axiosClient.get<FarmTool[]>('/FarmTool');
    return response.data;
  },
  getById: async (id: number): Promise<FarmTool> => {
    const response = await axiosClient.get<FarmTool>(`/FarmTool/${id}`);
    return response.data;
  },
  create: async (data: Omit<FarmTool, 'id'>): Promise<FarmTool> => {
    const response = await axiosClient.post<FarmTool>('/FarmTool', data);
    return response.data;
  },
  update: async (id: number, data: Omit<FarmTool, 'id'>): Promise<FarmTool> => {
    const response = await axiosClient.put<FarmTool>(`/FarmTool/${id}`, data);
    return response.data;
  },
  delete: async (id: number): Promise<void> => {
    await axiosClient.delete(`/FarmTool/${id}`);
  },
  
  getByUserId: async (userId: number): Promise<FarmTool[]> => {
    const response = await axiosClient.get<FarmTool[]>(`/FarmTool/user/${userId}`);
    return response.data;
  }
};

export default farmToolApi;
