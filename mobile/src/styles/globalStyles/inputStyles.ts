import { StyleSheet } from 'react-native';
import { colors } from './colors';

export const input = StyleSheet.create({
    inputContainer: {
        width: '100%',
        gap: 20,
        marginBottom: 50,
    },

    inputContainerRegister: {
        width: '100%',
        gap: 20,
        marginBottom: 50,
    },

    inputContainerPassword: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'flex-end',
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },

    label: {
        color: colors.dark_gray,
        fontSize: 18,
        fontWeight: '600',
    },

    input: {
        height: 35,
        borderBottomWidth: 1,
        borderBottomColor: "#E0E0E0",
        paddingBottom: 0,
    },

    inputPassword: {
        height: 35,
        paddingBottom: 0,
    },
});