import { View, SafeAreaView, Text, Image, ScrollView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { styles } from '../../styles/spaceRegisterStyles/SpaceWelcomeScreenStyles';
import RegisterSpaceButton from '../../components/buttons/registerSpaceButton';
import { useTheme } from '../../contexts/ThemeContext';
import Constants from 'expo-constants';

const statusBarHeight = Constants.statusBarHeight;

export default function SpaceWelcomeScreen() {
  const navigation = useNavigation();
  const { isDarkMode, theme } = useTheme();

  return (
    <SafeAreaView style={[styles.container, isDarkMode && { backgroundColor: theme.background }]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />
      <View style={[ isDarkMode && { backgroundColor: theme.background }]} />
      <ScrollView 
        style={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View style={styles.header}>
          <Text style={[styles.title, isDarkMode && { color: theme.text }]}>Cadastre seu espaço e alcance mais locatários!</Text>
          <View style={[styles.imageContainer, isDarkMode && { backgroundColor: theme.card }]}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80' }}
              style={styles.image}
            />
          </View>
          <Text style={[styles.description, isDarkMode && { color: theme.text }]}>
            Tem uma sala de reunião, auditório ou espaço para eventos disponível? Cadastre-se na nossa plataforma e conecte-se com pessoas que precisam de um local como o seu!{'\n'}{'\n'}Preencha os detalhes abaixo e comece a alugar seu espaço de forma prática e segura!
          </Text>
        </View>
      </ScrollView>
      <View style={[styles.buttonContainer, isDarkMode && { backgroundColor: theme.card, borderTopColor: theme.border }]}>
        <View style={styles.buttonRow}>
          <RegisterSpaceButton
            title="Cancelar Cadastro"
            onPress={() => navigation.goBack()}
            variant="secondary"
          />
          <RegisterSpaceButton
            title="Prosseguir"
            onPress={() => navigation.navigate('SpaceInfoScreen' as never)}
            variant="primary"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}