import { StyleSheet, Dimensions, Platform, StatusBar } from 'react-native';
import { colors } from '../globalStyles/colors';
import Constants from 'expo-constants';

const { width, height } = Dimensions.get('window');
const statusBarHeight = Platform.OS === 'ios' ? Constants.statusBarHeight : StatusBar.currentHeight || 0;

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
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
    contentContainer: {
        flex: 1,
        paddingHorizontal: 24,
    },
    header: {
        marginBottom: 32,
        paddingTop: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: colors.black,
        marginBottom: 8,
    },
    description: {
        fontSize: 16,
        color: colors.dark_gray,
        lineHeight: 24,
    },
    formContainer: {
        flex: 1,
    },
    inputContainer: {
        marginBottom: 24,
    },
    inputLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.black,
        marginBottom: 8,
    },
    input: {
        height: 48,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 16,
        justifyContent: 'center',
        backgroundColor: colors.white,
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
        marginVertical: 16,
        borderRadius: 8,
        overflow: 'hidden',
    },
    map: {
        flex: 1,
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