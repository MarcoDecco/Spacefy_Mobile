import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';

console.log('API URL:', API_URL); // Log para verificar a URL da API

const api = axios.create({
    baseURL: API_URL,
});

// Interceptor para adicionar o token em todas as requisições
api.interceptors.request.use(async (config) => {
    const token = await AsyncStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('Requisição sendo feita para:', config.url); // Log da URL da requisição
    return config;
});

// Interceptor para log de respostas
api.interceptors.response.use(
    (response) => {
        console.log('Resposta da API:', response.status);
        return response;
    },
    (error) => {
        console.log('Erro na requisição:', error.response?.status, error.response?.data);
        return Promise.reject(error);
    }
);

export default api;