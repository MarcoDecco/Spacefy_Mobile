import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import { authService } from '../services/authService';

interface JwtPayload {
  id: string;
  name: string;
  email: string;
  surname: string;
  telephone: string;
  profilePhoto: string;
  userType: string;
  iat: number;
  exp: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  surname?: string;
  telephone?: string;
  profilePhoto?: string;
  userType?: string;
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
      
      if (token) {
        console.log('✅ Token encontrado, decodificando...');
        const decodedToken = jwtDecode<JwtPayload>(token);
        console.log('📝 Token decodificado:', decodedToken);
        
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp < currentTime) {
          console.log('⚠️ Token expirado, removendo...');
          await AsyncStorage.removeItem('token');
          setUser(null);
        } else {
          console.log('✅ Token válido, configurando usuário...');
          setUser({
            id: decodedToken.id,
            name: decodedToken.name,
            email: decodedToken.email,
            surname: decodedToken.surname,
            telephone: decodedToken.telephone,
            profilePhoto: decodedToken.profilePhoto,
            userType: decodedToken.userType,
          });
        }
      } else {
        console.log('❌ Nenhum token encontrado');
      }
    } catch (error) {
      console.error('❌ Erro ao carregar dados:', error);
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
      
      setUser({
        id: decodedToken.id,
        name: decodedToken.name,
        email: decodedToken.email,
        surname: decodedToken.surname,
        profilePhoto: decodedToken.profilePhoto,
        userType: decodedToken.userType,
      });
    } catch (error) {
      console.error('❌ Erro no login:', error);
      throw error;
    }
  }

  async function signOut() {
    try {
      console.log('🚪 Iniciando processo de logout...');
      await authService.logout();
      setUser(null);
      console.log('✅ Logout realizado com sucesso');
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
      
      setUser({
        id: decodedToken.id,
        name: decodedToken.name,
        email: decodedToken.email,
        surname: decodedToken.surname,
        userType: decodedToken.userType,
      });
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
        setUser({
          ...decodedToken,
          ...userData
        });
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