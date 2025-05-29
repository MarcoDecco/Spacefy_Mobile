import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../services/authService';
import api from '../services/api';

interface User {
  id: string;
  name: string;
  email: string;
  // Adicione outros campos conforme necessário
}

interface AuthContextData {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  register: (userData: any) => Promise<void>;
  uptade: (userId: string, userData: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStoredData();
  }, []);

  async function loadStoredData() {
    try {
      const token = await AsyncStorage.getItem("token");
      const userId = await AsyncStorage.getItem("userId");

      if (token && userId) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        try {
          const response = await api.get<User>(`/users/${userId}`);
          setUser(response.data);
        } catch (error) {
          console.error("Erro ao buscar dados do usuário:", error);
          // Se houver erro ao buscar dados do usuário, fazemos logout
          await authService.logout();
          setUser(null);
        }
      }
    } catch (error) {
      console.error("Erro ao carregar dados armazenados:", error);
      // Em caso de erro geral, também fazemos logout
      await authService.logout();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const response = await authService.login(email, password);
      const { user } = response;
      setUser(user);
    } catch (error) {
      throw error;
    }
  };

  const signOut = async () => {
    try {
      console.log('Iniciando processo de logout...');
      console.log('Dados do usuário antes do logout:', user);
      
      // Verificar dados antes do logout
      const tokenBefore = await AsyncStorage.getItem("token");
      const userIdBefore = await AsyncStorage.getItem("userId");
      console.log('Dados antes do logout:', { token: !!tokenBefore, userId: userIdBefore });
      
      await authService.logout();
      
      // Verificar dados após o logout
      const tokenAfter = await AsyncStorage.getItem("token");
      const userIdAfter = await AsyncStorage.getItem("userId");
      console.log('Dados após o logout:', { token: !!tokenAfter, userId: userIdAfter });
      
      setUser(null);
      delete api.defaults.headers.common['Authorization'];
      
      console.log('Logout concluído com sucesso');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      throw error;
    }
  };

  const register = async (userData: any) => {
    try {
      await authService.register(userData);
    } catch (error) {
      throw error;
    }
  };

  const uptade = async (userId: string, userData: any) => {
    try {
      const response = await authService.uptade(userId, userData);
      setUser(response);
    } catch (error) {
      throw error;
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signOut,
    register,
    uptade
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}; 