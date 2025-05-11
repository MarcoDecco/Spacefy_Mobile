import { View, Text, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NavigationProps } from '../navigation/types';
import { welcomeStyles as styles } from '../styles/welcome.styles';
import { colors } from '../styles/globalStyles/colors';
import { buttons } from '../styles/globalStyles/buttonStyles';

export default function Welcome() {
  const navigation = useNavigation<NavigationProps>();

  return (
    <LinearGradient
      colors={[ colors.others[100], colors.others[200] ]}
      style={[styles.container]}
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
        style={buttons.blueButton}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={buttons.textBlueButton}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={buttons.whiteButton}
        onPress={() => navigation.navigate('Register')}
      >
        <Text style={buttons.textWhiteButton}>Criar Conta</Text>
      </TouchableOpacity>

    </LinearGradient>
  );
} 