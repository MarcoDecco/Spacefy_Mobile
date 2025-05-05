import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import logo from '../../assets/ArteIntrodutória.png';

export default function Welcome({ navigation }: { navigation: any }) {
  return (
    <LinearGradient
      colors={['#C2EBFF', '#6ACDFF']}
      className="flex-1 justify-center items-center px-6"
    >
      <Image
        source={logo}
        resizeMode="contain"
        className="w-[276px] h-[211px] mb-16"
      />

      {/* Título */}
      <Text className="text-[20px] font-semibold text-[#2F2F2F] text-center mb-12">
        Bem-vindo ao SPACEFY!
      </Text>

      {/* Descrição */}
      <Text className="text-[13px] text-[#2F2F2F] text-center mb-10 w-[80%]">
        Antes de começar a utilizar a plataforma, entre com o seu login preenchendo as informações necessárias.
      </Text>

      {/* Botão "Entrar" */}
      <TouchableOpacity
        className="bg-[#1486B8] py-3 px-10 rounded mb-4 w-[50%] items-center"
        onPress={() => navigation.navigate('Login')}
      >
        <Text className="text-white font-bold text-[15px]">Entrar</Text>
      </TouchableOpacity>

      {/* Botão "Registrar" */}
      <TouchableOpacity
        className="bg-white border border-[#1486B8] py-3 px-10 rounded w-[50%] items-center"
        onPress={() => navigation.navigate('Register')}
      >
        <Text className="text-[#1486B8] font-bold text-[15px]">Registrar</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}
