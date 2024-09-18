import axiosClient from "./axiosClient";

export interface ProductType {
    id: number;
    name: string;
    description: string;
    agriculturalProductId: number;
}

const productTypeApi = {
    getAll: async (): Promise<ProductType[]> => {
        const response = await axiosClient.get<ProductType[]>('/ProductType');
        return response.data;
    },
    getById: async (id: number): Promise<ProductType> => {
        const response = await axiosClient.get<ProductType>(`/ProductType/${id}`);
        return response.data;
    },
    create: async (data: Omit<ProductType, 'id'>): Promise<ProductType> => {
        const response = await axiosClient.post<ProductType>('/ProductType', data);
        return response.data;
    },
    update: async (id: number, data: Omit<ProductType, 'id'>): Promise<ProductType> => {
        const response = await axiosClient.put<ProductType>(`/ProductType/${id}`, data);
        return response.data;
    },
    delete: async (id: number): Promise<void> => {
        await axiosClient.delete(`/ProductType/${id}`);
    }
};

export default productTypeApi;