import { View, Text, Image, TextInput, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NavigationProps } from '../navigation/types';

export default function Register() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProps>();

  return (
    <LinearGradient
      colors={['#6ACDFF', '#1486B8']}
      className="flex-1 items-center"
      style={{ paddingTop: insets.top }}
    >
      <View className="w-11/12 bg-white rounded-2xl items-center mt-10 p-6 shadow-lg" style={{ elevation: 8 }}>
        <View className="-mt-16 mb-2 rounded-full bg-white p-2 shadow" style={{ elevation: 4 }}>
          <Image
            source={require('../../assets/perfil-login.png')}
            style={{ width: 70, height: 70, borderRadius: 35 }}
          />
        </View>
        <Text className="text-xl font-bold text-dark-gray mb-4 mt-2">Criar Conta</Text>
        <View className="w-full mb-2">
          <Text className="text-dark-gray font-semibold mb-1 ml-1">Nome</Text>
          <TextInput className="border-b border-light-gray px-2 pb-1 mb-3 text-dark-gray" placeholderTextColor="#A0A0A0" placeholder="Nome" />
          <Text className="text-dark-gray font-semibold mb-1 ml-1">Sobrenome</Text>
          <TextInput className="border-b border-light-gray px-2 pb-1 mb-3 text-dark-gray" placeholderTextColor="#A0A0A0" placeholder="Sobrenome" />
          <Text className="text-dark-gray font-semibold mb-1 ml-1">E-mail</Text>
          <TextInput className="border-b border-light-gray px-2 pb-1 mb-3 text-dark-gray" placeholderTextColor="#A0A0A0" placeholder="E-mail" keyboardType="email-address" autoCapitalize="none" />
          <Text className="text-dark-gray font-semibold mb-1 ml-1">Senha</Text>
          <TextInput className="border-b border-light-gray px-2 pb-1 mb-3 text-dark-gray" placeholderTextColor="#A0A0A0" placeholder="Senha" secureTextEntry />
          <Text className="text-dark-gray font-semibold mb-1 ml-1">Confirmar Senha</Text>
          <TextInput className="border-b border-light-gray px-2 pb-1 mb-3 text-dark-gray" placeholderTextColor="#A0A0A0" placeholder="Confirmar Senha" secureTextEntry />
          <Text className="text-dark-gray font-semibold mb-1 ml-1">Telefone</Text>
          <TextInput className="border-b border-light-gray px-2 pb-1 mb-5 text-dark-gray" placeholderTextColor="#A0A0A0" placeholder="Telefone" keyboardType="phone-pad" />
        </View>
        <TouchableOpacity
          className="w-full bg-blue rounded-lg py-3 mb-3 shadow"
          onPress={() => navigation.navigate('Login')}
        >
          <Text className="text-white text-center font-bold text-base">Cadastrar</Text>
        </TouchableOpacity>
        <View className="flex-row items-center w-full my-2">
          <View className="flex-1 h-px bg-light-gray" />
          <Text className="mx-2 text-dark-gray">ou</Text>
          <View className="flex-1 h-px bg-light-gray" />
        </View>
        <Text className="text-dark-gray text-center mt-2">Já possui uma conta?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text className="text-blue text-center font-bold text-base underline">Login</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
} 