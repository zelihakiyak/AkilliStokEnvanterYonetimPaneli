import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://scarf-liftoff-rental.ngrok-free.dev/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Response Interceptor: 401 gelirse token gecersiz demektir
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      delete apiClient.defaults.headers.common['Authorization'];
    }
    return Promise.reject(error);
  }
);

export default apiClient;
