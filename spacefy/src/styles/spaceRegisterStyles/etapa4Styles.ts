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
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: colors.black,
        marginBottom: 16,
        paddingHorizontal: 24,
        paddingTop: 24,
    },
    subtitle: {
        fontSize: 16,
        color: colors.dark_gray,
        lineHeight: 24,
        marginBottom: 24,
        paddingHorizontal: 24,
    },
    formContainer: {
        flex: 1,
        paddingHorizontal: 24,
    },
    availabilityContainer: {
        backgroundColor: colors.white,
        borderRadius: 16,
        padding: 16,
        marginBottom: 24,
    },
    timeSlotContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.light_gray,
    },
    timeSlotLabel: {
        fontSize: 16,
        color: colors.black,
        fontWeight: '500',
    },
    timeSlotValue: {
        fontSize: 16,
        color: colors.blue,
        fontWeight: '600',
    },
    addTimeSlotButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.light_blue,
        padding: 16,
        borderRadius: 12,
        marginTop: 16,
    },
    addTimeSlotText: {
        color: colors.blue,
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
    timeSlotRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.light_gray,
        padding: 12,
        borderRadius: 8,
        marginTop: 8,
    },
    timeSlotText: {
        fontSize: 14,
        color: colors.dark_gray,
    },
    removeTimeSlotButton: {
        padding: 4,
    },
    timeSlotList: {
        marginTop: 16,
    },
    timeSlotHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    timeSlotTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.black,
    },
    timeSlotCount: {
        fontSize: 14,
        color: colors.dark_gray,
    },
    priceContainer: {
        marginBottom: 24,
        backgroundColor: colors.white,
        padding: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.light_gray,
    },
    priceLabel: {
        fontSize: 16,
        color: colors.black,
        fontWeight: '500',
        marginBottom: 8,
    },
    priceInput: {
        fontSize: 18,
        color: colors.black,
        borderWidth: 1,
        borderColor: colors.light_gray,
        borderRadius: 6,
        paddingHorizontal: 12,
        paddingVertical: 8,
        backgroundColor: colors.white,
    },
}); 