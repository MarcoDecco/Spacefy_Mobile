// Tela de Fvoritos
import { Text, SafeAreaView } from 'react-native';
import { favoritesStyles } from '../styles/FavoritesStyles';

export default function Favoritos() {
  return (
    <SafeAreaView style={favoritesStyles.container}>
      <Text style={favoritesStyles.title}>Favoritos</Text>
    </SafeAreaView>
  );
}