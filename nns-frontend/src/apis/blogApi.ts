import axiosClient from "./axiosClient";

export interface Blog {
  id: number;
  title: string;
  caption: string;
  youtubeLink: string;
  createdAt: string;
}

const blogApi = {
  getAll: async (): Promise<Blog[]> => {
    const response = await axiosClient.get<Blog[]>('/Blog');
    return response.data;
  },
  getById: async (id: number): Promise<Blog> => {
    const response = await axiosClient.get<Blog>(`/Blog/${id}`);
    return response.data;
  },
  create: async (data: Omit<Blog, 'id'>): Promise<Blog> => {
    const response = await axiosClient.post<Blog>('/Blog', data);
    return response.data;
  },
  update: async (id: number, data: Omit<Blog, 'id'>): Promise<Blog> => {
    const response = await axiosClient.put<Blog>(`/Blog/${id}`, data);
    return response.data;
  },
  delete: async (id: number): Promise<void> => {
    await axiosClient.delete(`/Blog/${id}`);
  },
};

export default blogApi;
