import { useState, useEffect } from 'react';
import api from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Space {
  _id: string;
  space_name: string;
  image_url: string[];
  price_per_hour: number;
  location: string;
  space_description: string;
  space_amenities: string[];
  space_type: string;
  max_people: number;
  week_days: string[];
  opening_time: string;
  closing_time: string;
  space_rules: string[];
  owner_name: string;
  owner_phone: string;
  owner_email: string;
}

interface Favorite {
  _id: string;
  spaceId: Space | null;
  createdAt: string;
}

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const userId = await AsyncStorage.getItem('userId');
      const token = await AsyncStorage.getItem('token');
      
      console.log('🔑 Dados de autenticação:', {
        userId,
        hasToken: !!token,
        tokenLength: token?.length
      });
      
      if (!userId) {
        throw new Error('Usuário não autenticado');
      }

      if (!token) {
        throw new Error('Token não encontrado');
      }

      console.log('🔍 Buscando favoritos para o usuário:', userId);
      console.log('🌐 URL da API:', api.defaults.baseURL);
      
      const response = await api.get(`/users/favorites/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Filtra favoritos com spaceId nulo
      const validFavorites = response.data.filter((fav: Favorite) => fav.spaceId !== null);

      console.log('✅ Favoritos recebidos:', {
        count: validFavorites.length,
        data: validFavorites
      });
      
      setFavorites(validFavorites);
      setError(null);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || 'Erro ao carregar favoritos';
      console.error('❌ Erro ao buscar favoritos:', {
        message: errorMessage,
        error: err,
        response: err.response,
        request: err.request
      });
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (spaceId: string) => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const token = await AsyncStorage.getItem('token');
      
      console.log('🔑 Dados de autenticação (toggle):', {
        userId,
        hasToken: !!token,
        tokenLength: token?.length,
        token: token // Temporariamente para debug
      });
      
      if (!userId) {
        throw new Error('Usuário não autenticado');
      }

      if (!token) {
        throw new Error('Token não encontrado');
      }

      console.log('🔄 Toggling favorito para espaço:', {
        spaceId,
        userId,
        url: `${api.defaults.baseURL}/users/${userId}/favorite`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      const response = await api.post(
        `/users/${userId}/favorite`,
        { spaceId },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      console.log('✅ Resposta do toggle favorito:', response.data);
      
      // Atualiza a lista de favoritos após a ação
      await fetchFavorites();
      
      return response.data.isFavorited;
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || 'Erro ao atualizar favorito';
      console.error('❌ Erro ao favoritar/desfavoritar:', {
        message: errorMessage,
        error: err,
        response: err.response,
        request: err.request
      });
      setError(errorMessage);
      throw err;
    }
  };

  useEffect(() => {
    console.log('🔄 Hook de favoritos montado');
    fetchFavorites();
  }, []);

  return {
    favorites,
    loading,
    error,
    refreshFavorites: fetchFavorites,
    toggleFavorite
  };
}; 