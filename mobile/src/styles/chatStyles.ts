import { StyleSheet } from 'react-native';
import { colors } from './globalStyles/colors';

export const chatStyles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.light_gray
    },

    text: {
        fontSize: 100,
        fontWeight: 'bold',
        color: colors.dark_gray
    }
});