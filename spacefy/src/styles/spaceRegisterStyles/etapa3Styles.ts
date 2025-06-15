import { StyleSheet, Dimensions } from 'react-native';
import { colors } from '../globalStyles/colors';
import Constants from 'expo-constants';

const { width } = Dimensions.get('window');
const imageSize = (width - 60) / 2; // 2 colunas com espaçamento
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
    imageContainer: {
        flex: 1,
    },
    imageGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    imageWrapper: {
        width: imageSize,
        height: imageSize,
        borderRadius: 8,
        overflow: 'hidden',
        marginBottom: 10,
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    removeButton: {
        position: 'absolute',
        top: 5,
        right: 5,
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: colors.error,
        justifyContent: 'center',
        alignItems: 'center',
    },
    removeButtonText: {
        color: colors.white,
        fontSize: 14,
        fontWeight: 'bold',
    },
    addButton: {
        width: imageSize,
        height: imageSize,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: colors.light_gray,
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    addButtonText: {
        fontSize: 32,
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
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalImage: {
        width: width,
        height: width,
    },
}); 