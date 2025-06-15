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
    progressText: {
        fontSize: 13,
        color: colors.dark_gray,
        marginBottom: 4,
    },
    progressBarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 6,
        marginBottom: 16,
        gap: 6,
    },
    progressBar: {
        height: 6,
        borderRadius: 3,
        backgroundColor: colors.blue,
        flex: 1,
    },
    progressBarInactive: {
        height: 6,
        borderRadius: 3,
        backgroundColor: colors.gray,
        flex: 1,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.black,
        marginBottom: 24,
    },
    subtitle: {
        fontSize: 16,
        color: colors.gray,
        marginBottom: 24,
    },
    sectionContainer: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.black,
        marginBottom: 16,
    },
    priceContainer: {
        backgroundColor: colors.white,
        borderRadius: 8,
        padding: 16,
        marginBottom: 24,
    },
    priceInput: {
        borderWidth: 1,
        borderColor: colors.light_gray,
        borderRadius: 6,
        padding: 12,
        fontSize: 16,
        color: colors.black,
    },
    priceLabel: {
        fontSize: 14,
        color: colors.gray,
        marginBottom: 8,
    },
    precoLiquido: {
        fontSize: 14,
        color: colors.blue,
        marginTop: 8,
    },
    precoInfo: {
        fontSize: 14,
        color: colors.gray,
        marginTop: 8,
    },
    daysContainer: {
        backgroundColor: colors.white,
        borderRadius: 8,
        padding: 16,
    },
    dayRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    dayLabel: {
        flex: 1,
        fontSize: 16,
        color: colors.black,
    },
    timeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    timeInput: {
        borderWidth: 1,
        borderColor: colors.light_gray,
        borderRadius: 6,
        padding: 8,
        width: 80,
        textAlign: 'center',
    },
    timeSeparator: {
        fontSize: 16,
        color: colors.gray,
    },
    horarioContainer: {
        flex: 1,
    },
    horarioLabel: {
        fontSize: 14,
        color: colors.gray,
        marginBottom: 4,
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: colors.light_gray,
        borderRadius: 6,
        backgroundColor: colors.white,
    },
    picker: {
        height: 50,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        width: '48%',
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: colors.blue,
        marginRight: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkboxChecked: {
        backgroundColor: colors.blue,
    },
    checkboxLabel: {
        fontSize: 16,
        color: colors.black,
    },
    horariosDiaContainer: {
        backgroundColor: colors.white,
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
    },
    horariosDiaTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.black,
        marginBottom: 12,
    },
    horarioRangeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    horarioFieldsContainer: {
        flex: 1,
        flexDirection: 'row',
        gap: 12,
    },
    removeButton: {
        padding: 8,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        backgroundColor: colors.light_gray,
        borderRadius: 6,
    },
    addButtonText: {
        fontSize: 14,
        color: colors.blue,
        marginLeft: 8,
    },
    replicateButton: {
        backgroundColor: colors.white,
        borderRadius: 8,
        padding: 16,
        alignItems: 'center',
        marginBottom: 24,
    },
    replicateButtonText: {
        fontSize: 14,
        color: colors.blue,
        fontWeight: '600',
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