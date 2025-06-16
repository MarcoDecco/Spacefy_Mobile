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
                console.log('Buscando espaços alugados para o usuário:', user.id);
                const rentedSpaces = await rentalService.getRentalsByUserID(user.id);
                console.log('Dados brutos dos espaços alugados:', JSON.stringify(rentedSpaces, null, 2));

                try {
                  apiSpaces = rentedSpaces.map((rental: any) => {
                    console.log('Processando aluguel:', JSON.stringify(rental, null, 2));

                    // Verificando se temos os dados necessários
                    if (!rental.space) {
                      console.error('Aluguel sem dados do espaço:', rental);
                      throw new Error('Dados do espaço não encontrados');
                    }

                    // Usando os dados do espaço diretamente do objeto rental.space
                    const space = rental.space;

                    // Garantindo que image_url seja sempre um array
                    const image_url = Array.isArray(space.image_url)
                      ? space.image_url
                      : space.image_url
                        ? [space.image_url]
                        : [];

                    // Garantindo que location seja um objeto
                    const location = typeof space.location === 'string'
                      ? JSON.parse(space.location)
                      : space.location;

                    return {
                      _id: space._id,
                      space_name: space.space_name,
                      image_url,
                      location,
                      price_per_hour: space.price_per_hour,
                      space_description: space.space_description || '',
                      space_type: space.space_type || '',
                      space_amenities: space.space_amenities || [],
                      max_people: space.max_people || 0,
                      week_days: space.week_days || [],
                      opening_time: space.opening_time || '',
                      closing_time: space.closing_time || '',
                      space_rules: space.space_rules || [],
                      owner_name: space.owner_name || '',
                      owner_phone: space.owner_phone || '',
                      owner_email: space.owner_email || '',
                      rental_id: rental._id,
                      rental_start_date: rental.start_date,
                      rental_end_date: rental.end_date,
                      rental_start_time: rental.startTime,
                      rental_end_time: rental.endTime,
                      rental_value: rental.value
                    };
                  });
                  console.log('Espaços processados com sucesso:', apiSpaces.length);
                } catch (mapError) {
                  console.error('Erro ao processar espaços alugados:', mapError);
                  throw new Error('Erro ao processar dados dos espaços alugados');
                }
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