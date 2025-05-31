import React, { useState, useRef, useEffect } from 'react';
import { View, Image, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { CARD_WIDTH } from '../styles/homeStyles';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { cardStyles as styles } from '../styles/componentStyles/cardStyles';
import { colors } from '~/styles/globalStyles/colors';
import { NavigationProps } from '../navigation/types';
import { useTheme } from '../contexts/ThemeContext';

interface CardProps {
  _id: string;
  image_url: string[];
  space_name: string;
  location: string;
  price_per_hour: number;
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

const Card: React.FC<CardProps> = ({ 
  _id,
  image_url = [],
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
  owner_email = ''
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlayPaused, setIsAutoPlayPaused] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const isFocused = useIsFocused();
  const navigation = useNavigation<NavigationProps>();
  const { theme, isDarkMode } = useTheme();

  // Garantir que sempre haja pelo menos uma imagem válida
  const safeImages = image_url && image_url.length > 0
    ? image_url.map(url => ({ uri: url }))
    : [{ uri: 'https://via.placeholder.com/350x180?text=Sem+imagem' }];

  const handleScroll = (event: any) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    setActiveIndex(Math.round(index));
  };

  const scrollToIndex = (index: number) => {
    const newIndex = Math.max(0, Math.min(index, safeImages.length - 1));
    scrollRef.current?.scrollTo({
      x: newIndex * CARD_WIDTH,
      animated: true
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
    if (safeImages.length <= 1 || isAutoPlayPaused || !isFocused) return;
    const timer = setInterval(() => {
      scrollToIndex((activeIndex + 1) % safeImages.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [activeIndex, isAutoPlayPaused, safeImages.length, isFocused]);

  const handleCardPress = () => {
    navigation.navigate('SpaceDetails', {
      space: {
        _id,
        image_url,
        space_name,
        location,
        price_per_hour,
        space_description,
        space_amenities,
        space_type,
        max_people,
        week_days,
        opening_time,
        closing_time,
        space_rules,
        owner_name,
        owner_phone,
        owner_email
      }
    });
  };

  return (
    <TouchableOpacity
      style={[
        styles.card, 
        { 
          width: CARD_WIDTH,
          backgroundColor: isDarkMode ? theme.background : colors.white,
          borderWidth: isDarkMode ? 1 : 0,
          borderColor: colors.blue
        }
      ]}
      onPress={handleCardPress}
      activeOpacity={0.9}
    >
      {/* Carrossel de Imagens */}
      <View>
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
          snapToAlignment="center"
        >
          {safeImages.map((img, index) => (
            <Image
              key={index}
              source={{ uri: img.uri }}
              style={{ width: CARD_WIDTH, height: 180 }}
              resizeMode="cover"
            />
          ))}
        </ScrollView>

        {/* Dots */}
        <View style={styles.dotsContainer}>
          {safeImages.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === activeIndex ? styles.dotActive : styles.dotInactive
              ]}
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
            <Text style={[styles.address, { color: theme.gray }]} numberOfLines={1}>
              {typeof location === 'string' ? location : 'Endereço não disponível'}
            </Text>
            {space_type && (
              <Text style={[styles.spaceType, { color: theme.gray }]}>{space_type}</Text>
            )}
          </View>

          <TouchableOpacity onPress={() => setIsFavorite(!isFavorite)}>
            {isFavorite ? (
              <MaterialIcons
                name="favorite"
                size={21}
                color={colors.blue}
              />
            ) : (
              <MaterialIcons
                name="favorite-outline"
                size={22}
                color={theme.gray}
              />
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
            {price_per_hour ? `R$ ${price_per_hour.toLocaleString('pt-BR')}/hora` : 'Preço não disponível'}
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