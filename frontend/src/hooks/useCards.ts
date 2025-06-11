import { useEffect, useState } from 'react';
import { spaceService } from '../services/spaceService';
import { BaseCard } from '../types/card';
import { useAuth } from '../contexts/AuthContext';
import { rentalService } from '../services/rentalService';
import { RentalSpace } from '../types/card';

type CardType = 'all' | 'favorites' | 'rented';

export const useCards = (type: CardType = 'all') => {
  const [cards, setCards] = useState<BaseCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

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
        switch (type) {
          case 'favorites':
            apiSpaces = await spaceService.getFavoriteSpaces(user?.id);
            break;
          case 'rented':
            if (!user?.id) {
              throw new Error('Usuário não autenticado');
            }
            const rentedSpaces = await rentalService.getRentalsByUserID(user.id);
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

        console.log('Espaços recebidos:', apiSpaces);

        if (!apiSpaces || !Array.isArray(apiSpaces)) {
          console.error('Dados recebidos não são um array:', apiSpaces);
          throw new Error('Formato de dados inválido recebido da API');
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
  }, [type, user]);

  return { cards, loading, error };
};