import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "./api";
import { localAuthService } from "./database/localAuthService";
import { databaseService } from "./database/databaseService";
import { jwtDecode } from "jwt-decode";

// Inicializa o banco de dados quando o serviço é importado
databaseService.init().catch(console.error);

export const authService = {
  login: async (email, password) => {
    try {
      // Faz a requisição de login
      const response = await api.post("/auth/login", { email, password });
      console.log('Resposta completa da API:', JSON.stringify(response.data, null, 2));
      const { token, user } = response.data;

      // Decodifica o token para obter o email
      const decodedToken = jwtDecode(token);
      console.log('Token decodificado:', decodedToken);

      // Log dos dados antes de salvar
      const userData = {
        id: user.id,
        email: decodedToken.email, // Usando o email do token
        token,
        refreshToken: response.data.refreshToken
      };
      console.log('Dados do usuário antes de salvar:', userData);

      // Salva no AsyncStorage para compatibilidade com código existente
      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("userId", user.id);

      // Salva no banco de dados local
      await localAuthService.saveUserSession(userData);

      return response.data;
    } catch (error) {
      console.error('Erro detalhado no login:', {
        error,
        message: error.message,
        response: error.response?.data,
        stack: error.stack
      });
      throw error;
    }
  },
  
  register: async (userData) => {
    try {
      // Faz a requisição de registro
      const response = await api.post("/users/createUser", userData);
      return response.data;
    } catch (error) {
      console.error('Erro no registro:', error);
      throw error;
    }
  },

  update: async (userId, userData) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await api.put(
        `/users/updateUser/${userId}`,
        userData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Atualiza os dados no banco local se necessário
      if (userData.email) {
        await localAuthService.updateUserSession(userId, {
          email: userData.email
        });
      }

      return response.data;
    } catch (error) {
      console.error('Erro na atualização:', error);
      throw error;
    }
  },
  
  logout: async () => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      
      // Remove do banco local
      if (userId) {
        await localAuthService.logout(userId);
      }

      // Remove do AsyncStorage
      await AsyncStorage.multiRemove(['token', 'userId']);
      
      // Limpa o token do axios
      delete api.defaults.headers.common['Authorization'];
      
      return true;
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      throw error;
    }
  },

  // Novos métodos para gerenciamento offline
  getCurrentUser: async () => {
    try {
      return await localAuthService.getCurrentUser();
    } catch (error) {
      console.error('Erro ao buscar usuário atual:', error);
      return null;
    }
  },

  isAuthenticated: async () => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      if (!userId) return false;
      
      return await localAuthService.isUserLoggedIn(userId);
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      return false;
    }
  },

  refreshSession: async () => {
    try {
      const currentUser = await localAuthService.getCurrentUser();
      if (!currentUser) return null;

      const response = await api.post("/auth/refresh", {
        refreshToken: currentUser.refreshToken
      });

      const { token, refreshToken } = response.data;

      await localAuthService.updateUserSession(currentUser.id, {
        token,
        refreshToken,
        lastLogin: new Date().toISOString()
      });

      await AsyncStorage.setItem("token", token);

      return { token, refreshToken };
    } catch (error) {
      console.error('Erro ao atualizar sessão:', error);
      throw error;
    }
  }
};
