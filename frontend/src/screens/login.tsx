import { View, Text, Image, TextInput, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Login({ navigation }: any) {
  const insets = useSafeAreaInsets();

  return (
    <LinearGradient
      colors={['#6ACDFF', '#1486B8']}
      className="flex-1 items-center"
      style={{ paddingTop: insets.top }}
    >
      <View className="w-11/12 bg-white rounded-2xl items-center mt-16 p-6 shadow-lg" style={{ elevation: 8 }}>
        <View className="-mt-16 mb-4 rounded-full bg-white p-2 shadow" style={{ elevation: 4 }}>
          <Image
            source={require('../../assets/perfil-login.png')}
            style={{ width: 70, height: 70, borderRadius: 35 }}
          />
        </View>
        <View className="w-full mb-2">
          <Text className="text-dark-gray font-semibold mb-1 ml-1">E-mail</Text>
          <TextInput
            placeholder="E-mail"
            keyboardType="email-address"
            autoCapitalize="none"
            className="border-b border-light-gray px-2 pb-1 mb-4 text-dark-gray"
            placeholderTextColor="#A0A0A0"
          />
          <Text className="text-dark-gray font-semibold mb-1 ml-1">Senha</Text>
          <TextInput
            placeholder="Senha"
            secureTextEntry
            className="border-b border-light-gray px-2 pb-1 mb-6 text-dark-gray"
            placeholderTextColor="#A0A0A0"
          />
        </View>
        <TouchableOpacity
          className="w-full bg-blue rounded-lg py-3 mb-3 shadow"
          onPress={() => navigation.navigate('MainApp')}
        >
          <Text className="text-white text-center font-bold text-base">Entrar</Text>
        </TouchableOpacity>
        <Text className="text-dark-gray text-center mt-2">Não possui uma conta?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text className="text-blue text-center font-bold text-base underline">Cadastre-se</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
} 