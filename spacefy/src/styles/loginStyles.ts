import { StyleSheet } from 'react-native';
import { colors } from './globalStyles/colors';

export const loginStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },

  cardContainer: {
    width: '85%',
    backgroundColor: colors.white,
    borderRadius: 20,
    alignItems: 'center',
    padding: 20,
    marginVertical: 20,
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
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
    color: colors.gray,
    marginBottom: 5,
  },

  registerLink: {
    color: colors.blue,
    fontWeight: 'bold',
  },

  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    width: '100%',
  },

  divider: {
    flex: 1,
    height: 1,
    backgroundColor: colors.gray,
  },

  dividerText: {
    marginHorizontal: 10,
    color: colors.gray,
  },

  biometricButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    marginTop: 10,
    marginBottom: 20,
    borderRadius: 8,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.blue,
  },

  biometricButtonText: {
    color: colors.blue,
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500',
  },
}); 