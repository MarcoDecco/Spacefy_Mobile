import { View, FlatList, Text } from "react-native";
import SearchBar from "../components/searchBar";
import Card from "../components/card";
import { useCards } from "../hooks/useCards";
import { homeStyles as styles } from '../styles/homeStyles';
import { useTheme } from '../contexts/ThemeContext';
import { useState, useCallback } from 'react';
import { FilterOptions } from '../components/filter';
import { pageTexts } from '../styles/globalStyles/pageTexts';

// Função para mapear os dados da API para o formato esperado pelo Card
function mapCard(item: any) {
  // Trata o campo location que pode vir como objeto
  const location = typeof item.location === 'object' && item.location !== null
    ? item.location.formatted_address || 'Endereço não disponível'
    : item.location || 'Endereço não disponível';

  return {
    _id: item._id,
    image_url: item.image_url || [],
    space_name: item.space_name || 'Sem nome',
    location,
    price_per_hour: item.price_per_hour || 0,
    space_description: item.space_description || '',
    space_amenities: item.space_amenities || [],
    space_type: item.space_type || '',
    max_people: item.max_people || 0,
    week_days: item.week_days || [],
    opening_time: item.opening_time || '',
    closing_time: item.closing_time || '',
    space_rules: item.space_rules || [],
    owner_name: item.owner_name || '',
    owner_phone: item.owner_phone || '',
    owner_email: item.owner_email || ''
  };
}

export default function Home() {
  const { cards, loading } = useCards();
  const { theme, isDarkMode } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
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
          card.location.toLowerCase().includes(searchLower)
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

  return (
    <View style={[styles.container, isDarkMode && { backgroundColor: theme.background }]}>
      <SearchBar 
        onSearch={handleSearch} 
        onFilterChange={handleFilterChange}
        initialValue={searchQuery} 
      />
      <FlatList
        data={filteredCards}
        keyExtractor={(item) => item._id}
        renderItem={renderCard}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.contentContainer, { alignItems: 'center' }]}
        ListEmptyComponent={EmptySearchComponent}
      />
    </View>
  );
}