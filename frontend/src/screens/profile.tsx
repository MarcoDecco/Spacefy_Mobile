//Tela de Perfil
import { Text, View, Image, TouchableOpacity, ScrollView } from "react-native";
import { MaterialIcons, Feather, FontAwesome, Ionicons } from '@expo/vector-icons';

export default function Profile() {
  return (
    <ScrollView className="flex-1 bg-gradient-to-b from-[#1A7DB8] to-[#2CA6E0]">
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 pt-8 pb-4">
        <Text className="text-white text-2xl font-bold">Perfil</Text>
        <Ionicons name="notifications-outline" size={24} color="#fff" />
      </View>

      {/* Card do Usuário - NOVO LAYOUT */}
      <View className="relative bg-white mx-4 rounded-xl pt-8 pb-6 px-4 items-center shadow-md mb-4">
        {/* Ícone de menu no canto superior direito */}
        <TouchableOpacity className="absolute top-4 right-4">
          <Feather name="menu" size={24} color="#333" />
        </TouchableOpacity>
        {/* Foto centralizada com borda azul */}
        <View className="border-4 border-[#1A7DB8] rounded-full mb-3" style={{padding:2}}>
          <Image
            source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }}
            className="w-24 h-24 rounded-full"
          />
        </View>
        {/* Nome centralizado */}
        <Text className="text-2xl font-bold text-gray-800 mb-2">Ricardo Penne</Text>
        {/* Email e telefone centralizados */}
        <Text className="text-base text-gray-800 mb-1"><Text className="font-bold">Email:</Text> ricardopenne777@gmail.com</Text>
        <Text className="text-base text-gray-800"><Text className="font-bold">Telefone:</Text> (32) 99822-1535</Text>
      </View>

      {/* Anuncie seu Espaço */}
      <View className="bg-transparent mx-4 mt-6 flex-row items-center justify-between">
        <View className="flex-1 pr-2">
          <Text className="text-white text-lg font-bold">Anuncie seu Espaço na Spacefy</Text>
          <Text className="text-white text-sm mt-1">Veja fica mais fácil anunciar o seu local para aluguel.</Text>
          <TouchableOpacity className="bg-white rounded mt-3 px-4 py-2 self-start">
            <Text className="text-[#1A7DB8] font-bold">Anunciar Espaço</Text>
          </TouchableOpacity>
        </View>
        <Image
          source={{ uri: 'https://cdn-icons-png.flaticon.com/512/616/616494.png' }}
          className="w-20 h-20"
        />
      </View>

      {/* Configurações */}
      <View className="mt-8 mx-4">
        <Text className="text-white text-xl font-bold mb-2">Configurações</Text>
        <View className="bg-white rounded-xl divide-y divide-gray-200">
          <TouchableOpacity className="flex-row items-center px-4 py-3">
            <Feather name="user" size={20} color="#1A7DB8" />
            <Text className="flex-1 ml-3 text-gray-800">Login e segurança</Text>
            <Feather name="chevron-right" size={20} color="#1A7DB8" />
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center px-4 py-3">
            <FontAwesome name="credit-card" size={20} color="#1A7DB8" />
            <Text className="flex-1 ml-3 text-gray-800">Pagamentos</Text>
            <Feather name="chevron-right" size={20} color="#1A7DB8" />
          </TouchableOpacity>
          {[1,2,3].map((i) => (
            <TouchableOpacity key={i} className="flex-row items-center px-4 py-3">
              <MaterialIcons name="settings" size={20} color="#1A7DB8" />
              <Text className="flex-1 ml-3 text-gray-800">Coisa</Text>
              <Feather name="chevron-right" size={20} color="#1A7DB8" />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Minhas Avaliações */}
      <View className="mt-8 mx-4 mb-8">
        <Text className="text-white text-xl font-bold mb-2">Minhas Avaliações</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {[1,2].map((i) => (
            <View key={i} className="bg-white rounded-xl p-4 mr-4 w-72 shadow-md">
              <View className="flex-row items-center mb-1">
                <Text className="font-bold text-xs mr-2">Renata Silveira</Text>
                <Text className="font-bold text-xs">Local: Palácio de Cristal</Text>
              </View>
              <Text className="text-xs mb-2">★★★★★</Text>
              <Text className="text-xs text-gray-700">Já aluguei com esse locatário duas vezes e sempre foi tudo perfeito! Espaço limpo, bem organizado e sem burocracia no check-in. Voltarei mais vezes!</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
}