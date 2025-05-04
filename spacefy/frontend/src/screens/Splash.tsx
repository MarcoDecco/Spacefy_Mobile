import React, { useEffect } from 'react';
import { Text, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function Splash({ navigation }: { navigation: any }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Welcome');
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <LinearGradient
      colors={['#1EACE3', '#152F6C']} // degrade azul escuro para azul claro
    >
      <Text>SPACEFY</Text>
      <ActivityIndicator size="large" color="#fff" />
    </LinearGradient>
  );
}
