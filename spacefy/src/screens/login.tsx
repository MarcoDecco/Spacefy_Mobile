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
import { authenticateBiometric, isBiometricAvailable, isEnrolled } from '../services/biometrics';
import * as SecureStore from 'expo-secure-store';
import * as LocalAuthentication from 'expo-local-authentication';

export default function Login({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);

  useEffect(() => {
    // Verifica se biometria está disponível, cadastrada e se há e-mail salvo
    const checkBiometric = async () => {
      const available = await isBiometricAvailable();
      const enrolled = await isEnrolled();
      const savedEmail = await SecureStore.getItemAsync('biometricEmail');
      setBiometricEnabled(available && enrolled && !!savedEmail);
    };
    checkBiometric();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    try {
      setLoading(true);
      await authService.login(email, password);
      await SecureStore.setItemAsync('biometricEmail', email);
      await SecureStore.setItemAsync('biometricPassword', password);
      navigation.navigate('MainApp');
    } catch (error: any) {
      Alert.alert(
        'Erro ao fazer login',
        `Detalhes do erro: ${error?.message || error?.response?.data?.message || 'Erro desconhecido'}`
      );
    } finally {
      setLoading(false);
    }
  };

  // Login usando biometria com permissão e mensagem personalizada
  const handleBiometricLogin = async () => {
    try {
      // Verifica o tipo de biometria disponível
      const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
      let tipoBiometria = 'biometria';
      if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
        tipoBiometria = 'impressão digital';
      } else if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
        tipoBiometria = 'Face ID';
      }

      const result = await authenticateBiometric(
        `Autentique-se usando ${tipoBiometria} para entrar`
      );
      if (result.success) {
        await authService.biometricLogin();
        navigation.navigate('MainApp');
      } else {
        Alert.alert('Biometria', 'Autenticação biométrica não realizada.');
      }
    } catch (error) {
      Alert.alert('Biometria', 'Erro ao autenticar com biometria.');
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

            {biometricEnabled && (
              <View style={{ marginTop: 12 }}>
                <Button
                  text="Entrar com biometria"
                  onPress={handleBiometricLogin}
                  color="blue"
                />
              </View>
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