import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet } from "react-native";
import Card from "../components/card";
import { useCards } from "../hooks/useCards";
import { BaseCard } from "../types/card";
import { homeStyles as styles } from '../styles/homeStyles';
import SearchBar from "../components/searchBar";
import { pageTexts } from '../styles/globalStyles/pageTexts';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { FilterOptions } from '../components/filter';

export default function Rented() {
  const { cards: rentedCards, loading } = useCards('rented');
  const { theme, isDarkMode } = useTheme();
  const { user } = useAuth();
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

  const sortCards = (cards: BaseCard[]) => {
    switch (filters.sortBy) {
      case 'price_asc':
        return [...cards].sort((a, b) => a.price_per_hour - b.price_per_hour);
      case 'price_desc':
        return [...cards].sort((a, b) => b.price_per_hour - a.price_per_hour);
      default:
        return cards;
    }
  };

  const filteredCards = sortCards((rentedCards || []).filter(card => {
    const searchLower = searchQuery.toLowerCase();
    const location = typeof card.location === 'object' ? card.location.formatted_address : card.location;

    const matchesSearch = searchQuery === '' || (
      card.space_name.toLowerCase().includes(searchLower) ||
      location.toLowerCase().includes(searchLower)
    );

    const matchesPrice = filterByPrice(card.price_per_hour, filters.priceRange);
    const matchesType = filterByType(card.space_type, filters.spaceType);
    const matchesRating = filterByRating(5, filters.rating); // Usando rating fixo de 5 por enquanto

    return matchesSearch && matchesPrice && matchesType && matchesRating;
  }));

  const renderCard = (item: BaseCard) => (
    <View style={localStyles.cardContainer}>
      <Card
        _id={item._id}
        image_url={item.image_url}
        space_name={item.space_name}
        location={typeof item.location === 'object' ? item.location.formatted_address : item.location}
        price_per_hour={item.price_per_hour}
        space_description={item.space_description}
        space_type={item.space_type}
        space_amenities={[]}
        max_people={0}
        week_days={[]}
        opening_time=""
        closing_time=""
        space_rules={[]}
        owner_name=""
        owner_phone=""
        owner_email=""
      />
    </View>
  );

  const EmptyComponent = () => (
    <View style={{ 
      flex: 1, 
      justifyContent: 'center', 
      alignItems: 'center', 
      paddingTop: 50,
      paddingHorizontal: 20
    }}>
      {!user ? (
        <>
          <Text style={[pageTexts.title, { 
            textAlign: 'center', 
            color: theme.text,
            fontSize: 24,
            marginBottom: 16
          }]}>
            Faça login para ver seus aluguéis
          </Text>
          <Text style={[pageTexts.title, { 
            textAlign: 'center', 
            color: theme.text,
            fontSize: 16,
            opacity: 0.7,
            lineHeight: 24
          }]}>
            Entre com sua conta para ver os espaços que você alugou.
          </Text>
        </>
      ) : (
        <>
          <Text style={[pageTexts.title, { 
            textAlign: 'center', 
            color: theme.text,
            fontSize: 24,
            marginBottom: 16
          }]}>
            Nenhum espaço alugado ainda
          </Text>
          <Text style={[pageTexts.title, { 
            textAlign: 'center', 
            color: theme.text,
            fontSize: 16,
            opacity: 0.7,
            lineHeight: 24
          }]}>
            Explore os espaços disponíveis e faça seu primeiro aluguel para ver seus espaços alugados aqui.
          </Text>
        </>
      )}
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
        data={user ? filteredCards : []}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => renderCard(item)}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.contentContainer, localStyles.listContainer]}
        numColumns={1}
        ListEmptyComponent={loading ? null : EmptyComponent}
      />
    </View>
  );
}

const localStyles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    alignItems: 'center',
  },
  cardContainer: {
    width: '100%',
    marginBottom: 16,
    alignItems: 'center',
  },
});