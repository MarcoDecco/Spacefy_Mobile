import { View, Text, Image, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { loginStyles as styles } from '../styles/loginStyles';
import { colors } from '~/styles/globalStyles/colors';
import { imageStyles } from '~/styles/globalStyles/imageStyles';
import Button from '../components/buttons/button';
import BaseInput from '../components/inputs/baseInput';
import PasswordInput from '../components/inputs/passwordInput';
import { inputStyles } from '~/styles/componentStyles/inputStyles';
import { useState } from 'react';
import { authService } from '../services/authService';

export default function Login({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    try {
      setLoading(true);
      await authService.login(email, password);
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