import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { addFavorite, removeFavorite, getFavorites } from '../database/favorite';

interface Favorite {
  id: string;
  space_id: string;
  user_id: string;
}

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFavorites = async () => {
    setLoading(true);
    setError(null);
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) throw new Error('Usuário não autenticado');
      getFavorites(userId, (result) => {
        setFavorites(result);
        setLoading(false);
      });
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar favoritos');
      setLoading(false);
    }
  };

  const toggleFavorite = async (spaceId: string) => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) throw new Error('Usuário não autenticado');
      const alreadyFav = favorites.some(fav => fav.space_id === spaceId);
      if (alreadyFav) {
        removeFavorite(spaceId, userId);
      } else {
        addFavorite(spaceId, userId);
      }
      fetchFavorites();
      return !alreadyFav;
    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar favorito');
      throw err;
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
    toggleFavorite
  };
};