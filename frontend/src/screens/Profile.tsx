// Tela de Perfil

import { Text, SafeAreaView } from "react-native";
import { profileStyles } from "../styles/ProfileStyles";

export default function Profile() {
  return (
    <SafeAreaView style={profileStyles.container}>
      <Text style={profileStyles.title}>Perfil</Text>
    </SafeAreaView>
  );
}