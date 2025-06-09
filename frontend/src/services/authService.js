import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "./api";

export const authService = {
  login: async (email, password) => {
    // Faz a requisição de login
    const response = await api.post("/auth/login", { email, password });
    await AsyncStorage.setItem("token", response.data.token);
    await AsyncStorage.setItem("userId", response.data.user.id);
    return response.data;
  },
  
  register: async (userData) =>{
    // Faz a requisição de registro
    const response = await api.post("/users/createUser", userData);
    return response.data;
  },

  uptade: async (userId, userData) => {
    const token = await AsyncStorage.getItem("token"); // Recupera o token salvo
    const response = await api.put(
      `/users/updateUser/${userId}`,
      userData,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Envia o token no cabeçalho
        },
      }
    );
    return response.data;
  },
  
  logout: async () => {
    try {
      // Remove todos os dados do usuário do AsyncStorage
      await AsyncStorage.multiRemove(['token', 'userId']);
      
      // Limpa o token do axios para futuras requisições
      delete api.defaults.headers.common['Authorization'];
      
      return true;
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      throw error;
    }
  },
};
