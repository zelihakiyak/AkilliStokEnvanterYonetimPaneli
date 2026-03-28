import axios from 'axios';

const LOCAL_IP = '192.168.1.104';
const PORT     = '5073';

const apiClient = axios.create({
  baseURL: `http://${LOCAL_IP}:${PORT}/api`,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

export default apiClient;