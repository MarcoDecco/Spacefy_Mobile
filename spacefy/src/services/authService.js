import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "./api";
import { localAuthService } from "./database/localAuthService";
import { databaseService } from "./database/databaseService";
import { jwtDecode } from "jwt-decode";
import NetInfo from '@react-native-community/netinfo';
import * as SecureStore from 'expo-secure-store';

// Inicializa o banco de dados quando o serviço é importado
databaseService.init().catch(console.error);

export const authService = {
  login: async (email, password) => {
    try {
      // Verifica o status da conexão
      const netInfo = await NetInfo.fetch();
      const isOnline = netInfo.isConnected && netInfo.isInternetReachable;

      // Verifica o estado atual do usuário antes do login
      const currentUserBeforeLogin = await localAuthService.getCurrentUser(email);

      if (!isOnline) {
        // Tenta fazer login offline
        const currentUser = await localAuthService.getCurrentUser(email);

        if (currentUser) {
          // Atualiza o status de login mesmo no modo offline
          await localAuthService.saveUserSession({
            id: currentUser.id,
            email: currentUser.email,
            token: currentUser.token
          });
          return {
            user: {
              id: currentUser.id,
              email: currentUser.email
            },
            token: currentUser.token
          };
        }

        throw new Error('Nenhuma conta disponível para login offline. Faça login online primeiro para habilitar o acesso offline.');
      }

      // Faz a requisição de login
      const response = await api.post("/auth/login", {
        email,
        password
      });

      const { token, user } = response.data;

      // Decodifica o token para obter o email
      const decodedToken = jwtDecode(token);

      // Log dos dados antes de salvar
      const userData = {
        id: user.id,
        email: decodedToken.email,
        token,
        refreshToken: response.data.refreshToken
      };

      // Salva no AsyncStorage para compatibilidade com código existente
      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("userId", user.id);

      // Salva no banco de dados local
      await localAuthService.saveUserSession(userData);

      // Verifica se o usuário está realmente logado
      const isLoggedIn = await localAuthService.isUserLoggedIn(user.id);

      if (!isLoggedIn) {
        await localAuthService.saveUserSession({
          id: user.id,
          email: decodedToken.email,
          token
        });
      }

      // Salva e-mail e senha no SecureStore para login biométrico
      await SecureStore.setItemAsync('biometricEmail', email);
      await SecureStore.setItemAsync('biometricPassword', password);

      return response.data;
    } catch (error) {
      if (error.message && error.message.includes('login offline')) {
        throw error;
      } else if (!error.response) {
        throw new Error('Não foi possível conectar ao servidor. Verifique sua conexão com a internet.');
      } else {
        throw error;
      }
    }
  },

  // Login biométrico usando dados salvos no SecureStore
  biometricLogin: async () => {
    try {
      const email = await SecureStore.getItemAsync('biometricEmail');
      const password = await SecureStore.getItemAsync('biometricPassword');
      if (!email || !password) {
        throw new Error('Dados para login biométrico não encontrados.');
      }
      return await authService.login(email, password);
    } catch (error) {
      throw error;
    }
  },

  register: async (userData) => {
    try {
      const response = await api.post("/users/createUser", userData);
      return response.data;
    } catch (error) {
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

      if (userData.email) {
        await localAuthService.updateUserSession(userId, {
          email: userData.email
        });
      }

      return response.data;
    } catch (error) {
      throw error;
    }
  },

  logout: async () => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      if (userId) {
        await localAuthService.logout(userId);
      }
      await AsyncStorage.multiRemove(['token', 'userId']);
      await SecureStore.deleteItemAsync('biometricEmail');
      await SecureStore.deleteItemAsync('biometricPassword');
      delete api.defaults.headers.common['Authorization'];
      return true;
    } catch (error) {
      throw error;
    }
  },

  getCurrentUser: async () => {
    try {
      return await localAuthService.getCurrentUser();
    } catch (error) {
      return null;
    }
  },

  isAuthenticated: async () => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      if (!userId) return false;
      return await localAuthService.isUserLoggedIn(userId);
    } catch (error) {
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
      throw error;
    }
  }
};