import { StyleSheet, Dimensions } from 'react-native';
import { colors } from '../globalStyles/colors';
import Constants from 'expo-constants';

const { width } = Dimensions.get('window');
const statusBarHeight = Constants.statusBarHeight;

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.light_gray,
        marginTop: statusBarHeight,
    },
    progressContainer: {
        backgroundColor: colors.white,
        paddingTop: 20,
        paddingBottom: 5,
        borderBottomWidth: 1,
        borderBottomColor: colors.light_gray,
        marginBottom: 16,
    },
    formContainer: {
        flex: 1,
        paddingHorizontal: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: colors.black,
        marginBottom: 16,
        paddingTop: 24,
    },
    subtitle: {
        fontSize: 16,
        color: colors.dark_gray,
        lineHeight: 24,
        marginBottom: 24,
    },
    rulesContainer: {
        marginBottom: 24,
    },
    ruleItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: colors.light_gray,
    },
    ruleItemSelected: {
        borderColor: colors.blue,
        backgroundColor: colors.light_blue,
    },
    ruleIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.light_gray,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    ruleContent: {
        flex: 1,
    },
    ruleLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.black,
        marginBottom: 4,
    },
    ruleLabelSelected: {
        color: colors.blue,
    },
    ruleDescription: {
        fontSize: 14,
        color: colors.dark_gray,
        lineHeight: 20,
    },
    ruleDescriptionSelected: {
        color: colors.blue,
    },
    checkboxContainer: {
        width: 24,
        height: 24,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: colors.gray,
        marginLeft: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxChecked: {
        backgroundColor: colors.blue,
        borderColor: colors.blue,
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