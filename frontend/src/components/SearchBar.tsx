import { useState } from 'react';
import { Feather, Ionicons } from '@expo/vector-icons'
import { View, TextInput, TouchableOpacity, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { searchBarStyles as styles } from '../styles/globalStyles/searchBarStyles';

export default function Search() {
    const [text, setText] = useState('');

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                <View style={styles.searchContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder='Faça sua pesquisa aqui...'
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
                    style={styles.filterButton}
                >
                    <Ionicons name="filter" size={30} color="#333" />
                </TouchableOpacity>
            </View>
        </TouchableWithoutFeedback>
    );
}