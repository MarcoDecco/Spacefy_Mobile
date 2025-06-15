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
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.dark_gray,
        marginBottom: 15,
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
    scrollView: {
        flex: 1,
    },
    formContainer: {
        paddingBottom: 100,
    },
    rowContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    halfInput: {
        flex: 1,
    },
    typeButton: {
        backgroundColor: colors.blue,
        borderRadius: 6,
        paddingVertical: 8,
        paddingHorizontal: 16,
        marginBottom: 8,
        marginTop: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    typeButtonText: {
        color: colors.white,
        fontWeight: '600',
        fontSize: 15,
    },
    instructionsContainer: {
        marginTop: 24,
        backgroundColor: colors.white,
        borderRadius: 8,
        padding: 16,
    },
    instructionsTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.black,
        marginBottom: 8,
    },
    instructionsList: {
        gap: 8,
    },
    instructionItem: {
        fontSize: 14,
        color: colors.gray,
        lineHeight: 20,
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
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        width: '90%',
        maxHeight: '80%',
        backgroundColor: colors.white,
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
    },
    modalList: {
        width: '100%',
    },
    modalItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: colors.light_gray,
    },
    modalItemText: {
        fontSize: 16,
        color: colors.black,
    },
    modalCloseButton: {
        marginTop: 15,
        backgroundColor: colors.blue,
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        width: '100%',
    },
    modalCloseButtonText: {
        color: colors.white,
        fontWeight: 'bold',
        textAlign: 'center',
    },
}); 