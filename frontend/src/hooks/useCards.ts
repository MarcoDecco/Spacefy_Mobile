import { useState, useEffect } from 'react';
import { CardType } from '../types/card';

// Dados mockados temporários
const mockData = {
  featured: [
    {
      id: '1',
      images: [require('../../assets/espaco.jpg'), require('../../assets/espaco.jpg'), require('../../assets/espaco.jpg')],
      title: 'Porto Belo, Muriaé - MG',
      address: 'Rua Leonídio Valentim Ferreira',
      price: 'R$ 2.000',
      rating: 4.8,
      reviews: 24
    },
    {
      id: '2',
      images: [require('../../assets/espaco.jpg'), require('../../assets/espaco.jpg')],
      title: 'Espaço Elegante, Rio de Janeiro',
      address: 'Av. Atlântica, 200',
      price: 'R$ 3.500',
      rating: 4.9,
      reviews: 32
    }
  ],
  promo: [
    {
      id: '1',
      images: [require('../../assets/espaco.jpg'), require('../../assets/espaco.jpg')],
      title: 'Espaço Luxuoso, São Paulo',
      address: 'Av. Brigadeiro Faria Lima, 1500',
      price: 'R$ 2.800',
      originalPrice: 'R$ 3.500',
      rating: 4.9,
      reviews: 45,
      discount: '-20%'
    },
    {
      id: '2',
      images: [require('../../assets/espaco.jpg')],
      title: 'Salão Moderno, Rio de Janeiro',
      address: 'Rua Visconde de Pirajá, 500',
      price: 'R$ 1.900',
      originalPrice: 'R$ 2.400',
      rating: 4.7,
      reviews: 28,
      discount: '-15%'
    }
  ],
  rented: [
    {
      id: '1',
      images: [require('../../assets/espaco.jpg'), require('../../assets/espaco.jpg')],
      title: 'Espaço Corporativo, São Paulo',
      address: 'Av. Paulista, 1000',
      price: 'R$ 4.500',
      rating: 4.9,
      reviews: 56
    },
    {
      id: '2',
      images: [require('../../assets/espaco.jpg')],
      title: 'Sala de Reuniões Premium, Rio de Janeiro',
      address: 'Av. Rio Branco, 500',
      price: 'R$ 3.200',
      rating: 4.8,
      reviews: 42
    },
    {
      id: '3',
      images: [require('../../assets/espaco.jpg'), require('../../assets/espaco.jpg')],
      title: 'Espaço para Eventos, Belo Horizonte',
      address: 'Av. Afonso Pena, 1500',
      price: 'R$ 5.000',
      rating: 4.7,
      reviews: 38
    }
  ],
  favorites: [
    {
      id: '1',
      images: [require('../../assets/espaco.jpg'), require('../../assets/espaco.jpg')],
      title: 'Espaço Gourmet, São Paulo',
      address: 'Rua Augusta, 2000',
      price: 'R$ 3.800',
      rating: 4.9,
      reviews: 48
    },
    {
      id: '2',
      images: [require('../../assets/espaco.jpg')],
      title: 'Sala de Treinamento, Rio de Janeiro',
      address: 'Av. Nossa Senhora de Copacabana, 1000',
      price: 'R$ 2.900',
      rating: 4.8,
      reviews: 35
    },
    {
      id: '3',
      images: [require('../../assets/espaco.jpg'), require('../../assets/espaco.jpg')],
      title: 'Espaço Coworking, Belo Horizonte',
      address: 'Rua da Bahia, 1200',
      price: 'R$ 1.800',
      rating: 4.7,
      reviews: 29
    },
    {
      id: '4',
      images: [require('../../assets/espaco.jpg')],
      title: 'Sala de Conferência, Curitiba',
      address: 'Av. Sete de Setembro, 800',
      price: 'R$ 3.500',
      rating: 4.9,
      reviews: 41
    }
  ]
};

export const useCards = (type: 'featured' | 'promo' | 'rented' | 'favorites') => {
  const [cards, setCards] = useState<CardType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        setLoading(true);
        // Simulando uma chamada de API
        await new Promise(resolve => setTimeout(resolve, 500));
        setCards(mockData[type]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar cards');
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, [type]);

  return { cards, loading, error };
}; 