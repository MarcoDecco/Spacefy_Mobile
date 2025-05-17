import { StyleSheet } from 'react-native';
import { colors } from './globalStyles/colors';

export const registerStyles = StyleSheet.create({
  container: {
    flex: 1,
  },

  scrollContent: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: 8,
  },

  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },

  dividerText: {
    marginHorizontal: 8,
    color: '#333333',
  },

  loginText: {
    color: '#333333',
    textAlign: 'center',
    marginTop: 8,
  },

  loginLink: {
    color: colors.dark_blue,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
}); 