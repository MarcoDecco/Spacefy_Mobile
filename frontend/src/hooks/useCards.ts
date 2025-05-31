import { useEffect, useState } from 'react';
import { spaceService } from '../services/spaceService';
import { BaseCard } from '../types/card';

export const useCards = () => {
  const [cards, setCards] = useState<BaseCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Buscando todos os espaços...');

        const apiSpaces = await spaceService.getSpaces();
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
  }, []);

  return { cards, loading, error };
};