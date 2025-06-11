import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const authService = {
  async login(email: string, password: string) {
    console.log('🔑 Tentando login com:', { email });
    const response = await api.post('/auth/login', { email, password });
    console.log('✅ Login bem sucedido:', response.data);
    await AsyncStorage.setItem('token', response.data.token);
    return response.data;
  },

  async register(userData: any) {
    console.log('📝 Tentando registro com:', userData);
    const response = await api.post('/auth/register', userData);
    console.log('✅ Registro bem sucedido:', response.data);
    await AsyncStorage.setItem('token', response.data.token);
    return response.data;
  },

  async update(userId: string, userData: any) {
    console.log('📝 Tentando atualizar usuário:', { userId, userData });
    const response = await api.put(`/users/${userId}`, userData);
    console.log('✅ Atualização bem sucedida:', response.data);
    return response.data;
  },

  async logout() {
    console.log('🚪 Realizando logout');
    await AsyncStorage.removeItem('token');
    console.log('✅ Logout realizado com sucesso');
  }
};

export default authService; 