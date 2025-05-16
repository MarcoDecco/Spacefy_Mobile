import { StyleSheet } from 'react-native';

import Constants from 'expo-constants';
import { colors } from './colors';
// instanciando a altura da Status Bar do dispositivo
const statusBarHeight = Constants.statusBarHeight

// Altura total da SearchBar (StatusBar + margem + altura do container)
export const SEARCH_BAR_HEIGHT = statusBarHeight + 20 + 40;

export const searchBarStyles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: 8,
        paddingBottom: 8,
        backgroundColor: 'rgba(245, 245, 245, 0.8)', // Fundo com 95% de opacidade
    },

    searchContainer: {
        flexDirection: 'row',
        flex: 1,
        marginTop: statusBarHeight + 20,
        height: 50,
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 100,
        marginLeft: 20,
        paddingHorizontal: 8,
        justifyContent: 'space-between',
        boxShadow: '0px 0px 10px 3px rgba(0, 0, 0, 0.1)',
    },

    input: {
        fontSize: 18,
        flex: 1,
    },

    searchButton: {
        backgroundColor: '#1EACE3',
        padding: 6,
        borderRadius: 100,
    },

    filterButton: {
        width: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 15,
        backgroundColor: 'white',
        marginRight: 20,
        boxShadow: '0px 0px 10px 2px rgba(0, 0, 0, 0.1)',
    },
});