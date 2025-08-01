import { StyleSheet } from 'react-native';
import { colors } from '../globalStyles/colors';

import Constants from 'expo-constants';
// instanciando a altura da Status Bar do dispositivo
const statusBarHeight = Constants.statusBarHeight

// Altura total da SearchBar (StatusBar + margem + altura do container)
export const SEARCH_BAR_HEIGHT = statusBarHeight + 60;

export const searchBarStyles = StyleSheet.create({
    container: {
        position: 'absolute',
        zIndex: 1500,
        width: '100%',
        paddingBottom: 15,
        backgroundColor: colors.light_gray,
    },

    searchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: statusBarHeight + 20,
        marginHorizontal: 20,
        gap: 10,
    },

    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },

    searchContainer: {
        flexDirection: 'row',
        height: 50,
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 100,
        paddingHorizontal: 8,
        justifyContent: 'space-between',
        boxShadow: '0px 0px 10px 3px rgba(0, 0, 0, 0.1)',
    },

    input: {
        fontSize: 18,
        flex: 1,
    },

    searchButton: {
        backgroundColor: colors.blue,
        padding: 6,
        borderRadius: 100,
    },
});