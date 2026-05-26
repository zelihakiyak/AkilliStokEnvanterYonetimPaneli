import axios from 'axios';

const LOCAL_IP = '192.168.1.102';
const PORT     = '5073';

const apiClient = axios.create({
  baseURL: `http://${LOCAL_IP}:${PORT}/api`,
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
