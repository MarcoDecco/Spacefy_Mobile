import api from "./api";
import AsyncStorage from '@react-native-async-storage/async-storage';

export const authService = {
  async login(email, password) {
    try {
      console.log('Tentando fazer login com:', { email });
      // Faz a requisição de login
      const response = await api.post("/auth/login", { email, password });
      console.log('Resposta do login:', response.data);
      
      // Salva o token no AsyncStorage
      if (response.data.token) {
        await AsyncStorage.setItem('token', response.data.token);
      }
      
      return response.data;
    } catch (error) {
      console.error('Erro no login:', error.response?.data || error.message);
      throw error;
    }
  },

  async register(userData) {
    try {
      console.log('Tentando registrar usuário:', userData);
      // Faz a requisição de registro
      const response = await api.post("/users/createUser", userData);
      console.log('Resposta do registro:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erro no registro:', error.response?.data || error.message);
      throw error;
    }
  },

  async logout() {
    try {
      await AsyncStorage.removeItem('token');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  }
};
