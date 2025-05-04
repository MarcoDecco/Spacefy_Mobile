import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import logo from '../../assets/ArteIntrodutória.png';



export default function Welcome({ navigation }: { navigation: any }) {
  return (
    <LinearGradient colors={['#C2EBFF', '#6ACDFF']}>
      <Image
        source={logo}
        resizeMode="contain"
      />

      {/* Título */}
      <Text>Bem-vindo ao SPACEFY!</Text>

      {/* Descrição */}
      <Text>
        Antes de começar a utilizar a plataforma, 
entre com o seu login preenchendo as informações necessárias
      </Text>

      {/* Botões */}
      <TouchableOpacity
        onPress={() => navigation.navigate('Login')}
      >
        <Text>Entrar</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate('Register')}
      >
        <Text>Registrar</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}
