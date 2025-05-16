import { ActivityIndicator, Image, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NavigationProps } from '../navigation/types';
import * as NavigationBar from 'expo-navigation-bar';
import { splashStyles as styles } from '../styles/splash.styles';
import { colors } from '../styles/globalStyles/colors';

export default function Splash() {
  const navigation = useNavigation<NavigationProps>();

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
      <LinearGradient
        colors={[ colors.splash[100], colors.splash[200] ]}
        style={[ styles.gradient ]}>
        
        <Image source={require('../../assets/logo/logo-spacefy.png')} style={styles.logo} />

        <ActivityIndicator size={50} color="#FCFCFC" />
      </LinearGradient>
  );
}