import { useState, useEffect } from 'react';
import api from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Favorite, Space } from '../types/favorite';
import { localFavoriteService } from '../services/database/localFavoriteService';
import { databaseService } from '../services/database/databaseService'; // Importe o databaseService
import NetInfo from '@react-native-community/netinfo';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(true);

  // Monitora o estado da conexão
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOnline(state.isConnected ?? false);
    });

    return () => unsubscribe();
  }, []);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      setError(null);

      // Inicialize o banco de dados antes de qualquer operação
      await databaseService.init();

      const userId = await AsyncStorage.getItem('userId');
      const token = await AsyncStorage.getItem('token');

      if (!userId) {
        throw new Error('Usuário não autenticado');
      }

      try {
        // Tenta buscar do servidor primeiro
        if (token) {
          const response = await api.get(`/users/favorites/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });

          // Atualiza o banco local com os dados do servidor
          for (const favorite of response.data) {
            if (favorite.spaceId && favorite.spaceId._id) {
              await localFavoriteService.saveFavorite(favorite.spaceId, userId);
            }
          }
        }
      } catch (err) {
        console.log('Usando dados locais devido a erro na API:', err);
      }

      // Busca do banco local (seja após sincronização ou em caso de erro)
      const localSpaces = await localFavoriteService.getFavoriteSpaces(userId);
      setFavorites(localSpaces.map(space => ({
        _id: space._id, // Adiciona o _id do espaço ao objeto Favorite
        spaceId: space,
        userId,
        createdAt: new Date(),
        lastViewed: new Date()
      })));
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao carregar favoritos';
      console.error('Erro ao buscar favoritos:', errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (space: Space) => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const token = await AsyncStorage.getItem('token');

      if (!userId) {
        throw new Error('Usuário não autenticado');
      }

      if (!space._id) {
        throw new Error('ID do espaço não encontrado');
      }

      // Verifica se já está favoritado localmente
      const isFavorited = await localFavoriteService.isFavorite(space._id, userId);

      try {
        // Tenta sincronizar com o servidor
        if (token) {
          console.log('Enviando requisição para favoritar espaço:', {
            userId,
            spaceId: space._id,
            spaceName: space.space_name
          });

          const response = await api.post(
            `/users/${userId}/favorite`,
            { spaceId: space._id },
            { headers: { Authorization: `Bearer ${token}` } }
          );

          // Atualiza o banco local baseado na resposta do servidor
          if (response.data.isFavorited) {
            // Garante que temos todos os dados necessários do espaço
            if (!space.space_name) {
              throw new Error('Dados do espaço incompletos');
            }
            await localFavoriteService.saveFavorite(space, userId);
          } else {
            await localFavoriteService.removeFavorite(space._id, userId);
          }
        } else {
          // Se não tiver token, inverte o estado local
          if (isFavorited) {
            await localFavoriteService.removeFavorite(space._id, userId);
          } else {
            // Garante que temos todos os dados necessários do espaço
            if (!space.space_name) {
              throw new Error('Dados do espaço incompletos');
            }
            await localFavoriteService.saveFavorite(space, userId);
          }
        }
      } catch (err) {
        console.error('Erro ao sincronizar com servidor:', err);
        // Se falhar a sincronização, inverte o estado local
        if (isFavorited) {
          await localFavoriteService.removeFavorite(space._id, userId);
        } else {
          // Garante que temos todos os dados necessários do espaço
          if (!space.space_name) {
            throw new Error('Dados do espaço incompletos');
          }
          await localFavoriteService.saveFavorite(space, userId);
        }
      }

      // Atualiza a lista de favoritos
      await fetchFavorites();

      return !isFavorited;
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao atualizar favorito';
      console.error('Erro ao favoritar/desfavoritar:', errorMessage);
      setError(errorMessage);
      throw err;
    }
  };

  const updateLastViewed = async (spaceId: string) => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) return;

      await localFavoriteService.updateLastViewed(spaceId, userId);
    } catch (err) {
      console.error('Erro ao atualizar última visualização:', err);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  return {
    favorites,
    loading,
    error,
    refreshFavorites: fetchFavorites,
    toggleFavorite,
    updateLastViewed,
    isOnline
  };
};