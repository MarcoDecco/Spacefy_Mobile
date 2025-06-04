import { StyleSheet } from 'react-native';
import { colors } from './globalStyles/colors';

export const loginStyles = StyleSheet.create({
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
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },

  profileImageContainer: {
    marginTop: -70,
    marginBottom: 30,
    borderRadius: 100,
    backgroundColor: colors.white,
    padding: 6,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },

  profileImage: {
    width: 90,
    height: 90,
  },

  registerText: {
    color: colors.dark_gray,
    textAlign: 'center',
    marginTop: 6,
  },

  registerLink: {
    color: colors.blue,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
    textDecorationLine: 'underline',
  },

  dividerContainer: {
    display: 'flex',
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
  },
}); 