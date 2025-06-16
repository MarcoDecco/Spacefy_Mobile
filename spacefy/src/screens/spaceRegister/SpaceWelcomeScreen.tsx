import { View, SafeAreaView, Text, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { styles } from '../../styles/spaceRegisterStyles/SpaceWelcomeScreenStyles';
import RegisterSpaceButton from '../../components/buttons/registerSpaceButton';

export default function SpaceWelcomeScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      {/* Adicione um View com padding */}
      <View style={{ paddingHorizontal: 16, flex: 1, justifyContent: 'center' }}>
        <Text style={styles.title}>Cadastre seu espaço e alcance mais locatários!</Text>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80' }}
          style={styles.image}
          resizeMode="cover"
        />
        <Text style={styles.description}>
          Tem uma sala de reunião, auditório ou espaço para eventos disponível? Cadastre-se na nossa plataforma e conecte-se com pessoas que precisam de um local como o seu!{'\n'}{'\n'}Preencha os detalhes abaixo e comece a alugar seu espaço de forma prática e segura!
        </Text>
        <View style={styles.buttonRow}>
          <RegisterSpaceButton
            title="Cancelar Cadastro"
            onPress={() => navigation.goBack()}
            variant="secondary"
          />
          <RegisterSpaceButton
            title="Prosseguir"
            onPress={() => navigation.navigate('SpaceInfoScreen' as never)}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}