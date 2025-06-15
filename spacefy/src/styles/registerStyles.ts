import { StyleSheet } from 'react-native';
import { colors } from './globalStyles/colors';

export const registerStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 70,
  },

  cardContainer: {
    width: '85%',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 15,
    alignItems: 'center',
    padding: 24,
    marginVertical: 20,
    boxShadow: '0px 4px 10px 0px rgba(0, 0, 0, 0.25)',
  },

  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loginText: {
    color: colors.dark_gray,
    textAlign: 'center',
    marginTop: 6,
    fontSize: 14, // harmonizado com a tela de login
  },

  loginLink: {
    color: colors.blue,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16, // harmonizado com a tela de login
    textDecorationLine: 'underline',
    marginBottom: 12,
  },

  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: 8,
    paddingHorizontal: 32,
  },

  divider: {
    flex: 1,
    height: 1,
    backgroundColor: colors.gray,
  },

  dividerText: {
    marginHorizontal: 8,
    color: colors.dark_gray,
    fontSize: 12,
  },
});
