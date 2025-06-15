import { StyleSheet } from "react-native";
import { colors } from "../globalStyles/colors";

import Constants from 'expo-constants';
// instanciando a altura da Status Bar do dispositivo
const statusBarHeight = Constants.statusBarHeight

export const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginTop: statusBarHeight,
      backgroundColor: colors.light_gray,
      paddingHorizontal: 30,
      paddingTop: 30,
    },
    title: {
      fontSize: 36,
      fontWeight: 'bold',
      color: colors.black,
      marginBottom: 24,
    },
    image: {
      width: '100%',
      height: 180,
      borderRadius: 14,
      marginBottom: 24,
    },
    description: {
      fontSize: 17,
      color: colors.black,
      marginBottom: 24,
      textAlign: 'justify',
    },
    buttonRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 12,
    },
  }); 