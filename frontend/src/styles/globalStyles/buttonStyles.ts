import { StyleSheet } from 'react-native';
import { colors } from './colors';

export const buttons = StyleSheet.create({
    blueButton: {
        width: '60%',
        backgroundColor: colors.dark_blue,
        borderRadius: 10,
        paddingVertical: 12,
        marginBottom: 10,
        boxShadow: '0px 5px 8px rgba(0, 0, 0, 0.2)',
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
        borderColor: colors.dark_blue,
        borderRadius: 10,
        paddingVertical: 12,
        boxShadow: '0px 5px 8px rgba(0, 0, 0, 0.2)',
    },

    textWhiteButton: {
        color: colors.dark_blue,
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 18,
    },
})
