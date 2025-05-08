import React, { useEffect } from 'react';
import { Text, ActivityIndicator, SafeAreaView, StatusBar, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function Splash({ navigation }: { navigation: any }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Welcome');
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView className='flex-1'>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#1EACE3', '#152F6C']}
        className='flex-1'
      >
        <Text 
          style={{
            fontSize: 64,
            color: '#1EACE3',
            fontFamily: 'Inter_400Regular',
            letterSpacing: 8,
            marginBottom: 20,
            textAlign: 'center',
            marginTop: Platform.OS === 'ios' ? 40 : 0,
            textShadowColor: '#FFFFFF',
            textShadowOffset: { width: 5, height: 0 },
            textShadowRadius: 2
          }}
        >
          SPACEFY
        </Text>
        <ActivityIndicator 
          size={70} 
          color="#ffffff" 
          style={{ marginTop: 40 }} 
        />
      </LinearGradient>
    </SafeAreaView>
  );
}
