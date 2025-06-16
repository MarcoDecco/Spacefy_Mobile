import { useState, useEffect, useRef } from 'react';
import { Alert } from 'react-native';
import { Space } from '../types/space';
import { spaceService } from '../services/spaceService';

// Cache global para os detalhes dos espaços
const spaceCache = new Map<string, { data: Space; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos em milissegundos

export const useSpaceDetails = (spaceId: string) => {
  const [space, setSpace] = useState<Space | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    const fetchSpaceDetails = async () => {
      if (!spaceId) return;

      try {
        setIsLoading(true);

        // Verifica se existe um cache válido
        const cachedData = spaceCache.get(spaceId);
        const now = Date.now();

        if (cachedData && now - cachedData.timestamp < CACHE_DURATION) {
          if (isMounted.current) {
            setSpace(cachedData.data);
            setIsLoading(false);
          }
          return;
        }

        // Se não tem cache ou está expirado, busca da API
        const spaceDetails = await spaceService.getSpaceById(spaceId);
        
        // Atualiza o cache
        spaceCache.set(spaceId, {
          data: spaceDetails,
          timestamp: now
        });

        if (isMounted.current) {
          setSpace(spaceDetails);
        }
      } catch (error) {
        console.error('Erro ao buscar detalhes do espaço:', error);
        if (isMounted.current) {
          Alert.alert('Erro', 'Não foi possível carregar os detalhes do espaço.');
        }
      } finally {
        if (isMounted.current) {
          setIsLoading(false);
        }
      }
    };

    fetchSpaceDetails();
  }, [spaceId]);

  // Função para forçar atualização dos dados
  const refreshSpaceDetails = async () => {
    if (!spaceId) return;

    try {
      setIsLoading(true);
      const spaceDetails = await spaceService.getSpaceById(spaceId);
      
      spaceCache.set(spaceId, {
        data: spaceDetails,
        timestamp: Date.now()
      });

      if (isMounted.current) {
        setSpace(spaceDetails);
      }
    } catch (error) {
      console.error('Erro ao atualizar detalhes do espaço:', error);
      if (isMounted.current) {
        Alert.alert('Erro', 'Não foi possível atualizar os detalhes do espaço.');
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  };

  return { space, isLoading, refreshSpaceDetails };
}; 