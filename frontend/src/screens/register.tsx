import { View, Text, Image, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NavigationProps } from '../navigation/types';
import { globalStyles } from '../styles/globalStyles/globalStyles';
import { registerStyles as styles } from '../styles/registerStyles';
import { colors } from '../styles/globalStyles/colors';
import { imageStyles } from '~/styles/globalStyles/imageStyles';
import { loginStyles } from '~/styles/loginStyles';
import Button from '../components/button';
import BaseInput from '../components/inputs/baseInput';
import PasswordInput from '../components/inputs/passwordInput';
import { useState } from 'react';
import { authService } from '../services/authService';

export default function Register() {
  const navigation = useNavigation<NavigationProps>();
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    password: '',
    telephone: '',
    role: 'usuario'
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    // Validações
    if (!formData.name || !formData.surname || !formData.email || !formData.password || !formData.telephone) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    if (formData.password !== confirmPassword) {
      Alert.alert('Erro', 'As senhas não coincidem');
      return;
    }

    try {
      setLoading(true);
      await authService.register(formData);
      
      Alert.alert(
        'Sucesso',
        'Cadastro realizado com sucesso!',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Login')
          }
        ]
      );
    } catch (error: any) {
      Alert.alert(
        'Erro ao cadastrar',
        error?.response?.data?.mensagem || 'Ocorreu um erro ao realizar o cadastro'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={[colors.others[100], colors.others[200]]}
      style={[styles.container]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={[globalStyles.container]}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 20}
        enabled
      >
        <ScrollView
          contentContainerStyle={[styles.scrollContent]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        >
          <View style={loginStyles.cardContainer}>
            <View style={imageStyles.profileImageContainer}>
              <Image source={require('../../assets/perfil-login.png')} style={imageStyles.profileImage} />
            </View>

            <BaseInput
              label="Nome"
              placeholder="Digite seu nome"
              required
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
            />

            <BaseInput
              label="Sobrenome"
              placeholder="Digite seu sobrenome"
              required
              value={formData.surname}
              onChangeText={(text) => setFormData({ ...formData, surname: text })}
            />

            <BaseInput
              label="E-mail"
              placeholder="Digite seu e-mail"
              keyboardType="email-address"
              autoCapitalize="none"
              required
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
            />

            <PasswordInput
              label="Senha"
              placeholder="Digite sua senha"
              required
              value={formData.password}
              onChangeText={(text) => setFormData({ ...formData, password: text })}
            />

            <PasswordInput
              label="Confirmar Senha"
              placeholder="Confirme sua senha"
              required
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />

            <BaseInput
              label="Telefone"
              placeholder="Digite seu telefone"
              keyboardType="phone-pad"
              required
              value={formData.telephone}
              onChangeText={(text) => setFormData({ ...formData, telephone: text })}
            />

            <Button 
              text={loading ? "Cadastrando..." : "Cadastrar"}
              onPress={handleRegister}
              color="blue"
            />

            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>ou</Text>
              <View style={styles.divider} />
            </View>

            <Text style={styles.loginText}>Já possui uma conta?</Text>

            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}>Login</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
} 