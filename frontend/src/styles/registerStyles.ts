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

  
  loginText: {
    color: colors.dark_gray,
    textAlign: 'center',
    marginTop: 8,
  },
  
  loginLink: {
    color: colors.blue,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
    textDecorationLine: 'underline',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: -0.2, height: 0.2 },
    textShadowRadius: 0.5,
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
    backgroundColor: colors.gray,
  },
  
  dividerText: {
    marginHorizontal: 8,
    color: colors.dark_gray,
  },
}); 