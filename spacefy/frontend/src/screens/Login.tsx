import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import Perfil from '../../assets/Perfil.png'
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
            source={Perfil} 
            style={{ width: 120, height: 120, marginBottom: 16, resizeMode: 'contain' }}
          />

          {/* Email */}
          <View className="mb-5 w-full">
            <Text
              className="text-[#2F2F2F]"
              style={{ fontFamily: 'Inter_500Medium', fontSize: 16 }}
            >
              Email
            </Text>
            <View className="border-b border-[#E0E0E0] pt-1 pb-1">
              <TextInput
                placeholder="seu@email.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                className="h-10 text-[#2F2F2F]"
                placeholderTextColor="#888888"
                style={{ 
                  fontFamily: 'Inter_400Regular', 
                  fontSize: 16,
                  fontWeight: 'normal'
                }}
              />
            </View>
          </View>

          {/* Senha */}
          <View className="mb-5 w-full">
            <Text
              className="text-[#2F2F2F]"
              style={{ fontFamily: 'Inter_500Medium', fontSize: 16 }}
            >
              Senha
            </Text>
            <View className="border-b border-[#E0E0E0] pt-1 pb-1 flex-row justify-between items-center">
              <TextInput
                placeholder="••••••••"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                className="flex-1 h-10 text-[#2F2F2F]"
                placeholderTextColor="#888888"
                style={{ 
                  fontFamily: 'Inter_400Regular', 
                  fontSize: 16,
                  fontWeight: 'normal'
                }}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <MaterialIcons
                  name={showPassword ? 'visibility-off' : 'visibility'}
                  size={20}
                  color="#888888"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Botão de Entrar */}
          <View className="items-center mt-6 w-full">
            <TouchableOpacity
              onPress={handleLogin}
              activeOpacity={0.8}
              className="bg-[#1486B8] w-1/2 h-10 rounded justify-center items-center"
            >
              <Text
                className="text-white text-base"
                style={{ fontFamily: 'Inter_600SemiBold' }}
              >
                Entrar
              </Text>
            </TouchableOpacity>
          </View>

          {/* Link de cadastro */}
          <View className="mt-6 items-center">
            <Text
              className="text-sm text-[#2F2F2F] text-center"
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