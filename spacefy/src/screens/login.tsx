import { View, Text, Image, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { loginStyles as styles } from '../styles/loginStyles';
import { colors } from '~/styles/globalStyles/colors';
import { imageStyles } from '~/styles/globalStyles/imageStyles';
import Button from '../components/buttons/button';
import BaseInput from '../components/inputs/baseInput';
import PasswordInput from '../components/inputs/passwordInput';
import { inputStyles } from '~/styles/componentStyles/inputStyles';
import { useState, useEffect } from 'react';
import { authService } from '../services/authService';
import * as LocalAuthentication from 'expo-local-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

export default function Login({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);
  const [isBiometricEnabled, setIsBiometricEnabled] = useState(false);

  useEffect(() => {
    checkBiometricSupport();
    checkBiometricEnabled();
  }, []);

  const checkBiometricSupport = async () => {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    setIsBiometricSupported(compatible);
  };

  const checkBiometricEnabled = async () => {
    try {
      const enabled = await AsyncStorage.getItem('biometricEnabled');
      setIsBiometricEnabled(enabled === 'true');
    } catch (error) {
      console.log('Erro ao verificar biometria:', error);
    }
  };

  const handleBiometricLogin = async () => {
    try {
      const savedCredentials = await AsyncStorage.getItem('userCredentials');
      if (!savedCredentials) {
        Alert.alert(
          'Biometria não configurada',
          'Faça login com email e senha primeiro para ativar a biometria.'
        );
        return;
      }

      const { email: savedEmail, password: savedPassword } = JSON.parse(savedCredentials);
      
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Autentique-se para continuar',
        fallbackLabel: 'Usar senha',
        disableDeviceFallback: false,
      });

      if (result.success) {
        setLoading(true);
        await authService.login(savedEmail, savedPassword);
        navigation.navigate('MainApp');
      }
    } catch (error) {
      console.log('Erro na autenticação biométrica:', error);
      Alert.alert('Erro', 'Falha na autenticação biométrica');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    try {
      setLoading(true);
      await authService.login(email, password);
      
      // Salvar credenciais para biometria
      if (isBiometricSupported && !isBiometricEnabled) {
        Alert.alert(
          'Ativar Biometria',
          'Deseja ativar a autenticação biométrica para próximos logins?',
          [
            {
              text: 'Não',
              style: 'cancel'
            },
            {
              text: 'Sim',
              onPress: async () => {
                try {
                  await AsyncStorage.setItem('userCredentials', JSON.stringify({ email, password }));
                  await AsyncStorage.setItem('biometricEnabled', 'true');
                  setIsBiometricEnabled(true);
                } catch (error) {
                  console.log('Erro ao salvar credenciais:', error);
                }
              }
            }
          ]
        );
      }
      
      navigation.navigate('MainApp');
    } catch (error: any) {
      console.log('Erro detalhado:', error);
      Alert.alert(
        'Erro ao fazer login',
        `Detalhes do erro: ${error?.message || error?.response?.data?.message || 'Erro desconhecido'}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior='height'
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -100}
    >
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <LinearGradient
          colors={[colors.others[100], colors.others[200]]}
          style={[styles.container]}
        >
          <View style={styles.cardContainer}>
            <View style={imageStyles.profileImageContainer}>
              <Image
                source={require('../../assets/perfil-login.png')}
                style={imageStyles.profileImage}
              />
            </View>

            <BaseInput
              label="E-mail"
              placeholder="Digite seu e-mail"
              keyboardType="email-address"
              autoCapitalize="none"
              required
              value={email}
              onChangeText={setEmail}
            />

            <PasswordInput
              label="Senha"
              placeholder="Digite sua senha"
              required
              containerStyle={inputStyles.marginBottom}
              value={password}
              onChangeText={setPassword}
            />

            <Button 
              text={loading ? "Carregando..." : "Entrar"}
              onPress={handleLogin}
              color="blue"
            />

            {isBiometricSupported && (
              <TouchableOpacity
                style={styles.biometricButton}
                onPress={handleBiometricLogin}
                disabled={loading}
              >
                <Ionicons 
                  name={Platform.OS === 'ios' ? 'finger-print' : 'finger-print'} 
                  size={24} 
                  color={colors.blue} 
                />
                <Text style={styles.biometricButtonText}>
                  {isBiometricEnabled ? 'Entrar com Biometria' : 'Configurar Biometria'}
                </Text>
              </TouchableOpacity>
            )}

            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>ou</Text>
              <View style={styles.divider} />
            </View>

            <Text style={styles.registerText}>Não possui uma conta?</Text>

            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.registerLink}>Cadastre-se</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </ScrollView>
    </KeyboardAvoidingView>
  );
} 