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
    categoriesContainer: {
        paddingBottom: 100,
    },
    categorySection: {
        marginBottom: 24,
        backgroundColor: colors.white,
        borderRadius: 8,
        padding: 16,
    },
    categoryTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.black,
        marginBottom: 16,
    },
    itemsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    itemContainer: {
        width: '48%',
        marginBottom: 12,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkbox: {
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
    itemLabel: {
        flex: 1,
        fontSize: 16,
        color: colors.black,
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