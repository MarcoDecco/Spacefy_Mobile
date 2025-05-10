import React, { useState, useRef, useEffect } from 'react';
import { View, Image, Text, TouchableOpacity, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { CARD_WIDTH } from '../styles/home.styles';
import { useIsFocused } from '@react-navigation/native';

const CARD_HEIGHT = 340;

interface CardProps {
  images: any[];
  title: string;
  address: string;
  price: string;
  rating: number;
  reviews: number;
}

const Card: React.FC<CardProps> = ({ images, title, address, price, rating, reviews }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlayPaused, setIsAutoPlayPaused] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const isFocused = useIsFocused();

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

  return (
    <View style={[styles.card, { width: CARD_WIDTH, height: CARD_HEIGHT }]}> 
      {/* Carrossel de Imagens */}
      {images.length > 1 ? (
        <View style={styles.carouselContainer}>
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
                style={[styles.image, { width: CARD_WIDTH, height: 180 }]}
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
              <TouchableOpacity
                key={index}
                onPress={() => {
                  setIsAutoPlayPaused(true);
                  scrollToIndex(index);
                  setTimeout(() => setIsAutoPlayPaused(false), 5000);
                }}
              >
                <View
                  style={[styles.dot, activeIndex === index ? styles.dotActive : styles.dotInactive]}
                />
              </TouchableOpacity>
            ))}
          </View>
          {/* Contador de fotos */}
          <View style={styles.counter}>
            <Text style={styles.counterText}>{activeIndex + 1}/{images.length}</Text>
          </View>
        </View>
      ) : (
        <Image
          source={images[0]}
          style={[styles.image, { width: CARD_WIDTH, height: 180 }]}
          resizeMode="cover"
        />
      )}
      {/* Conteúdo do Card */}
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title} numberOfLines={1}>{title}</Text>
            <Text style={styles.address} numberOfLines={1}>{address}</Text>
          </View>
          <TouchableOpacity>
            <Feather name="heart" size={20} color="#888" />
          </TouchableOpacity>
        </View>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>{price}</Text>
          <Text style={styles.priceHour}>por hora</Text>
        </View>
        <View style={styles.footer}>
          <View style={styles.ratingRow}>
            <Feather name="star" size={18} color="#F59E0B" />
            <Text style={styles.rating}>{rating.toFixed(2)}</Text>
            <Text style={styles.reviews}>({reviews} avaliações)</Text>
          </View>
          <TouchableOpacity style={styles.seeMoreButton}>
            <Text style={styles.seeMoreText}>Ver mais</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
    marginBottom: 18,
    position: 'relative',
  },
  carouselContainer: {
    position: 'relative',
  },
  image: {
    borderRadius: 0,
  },
  arrow: {
    position: 'absolute',
    top: '50%',
    marginTop: -24,
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 8,
    borderRadius: 20,
    zIndex: 2,
  },
  arrowLeft: {
    left: 8,
  },
  arrowRight: {
    right: 8,
  },
  dotsContainer: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 3,
  },
  dotActive: {
    backgroundColor: '#fff',
  },
  dotInactive: {
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  counter: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  counterText: {
    color: '#fff',
    fontSize: 12,
  },
  content: {
    padding: 16,
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
  },
  address: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
  },
  priceHour: {
    fontSize: 14,
    color: '#888',
    marginLeft: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
    paddingTop: 16,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#222',
    marginLeft: 4,
  },
  reviews: {
    fontSize: 13,
    color: '#888',
    marginLeft: 4,
  },
  seeMoreButton: {
    backgroundColor: '#1EACE3',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  seeMoreText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default Card;