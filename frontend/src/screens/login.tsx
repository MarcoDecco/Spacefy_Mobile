import { View, Text, Image, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { loginStyles as styles } from '../styles/loginStyles';
import { colors } from '~/styles/globalStyles/colors';
import { imageStyles } from '~/styles/globalStyles/imageStyles';
import Button from '../components/button';
import BaseInput from '../components/inputs/baseInput';
import PasswordInput from '../components/inputs/passwordInput';
import { inputStyles } from '~/styles/componentStyles/inputStyles';
import React, { useState } from 'react';
import {authService }from '../services/authService'; // Importe seu serviço de autenticação

export default function Login({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Função para autenticar o usuário
  const handleLogin = async () => {
    try {
      await authService.login(email, password);
      navigation.navigate('MainApp');
    } catch (error: any) {
      Alert.alert('Erro', error?.message || 'Falha ao fazer login');
    }
  };

  return (
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
          containerStyle={ inputStyles.marginBottom }
          value={password}
          onChangeText={setPassword}
        />

        <Button 
          text="Entrar"
          onPress={handleLogin} // Use a função de login
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
  );
}