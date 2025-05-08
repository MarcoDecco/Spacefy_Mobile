import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
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
            <View 
              style={{
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
              }}
            >
              <Image
                source={Perfil} 
                style={{ 
                  width: 120, 
                  height: 120, 
                  marginBottom: 16, 
                  alignSelf: 'center',
                  resizeMode: 'contain' 
                }}
              />

              {/* Email */}
              <View style={{ marginBottom: 20, width: '100%' }}>
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
                    autoCorrect={false}
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
              <View style={{ marginBottom: 20, width: '100%' }}>
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

              {/* Botão de Entrar */}
              <View style={{ alignItems: 'center', marginTop: 24, width: '100%' }}>
                <TouchableOpacity
                  onPress={handleLogin}
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
                    Entrar
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Link de cadastro */}
              <View style={{ marginTop: 24, alignItems: 'center' }}>
                <Text
                  style={{ 
                    fontSize: 14,
                    color: '#2F2F2F',
                    fontFamily: 'Inter_400Regular'
                  }}
                >
                  Não tem uma conta?
                </Text>
                <TouchableOpacity 
                  onPress={() => navigation.navigate('Register')}
                  style={{ marginTop: 4 }}
                >
                  <Text
                    style={{ 
                      color: '#1486B8',
                      fontSize: 14,
                      fontFamily: 'Inter_600SemiBold'
                    }}
                  >
                    Cadastre-se
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