import React, { useEffect } from 'react';
import { Text, ActivityIndicator, View } from 'react-native';
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
      colors={['#1EACE3', '#152F6C']}
      className="flex-1 justify-center items-center"
    >
      <Text className="text-[64px] text-[#1B97CE] font-normal tracking-widest mb-5"
            style={{
              fontFamily: 'Inter_400Regular',
              textShadowColor: '#FFFFFF',
              textShadowOffset: { width: 5, height: 0 },
              textShadowRadius: 2
            }}
      >
        SPACEFY
      </Text>
      <ActivityIndicator size="large" color="#fff" className="mt-2" />
    </LinearGradient>
  );
}
