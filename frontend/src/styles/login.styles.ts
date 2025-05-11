import { StyleSheet } from 'react-native';
import { colors } from './globalStyles/colors';

export const loginStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  cardContainer: {
    width: '85%',
    backgroundColor: colors.white,
    borderRadius: 15,
    alignItems: 'center',
    padding: 24,
    boxShadow: '2px 6px 10px rgba(0, 0, 0, 0.2)',
  },

  profileImageContainer: {
    marginTop: -70,
    marginBottom: 50,
    borderRadius: 100,
    backgroundColor: colors.white,
    padding: 6,
    boxShadow: '0px 5px 10px rgba(0, 0, 0, 0.2)',
  },

  profileImage: {
    width: 90,
    height: 90,
  },

  registerText: {
    color: colors.dark_gray,
    textAlign: 'center',
    marginTop: 15,
  },

  registerLink: {
    color: colors.dark_blue,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
}); 