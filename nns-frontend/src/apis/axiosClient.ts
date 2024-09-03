import axios from 'axios';

const axiosClient = axios.create({
  // baseURL: 'https://localhost:8081', // Your API base URL
  baseURL: 'http://103.179.185.123:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosClient.interceptors.response.use(
  response => response,
  error => {
    // Handle errors here (e.g., show notifications)
    return Promise.reject(error);
  }
);

export default axiosClient;