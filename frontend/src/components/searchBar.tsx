import { useState } from 'react';
import Constants from 'expo-constants'
import { Feather, Ionicons } from '@expo/vector-icons'
import { View, Text, TextInput, Pressable, TouchableOpacity, Button, Platform } from 'react-native';


// instanciando a altura da Status Bar do dispositivo
const statusBarHeight = Constants.statusBarHeight

export default function Search() {
    
    const [text, setText] = useState('');

    return (
        <View 
            style={{
                marginTop: Platform.OS === 'ios' ? statusBarHeight + 10 : statusBarHeight + 20,
                paddingHorizontal: 16
            }} 
            className='flex-row items-center gap-2'
        >
            <View 
                className='flex-row flex-1 items-center bg-white border border-light-gray rounded-xl px-3 py-1 justify-between'
                style={{
                    ...Platform.select({
                        ios: {
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 1 },
                            shadowOpacity: 0.1,
                            shadowRadius: 2,
                        }
                    })
                }}
            >
                {/** Barra de pesquisa */}
                <TextInput 
                    className='text-lg h-10 flex-1'
                    placeholder='Faça sua pesquisa aqui...'
                    value={text}
                    onChangeText={setText}
                    returnKeyType='search'
                    autoCorrect={false}
                    style={{
                        ...Platform.select({
                            ios: {
                                paddingVertical: 8
                            }
                        })
                    }}
                />

                {/** Lupa */}
                <TouchableOpacity 
                    onPress={() => console.log('Pesquisar')} 
                    className='bg-blue p-1.5 rounded-full'
                    style={{
                        ...Platform.select({
                            ios: {
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 1 },
                                shadowOpacity: 0.2,
                                shadowRadius: 1.41,
                            }
                        })
                    }}
                >
                    <Feather name="search" size={22} color="white" />
                </TouchableOpacity>
            </View>

            {/** Filtro */}
            <TouchableOpacity 
                onPress={() => console.log('Filtro')} 
                className='border border-light-gray rounded-xl bg-white p-1.5'
                style={{
                    ...Platform.select({
                        ios: {
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 1 },
                            shadowOpacity: 0.1,
                            shadowRadius: 2,
                        }
                    })
                }}
            >
                <Ionicons name="filter" size={30}/>
            </TouchableOpacity>
         </View>
    );
}
      
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