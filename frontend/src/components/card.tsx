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
  id: string;
  images: any[];
  title: string;
  address: string;
  price: string;
  rating: number;
  reviews: number;
}

const Card: React.FC<CardProps> = ({ id, images, title, address, price, rating, reviews }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlayPaused, setIsAutoPlayPaused] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const isFocused = useIsFocused();
  const navigation = useNavigation<NavigationProps>();
  const { theme, isDarkMode } = useTheme();

  const handleScroll = (event: any) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    setActiveIndex(Math.round(index));
  };

  const scrollToIndex = (index: number) => {
    const newIndex = Math.max(0, Math.min(index, images.length - 1));
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
    if (images.length <= 1 || isAutoPlayPaused || !isFocused) return;
    const timer = setInterval(() => {
      scrollToIndex((activeIndex + 1) % images.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [activeIndex, isAutoPlayPaused, images.length, isFocused]);

  const handleCardPress = () => {
    navigation.navigate('SpaceDetails', {
      space: {
        id,
        images,
        title,
        address,
        price,
        rating,
        reviews,
        description: 'Este é um espaço incrível para seu evento. Com localização privilegiada e todas as comodidades necessárias para garantir o sucesso do seu evento.',
        amenities: [
          'Estacionamento',
          'Wi-Fi',
          'Ar condicionado',
          'Cozinha',
          'Banheiros'
        ]
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
      {images.length > 1 ? (
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
            {images.map((img, index) => (
              <Image
                key={index}
                source={img}
                style={{ width: CARD_WIDTH, height: 180 }}
                resizeMode="cover"
              />
            ))}
          </ScrollView>

          {/* Setas de navegação */}
          <TouchableOpacity
            style={[styles.arrow, styles.arrowLeft]}
            onPress={() => {
              setIsAutoPlayPaused(true);
              scrollToIndex(activeIndex - 1);
              setTimeout(() => setIsAutoPlayPaused(false), 5000);
            }}
          >
            <Feather name="chevron-left" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.arrow, styles.arrowRight]}
            onPress={() => {
              setIsAutoPlayPaused(true);
              scrollToIndex(activeIndex + 1);
              setTimeout(() => setIsAutoPlayPaused(false), 5000);
            }}
          >
            <Feather name="chevron-right" size={24} color="white" />
          </TouchableOpacity>

          {/* Dots */}
          <View style={styles.dotsContainer}>
            {images.map((_, index) => (
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
              {activeIndex + 1}/{images.length}
            </Text>
          </View>
        </View>
      ) : (
        <Image
          source={images[0]}
          style={{ width: CARD_WIDTH, height: 180 }}
          resizeMode="cover"
        />
      )}

      <View style={styles.content}>
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.title, { color: theme.text }]} numberOfLines={1}>{title}</Text>
            <Text style={[styles.address, { color: theme.gray }]} numberOfLines={1}>{address}</Text>
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

        <View style={styles.priceContainer}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
            <Text style={[styles.price, { color: theme.text }]}>{price}</Text>
            <Text style={[styles.priceHour, { color: theme.gray }]}>por hora</Text>
          </View>

          <View style={styles.ratingRow}>
            <MaterialIcons name="star" size={18} color="#F59E0B" />
            <Text style={[styles.rating, { color: theme.text }]}>{rating.toFixed(2)}</Text>
            <Text style={[styles.reviews, { color: theme.gray }]}>({reviews} avaliações)</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default Card;