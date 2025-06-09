import { useState } from 'react';
import { Feather } from '@expo/vector-icons'
import { View, TextInput, TouchableOpacity, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { searchBarStyles as styles } from '../styles/globalStyles/searchBarStyles';
import { useTheme } from '../contexts/ThemeContext';
import Filter, { FilterOptions } from './filter';

interface SearchProps {
  onSearch?: (text: string) => void;
  onFilterChange?: (filters: FilterOptions) => void;
  initialValue?: string;
}

export default function Search({ onSearch, onFilterChange, initialValue = '' }: SearchProps) {
    const [text, setText] = useState(initialValue);
    const { theme, isDarkMode } = useTheme();

    const handleSearch = (searchText: string) => {
        setText(searchText);
        onSearch?.(searchText);
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={[styles.container, { backgroundColor: theme.background }]}>
                <View style={styles.searchRow}>
                    <View style={[styles.searchContainer, { 
                        backgroundColor: isDarkMode ? theme.dark_gray : theme.card,
                        borderWidth: 1,
                        borderColor: theme.border,
                        flex: 1
                    }]}>
                        <TextInput
                            style={[styles.input, { color: theme.text }]}
                            placeholder='Faça sua pesquisa aqui...'
                            placeholderTextColor={theme.gray}
                            value={text}
                            onChangeText={handleSearch}
                            returnKeyType='search'
                            autoCorrect={false}
                        />

                        <TouchableOpacity 
                            onPress={() => {
                                Keyboard.dismiss();
                                onSearch?.(text);
                            }} 
                            style={styles.searchButton}
                        >
                            <Feather name="search" size={22} color="white" />
                        </TouchableOpacity>
                    </View>

                    <Filter 
                        onFilterChange={onFilterChange || (() => {})}
                        isDarkMode={isDarkMode}
                        theme={theme}
                    />
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
}
