import { StyleSheet } from 'react-native';
import { colors } from '../globalStyles/colors';

export const buttons = StyleSheet.create({
    blueButton: {
        width: '60%',
        backgroundColor: colors.blue,
        borderRadius: 10,
        paddingVertical: 12,
        marginBottom: 10,
        elevation: 5,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },

    textBlueButton: {
        color: colors.white,
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 18,
    },

    whiteButton: {
        width: '60%',
        backgroundColor: colors.white,
        borderWidth: 1.5,
        borderColor: colors.blue,
        borderRadius: 10,
        paddingVertical: 12,
        elevation: 5,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },

    textWhiteButton: {
        color: colors.blue,
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 18,
    },
});

export const registerSpaceButtonStyles = StyleSheet.create({
  button: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
    marginHorizontal: 4,
    elevation: 2,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  primary: {
    backgroundColor: colors.blue,
  },
  secondary: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.blue,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 16,
  },
  secondaryText: {
    color: colors.blue,
  },
});
