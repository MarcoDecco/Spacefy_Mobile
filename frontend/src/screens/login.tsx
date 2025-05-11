import { View, Text, Image, TextInput, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { loginStyles as styles } from '../styles/login.styles';
import { colors } from '~/styles/globalStyles/colors';
import { input } from '~/styles/globalStyles/inputStyles';
import { buttons } from '~/styles/globalStyles/buttonStyles';
import { imageStyles } from '~/styles/globalStyles/imageStyles';

export default function Login({ navigation }: any) {
  const [showPassword, setShowPassword] = useState(false);

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

        <View style={input.inputContainer}>
          <View>
            <Text style={input.label}>E-mail</Text>
            <TextInput
              placeholder="Digite seu e-mail"
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#A0A0A0"
              style={input.input}
            />
          </View>

          <View>
            <Text style={input.label}>Senha</Text>
            <View style={input.inputContainerPassword}>
              <TextInput
                placeholder="Digite sua senha"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                placeholderTextColor="#A0A0A0"
                style={[input.inputPassword, { flex: 1 }]}
              />

              <TouchableOpacity 
                onPress={() => setShowPassword(!showPassword)}
              > 
                <Ionicons 
                  name={showPassword ? "eye-off" : "eye"} 
                  size={20} 
                  color="#A0A0A0"
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={buttons.blueButton}
          onPress={() => navigation.navigate('MainApp')}
        >
          <Text style={buttons.textBlueButton}>Entrar</Text>
        </TouchableOpacity>

        <Text style={styles.registerText}>Não possui uma conta?</Text>

        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.registerLink}>Cadastre-se</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
} 