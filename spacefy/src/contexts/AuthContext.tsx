import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import { authService } from '../services/authService';
import { localAuthService } from '../services/database/localAuthService';
import api from '../services/api';

interface JwtPayload {
  id: string;
  name: string;
  email: string;
  surname: string;
  telephone: string;
  profilePhoto: string;
  iat: number;
  exp: number;
  role: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  surname: string;
  telephone?: string;
  profilePhoto?: string;
  role?: string;
}

interface AuthContextData {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  register: (userData: any) => Promise<void>;
  updateUser: (userData: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStoredData();
  }, []);

  async function loadStoredData() {
    try {
      console.log('🔄 Carregando dados armazenados...');
      const token = await AsyncStorage.getItem('token');
      const userId = await AsyncStorage.getItem('userId');
      
      console.log('🔑 Dados do AsyncStorage:', { hasToken: !!token, userId });

      if (token) {
        console.log('✅ Token encontrado, decodificando...');
        const decodedToken = jwtDecode<JwtPayload>(token);
        console.log('📝 Token decodificado:', decodedToken);
        
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp < currentTime) {
          console.log('⚠️ Token expirado, removendo...');
          await AsyncStorage.multiRemove(['token', 'userId']);
          setUser(null);
        } else {
          console.log('✅ Token válido, configurando usuário...');
          const user: User = {
            id: decodedToken.id,
            name: decodedToken.name,
            email: decodedToken.email,
            surname: decodedToken.surname,
            telephone: decodedToken.telephone,
            profilePhoto: decodedToken.profilePhoto,
            role: decodedToken.role
          };
          setUser(user);
        }
      } else {
        // Se não tem token no AsyncStorage, tenta buscar do banco local
        console.log('🔍 Buscando usuário no banco local...');
        const currentUser = await localAuthService.getCurrentUser();
        
        if (currentUser && currentUser.isLoggedIn) {
          console.log('✅ Usuário encontrado no banco local:', {
            id: currentUser.id,
            email: currentUser.email,
            isLoggedIn: currentUser.isLoggedIn
          });
          
          // Salva no AsyncStorage para manter consistência
          await AsyncStorage.setItem('token', currentUser.token);
          await AsyncStorage.setItem('userId', currentUser.id);
          
          // Como o LocalUser tem menos campos que o User, usamos valores padrão
          const user: User = {
            id: currentUser.id,
            email: currentUser.email,
            name: '', // Campo não disponível no LocalUser
            surname: '', // Campo não disponível no LocalUser
            telephone: '', // Campo não disponível no LocalUser
            profilePhoto: '', // Campo não disponível no LocalUser
            role: 'user' // Campo não disponível no LocalUser
          };
          setUser(user);
        } else {
          console.log('❌ Nenhum usuário encontrado');
          setUser(null);
        }
      }
    } catch (error) {
      console.error('❌ Erro ao carregar dados:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  async function signIn(email: string, password: string) {
    try {
      console.log('🔑 Iniciando processo de login...');
      const response = await authService.login(email, password);
      console.log('✅ Login bem sucedido:', response);
      
      const decodedToken = jwtDecode<JwtPayload>(response.token);
      console.log('📝 Token decodificado:', decodedToken);
      
      // Salva o token e userId no AsyncStorage
      await AsyncStorage.setItem('token', response.token);
      await AsyncStorage.setItem('userId', decodedToken.id);
      console.log('💾 Dados salvos no AsyncStorage');
      
      const user: User = {
        id: decodedToken.id,
        name: decodedToken.name,
        email: decodedToken.email,
        surname: decodedToken.surname,
        telephone: decodedToken.telephone,
        profilePhoto: decodedToken.profilePhoto,
        role: decodedToken.role
      };
      setUser(user);
    } catch (error) {
      console.error('❌ Erro no login:', error);
      throw error;
    }
  }

  async function signOut() {
    try {
      console.log('🚪 Iniciando processo de logout...');
      const userId = await AsyncStorage.getItem('userId');
      
      if (userId) {
        // Atualiza o banco local
        await localAuthService.logout(userId);
        console.log('✅ Status atualizado no banco local');
      }

      // Remove do AsyncStorage
      await AsyncStorage.multiRemove(['token', 'userId']);
      console.log('✅ Dados removidos do AsyncStorage');
      
      // Limpa o estado
      setUser(null);
      console.log('✅ Estado do usuário limpo');
      
      // Limpa o token do axios
      delete api.defaults.headers.common['Authorization'];
      console.log('✅ Token removido do axios');
    } catch (error) {
      console.error('❌ Erro no logout:', error);
      throw error;
    }
  }

  async function register(userData: any) {
    try {
      console.log('📝 Iniciando processo de registro...');
      const response = await authService.register(userData);
      console.log('✅ Registro bem sucedido:', response);
      
      const decodedToken = jwtDecode<JwtPayload>(response.token);
      console.log('📝 Token decodificado:', decodedToken);
      
      // Salva o token e userId no AsyncStorage
      await AsyncStorage.setItem('token', response.token);
      await AsyncStorage.setItem('userId', decodedToken.id);
      console.log('💾 Dados salvos no AsyncStorage');
      
      const user: User = {
        id: decodedToken.id,
        name: decodedToken.name,
        email: decodedToken.email,
        surname: decodedToken.surname,
        telephone: decodedToken.telephone,
        profilePhoto: decodedToken.profilePhoto,
        role: decodedToken.role
      };
      setUser(user);
    } catch (error) {
      console.error('❌ Erro no registro:', error);
      throw error;
    }
  }

  async function updateUser(userData: any) {
    try {
      if (!user) {
        throw new Error('Usuário não autenticado');
      }
      
      console.log('📝 Iniciando atualização do usuário...', userData);
      const response = await authService.update(user.id, userData);
      console.log('✅ Atualização bem sucedida:', response);
      
      // Atualiza o token se necessário
      if (response.token) {
        await AsyncStorage.setItem('token', response.token);
        const decodedToken = jwtDecode<JwtPayload>(response.token);
        const user: User = {
          id: decodedToken.id,
          name: decodedToken.name,
          email: decodedToken.email,
          surname: decodedToken.surname,
          telephone: decodedToken.telephone,
          profilePhoto: decodedToken.profilePhoto,
          role: decodedToken.role
        };
        setUser(user);
      } else {
        setUser(prevUser => ({
          ...prevUser!,
          ...userData,
        }));
      }
    } catch (error) {
      console.error('❌ Erro na atualização:', error);
      throw error;
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut, register, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 