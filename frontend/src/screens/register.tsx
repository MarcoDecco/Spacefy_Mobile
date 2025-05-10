import { View, Text, Image, TextInput, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NavigationProps } from '../navigation/types';
import { registerStyles as styles } from '../styles/register.styles';

export default function Register() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProps>();

  return (
    <LinearGradient
      colors={['#6ACDFF', '#1486B8']}
      style={[styles.container, { paddingTop: insets.top }]}
    >
      <View style={styles.cardContainer}>
        <View style={styles.profileImageContainer}>
          <Image
            source={require('../../assets/perfil-login.png')}
            style={styles.profileImage}
          />
        </View>
        <Text style={styles.title}>Criar Conta</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Nome</Text>
          <TextInput
            style={styles.input}
            placeholderTextColor="#A0A0A0"
            placeholder="Nome"
          />
          <Text style={styles.label}>Sobrenome</Text>
          <TextInput
            style={styles.input}
            placeholderTextColor="#A0A0A0"
            placeholder="Sobrenome"
          />
          <Text style={styles.label}>E-mail</Text>
          <TextInput
            style={styles.input}
            placeholderTextColor="#A0A0A0"
            placeholder="E-mail"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Text style={styles.label}>Senha</Text>
          <TextInput
            style={styles.input}
            placeholderTextColor="#A0A0A0"
            placeholder="Senha"
            secureTextEntry
          />
          <Text style={styles.label}>Confirmar Senha</Text>
          <TextInput
            style={styles.input}
            placeholderTextColor="#A0A0A0"
            placeholder="Confirmar Senha"
            secureTextEntry
          />
          <Text style={styles.label}>Telefone</Text>
          <TextInput
            style={styles.input}
            placeholderTextColor="#A0A0A0"
            placeholder="Telefone"
            keyboardType="phone-pad"
          />
        </View>
        <TouchableOpacity
          style={styles.registerButton}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.registerButtonText}>Cadastrar</Text>
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
    </LinearGradient>
  );
} 