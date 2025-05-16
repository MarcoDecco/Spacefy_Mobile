import { View, Text, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { welcomeStyles as styles } from '../styles/welcome.styles';
import { colors } from '../styles/globalStyles/colors';
import { containers } from '../styles/globalStyles/containerStyles';
import Button from '../components/button';

export default function Welcome() {
  return (
    <LinearGradient
      colors={[ colors.others[100], colors.others[200] ]}
      style={[containers.container2]}
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

      <Button 
        text="Login"
        navigateTo="Login"
        color="blue"
      />

      <Button 
        text="Criar Conta"
        navigateTo="Register"
        color="white"
      />

    </LinearGradient>
  );
} 