import { View, Image, Text, TouchableOpacity, ScrollView, Dimensions, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useState, useRef, useEffect } from 'react';
import { NativeSyntheticEvent, NativeScrollEvent } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');
const CARD_WIDTH = screenWidth * 0.8;
const IMAGE_HEIGHT = 180;

interface CardProps {
  images: any[];
  title: string;
  address: string;
  price: string;
  rating: number;
  reviews: number;
}

export default function Card({ images, title, address, price, rating, reviews }: CardProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlayPaused, setIsAutoPlayPaused] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
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

  // Autoplay
  useEffect(() => {
    if (images.length <= 1 || isAutoPlayPaused) return;

    const timer = setInterval(() => {
      scrollToIndex((activeIndex + 1) % images.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [activeIndex, isAutoPlayPaused, images.length]);

  return (
    <View className="bg-white rounded-2xl shadow-md overflow-hidden" style={{ width: CARD_WIDTH }}>
      {/* Carrossel de Imagens */}
      {images.length > 1 ? (
        <View className="relative">
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            ref={scrollRef}
            scrollEventThrottle={16}
            onTouchStart={() => setIsAutoPlayPaused(true)}
            onTouchEnd={() => setIsAutoPlayPaused(false)}
            contentContainerStyle={{ width: CARD_WIDTH * images.length }}
            style={{ width: CARD_WIDTH }}
          >
            {images.map((img, index) => (
              <Image 
                key={index}
                source={img} 
                style={{ 
                  width: CARD_WIDTH, 
                  height: IMAGE_HEIGHT,
                  ...Platform.select({
                    ios: {
                      borderRadius: 16,
                    }
                  })
                }} 
                resizeMode="cover"
              />
            ))}
          </ScrollView>
          
          {/* Controles de navegação */}
          <TouchableOpacity
            className="absolute left-2 top-1/2 -translate-y-4 bg-black/30 p-2 rounded-full"
            style={{
              transform: [{ translateY: -20 }],
              ...Platform.select({
                ios: {
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                }
              })
            }}
            onPress={() => {
              setIsAutoPlayPaused(true);
              scrollToIndex(activeIndex - 1);
              setTimeout(() => setIsAutoPlayPaused(false), 5000);
            }}
          >
            <Feather name="chevron-left" size={24} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            className="absolute right-2 top-1/2 -translate-y-4 bg-black/30 p-2 rounded-full"
            style={{
              transform: [{ translateY: -20 }],
              ...Platform.select({
                ios: {
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                }
              })
            }}
            onPress={() => {
              setIsAutoPlayPaused(true);
              scrollToIndex(activeIndex + 1);
              setTimeout(() => setIsAutoPlayPaused(false), 5000);
            }}
          >
            <Feather name="chevron-right" size={24} color="white" />
          </TouchableOpacity>

          {/* Indicadores de página */}
          <View className="absolute bottom-2 flex-row justify-center w-full">
            {images.map((_, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  setIsAutoPlayPaused(true);
                  scrollToIndex(index);
                  setTimeout(() => setIsAutoPlayPaused(false), 5000);
                }}
                style={{
                  ...Platform.select({
                    ios: {
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.2,
                      shadowRadius: 1.41,
                    }
                  })
                }}
              >
                <View 
                  className={`h-2 w-2 mx-1 rounded-full ${activeIndex === index ? 'bg-white' : 'bg-white/50'}`}
                />
              </TouchableOpacity>
            ))}
          </View>

          {/* Contador de fotos */}
          <View 
            className="absolute top-2 right-2 bg-black/50 px-2 py-1 rounded-full"
            style={{
              ...Platform.select({
                ios: {
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.2,
                  shadowRadius: 1.41,
                }
              })
            }}
          >
            <Text className="text-white text-xs">{activeIndex + 1}/{images.length}</Text>
          </View>
        </View>
      ) : (
        <Image 
          source={images[0]} 
          style={{ 
            width: CARD_WIDTH, 
            height: IMAGE_HEIGHT,
            ...Platform.select({
              ios: {
                borderRadius: 16,
              }
            })
          }} 
          resizeMode="cover"
        />
      )}

      {/* Conteúdo do Card */}
      <View className="p-4">
        <View className="flex-row justify-between items-start">
          <View className="flex-1 mr-2">
            <Text className="text-lg font-bold text-gray-900" numberOfLines={1}>{title}</Text>
            <Text className="text-sm text-gray-500 mt-1" numberOfLines={1}>{address}</Text>
          </View>
          <TouchableOpacity
            style={{
              ...Platform.select({
                ios: {
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.2,
                  shadowRadius: 1.41,
                }
              })
            }}
          >
            <Feather name="heart" size={20} color="#888" />
          </TouchableOpacity>
        </View>

        <Text className="text-base font-semibold text-gray-900 mt-2">
          {price} <Text className="text-gray-500 font-normal">por hora</Text>
        </Text>

        <View className="flex-row justify-between items-center mt-4">
          <View className="flex-row items-center">
            <Feather name="star" size={18} color="#F59E0B" fill="#F59E0B" />
            <Text className="ml-1 text-gray-900">{rating.toFixed(2)}</Text>
            <Text className="ml-1 text-gray-500">({reviews} avaliações)</Text>
          </View>

          <TouchableOpacity 
            className="bg-blue-600 px-3 py-1 rounded-full"
            style={{
              ...Platform.select({
                ios: {
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.2,
                  shadowRadius: 1.41,
                }
              })
            }}
          >
            <Text className="text-white text-sm font-medium">Ver mais</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}