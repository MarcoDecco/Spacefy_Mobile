import { View, Text, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NavigationProps } from '../navigation/types';
import { welcomeStyles as styles } from '../styles/welcome.styles';

export default function Welcome() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProps>();

  return (
    <LinearGradient
      colors={['#C2EBFF', '#6ACDFF']}
      style={[styles.container, { paddingTop: insets.top }]}
    >
      <View style={styles.imageContainer}>
        <Image
          source={require('../../assets/arte-introdutoria.png')}
          style={styles.image}
        />
      </View>

      <Text style={styles.title}>Bem vindo ao SPACEFY!</Text>

      <Text style={styles.subtitle}>
        Antes de começar a utilizar a plataforma, entre com o seu login preenchendo as informações necessárias
      </Text>

      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.registerButton}
        onPress={() => navigation.navigate('Register')}
      >
        <Text style={styles.registerButtonText}>Criar Conta</Text>
      </TouchableOpacity>

    </LinearGradient>
  );
} 