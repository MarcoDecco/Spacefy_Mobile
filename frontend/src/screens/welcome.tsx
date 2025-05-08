import React from 'react';
import { View, Text, TouchableOpacity, Image, SafeAreaView, StatusBar, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import logo from '../../assets/arte-introdutoria.png';

export default function Welcome({ navigation }: { navigation: any }) {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient
        colors={['#C2EBFF', '#6ACDFF']}
        style={{ flex: 1 }}
      >
        <View style={{ 
          flex: 1, 
          justifyContent: 'center', 
          alignItems: 'center',
          paddingHorizontal: 24,
          paddingTop: Platform.OS === 'ios' ? 20 : 0
        }}>
          <Image
            source={logo}
            style={{ 
              width: 276, 
              height: 211, 
              marginBottom: 64,
              resizeMode: 'contain'
            }}
          />

          {/* Título */}
          <Text style={{ 
            fontSize: 20,
            fontWeight: '600',
            color: '#2F2F2F',
            textAlign: 'center',
            marginBottom: 48,
            fontFamily: 'Inter_600SemiBold'
          }}>
            Bem-vindo ao SPACEFY!
          </Text>

          {/* Descrição */}
          <Text style={{ 
            fontSize: 13,
            color: '#2F2F2F',
            textAlign: 'center',
            marginBottom: 40,
            width: '80%',
            fontFamily: 'Inter_400Regular'
          }}>
            Antes de começar a utilizar a plataforma, entre com o seu login preenchendo as informações necessárias.
          </Text>

          {/* Botão "Entrar" */}
          <TouchableOpacity
            style={{
              backgroundColor: '#1486B8',
              paddingVertical: 12,
              paddingHorizontal: 40,
              borderRadius: 8,
              marginBottom: 16,
              width: '50%',
              alignItems: 'center',
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
            <Text style={{ 
              color: 'white',
              fontWeight: 'bold',
              fontSize: 15,
              fontFamily: 'Inter_600SemiBold'
            }}>
              Entrar
            </Text>
          </TouchableOpacity>

          {/* Botão "Registrar" */}
          <TouchableOpacity
            style={{
              backgroundColor: 'white',
              borderWidth: 1,
              borderColor: '#1486B8',
              paddingVertical: 12,
              paddingHorizontal: 40,
              borderRadius: 8,
              width: '50%',
              alignItems: 'center',
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
            <Text style={{ 
              color: '#1486B8',
              fontWeight: 'bold',
              fontSize: 15,
              fontFamily: 'Inter_600SemiBold'
            }}>
              Registrar
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}
