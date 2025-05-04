import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons'; // Importe o ícone

export default function Register({ navigation }: { navigation: any }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Estado para mostrar/ocultar senha

  const handleRegister = () => {
    navigation.navigate('Login');
  };

  return (
    <LinearGradient colors={['#C2EBFF', '#6ACDFF']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View>
          <View>
            <Text>Criar Conta</Text>
            
            {/* Campo Nome Completo */}
            <View>
              <Text>Nome completo</Text>
              <TextInput
                placeholder="Digite seu nome completo"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            </View>
            
            {/* Campo Email */}
            <View>
              <Text>Email</Text>
              <TextInput
                placeholder="seu@email.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            
            {/* Campo Senha com ícone */}
            <View>
              <Text>Senha</Text>
              <View> {/* Novo container para senha */}
                <TextInput // Input ocupa todo espaço disponível
                  placeholder="••••••••"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword} // Alterna entre texto visível/oculto
                />
                <TouchableOpacity 
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <MaterialIcons 
                    name={showPassword ? 'visibility-off' : 'visibility'} 
                    size={24}
                  />
                </TouchableOpacity>
              </View>
            </View>
            
            {/* Botão Registrar */}
            <View>
              <TouchableOpacity
                onPress={handleRegister}
                activeOpacity={0.8}
              >
                <Text>Registrar</Text>
              </TouchableOpacity>
            </View>
            
            {/* Link para Login */}
            <View>
              <Text>Já tem uma conta?</Text>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text>Faça login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}