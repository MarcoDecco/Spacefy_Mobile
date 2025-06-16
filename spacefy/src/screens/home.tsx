import { View, FlatList, Text } from "react-native";
import SearchBar from "../components/searchBar";
import Card from "../components/card";
import { useCards } from "../hooks/useCards";
import { homeStyles as styles } from '../styles/homeStyles';
import { useTheme } from '../contexts/ThemeContext';
import { useState, useCallback, useRef } from 'react';
import { FilterOptions } from '../components/filter';
import { pageTexts } from '../styles/globalStyles/pageTexts';
import ScrollToTopButton from '../components/scrollToTopButton';

// Função para mapear os dados da API para o formato esperado pelo Card
function mapCard(item: any) {
  console.log('[mapCard] Dados recebidos:', item);

  // Trata o campo location que pode vir em diferentes formatos
  let location: string | {
    coordinates: {
      lat: number;
      lng: number;
    };
    formatted_address: string;
    place_id: string;
  } = 'Endereço não disponível';

  if (item.location) {
    if (typeof item.location === 'object' && item.location !== null) {
      if ('coordinates' in item.location) {
        // Já está no formato correto
        location = item.location;
      } else if (item.location.lat && item.location.lng) {
        // Tem lat/lng mas não está no formato correto
        location = {
          coordinates: {
            lat: item.location.lat,
            lng: item.location.lng
          },
          formatted_address: item.location.formatted_address || `${item.location.lat}, ${item.location.lng}`,
          place_id: item.location.place_id || ''
        };
      } else if (item.location.formatted_address) {
        // Tem apenas o endereço formatado
        location = item.location.formatted_address;
      }
    } else if (typeof item.location === 'string') {
      try {
        // Tenta fazer parse se for JSON
        const parsedLocation = JSON.parse(item.location);
        if ('coordinates' in parsedLocation) {
          location = parsedLocation;
        } else if (parsedLocation.lat && parsedLocation.lng) {
          location = {
            coordinates: {
              lat: parsedLocation.lat,
              lng: parsedLocation.lng
            },
            formatted_address: parsedLocation.formatted_address || `${parsedLocation.lat}, ${parsedLocation.lng}`,
            place_id: parsedLocation.place_id || ''
          };
        } else {
          location = parsedLocation.formatted_address || item.location;
        }
      } catch {
        // Se não for JSON, usa a string como está
        location = item.location;
      }
    }
  }

  // Garantir que image_url seja sempre um array válido
  let image_url = item.image_url;
  if (!image_url) {
    image_url = [];
  } else if (typeof image_url === 'string') {
    try {
      // Tenta fazer parse se for uma string JSON
      image_url = JSON.parse(image_url);
    } catch {
      // Se não for JSON, trata como uma única URL
      image_url = [image_url];
    }
  } else if (!Array.isArray(image_url)) {
    image_url = [];
  }

  console.log('[mapCard] Dados processados:', {
    originalLocation: item.location,
    processedLocation: location,
    originalImageUrl: item.image_url,
    processedImageUrl: image_url
  });

  return {
    ...item,
    location,
    image_url
  };
}

export default function Home() {
  const { cards, loading } = useCards();
  const { theme, isDarkMode } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const [filters, setFilters] = useState<FilterOptions>({
    priceRange: '',
    spaceType: '',
    rating: '',
    sortBy: '',
  });

  const handleSearch = useCallback((text: string) => {
    setSearchQuery(text);
  }, []);

  const handleFilterChange = useCallback((newFilters: FilterOptions) => {
    setFilters(newFilters);
  }, []);

  const filterByPrice = (price: number, range: string) => {
    if (!range) return true;
    const [min, max] = range.split('-').map(Number);
    if (range === '200+') return price >= 200;
    return price >= min && price <= max;
  };

  const filterByType = (type: string, filterType: string) => {
    if (!filterType) return true;
    return type === filterType;
  };

  const filterByRating = (rating: number, filterRating: string) => {
    if (!filterRating) return true;
    const minRating = parseInt(filterRating);
    return rating >= minRating;
  };

  const sortCards = (cards: any[]) => {
    switch (filters.sortBy) {
      case 'price_asc':
        return [...cards].sort((a, b) => a.price_per_hour - b.price_per_hour);
      case 'price_desc':
        return [...cards].sort((a, b) => b.price_per_hour - a.price_per_hour);
      default:
        return cards;
    }
  };

  const filteredCards = sortCards(
    cards
      .map(mapCard)
      .filter(card => {
        const searchLower = searchQuery.toLowerCase();
        const matchesSearch = searchQuery === '' || (
          card.space_name.toLowerCase().includes(searchLower) ||
          card.location.formatted_address.toLowerCase().includes(searchLower)
        );

        const matchesPrice = filterByPrice(card.price_per_hour, filters.priceRange);
        const matchesType = filterByType(card.space_type, filters.spaceType);
        const matchesRating = filterByRating(5, filters.rating); // Usando rating fixo de 5 por enquanto

        return matchesSearch && matchesPrice && matchesType && matchesRating;
      })
  );

  const renderCard = ({ item }: { item: any }) => (
    <View style={{ alignItems: 'center' }}>
      <Card {...item} />
    </View>
  );

  const EmptySearchComponent = () => (
    <View style={{ 
      flex: 1, 
      justifyContent: 'center', 
      alignItems: 'center', 
      paddingTop: 50,
      paddingHorizontal: 20
    }}>
      <Text style={[pageTexts.title, { 
        textAlign: 'center', 
        color: theme.text,
        fontSize: 24,
        marginBottom: 16
      }]}>
        Nenhum espaço encontrado
      </Text>
      <Text style={[pageTexts.title, { 
        textAlign: 'center', 
        color: theme.text,
        fontSize: 16,
        opacity: 0.7,
        lineHeight: 24
      }]}>
        Tente ajustar sua busca ou filtros para encontrar o que você procura.
      </Text>
    </View>
  );

  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setShowScrollTop(offsetY > 300);
  };

  const scrollToTop = () => {
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  return (
    <View style={[styles.container, isDarkMode && { backgroundColor: theme.background }]}>
      <SearchBar 
        onSearch={handleSearch} 
        onFilterChange={handleFilterChange}
        initialValue={searchQuery} 
      />
      <FlatList
        ref={flatListRef}
        data={filteredCards}
        keyExtractor={(item) => item._id}
        renderItem={renderCard}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.contentContainer, { alignItems: 'center' }]}
        ListEmptyComponent={EmptySearchComponent}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      />
      <ScrollToTopButton onPress={scrollToTop} visible={showScrollTop} />
    </View>
  );
}