import { useEffect, useState } from 'react';
import { spaceService } from '../services/spaceService';
import { BaseCard } from '../types/card';
import { useAuth } from '../contexts/AuthContext';
import { rentalService } from '../services/rentalService';
import { RentalSpace } from '../types/card';
import NetInfo from '@react-native-community/netinfo';
import { databaseService } from '../services/database/databaseService';

type CardType = 'all' | 'favorites' | 'rented';

export const useCards = (type: CardType = 'all') => {
  const [cards, setCards] = useState<BaseCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(true);
  const { user } = useAuth();

  // Monitora o estado da conexão
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOnline(state.isConnected ?? false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchCards = async () => {
      if (!user && (type === 'favorites' || type === 'rented')) {
        setCards([]);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        console.log(`Buscando espaços do tipo: ${type}...`);

        let apiSpaces;
        const isConnected = await NetInfo.fetch().then(state => state.isConnected);

        if (isConnected) {
          // Tenta buscar da API primeiro
          try {
            switch (type) {
              case 'favorites':
                apiSpaces = await spaceService.getFavoriteSpaces(user?.id);
                break;
              case 'rented':
                if (!user?.id) {
                  throw new Error('Usuário não autenticado');
                }
                const rentedSpaces = await rentalService.getSpacesByUserRentalID(user.id);
                apiSpaces = rentedSpaces.map((rental: RentalSpace) => ({
                  ...rental.space,
                  rental_id: rental._id,
                  rental_start_date: rental.start_date,
                  rental_end_date: rental.end_date,
                  rental_start_time: rental.startTime,
                  rental_end_time: rental.endTime,
                  rental_value: rental.value
                }));
                break;
              default:
                apiSpaces = await spaceService.getSpaces();
            }

            // Salva os dados no banco local
            if (apiSpaces && Array.isArray(apiSpaces)) {
              await databaseService.saveData('spaces', apiSpaces);
            }
          } catch (apiError) {
            console.log('Erro ao buscar da API, usando dados locais:', apiError);
          }
        }

        // Se não conseguiu da API ou está offline, busca do banco local
        if (!apiSpaces || !Array.isArray(apiSpaces)) {
          const hasLocalData = await databaseService.hasLocalData('spaces');
          if (hasLocalData) {
            apiSpaces = await databaseService.getData('spaces');
            console.log('Usando dados locais:', apiSpaces.length, 'espaços encontrados');
          } else {
            throw new Error('Nenhum dado disponível offline');
          }
        }

        if (!apiSpaces || !Array.isArray(apiSpaces)) {
          console.error('Dados recebidos não são um array:', apiSpaces);
          throw new Error('Formato de dados inválido');
        }

        setCards(apiSpaces);
        console.log('Cards atualizados com sucesso:', apiSpaces.length);
      } catch (err: any) {
        console.error('Erro ao buscar cards:', err);
        setError(err.message || 'Erro ao buscar espaços');
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, [type, user, isOnline]);

  return { cards, loading, error, isOnline };
};