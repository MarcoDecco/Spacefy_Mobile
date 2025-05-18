import { View, Text, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { loginStyles as styles } from '../styles/loginStyles';
import { colors } from '~/styles/globalStyles/colors';
import { imageStyles } from '~/styles/globalStyles/imageStyles';
import Button from '../components/button';
import BaseInput from '../components/inputs/baseInput';
import PasswordInput from '../components/inputs/passwordInput';
import { inputStyles } from '~/styles/componentStyles/inputStyles';

export default function Login({ navigation }: any) {
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
        />

        <PasswordInput
          label="Senha"
          placeholder="Digite sua senha"
          required
          containerStyle={ inputStyles.marginBottom }
        />

        <Button 
          text="Entrar"
          navigateTo="MainApp"
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