import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'https://nns-api.uydev.id.vn',
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosClient.interceptors.response.use(
  response => response,
  error => {
    return Promise.reject(error);
  }
);

export default axiosClient;