import { StyleSheet, Dimensions } from 'react-native';
import { colors } from './globalStyles/colors';

const { width } = Dimensions.get('window');

export const registerStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  scrollContent: {
    flexGrow: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
  },

  loginText: {
    color: colors.dark_gray,
    textAlign: 'center',
    marginTop: 4,
    fontSize: 13,
  },
  
  loginLink: {
    color: colors.blue,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 13,
    textDecorationLine: 'underline',
    marginBottom: 12,
  },

  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: 8,
    paddingHorizontal: 20,
  },
  
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: colors.gray,
  },
  
  dividerText: {
    marginHorizontal: 6,
    color: colors.dark_gray,
    fontSize: 11,
  },
}); 