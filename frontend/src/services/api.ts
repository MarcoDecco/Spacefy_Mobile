import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { API_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

console.log('🌐 URL da API:', API_URL);

const api = axios.create({
  baseURL: API_URL || 'http://localhost:3000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar o token de autenticação
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      console.log('🚀 Requisição:', {
        url: config.url,
        method: config.method,
        headers: config.headers,
        data: config.data
      });
      return config;
    } catch (error) {
      console.error('❌ Erro ao obter token:', error);
      return config;
    }
  },
  (error) => {
    console.error('❌ Erro na requisição:', error);
    return Promise.reject(error);
  }
);

// Interceptor para respostas
api.interceptors.response.use(
  (response) => {
    console.log('✅ Resposta:', {
      status: response.status,
      data: response.data
    });
    return response;
  },
  async (error: AxiosError) => {
    if (error.response) {
      // O servidor respondeu com um status de erro
      console.error('❌ Erro na resposta:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      });
      
      switch (error.response.status) {
        case 502:
          console.error('Erro de conexão com o servidor. Tente novamente mais tarde.');
          break;
        case 401:
          // Token expirado ou inválido
          console.error('Não autorizado. Por favor, faça login novamente.');
          await AsyncStorage.removeItem('token');
          // Aqui você pode adicionar uma lógica para redirecionar para a tela de login
          break;
        case 404:
          console.error('Recurso não encontrado.');
          break;
        case 500:
          console.error('Erro interno do servidor.');
          break;
        default:
          console.error('Erro na requisição:', error.response.data);
      }
    } else if (error.request) {
      // A requisição foi feita mas não houve resposta
      console.error('❌ Sem resposta do servidor:', {
        request: error.request,
        message: error.message,
        config: error.config
      });
    } else {
      // Erro na configuração da requisição
      console.error('❌ Erro na configuração:', {
        message: error.message,
        config: error.config
      });
    }
    return Promise.reject(error);
  }
);

export default api; 