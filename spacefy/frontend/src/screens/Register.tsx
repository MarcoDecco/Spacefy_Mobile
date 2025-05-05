import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

export default function Register({ navigation }: { navigation: any }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = () => {
    navigation.navigate('Login');
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
        <View className="bg-white rounded-lg p-6 shadow-md">
          {/* Título */}
          <Text
            className="text-2xl text-[#2F2F2F] text-center mb-6"
            style={{ fontFamily: 'Inter_700Bold' }}
          >
            Criar Conta
          </Text>

          {/* Nome */}
          <View className="mb-4">
            <Text
              className="text-[#2F2F2F] mb-2"
              style={{ fontFamily: 'Inter_500Medium', fontSize: 16 }}
            >
              Nome completo
            </Text>
            <TextInput
              className="h-12 px-4 border border-[#E0E0E0] rounded text-[#2F2F2F] bg-white"
              placeholder="Digite seu nome completo"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              placeholderTextColor="#888888"
              style={{ fontFamily: 'Inter_400Regular', fontSize: 16 }}
            />
          </View>

          {/* Email */}
          <View className="mb-4">
            <Text
              className="text-[#2F2F2F] mb-2"
              style={{ fontFamily: 'Inter_500Medium', fontSize: 16 }}
            >
              Email
            </Text>
            <TextInput
              className="h-12 px-4 border border-[#E0E0E0] rounded text-[#2F2F2F] bg-white"
              placeholder="seu@email.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#888888"
              style={{ fontFamily: 'Inter_400Regular', fontSize: 16 }}
            />
          </View>

          {/* Senha */}
          <View className="mb-4">
            <Text
              className="text-[#2F2F2F] mb-2"
              style={{ fontFamily: 'Inter_500Medium', fontSize: 16 }}
            >
              Senha
            </Text>
            <View className="flex-row items-center border border-[#E0E0E0] rounded bg-white pr-4">
              <TextInput
                className="flex-1 h-12 px-4 text-[#2F2F2F]"
                placeholder="••••••••"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                placeholderTextColor="#888888"
                style={{ fontFamily: 'Inter_400Regular', fontSize: 16 }}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <MaterialIcons
                  name={showPassword ? 'visibility-off' : 'visibility'}
                  size={24}
                  color="#888888"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Botão Registrar */}
          <View className="items-center mt-2">
            <TouchableOpacity
              onPress={handleRegister}
              className="bg-[#1486B8] w-[50%] h-10 rounded justify-center items-center"
              activeOpacity={0.8}
            >
              <Text
                className="text-white text-base"
                style={{ fontFamily: 'Inter_600SemiBold' }}
              >
                Registrar
              </Text>
            </TouchableOpacity>
          </View>

          {/* Link Login */}
          <View className="mt-4 items-center">
            <Text
              className="text-sm text-[#2F2F2F]"
              style={{ fontFamily: 'Inter_400Regular' }}
            >
              Já tem uma conta?
            </Text>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text
                className="text-[#1486B8] text-base mt-1"
                style={{ fontFamily: 'Inter_600SemiBold' }}
              >
                Faça login
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}