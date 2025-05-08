import React from 'react';
import { View, Text, TouchableOpacity, Image, SafeAreaView, StatusBar, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Login from '../../assets/arte-introdutoria.png';

export default function Welcome({ navigation }: { navigation: any }) {
  return (
    <SafeAreaView className="flex-1">
      <StatusBar barStyle="dark-content" />
      
      <LinearGradient colors={['#C2EBFF', '#6ACDFF']} className="flex-1">
        <View className="flex-1 justify-center items-center px-18" style={{paddingTop: Platform.OS === 'ios' ? 20 : 0}}>
        
        <Image
          source={Login}
          style={{ width: 276, height: 211, resizeMode: 'contain' }}
        />

          {/* Título */}
          <Text className="text-2xl font-semibold text-[#2F2F2F] text-center mb-4 font-['Inter_600SemiBold']">
            Bem-vindo ao SPACEFY!
          </Text>

          {/* Descrição */}
          <Text className="text-base text-[#2F2F2F] text-center w-4/5 font-['Inter_400Regular']">
            Antes de começar a utilizar a plataforma, entre com o seu login preenchendo as informações necessárias.
          </Text>

          {/* Botão "Entrar" */}
          <TouchableOpacity
            className="bg-[#1486B8] py-3 px-10 rounded-lg mb-4 mt-16 w-1/2 items-center shadow-md"
            style={{
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.1,
              shadowRadius: 3.84,
              elevation: 5,
            }}
            onPress={() => navigation.navigate('Login')}
          >
            <Text className="text-white font-bold text-[15px] font-['Inter_600SemiBold']">
              Entrar
            </Text>
          </TouchableOpacity>

          {/* Botão "Registrar" */}
          <TouchableOpacity
            className="bg-white border border-[#1486B8] py-3 px-10 rounded-lg w-1/2 items-center shadow-md"
            style={{
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.1,
              shadowRadius: 3.84,
              elevation: 5,
            }}
            onPress={() => navigation.navigate('Register')}
          >
            <Text className="text-[#1486B8] font-bold text-[15px] font-['Inter_600SemiBold']">
              Registrar
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}
