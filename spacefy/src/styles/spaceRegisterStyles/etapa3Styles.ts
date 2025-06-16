import { StyleSheet, Dimensions } from 'react-native';
import { colors } from '../globalStyles/colors';
import Constants from 'expo-constants';

const { width } = Dimensions.get('window');
const imageSize = (width - 48 - 16) / 3; // 3 imagens por linha com espaçamento
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
    imageContainer: {
        backgroundColor: colors.white,
        borderRadius: 16,
        padding: 16,
        marginBottom: 24,
    },
    imageGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    imageWrapper: {
        width: imageSize,
        height: imageSize,
        borderRadius: 12,
        overflow: 'hidden',
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    removeButton: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    removeButtonText: {
        color: colors.white,
        fontSize: 14,
        fontWeight: '600',
    },
    addButton: {
        width: imageSize,
        height: imageSize,
        borderRadius: 12,
        backgroundColor: colors.light_blue,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: colors.blue,
        borderStyle: 'dashed',
    },
    addButtonText: {
        fontSize: 32,
        color: colors.blue,
        fontWeight: '300',
    },
    buttonRowFixed: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 24,
        backgroundColor: colors.white,
        borderTopWidth: 1,
        borderTopColor: colors.light_gray,
        gap: 12,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalImage: {
        width: width - 48,
        height: width - 48,
        resizeMode: 'contain',
    },
    imageCounter: {
        position: 'absolute',
        bottom: 8,
        left: 8,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    imageCounterText: {
        color: colors.white,
        fontSize: 12,
        fontWeight: '600',
    },
    imageTip: {
        fontSize: 14,
        color: colors.dark_gray,
        marginTop: 16,
        textAlign: 'center',
    },
}); 