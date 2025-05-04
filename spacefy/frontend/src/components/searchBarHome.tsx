import { useState } from 'react';
import Constants from 'expo-constants'
import { Feather } from '@expo/vector-icons'
import { View, Text, TextInput, Pressable, TouchableOpacity, Button } from 'react-native';


// instanciando a altura da Status Bar do dispositivo
const statusBarHeight = Constants.statusBarHeight

export default function Search() {
    
    const [text, setText] = useState('');

    return (
        <View style={{marginTop: statusBarHeight+20}} className='flex-row items-center gap-2'>
            <View className='flex-row flex-1 items-center bg-white border border-light-gray rounded-xl ml-5 px-3 py-1 justify-between'>
                {/** Barra de pesquisa */}
                <TextInput className='text-lg h-10'
                    placeholder='Faça sua pesquisa aqui...'
                    value={text}
                    onChangeText={setText}
                    returnKeyType='search'
                    autoCorrect={false}
                />

                {/** Lupa */}
                <TouchableOpacity onPress={() => console.log('Pesquisar')} className='bg-blue p-1.5 rounded-full'>
                    <Feather name="search" size={22} color="white" />
                </TouchableOpacity>
            </View>

            {/** Filtro */}
            <TouchableOpacity onPress={() => console.log('Filtro')} className='border border-light-gray rounded-xl bg-white mr-5 p-1.5'>
                <Feather name="sliders" size={30} color="" className='rotate-90' />
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