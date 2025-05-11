import { useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NavigationProps } from '../navigation/types';
import { globalStyles } from '../styles/globalStyles/globalStyles';
import { registerStyles as styles } from '../styles/register.styles';
import { colors } from '../styles/globalStyles/colors';
import { imageStyles } from '~/styles/globalStyles/imageStyles';
import { loginStyles } from '~/styles/login.styles';
import { input } from '~/styles/globalStyles/inputStyles';
import { buttons } from '~/styles/globalStyles/buttonStyles';

export default function Register() {
  const navigation = useNavigation<NavigationProps>();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <LinearGradient
      colors={[colors.others[100], colors.others[200]]}
      style={[styles.container]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={[globalStyles.container]}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="always"
          keyboardDismissMode="none"
        >
          <View style={loginStyles.cardContainer}>
            <View style={imageStyles.profileImageContainer}>
              <Image source={require('../../assets/perfil-login.png')} style={imageStyles.profileImage} />
            </View>

            <View style={input.inputContainerRegister}>
              <View>
                <Text style={input.label}>Nome Completo</Text>
                <TextInput
                  style={input.input}
                  placeholderTextColor="#A0A0A0"
                  placeholder="Digite seu nome"
                />
              </View>

              <View>
                <Text style={input.label}>E-mail</Text>
                <TextInput
                  style={input.input}
                  placeholderTextColor="#A0A0A0"
                  placeholder="Digite seu e-mail"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View>
                <Text style={input.label}>Senha</Text>
                <View style={input.inputContainerPassword}>
                  <TextInput
                    style={[input.inputPassword, { flex: 1 }]}
                    placeholderTextColor="#A0A0A0"
                    placeholder="Digite sua senha"
                    secureTextEntry={!showPassword}
                  />

                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Ionicons
                      name={showPassword ? 'eye-off' : 'eye'}
                      size={20}
                      color="#A0A0A0"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <View>
                <Text style={input.label}>Confirmar Senha</Text>
                <View style={input.inputContainerPassword}>
                  <TextInput
                    style={[input.inputPassword, { flex: 1 }]}
                    placeholderTextColor="#A0A0A0"
                    placeholder="Confirme sua senha"
                    secureTextEntry={!showConfirmPassword}
                  />
                  <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                    <Ionicons
                      name={showConfirmPassword ? 'eye-off' : 'eye'}
                      size={20}
                      color="#A0A0A0"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <View>
                <Text style={input.label}>Telefone</Text>
                <TextInput
                  style={input.input}
                  placeholderTextColor="#A0A0A0"
                  placeholder="Digite seu telefone"
                  keyboardType="phone-pad"
                />
              </View>
            </View>

            <TouchableOpacity
              style={buttons.blueButton}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={buttons.textBlueButton}>Cadastrar</Text>
            </TouchableOpacity>

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