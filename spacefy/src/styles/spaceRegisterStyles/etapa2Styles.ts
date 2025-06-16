import { StyleSheet, Dimensions } from 'react-native';
import { colors } from '../globalStyles/colors';
import Constants from 'expo-constants';

const statusBarHeight = Constants.statusBarHeight;
const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.light_gray,
    },
    progressContainer: {
        backgroundColor: colors.white,
        paddingTop: 20,
        paddingBottom: 5,
        borderBottomWidth: 1,
        borderBottomColor: colors.light_gray,
    },
    contentContainer: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 24,
    },
    header: {
        marginBottom: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: colors.black,
        marginBottom: 16,
        lineHeight: 36,
    },
    description: {
        fontSize: 16,
        color: colors.dark_gray,
        lineHeight: 24,
        marginBottom: 16,
    },
    formContainer: {
        flex: 1,
    },
    inputContainer: {
        marginBottom: 16,
    },
    inputLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.black,
        marginBottom: 8,
    },
    input: {
        backgroundColor: colors.white,
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        color: colors.black,
        borderWidth: 1,
        borderColor: colors.light_gray,
    },
    inputError: {
        borderColor: colors.error,
    },
    errorText: {
        color: colors.error,
        fontSize: 14,
        marginTop: 4,
    },
    buttonContainer: {
        padding: 24,
        backgroundColor: colors.white,
        borderTopWidth: 1,
        borderTopColor: colors.light_gray,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
    },
    addressContainer: {
        backgroundColor: colors.white,
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
    },
    addressRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    addressIcon: {
        marginRight: 12,
    },
    addressText: {
        flex: 1,
        fontSize: 16,
        color: colors.black,
    },
    addressLabel: {
        fontSize: 14,
        color: colors.dark_gray,
        marginBottom: 4,
    },
    mapContainer: {
        height: 200,
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 16,
        backgroundColor: colors.light_gray,
    },
    map: {
        width: '100%',
        height: '100%',
    },
    mapLoadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    currentLocationButton: {
        position: 'absolute',
        bottom: 16,
        right: 16,
        backgroundColor: colors.blue,
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
        shadowColor: colors.black,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    useCurrentLocationButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: colors.light_blue,
        marginLeft: 12,
    },
}); 