import React, { useState, useRef, useEffect } from 'react';

import {
  View,
  Image,
  Text,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';

import { Feather } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { CARD_WIDTH } from '../styles/homeStyles';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { cardStyles as styles } from '../styles/componentStyles/cardStyles';
import { colors } from '~/styles/globalStyles/colors';
import { NavigationProps } from '../navigation/types';
import { useTheme } from '../contexts/ThemeContext';
import { useFavorites } from '../hooks/useFavorites';
import { Space } from '../types/favorite';

type CardProps = Space & {
  isSelected?: boolean;
};

const Card: React.FC<CardProps> = ({
  _id,
  image_url,
  space_name,
  location,
  price_per_hour,
  space_description = '',
  space_amenities = [],
  space_type = '',
  max_people = 0,
  week_days = [],
  opening_time = '',
  closing_time = '',
  space_rules = [],
  owner_name = '',
  owner_phone = '',
  owner_email = '',
  isSelected = false,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlayPaused, setIsAutoPlayPaused] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const isFocused = useIsFocused();
  const navigation = useNavigation<NavigationProps>();
  const { theme, isDarkMode } = useTheme();
  const { favorites, toggleFavorite } = useFavorites();

  const isFavorite = favorites.some((fav) => fav.spaceId && fav.spaceId._id === _id);

  // Garantir que image_url seja sempre um array válido
  const validImageUrl = Array.isArray(image_url) ? image_url : 
    (typeof image_url === 'string' ? [image_url] : []);

  // Garantir que sempre haja pelo menos uma imagem válida
  const safeImages = validImageUrl.length > 0
    ? validImageUrl.map((url) => ({ uri: url }))
    : [{ uri: 'https://via.placeholder.com/350x180?text=Sem+imagem' }];

  console.log('[Card] Dados das imagens:', {
    originalImageUrl: image_url,
    validImageUrl,
    safeImages
  });

  const handleScroll = (event: any) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    setActiveIndex(Math.round(index));
  };

  const scrollToIndex = (index: number) => {
    const newIndex = Math.max(0, Math.min(index, safeImages.length - 1));
    scrollRef.current?.scrollTo({
      x: newIndex * CARD_WIDTH,
      animated: true,
    });
    setActiveIndex(newIndex);
  };

  const handleMomentumScrollEnd = (event: any) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    const roundedIndex = Math.round(index);

    if (roundedIndex !== activeIndex) {
      scrollToIndex(roundedIndex);
    }
  };

  useEffect(() => {
    if (!isSelected || safeImages.length <= 1 || isAutoPlayPaused || !isFocused) return;
    const timer = setInterval(() => {
      scrollToIndex((activeIndex + 1) % safeImages.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [activeIndex, isAutoPlayPaused, safeImages.length, isFocused, isSelected]);

  const handleCardPress = () => {
    navigation.navigate('SpaceDetails', {
      space: {
        id: _id,
        images: safeImages,
        title: space_name,
        address: location ? (typeof location === 'object' ? location.formatted_address : location) : '',
        price: `R$ ${price_per_hour.toLocaleString('pt-BR')}`,
        rating: 5.0,
        reviews: 100,
        description: space_description,
        amenities: space_amenities,
        type: space_type,
        area: `${max_people}m²`,
        capacity: `${max_people} pessoas`,
        bathrooms: '2',
        hasWifi: space_amenities.includes('Wi-Fi'),
      },
    });
  };

  const handleFavoritePress = async (e: any) => {
    e.stopPropagation(); // Previne que o card seja clicado
    try {
      if (!_id) {
        console.error('Erro ao favoritar: ID do espaço não encontrado');
        Alert.alert('Erro', 'Não foi possível favoritar este espaço. ID não encontrado.', [
          { text: 'OK' },
        ]);
        return;
      }

      const spaceData: Space = {
        _id,
        space_name,
        image_url: safeImages.map((img) => img.uri),
        location: typeof location === 'object' ? location : {
          coordinates: { lat: 0, lng: 0 },
          formatted_address: location,
          place_id: ''
        },
        price_per_hour,
        space_description,
        space_amenities,
        space_type,
        max_people,
        week_days: [],
        opening_time: '',
        closing_time: '',
        space_rules: [],
        owner_name: '',
        owner_phone: '',
        owner_email: '',
      };
      await toggleFavorite(spaceData);
    } catch (error: any) {
      console.error('Erro ao favoritar:', error);
      Alert.alert(
        'Erro',
        error.message || 'Não foi possível favoritar este espaço. Tente novamente mais tarde.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleLocationPress = () => {
    if (!location) return;

    let url;
    if (typeof location === 'object' && 'coordinates' in location) {
      // Se tiver coordenadas no formato correto
      url = `https://www.google.com/maps/search/?api=1&query=${location.coordinates.lat},${location.coordinates.lng}`;
    } else if (typeof location === 'string') {
      // Se for uma string (endereço)
      url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
    } else {
      return; // Não tem localização válida
    }

    // @ts-ignore
    if (typeof window !== 'undefined') {
      window.open(url, '_blank');
    } else {
      import('react-native').then(({ Linking }) => Linking.openURL(url));
    }
  };

  const getLocationDisplay = () => {
    if (!location) return 'Endereço não disponível';
    if (typeof location === 'string') return location;
    return location.formatted_address || 'Endereço não disponível';
  };

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          width: CARD_WIDTH,
          backgroundColor: isDarkMode ? theme.background : colors.white,
          borderWidth: isDarkMode ? 1 : 0,
          borderColor: colors.blue,
        },
      ]}
      onPress={handleCardPress}
      activeOpacity={0.9}>
      {/* Carrossel de Imagens */}
      <View style={{ width: CARD_WIDTH, height: 180 }}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          onMomentumScrollEnd={handleMomentumScrollEnd}
          ref={scrollRef}
          scrollEventThrottle={16}
          onTouchStart={() => setIsAutoPlayPaused(true)}
          onTouchEnd={() => setIsAutoPlayPaused(false)}
          decelerationRate="fast"
          snapToInterval={CARD_WIDTH}
          snapToAlignment="center">
          {safeImages.map((img, index) => (
            <TouchableWithoutFeedback key={index}>
              <View style={{ width: CARD_WIDTH, height: 180 }}>
                <Image
                  source={{ uri: img.uri }}
                  style={{ width: CARD_WIDTH, height: 180 }}
                  resizeMode="cover"
                />
              </View>
            </TouchableWithoutFeedback>
          ))}
        </ScrollView>

        {/* Dots */}
        <View style={styles.dotsContainer}>
          {safeImages.map((_, index) => (
            <View
              key={index}
              style={[styles.dot, index === activeIndex ? styles.dotActive : styles.dotInactive]}
            />
          ))}
        </View>

        {/* Contador de imagens */}
        <View style={styles.counter}>
          <Text style={styles.counterText}>
            {activeIndex + 1}/{safeImages.length}
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.title, { color: theme.text }]} numberOfLines={1}>
              {space_name || 'Sem nome'}
            </Text>
            <TouchableOpacity onPress={handleLocationPress}>
              <Text style={[styles.address, isDarkMode && { color: theme.text }]} numberOfLines={1}>
                {getLocationDisplay()}
              </Text>
            </TouchableOpacity>
            {space_type && (
              <Text style={[styles.spaceType, { color: theme.gray }]}>{space_type}</Text>
            )}
          </View>

          <TouchableOpacity onPress={handleFavoritePress}>
            {isFavorite ? (
              <MaterialIcons name="favorite" size={21} color={colors.error} />
            ) : (
              <MaterialIcons name="favorite-outline" size={22} color={theme.gray} />
            )}
          </TouchableOpacity>
        </View>

        {space_description && (
          <Text style={[styles.description, { color: theme.gray }]} numberOfLines={2}>
            {space_description}
          </Text>
        )}

        <View style={styles.priceContainer}>
          <Text style={[styles.price, { color: theme.blue }]}>
            {price_per_hour
              ? `R$ ${price_per_hour.toLocaleString('pt-BR')}/hora`
              : 'Preço não disponível'}
          </Text>
        </View>

        <View style={styles.ratingRow}>
          <MaterialIcons name="star" size={16} color="#F59E0B" />
          <Text style={[styles.rating, { color: theme.text }]}>5.0</Text>
          <Text style={[styles.reviews, { color: theme.gray }]}>(100 avaliações)</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default Card;
