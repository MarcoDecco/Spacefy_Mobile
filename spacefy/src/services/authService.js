import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "./api";
import { localAuthService } from "./database/localAuthService";
import { databaseService } from "./database/databaseService";
import { jwtDecode } from "jwt-decode";
import NetInfo from '@react-native-community/netinfo';

// Inicializa o banco de dados quando o serviço é importado
databaseService.init().catch(console.error);

export const authService = {
  login: async (email, password) => {
    try {
      console.log('🚀 Iniciando processo de login...', { email });
      
      // Verifica o status da conexão
      const netInfo = await NetInfo.fetch();
      const isOnline = netInfo.isConnected && netInfo.isInternetReachable;
      console.log('🌐 Status da conexão:', { isOnline, netInfo });

      // Verifica o estado atual do usuário antes do login
      const currentUserBeforeLogin = await localAuthService.getCurrentUser(email);
      console.log('👤 Estado do usuário antes do login:', currentUserBeforeLogin ? {
        id: currentUserBeforeLogin.id,
        email: currentUserBeforeLogin.email,
        isLoggedIn: currentUserBeforeLogin.isLoggedIn,
        lastLogin: currentUserBeforeLogin.lastLogin,
        hasToken: !!currentUserBeforeLogin.token
      } : 'Nenhum usuário encontrado');

      if (!isOnline) {
        console.log('📱 Tentando login offline...');
        // Tenta fazer login offline
        const currentUser = await localAuthService.getCurrentUser(email);
        console.log('👤 Resultado da busca offline:', currentUser ? {
          id: currentUser.id,
          email: currentUser.email,
          isLoggedIn: currentUser.isLoggedIn,
          lastLogin: currentUser.lastLogin,
          hasToken: !!currentUser.token
        } : 'Nenhum usuário encontrado');

        if (currentUser) {
          // Atualiza o status de login mesmo no modo offline
          await localAuthService.saveUserSession({
            id: currentUser.id,
            email: currentUser.email,
            token: currentUser.token
          });
          console.log('✅ Login offline realizado com sucesso');
          return {
            user: {
              id: currentUser.id,
              email: currentUser.email
            },
            token: currentUser.token
          };
        }

        console.log('❌ Nenhuma conta disponível para login offline');
        throw new Error('Nenhuma conta disponível para login offline. Faça login online primeiro para habilitar o acesso offline.');
      }

      console.log('🌐 Realizando login online...');
      // Faz a requisição de login
      const response = await api.post("/auth/login", {
        email,
        password
      });

      const { token, user } = response.data;
      console.log('✅ Login online bem-sucedido:', {
        userId: user.id,
        email: user.email,
        tokenLength: token.length
      });

      // Decodifica o token para obter o email
      const decodedToken = jwtDecode(token);
      console.log('🔑 Token decodificado:', {
        email: decodedToken.email,
        exp: decodedToken.exp
      });

      // Log dos dados antes de salvar
      const userData = {
        id: user.id,
        email: decodedToken.email,
        token,
        refreshToken: response.data.refreshToken
      };
      console.log('💾 Preparando dados para salvar:', {
        id: userData.id,
        email: userData.email,
        tokenLength: userData.token.length,
        hasRefreshToken: !!userData.refreshToken
      });

      // Salva no AsyncStorage para compatibilidade com código existente
      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("userId", user.id);
      console.log('💾 Dados salvos no AsyncStorage');

      // Salva no banco de dados local
      await localAuthService.saveUserSession(userData);
      console.log('✅ Dados salvos no banco local');

      // Verifica se os dados foram salvos corretamente
      const savedUser = await localAuthService.getCurrentUser(email);
      console.log('🔍 Verificação pós-salvamento:', savedUser ? {
        id: savedUser.id,
        email: savedUser.email,
        isLoggedIn: savedUser.isLoggedIn,
        lastLogin: savedUser.lastLogin,
        hasToken: !!savedUser.token
      } : 'Usuário não encontrado');

      // Verifica se o usuário está realmente logado
      const isLoggedIn = await localAuthService.isUserLoggedIn(user.id);
      console.log('🔐 Verificação final de login:', {
        userId: user.id,
        isLoggedIn,
        hasToken: !!token
      });

      if (!isLoggedIn) {
        console.log('⚠️ Usuário não está marcado como logado, tentando corrigir...');
        await localAuthService.saveUserSession({
          id: user.id,
          email: decodedToken.email,
          token
        });
      }

      return response.data;
    } catch (error) {
      console.error('❌ Erro no login:', {
        error,
        message: error.message,
        response: error.response?.data,
        stack: error.stack
      });

      // Melhora a mensagem de erro para ser mais específica
      if (error.message.includes('login offline')) {
        throw error; // Mantém a mensagem de erro específica que já definimos
      } else if (!error.response) {
        throw new Error('Não foi possível conectar ao servidor. Verifique sua conexão com a internet.');
      } else {
        throw error; // Mantém outros erros como estão
      }
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
