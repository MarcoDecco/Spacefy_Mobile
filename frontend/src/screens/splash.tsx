import { View, ActivityIndicator, Text, Platform } from 'react-native';
import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NavigationProps } from '../navigation/types';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as NavigationBar from 'expo-navigation-bar';

export default function Splash() {
  const navigation = useNavigation<NavigationProps>();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    // Configurações específicas por plataforma
    if (Platform.OS === 'android') {
      // Configurações para Android
      NavigationBar.setBackgroundColorAsync('transparent');
      NavigationBar.setButtonStyleAsync('light');
    }

    // Simula um tempo de carregamento de 2 segundos
    const timer = setTimeout(() => {
      // Navega para a tela de boas-vindas após o carregamento
      navigation.navigate('Welcome');
    }, 1500);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={{ flex: 1 }}>
      <StatusBar 
        style={Platform.OS === 'ios' ? 'dark' : 'light'} 
        translucent 
        backgroundColor="transparent" 
      />
      <LinearGradient
        colors={['#1EACE3', '#152F6C']}
        className="flex-1 items-center justify-center"
        style={{
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          // Ajustes específicos para iOS
          ...(Platform.OS === 'ios' && {
            paddingTop: Math.max(insets.top, 20), // Garante padding mínimo no iOS
          }),
        }}
      >
        {/* Aqui você pode adicionar o logo do Spacefy */}
        <View className="mb-4">
          <Text className="text-3xl font-bold text-white">Spacefy</Text>
        </View>
        <ActivityIndicator 
          size={Platform.OS === 'ios' ? 'large' : 'large'} 
          color="#FCFCFC" 
        />
      </LinearGradient>
    </View>
  );
}