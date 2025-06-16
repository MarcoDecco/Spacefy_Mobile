import { StyleSheet } from 'react-native';
import { colors } from '../globalStyles/colors';
import Constants from 'expo-constants';

const statusBarHeight = Constants.statusBarHeight;

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: statusBarHeight,
        backgroundColor: colors.light_gray,
        paddingHorizontal: 30,
        paddingTop: 30,
    },
    progressContainer: {
        marginBottom: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.black,
        marginBottom: 24,
    },
    subtitle: {
        fontSize: 16,
        color: colors.dark_gray,
        marginBottom: 24,
    },
    rulesContainer: {
        gap: 16,
        paddingBottom: 100,
    },
    ruleItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: 16,
        backgroundColor: colors.white,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.light_gray,
    },
    checkboxContainer: {
        width: 24,
        height: 24,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: colors.blue,
        marginRight: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkboxChecked: {
        backgroundColor: colors.blue,
    },
    ruleContent: {
        flex: 1,
    },
    ruleLabel: {
        fontSize: 16,
        fontWeight: '500',
        color: colors.black,
        marginBottom: 4,
    },
    ruleDescription: {
        fontSize: 14,
        color: colors.gray,
    },
    buttonRowFixed: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        paddingHorizontal: 30,
        marginBottom: '8%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
    },
}); 