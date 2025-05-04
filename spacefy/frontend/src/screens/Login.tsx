import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
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
    <LinearGradient colors={['#C2EBFF', '#6ACDFF']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View>
          {/* Card branco que contém os inputs e botão */}
          <View>
          <Text>Bem-vindo de volta</Text>
            {/* Email */}
            <View>
              <Text>Email</Text>
              <TextInput
                placeholder="seu@email.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {/* Senha */}
            <View>
              <Text>Senha</Text>
              <View>
                <TextInput
                  placeholder="••••••••"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
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

            {/* Botão de Entrar */}
            <View>
            <TouchableOpacity 
              onPress={handleLogin}
              activeOpacity={0.8}
            >
            <Text>Entrar</Text>
          </TouchableOpacity>
          </View>

           {/* Texto de cadastro dentro do card - versão vertical */}
          <View>
            <Text>Não tem uma conta?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text>Cadastre-se</Text>
            </TouchableOpacity>
          </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}