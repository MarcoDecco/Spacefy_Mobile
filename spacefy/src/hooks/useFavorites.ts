import { useState, useEffect } from 'react';
import api from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Favorite, Space } from '../types/favorite';
import { localFavoriteService } from '../services/database/localFavoriteService';
import { databaseService } from '../services/database/databaseService'; // Importe o databaseService
import NetInfo from '@react-native-community/netinfo';
import { localAuthService } from '../services/database/localAuthService';
import { LocalSpace } from '../types/database';

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

      // Tenta obter o usuário atual do banco local primeiro
      const currentUser = await localAuthService.getCurrentUser();
      console.log('👤 Usuário atual:', currentUser ? {
        id: currentUser.id,
        email: currentUser.email,
        isLoggedIn: currentUser.isLoggedIn
      } : 'Nenhum usuário encontrado');

      // Se não encontrou no banco local, tenta do AsyncStorage
      const userId = await AsyncStorage.getItem('userId');
      const token = await AsyncStorage.getItem('token');
      console.log('🔑 Dados do AsyncStorage:', { userId, hasToken: !!token });

      // Se não tem usuário em nenhum lugar, lança erro
      if (!currentUser && (!userId || !token)) {
        throw new Error('Usuário não autenticado. Faça login para acessar seus favoritos.');
      }

      // Define o ID do usuário a ser usado
      const effectiveUserId = currentUser?.id || userId;
      if (!effectiveUserId) {
        throw new Error('ID do usuário não encontrado');
      }

      // Se está online e tem token, tenta sincronizar com o servidor
      if (isOnline && token) {
        try {
          console.log('🌐 Tentando sincronizar favoritos online...');
          const response = await api.get(`/users/favorites/${effectiveUserId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });

          // Atualiza o banco local com os dados do servidor
          if (response.data && Array.isArray(response.data)) {
            console.log('✅ Dados recebidos do servidor:', response.data.length, 'favoritos');
            for (const favorite of response.data) {
              if (favorite.spaceId && favorite.spaceId._id) {
                await localFavoriteService.saveFavorite(favorite.spaceId, effectiveUserId);
              }
            }
          }
        } catch (err) {
          console.log('⚠️ Erro ao sincronizar favoritos online:', err);
          // Continua mesmo com erro, tentando usar dados locais
        }
      }

      // Busca do banco local
      const localSpaces = await localFavoriteService.getFavoriteSpaces(effectiveUserId);
      console.log('💫 Favoritos encontrados localmente:', localSpaces.length);

      // Converte LocalSpace para Space
      const favorites: Favorite[] = localSpaces.map((localSpace: LocalSpace) => {
        // Garante que image_url seja sempre um array
        const imageUrl = Array.isArray(localSpace.image_url)
          ? localSpace.image_url
          : typeof localSpace.image_url === 'string'
            ? [localSpace.image_url]
            : [];

        // Garante que arrays sejam sempre arrays
        const amenities = Array.isArray(localSpace.space_amenities)
          ? localSpace.space_amenities
          : typeof localSpace.space_amenities === 'string'
            ? JSON.parse(localSpace.space_amenities)
            : [];

        const weekDays = Array.isArray(localSpace.week_days)
          ? localSpace.week_days
          : typeof localSpace.week_days === 'string'
            ? JSON.parse(localSpace.week_days)
            : [];

        const rules = Array.isArray(localSpace.space_rules)
          ? localSpace.space_rules
          : typeof localSpace.space_rules === 'string'
            ? JSON.parse(localSpace.space_rules)
            : [];

        // Converte o espaço local para o formato Space
        const space: Space = {
          _id: localSpace._id,
          space_name: localSpace.space_name,
          image_url: imageUrl,
          location: localSpace.location,
          price_per_hour: localSpace.price_per_hour,
          space_description: localSpace.space_description,
          space_amenities: amenities,
          space_type: localSpace.space_type,
          max_people: localSpace.max_people,
          week_days: weekDays,
          space_rules: rules,
          // Campos não disponíveis no LocalSpace, usando valores padrão
          opening_time: '',
          closing_time: '',
          owner_name: '',
          owner_phone: '',
          owner_email: '',
          updatedAt: localSpace.last_updated
        };

        return {
          _id: localSpace._id,
          spaceId: space,
          userId: effectiveUserId,
          createdAt: new Date(),
          lastViewed: new Date()
        };
      });

      setFavorites(favorites);
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao carregar favoritos';
      console.error('❌ Erro ao buscar favoritos:', errorMessage);
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