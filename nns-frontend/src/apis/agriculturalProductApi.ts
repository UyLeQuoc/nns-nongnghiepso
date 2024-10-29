import axiosClient from "./axiosClient";

export interface AgriculturalProduct {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  beginPrice: number;
  createdAt: string;
  productTypes?: ProductType[] | [];
}

export interface ProductType {
  id: number;
  name: string;
  description: string;
  agriculturalProductId: number;
}

export interface DailyPrice {
  date: string;
  price: number;
  note?: string;
}

export interface UserInfo {
  userId: number;
  fullName: string;
  email: string;
  dob: string;
  phoneNumber: string;
  imageUrl: string;
  thumbnailUrl: string;
  description: string;
  address: string;
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
  getUserById: async (id: number): Promise<UserInfo> => {
    const response = await axiosClient.get<UserInfo>(`/api/User/${id}`);
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
    const response = await axiosClient.get<ProductType[]>(`/AgriculturalProduct/${id}/product-types`);
    return response.data;
  },

  getDailyPricesForUserProductType: async (userId: number, productTypeId: number): Promise<DailyPrice[]> => {
    const response = await axiosClient.get<DailyPrice[]>(`/api/AgentProductPreference/user/${userId}/product/${productTypeId}/daily-prices`);
    return response.data;
  },

  getDailyPricesForProductType: async (productTypeId: number): Promise<any[]> => {
    const response = await axiosClient.get<any[]>(`/api/AgentProductPreference/product/${productTypeId}/daily-prices`);
    return response.data;
  }
};

export default agriculturalProductApi;
