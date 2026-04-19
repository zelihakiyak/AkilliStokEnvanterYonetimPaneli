import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const apiClient = axios.create({
    baseURL: 'http://192.168.1.29:5073/api',
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' },
});

// Her istekte token'ı otomatik ekler
apiClient.interceptors.request.use(async (config) => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default apiClient;