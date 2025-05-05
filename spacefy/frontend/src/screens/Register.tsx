import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
  Alert,
} from 'react-native';
import Perfil from '../../assets/Perfil.png'
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

export default function Register({ navigation }: { navigation: any }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRegister = () => {
    if (password !== confirmPassword) {
      Alert.alert('Erro', 'As senhas não coincidem');
      return;
    }
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
          {/* Container para centralizar a imagem */}
          <View style={{ alignItems: 'center' }}>
            <Image
              source={Perfil} 
              style={{ width: 120, height: 120, marginBottom: 16, resizeMode: 'contain' }}
            />
          </View>
          
          {/* Título */}
          <Text
            className="text-2xl text-[#2F2F2F] text-center mb-6"
            style={{ fontFamily: 'Inter_700Bold' }}
          >
            Criar Conta
          </Text>

          {/* Nome */}
          <View className="mb-5">
            <Text
              className="text-[#2F2F2F]"
              style={{ fontFamily: 'Inter_500Medium', fontSize: 16 }}
            >
              Nome completo
            </Text>
            <View className="border-b border-[#E0E0E0] pt-1 pb-1">
              <TextInput
                className="h-10 text-[#2F2F2F]"
                placeholder="Digite seu nome completo"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                placeholderTextColor="#888888"
                style={{ 
                  fontFamily: 'Inter_400Regular', 
                  fontSize: 16,
                  fontWeight: 'normal' // Garante que não fica em negrito
                }}
              />
            </View>
          </View>

          {/* Email */}
          <View className="mb-5">
            <Text
              className="text-[#2F2F2F]"
              style={{ fontFamily: 'Inter_500Medium', fontSize: 16 }}
            >
              Email
            </Text>
            <View className="border-b border-[#E0E0E0] pt-1 pb-1">
              <TextInput
                className="h-10 text-[#2F2F2F]"
                placeholder="seu@email.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
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
          <View className="mb-5">
            <Text
              className="text-[#2F2F2F]"
              style={{ fontFamily: 'Inter_500Medium', fontSize: 16 }}
            >
              Senha
            </Text>
            <View className="border-b border-[#E0E0E0] pt-1 pb-1 flex-row justify-between items-center">
              <TextInput
                className="flex-1 h-10 text-[#2F2F2F]"
                placeholder="••••••••"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
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

          {/* Confirmação de Senha */}
          <View className="mb-5">
            <Text
              className="text-[#2F2F2F]"
              style={{ fontFamily: 'Inter_500Medium', fontSize: 16 }}
            >
              Confirmar Senha
            </Text>
            <View className="border-b border-[#E0E0E0] pt-1 pb-1 flex-row justify-between items-center">
              <TextInput
                className="flex-1 h-10 text-[#2F2F2F]"
                placeholder="••••••••"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                placeholderTextColor="#888888"
                style={{ 
                  fontFamily: 'Inter_400Regular', 
                  fontSize: 16,
                  fontWeight: 'normal'
                }}
              />
              <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                <MaterialIcons
                  name={showConfirmPassword ? 'visibility-off' : 'visibility'}
                  size={20}
                  color="#888888"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Botão Registrar */}
          <View className="items-center mt-6">
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
          <View className="mt-6 items-center">
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