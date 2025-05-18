import { View, Text, Image, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
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

export default function Register() {
  const navigation = useNavigation<NavigationProps>();

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
              label="Nome Completo"
              placeholder="Digite seu nome"
              required
            />

            <BaseInput
              label="E-mail"
              placeholder="Digite seu e-mail"
              keyboardType="email-address"
              autoCapitalize="none"
              required
            />

            <PasswordInput
              label="Senha"
              placeholder="Digite sua senha"
              required
            />

            <PasswordInput
              label="Confirmar Senha"
              placeholder="Confirme sua senha"
              required
            />

            <BaseInput
              label="Telefone"
              placeholder="Digite seu telefone"
              keyboardType="phone-pad"
              required
            />

            <Button 
              text="Cadastrar"
              navigateTo="Login"
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