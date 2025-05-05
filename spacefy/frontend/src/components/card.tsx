import { View, Image, Text, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useState, useRef } from 'react';
import { NativeSyntheticEvent, NativeScrollEvent } from 'react-native';

import imagem1 from '../../assets/espaco.jpg';
import imagem2 from '../../assets/espaco.jpg';
import imagem3 from '../../assets/espaco.jpg';

const { width } = Dimensions.get('window');

export default function Card() {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef(null);
  const images = [imagem1, imagem2, imagem3]; // Array de imagens

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    setActiveIndex(Math.round(index));
  };

  return (
    <View className="mt-6 mx-4 bg-white rounded-2xl shadow-md overflow-hidden">
    {/* Carrossel de Imagens */}
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
          style={{ width, height: 180 }} 
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
        
        {/* Contador de fotos */}
        <View className="absolute bottom-2 right-2 bg-black/50 px-2 py-1 rounded-full">
          <Text className="text-white text-xs">{activeIndex + 1}/{images.length}</Text>
        </View>
      </View>

      {/* Conteúdo do Card (mantido igual) */}
      <View className="p-4">
        <View className="flex-row justify-between items-start">
          <View className="flex-1">
            <Text className="text-lg font-bold text-gray-900">Porto Belo, Muriaé - MG</Text>
            <Text className="text-sm text-gray-500 mt-1">Rua Leonídio Valentim Ferreira</Text>
          </View>
          <Feather name="heart" size={20} color="#888" />
        </View>

        <Text className="text-base font-semibold text-gray-900 mt-2">
          R$ 2.000 <Text className="text-gray-500 font-normal">por hora</Text>
        </Text>

        <View className="flex-row justify-between items-center mt-4">
          <View className="flex-row items-center">
            <Feather name="star" size={18} color="#F59E0B" fill="#F59E0B" />
            <Text className="ml-1 text-gray-900">4,80</Text>
            <Text className="ml-1 text-gray-500">(24 avaliações)</Text>
          </View>

          <TouchableOpacity className="bg-blue-600 px-3 py-1 rounded-full">
            <Text className="text-white text-sm font-medium">Ver mais</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}