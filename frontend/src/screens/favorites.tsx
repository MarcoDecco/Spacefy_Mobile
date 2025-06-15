import { useState, useCallback, useRef } from 'react';
import { View, FlatList, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { useFavorites } from '../hooks/useFavorites';
import Card from '../components/card';
import Search from '../components/searchBar';
import { useTheme } from '../contexts/ThemeContext';
import { homeStyles as styles } from '../styles/homeStyles';
import { FilterOptions } from '../components/filter';
import { pageTexts } from '../styles/globalStyles/pageTexts';
import ScrollToTopButton from '../components/scrollToTopButton';

interface Space {
  _id: string;
  space_name: string;
  image_url: string[];
  price_per_hour: number;
  location: string | {
    coordinates: {
      lat: number;
      lng: number;
    };
    formatted_address: string;
    place_id: string;
  };
  space_description: string;
  space_amenities: string[];
  space_type: string;
  max_people: number;
  week_days: string[];
  opening_time: string;
  closing_time: string;
  space_rules: string[];
  owner_name: string;
  owner_phone: string;
  owner_email: string;
}

interface Favorite {
  _id: string; // Agora o campo _id existe
  spaceId: Space | null;
  userId: string;
  createdAt: Date;
  lastViewed: Date;
}

export default function Favorites() {
  const { favorites, loading, error } = useFavorites();
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

  const filteredFavorites = favorites.filter((favorite) => {
    if (!favorite.spaceId) return false;

    const space = favorite.spaceId;
    const searchLower = searchQuery.toLowerCase();

    const matchesSearch =
      searchQuery === '' ||
      (typeof space.space_name === 'string' &&
        space.space_name.toLowerCase().includes(searchLower)) ||
      (typeof space.location === 'string' && space.location.toLowerCase().includes(searchLower));

    const matchesPrice = filterByPrice(space.price_per_hour, filters.priceRange);
    const matchesType = filterByType(space.space_type, filters.spaceType);
    const matchesRating = filterByRating(5, filters.rating); // Usando rating fixo de 5 por enquanto

    return matchesSearch && matchesPrice && matchesType && matchesRating;
  });

  const renderCard = (item: Favorite) => {
    if (!item.spaceId) return null;

    const spaceData: Space = {
      _id: item.spaceId._id,
      space_name: item.spaceId.space_name,
      image_url: item.spaceId.image_url,
      location: typeof item.spaceId.location === 'object' ? item.spaceId.location.formatted_address : item.spaceId.location,
      price_per_hour: item.spaceId.price_per_hour,
      space_description: item.spaceId.space_description || '',
      space_amenities: item.spaceId.space_amenities || [],
      space_type: item.spaceId.space_type || '',
      max_people: item.spaceId.max_people || 0,
      week_days: item.spaceId.week_days || [],
      opening_time: item.spaceId.opening_time || '',
      closing_time: item.spaceId.closing_time || '',
      space_rules: item.spaceId.space_rules || [],
      owner_name: item.spaceId.owner_name || '',
      owner_phone: item.spaceId.owner_phone || '',
      owner_email: item.spaceId.owner_email || '',
    };

    return (
      <View style={localStyles.cardContainer}>
        <Card {...spaceData} />
      </View>
    );
  };

  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setShowScrollTop(offsetY > 300);
  };

  const scrollToTop = () => {
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={theme.blue} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: theme.text }}>{error}</Text>
      </View>
    );
  }

  if (favorites.length === 0) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: theme.text }}>Você ainda não tem espaços favoritos</Text>
      </View>
    );
  }

  const EmptySearchComponent = () => (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 50,
        paddingHorizontal: 20,
      }}>
      <Text
        style={[
          pageTexts.title,
          {
            textAlign: 'center',
            color: theme.text,
            fontSize: 24,
            marginBottom: 16,
          },
        ]}>
        Nenhum espaço encontrado
      </Text>
      <Text
        style={[
          pageTexts.title,
          {
            textAlign: 'center',
            color: theme.text,
            fontSize: 16,
            opacity: 0.7,
            lineHeight: 24,
          },
        ]}>
        Tente ajustar sua busca ou filtros para encontrar o que você procura.
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, isDarkMode && { backgroundColor: theme.background }]}>
      <Search
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
        initialValue={searchQuery}
      />
      <FlatList
        ref={flatListRef}
        data={filteredFavorites}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => renderCard(item)}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.contentContainer, localStyles.listContainer]}
        numColumns={1}
        ListEmptyComponent={EmptySearchComponent}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      />
      <ScrollToTopButton onPress={scrollToTop} visible={showScrollTop} />
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
