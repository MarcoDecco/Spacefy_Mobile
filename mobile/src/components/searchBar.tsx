import { useState } from 'react';
import { Feather, Ionicons } from '@expo/vector-icons'
import { View, TextInput, TouchableOpacity, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { searchBarStyles as styles } from '../styles/globalStyles/searchBarStyles';
import { useTheme } from '../contexts/ThemeContext';

export default function Search() {
    const [text, setText] = useState('');
    const { theme, isDarkMode } = useTheme();

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={[styles.container, { backgroundColor: theme.background }]}>
                <View style={[styles.searchContainer, { 
                    backgroundColor: isDarkMode ? theme.dark_gray : theme.card,
                    borderWidth: 1,
                    borderColor: theme.border
                }]}>
                    <TextInput
                        style={[styles.input, { color: theme.text }]}
                        placeholder='Faça sua pesquisa aqui...'
                        placeholderTextColor={theme.gray}
                        value={text}
                        onChangeText={setText}
                        returnKeyType='search'
                        autoCorrect={false}
                    />

                    <TouchableOpacity 
                        onPress={() => {
                            Keyboard.dismiss();
                            console.log('Pesquisar');
                        }} 
                        style={styles.searchButton}
                    >
                        <Feather name="search" size={22} color="white" />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity 
                    onPress={() => {
                        Keyboard.dismiss();
                        console.log('Filtro');
                    }} 
                    style={[styles.filterButton, { 
                        backgroundColor: isDarkMode ? theme.dark_gray : theme.card,
                        borderWidth: 1,
                        borderColor: theme.border
                    }]}
                >
                    <Ionicons name="filter" size={30} color={theme.text} />
                </TouchableOpacity>
            </View>
        </TouchableWithoutFeedback>
    );
}
