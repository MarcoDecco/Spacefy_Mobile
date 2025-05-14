import { StyleSheet } from 'react-native';

import Constants from 'expo-constants';
// instanciando a altura da Status Bar do dispositivo
const statusBarHeight = Constants.statusBarHeight

// Altura total da SearchBar (StatusBar + margem + altura do container)
export const SEARCH_BAR_HEIGHT = statusBarHeight + 20 + 40;

export const searchBarStyles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: statusBarHeight + 20,
        left: 0,
        right: 0,
        zIndex: 1000,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: 'transparent',
    },

    searchContainer: {
        flexDirection: 'row',
        flex: 1,
        height: 50,
        alignItems: 'center',
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#E3E3E3',
        borderRadius: 12,
        marginLeft: 20,
        paddingHorizontal: 12,
        justifyContent: 'space-between',
    },

    input: {
        fontSize: 18,
        flex: 1,
    },

    searchButton: {
        backgroundColor: '#1EACE3',
        padding: 6,
        borderRadius: 20,
    },

    filterButton: {
        width: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#E3E3E3',
        borderRadius: 12,
        backgroundColor: 'white',
        marginRight: 20,
    },
});