// Tela Home

import { Text, SafeAreaView, TextInput } from 'react-native';
import { homeStyles } from '../styles/HomeStyles';

export default function Home() {
  return (
    <SafeAreaView style={homeStyles.container}>
      <Text style={homeStyles.title}>Home</Text>
    </SafeAreaView>
  );
}