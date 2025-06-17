import { StyleSheet, Dimensions, Platform, StatusBar } from 'react-native';
import { colors } from '../globalStyles/colors';
import Constants from 'expo-constants';

const { width } = Dimensions.get('window');
const statusBarHeight = Platform.OS === 'ios' ? Constants.statusBarHeight : StatusBar.currentHeight || 0;

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.light_gray,
        paddingTop: statusBarHeight,
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
    categorySection: {
        marginBottom: 24,
    },
    categoryHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    categoryIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.light_gray,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    categoryTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: colors.black,
    },
    itemsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: -8,
    },
    itemContainer: {
        width: (width - 64) / 2,
        backgroundColor: colors.white,
        borderRadius: 12,
        padding: 16,
        margin: 8,
        borderWidth: 1,
        borderColor: colors.light_gray,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    itemContainerSelected: {
        borderColor: colors.blue,
        backgroundColor: colors.light_blue,
    },
    itemContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    itemIconContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: colors.light_gray,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 4,
    },
    itemIconContainerSelected: {
        backgroundColor: colors.white,
    },
    itemLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: colors.black,
        flex: 1,
    },
    itemLabelSelected: {
        color: colors.blue,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: colors.gray,
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