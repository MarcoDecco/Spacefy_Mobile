import { useState } from 'react';
import Constants from 'expo-constants'
import { Feather, Ionicons } from '@expo/vector-icons'
import { View, Text, TextInput, Pressable, TouchableOpacity, Button, StyleSheet, Keyboard, TouchableWithoutFeedback } from 'react-native';

// instanciando a altura da Status Bar do dispositivo
const statusBarHeight = Constants.statusBarHeight

export default function Search() {
    const [text, setText] = useState('');

    return (
        <View style={[styles.headerContainer, { paddingTop: statusBarHeight + 20 }]}>
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
        </View>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        backgroundColor: '#fff',
        paddingBottom: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 5,
        zIndex: 1000,
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    searchContainer: {
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#E3E3E3',
        borderRadius: 12,
        marginLeft: 20,
        paddingHorizontal: 12,
        paddingVertical: 4,
        justifyContent: 'space-between',
    },
    input: {
        fontSize: 18,
        height: 40,
        flex: 1,
    },
    searchButton: {
        backgroundColor: '#1EACE3',
        padding: 6,
        borderRadius: 20,
    },
    filterButton: {
        borderWidth: 1,
        borderColor: '#E3E3E3',
        borderRadius: 12,
        backgroundColor: 'white',
        marginRight: 20,
        padding: 6,
    },
});
      
      {/* Campo de pesquisa */}
    //   <View style={{marginTop: statusBarHeight}} className="flex-row flex-1 items-center bg-white rounded-full border border-gray-300 px-4 py-2 shadow-sm">
    //       <TextInput
    //           className="flex-1 text-gray-800 placeholder-gray-400"
    //           placeholder="Faça sua pesquisa aqui...."
    //           value={text}
    //           onChangeText={setText}
    //           placeholderTextColor="#a1a1aa"
    //       />

    //       <TouchableOpacity>
    //           <Feather name='search' size={20} color='white'/>
    //       </TouchableOpacity>
    //   </View>

          {/* Botão de filtro */}
          {/* <TouchableOpacity className="bg-white p-3 rounded-xl border border-gray-300 shadow-sm">
              <SlidersHorizontal size={20} color="#333" />
          </TouchableOpacity> */}
//   </View>