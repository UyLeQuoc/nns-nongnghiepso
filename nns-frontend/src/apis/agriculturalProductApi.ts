import axiosClient from "./axiosClient";

export interface AgriculturalProduct {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  beginPrice: number;
  createdAt: string;
}

export interface ProductType {
  id: number;
  name: string;
  description: string;
  agriculturalProductId: number;
}

const agriculturalProductApi = {
  getAll: async (): Promise<AgriculturalProduct[]> => {
    const response = await axiosClient.get<AgriculturalProduct[]>('/AgriculturalProduct');
    return response.data;
  },
  getById: async (id: number): Promise<AgriculturalProduct> => {
    const response = await axiosClient.get<AgriculturalProduct>(`/AgriculturalProduct/${id}`);
    return response.data;
  },
  create: async (data: Omit<AgriculturalProduct, 'id'>): Promise<AgriculturalProduct> => {
    const response = await axiosClient.post<AgriculturalProduct>('/AgriculturalProduct', data);
    return response.data;
  },
  update: async (id: number, data: Omit<AgriculturalProduct, 'id'>): Promise<AgriculturalProduct> => {
    const response = await axiosClient.put<AgriculturalProduct>(`/AgriculturalProduct/${id}`, data);
    return response.data;
  },
  delete: async (id: number): Promise<void> => {
    await axiosClient.delete(`/AgriculturalProduct/${id}`);
  },

  getProductTypesByAgriculturalProductId: async (id: number): Promise<ProductType[]> => {
    const response = await axiosClient.get<ProductType[]>(`/AgriculturalProduct/${id}/ProductTypes`);
    return response.data;
  }
};

export default agriculturalProductApi;
