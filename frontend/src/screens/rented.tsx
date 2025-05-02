// Tela de Alugados

import { Text, SafeAreaView } from 'react-native';
import { rentedStyles } from '../styles/RentedStyles';

export default function Rented() {
  return (
    <SafeAreaView style={rentedStyles.container}>
      <Text style={rentedStyles.title}>Alugados</Text>
    </SafeAreaView>
  );
}