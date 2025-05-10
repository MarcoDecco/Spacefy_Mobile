import { View, Text, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NavigationProps } from '../navigation/types';

export default function Welcome() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProps>();

  return (
    <LinearGradient
      colors={['#C2EBFF', '#6ACDFF']}
      className="flex-1 items-center justify-center"
      style={{ paddingTop: insets.top }}
    >
      <View className="w-full items-center">
        <Image
          source={require('../../assets/arte-introdutoria.png')}
          style={{ width: 280, height: 205, resizeMode: 'contain' }}
        />
      </View>

      <Text className="text-2xl font-bold text-dark-gray mt-16 mb-4 text-center">Bem vindo ao SPACEFY!</Text>

      <Text className="text-lg text-dark-gray text-center mb-12 px-12">
        Antes de começar a utilizar a plataforma, entre com o seu login preenchendo as informações necessárias
      </Text>

      <TouchableOpacity
        className="w-3/4 bg-dark-blue rounded-lg py-3 mb-3 shadow"
        onPress={() => navigation.navigate('Login')}
      >
        <Text className="text-white text-center font-bold text-base">Login</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="w-3/4 bg-white border-2 border-dark-blue rounded-lg py-3 shadow"
        onPress={() => navigation.navigate('Register')}
      >
        <Text className="text-dark-blue text-center font-bold text-base">Criar Conta</Text>
      </TouchableOpacity>

    </LinearGradient>
  );
} 