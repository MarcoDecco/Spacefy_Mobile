import { View, Text, Image, TextInput, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { loginStyles as styles } from '../styles/login.styles';

export default function Login({ navigation }: any) {
  const insets = useSafeAreaInsets();

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
        <View style={styles.inputContainer}>
          <Text style={styles.label}>E-mail</Text>
          <TextInput
            placeholder="E-mail"
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
            placeholderTextColor="#A0A0A0"
          />
          <Text style={styles.label}>Senha</Text>
          <TextInput
            placeholder="Senha"
            secureTextEntry
            style={styles.input}
            placeholderTextColor="#A0A0A0"
          />
        </View>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => navigation.navigate('MainApp')}
        >
          <Text style={styles.loginButtonText}>Entrar</Text>
        </TouchableOpacity>
        <Text style={styles.registerText}>Não possui uma conta?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.registerLink}>Cadastre-se</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
} 