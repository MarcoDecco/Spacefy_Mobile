import { View, Image, Text, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useState, useRef } from 'react';
import { NativeSyntheticEvent, NativeScrollEvent } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

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
    <View className="bg-white rounded-2xl shadow-md overflow-hidden mb-10">
      {/* Tag de desconto */}
      <View className="absolute top-2 left-2 bg-red-600 px-2 py-1 rounded z-10">
        <Text className="text-white text-sm font-bold">{discount}</Text>
      </View>
      
      {/* Carrossel de Imagens (mesmo do Card normal) */}
      {images.length > 1 ? (
        <View className="relative">
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            ref={scrollRef}
            scrollEventThrottle={16}
          >
            {images.map((img, index) => (
              <Image 
                key={index}
                source={img} 
                style={{ width: screenWidth * 0.8, height: 180 }} 
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
              />
            ))}
          </View>
        </View>
      ) : (
        <Image 
          source={images[0]} 
          style={{ width: screenWidth * 0.8, height: 180 }} 
          resizeMode="cover"
        />
      )}

      {/* Conteúdo do Card com destaque para promoção */}
      <View className="p-4">
        <View className="flex-row justify-between items-start">
          <View className="flex-1">
            <Text className="text-lg font-bold text-gray-900">{title}</Text>
            <Text className="text-sm text-gray-500 mt-1">{address}</Text>
          </View>
          <TouchableOpacity>
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
          <Text className="text-sm text-red-6000 ml-2">por hora</Text>
        </View>

        <View className="flex-row justify-between items-center mt-4">
          <View className="flex-row items-center">
            <Feather name="star" size={18} color="#F59E0B" fill="#F59E0B" />
            <Text className="ml-1 text-gray-900">{rating.toFixed(2)}</Text>
            <Text className="ml-1 text-gray-500">({reviews} avaliações)</Text>
          </View>

          <TouchableOpacity className="bg-blue-600 px-3 py-1 rounded-full">
            <Text className="text-white text-sm font-medium">Reservar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}