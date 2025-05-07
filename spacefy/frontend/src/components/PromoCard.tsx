import { View, Image, Text, TouchableOpacity, ScrollView, Dimensions, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useState, useRef } from 'react';
import { NativeSyntheticEvent, NativeScrollEvent } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');
const CARD_WIDTH = screenWidth * 0.8;
const IMAGE_HEIGHT = 180;

interface PromoCardProps {
  images: any[];
  title: string;
  address: string;
  price: string;
  originalPrice: string;
  rating: number;
  reviews: number;
  discount: string;
}

export default function PromoCard({ 
  images, 
  title, 
  address, 
  price, 
  originalPrice, 
  rating, 
  reviews, 
  discount 
}: PromoCardProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    setActiveIndex(Math.round(index));
  };

  return (
    <View className="bg-white rounded-2xl shadow-md overflow-hidden mb-10" style={{ width: CARD_WIDTH }}>
      {/* Tag de desconto */}
      <View 
        className="absolute top-2 left-2 bg-red-600 px-2 py-1 rounded z-10"
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
        <Text className="text-white text-sm font-bold">{discount}</Text>
      </View>
      
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
          
          {/* Indicadores de página */}
          <View className="absolute bottom-2 flex-row justify-center w-full">
            {images.map((_, index) => (
              <View 
                key={index}
                className={`h-2 w-2 mx-1 rounded-full ${activeIndex === index ? 'bg-white' : 'bg-white/50'}`}
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
              />
            ))}
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

      {/* Conteúdo do Card com destaque para promoção */}
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

        <View className="flex-row items-center mt-2">
          <Text className="text-base font-semibold text-red-600">
            {price}
          </Text>
          <Text className="text-sm text-gray-500 line-through ml-2">
            {originalPrice}
          </Text>
          <Text className="text-sm text-red-600 ml-2">por hora</Text>
        </View>

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
            <Text className="text-white text-sm font-medium">Reservar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}