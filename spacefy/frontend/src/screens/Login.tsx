import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image, // <-- Importante
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

export default function Login({ navigation }: { navigation: any }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'MainApp' }],
    });
  };

  return (
    <LinearGradient
      colors={['#C2EBFF', '#6ACDFF']}
      className="flex-1"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 justify-center px-6"
      >
        <View className="bg-white p-6 rounded-md shadow-md items-center">
          <Image
            source={require('../../assets/Perfil.png')} 
            style={{ width: 120, height: 120, marginBottom: 16, resizeMode: 'contain' }}
          />

          {/* Email */}
          <View className="mb-4 w-full">
            <Text
              className="text-base text-neutral-800 mb-2"
              style={{ fontFamily: 'Inter_500Medium' }}
            >
              Email
            </Text>
            <TextInput
              placeholder="seu@email.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              className="h-12 px-4 border border-gray-300 rounded bg-white text-base text-neutral-800"
              style={{ fontFamily: 'Inter_400Regular' }}
            />
          </View>

          {/* Senha */}
          <View className="mb-4 w-full">
            <Text
              className="text-base text-neutral-800 mb-2"
              style={{ fontFamily: 'Inter_500Medium' }}
            >
              Senha
            </Text>
            <View className="relative">
              <TextInput
                placeholder="••••••••"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                className="h-12 px-4 pr-12 border border-gray-300 rounded bg-white text-base text-neutral-800"
                style={{ fontFamily: 'Inter_400Regular' }}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3"
              >
                <MaterialIcons
                  name={showPassword ? 'visibility-off' : 'visibility'}
                  size={24}
                  color="#888"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Botão de Entrar */}
          <View className="items-center mt-2 w-full">
            <TouchableOpacity
              onPress={handleLogin}
              activeOpacity={0.8}
              className="bg-[#1486B8] w-1/2 h-10 rounded justify-center items-center"
            >
              <Text
                className="text-white text-base font-semibold"
                style={{ fontFamily: 'Inter_600SemiBold' }}
              >
                Entrar
              </Text>
            </TouchableOpacity>
          </View>

          {/* Link de cadastro */}
          <View className="mt-6 items-center">
            <Text
              className="text-sm text-neutral-800 text-center"
              style={{ fontFamily: 'Inter_400Regular' }}
            >
              Não tem uma conta?
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text
                className="text-[#1486B8] text-sm mt-1"
                style={{ fontFamily: 'Inter_600SemiBold' }}
              >
                Cadastre-se
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}
