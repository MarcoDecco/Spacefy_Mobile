import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://spacefy-5l5i.onrender.com';

const api = axios.create({
    baseURL: API_URL,
});

// Interceptor para adicionar o token em todas as requisições
api.interceptors.request.use(async (config) => {
    const token = await AsyncStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;