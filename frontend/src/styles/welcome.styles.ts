import { StyleSheet } from 'react-native';
import { colors } from './globalStyles/colors';

export const welcomeStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  imageContainer: {
    width: '100%',
    alignItems: 'center',
  },

  image: {
    width: 280,
    height: 205,
    resizeMode: 'contain',
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.dark_gray,
    marginTop: 50,
    marginBottom: 15,
    textAlign: 'center',
  },

  subtitle: {
    fontSize: 18,
    color: colors.dark_gray,
    textAlign: 'center',
    marginBottom: 50,
    paddingHorizontal: 50,
  },
}); 