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
  SafeAreaView,
  ScrollView,
  StatusBar,
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
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient
        colors={['#C2EBFF', '#6ACDFF']}
        style={{ flex: 1 }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <ScrollView 
            contentContainerStyle={{ 
              flexGrow: 1,
              justifyContent: 'center',
              paddingHorizontal: 24,
              paddingVertical: Platform.OS === 'ios' ? 20 : 0
            }}
            keyboardShouldPersistTaps="handled"
          >
            <View style={{
              backgroundColor: 'white',
              padding: 24,
              borderRadius: 12,
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.1,
              shadowRadius: 3.84,
              elevation: 5,
            }}>
              {/* Container para centralizar a imagem */}
              <View style={{ alignItems: 'center' }}>
                <Image
                  source={Perfil} 
                  style={{ 
                    width: 120, 
                    height: 120, 
                    marginBottom: 16, 
                    resizeMode: 'contain' 
                  }}
                />
              </View>
              
              {/* Título */}
              <Text
                style={{ 
                  fontSize: 24,
                  color: '#2F2F2F',
                  textAlign: 'center',
                  marginBottom: 24,
                  fontFamily: 'Inter_700Bold'
                }}
              >
                Criar Conta
              </Text>

              {/* Nome */}
              <View style={{ marginBottom: 20 }}>
                <Text
                  style={{ 
                    fontFamily: 'Inter_500Medium', 
                    fontSize: 16,
                    color: '#2F2F2F',
                    marginBottom: 8
                  }}
                >
                  Nome completo
                </Text>
                <View style={{ 
                  borderBottomWidth: 1,
                  borderBottomColor: '#E0E0E0',
                  paddingVertical: 4
                }}>
                  <TextInput
                    placeholder="Digite seu nome completo"
                    value={name}
                    onChangeText={setName}
                    autoCapitalize="words"
                    style={{ 
                      height: 40,
                      color: '#2F2F2F',
                      fontFamily: 'Inter_400Regular',
                      fontSize: 16,
                      paddingVertical: Platform.OS === 'ios' ? 8 : 0
                    }}
                    placeholderTextColor="#888888"
                  />
                </View>
              </View>

              {/* Email */}
              <View style={{ marginBottom: 20 }}>
                <Text
                  style={{ 
                    fontFamily: 'Inter_500Medium', 
                    fontSize: 16,
                    color: '#2F2F2F',
                    marginBottom: 8
                  }}
                >
                  Email
                </Text>
                <View style={{ 
                  borderBottomWidth: 1,
                  borderBottomColor: '#E0E0E0',
                  paddingVertical: 4
                }}>
                  <TextInput
                    placeholder="seu@email.com"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={{ 
                      height: 40,
                      color: '#2F2F2F',
                      fontFamily: 'Inter_400Regular',
                      fontSize: 16,
                      paddingVertical: Platform.OS === 'ios' ? 8 : 0
                    }}
                    placeholderTextColor="#888888"
                  />
                </View>
              </View>

              {/* Senha */}
              <View style={{ marginBottom: 20 }}>
                <Text
                  style={{ 
                    fontFamily: 'Inter_500Medium', 
                    fontSize: 16,
                    color: '#2F2F2F',
                    marginBottom: 8
                  }}
                >
                  Senha
                </Text>
                <View style={{ 
                  borderBottomWidth: 1,
                  borderBottomColor: '#E0E0E0',
                  paddingVertical: 4,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <TextInput
                    placeholder="••••••••"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    style={{ 
                      flex: 1,
                      height: 40,
                      color: '#2F2F2F',
                      fontFamily: 'Inter_400Regular',
                      fontSize: 16,
                      paddingVertical: Platform.OS === 'ios' ? 8 : 0
                    }}
                    placeholderTextColor="#888888"
                  />
                  <TouchableOpacity 
                    onPress={() => setShowPassword(!showPassword)}
                    style={{ padding: 8 }}
                  >
                    <MaterialIcons
                      name={showPassword ? 'visibility-off' : 'visibility'}
                      size={20}
                      color="#888888"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Confirmação de Senha */}
              <View style={{ marginBottom: 20 }}>
                <Text
                  style={{ 
                    fontFamily: 'Inter_500Medium', 
                    fontSize: 16,
                    color: '#2F2F2F',
                    marginBottom: 8
                  }}
                >
                  Confirmar Senha
                </Text>
                <View style={{ 
                  borderBottomWidth: 1,
                  borderBottomColor: '#E0E0E0',
                  paddingVertical: 4,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <TextInput
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showConfirmPassword}
                    style={{ 
                      flex: 1,
                      height: 40,
                      color: '#2F2F2F',
                      fontFamily: 'Inter_400Regular',
                      fontSize: 16,
                      paddingVertical: Platform.OS === 'ios' ? 8 : 0
                    }}
                    placeholderTextColor="#888888"
                  />
                  <TouchableOpacity 
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{ padding: 8 }}
                  >
                    <MaterialIcons
                      name={showConfirmPassword ? 'visibility-off' : 'visibility'}
                      size={20}
                      color="#888888"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Botão Registrar */}
              <View style={{ alignItems: 'center', marginTop: 24 }}>
                <TouchableOpacity
                  onPress={handleRegister}
                  activeOpacity={0.8}
                  style={{
                    backgroundColor: '#1486B8',
                    width: '50%',
                    height: 40,
                    borderRadius: 8,
                    justifyContent: 'center',
                    alignItems: 'center',
                    shadowColor: '#000',
                    shadowOffset: {
                      width: 0,
                      height: 2,
                    },
                    shadowOpacity: 0.1,
                    shadowRadius: 3.84,
                    elevation: 5,
                  }}
                >
                  <Text
                    style={{ 
                      color: 'white',
                      fontSize: 16,
                      fontFamily: 'Inter_600SemiBold'
                    }}
                  >
                    Registrar
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Link Login */}
              <View style={{ marginTop: 24, alignItems: 'center' }}>
                <Text
                  style={{ 
                    fontSize: 14,
                    color: '#2F2F2F',
                    fontFamily: 'Inter_400Regular'
                  }}
                >
                  Já tem uma conta?
                </Text>
                <TouchableOpacity 
                  onPress={() => navigation.goBack()}
                  style={{ marginTop: 4 }}
                >
                  <Text
                    style={{ 
                      color: '#1486B8',
                      fontSize: 14,
                      fontFamily: 'Inter_600SemiBold'
                    }}
                  >
                    Faça login
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
}