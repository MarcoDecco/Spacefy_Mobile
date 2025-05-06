//Tela de espaços favoritos
import { View, ScrollView, Dimensions, Text } from "react-native";
import SearchBar from '../components/searchBar'
import Card from '../components/card'

const { width } = Dimensions.get('window');

export default function Favorites() {
  // Dados dos cards em destaque (original inalterado)
  const featuredCards = [
    {
      id: '1',
      images: [require('../../assets/espaco.jpg'), require('../../assets/espaco.jpg'), require('../../assets/espaco.jpg')],
      title: 'Porto Belo, Muriaé - MG',
      address: 'Rua Leonídio Valentim Ferreira',
      price: 'R$ 2.000',
      rating: 4.8,
      reviews: 24
    },
  ]

  return (
    <ScrollView className="bg-gray-50">
      <SearchBar />

<View className="mx-5 mt-10 mb-4">
  <Text className="text-xl font-bold text-gray-900">Espaços Favoritos</Text>
</View>

<View className="flex-1 items-center">
  {featuredCards.map((card) => (
    <View key={card.id} style={{ width: width * 0.85}} className="justify-center">
      <Card 
        images={card.images}
        title={card.title}
        address={card.address}
        price={card.price}
        rating={card.rating}
        reviews={card.reviews}
      />
    </View>
  ))}
</View>

<View className="flex-1 items-center mt-10">
  {featuredCards.map((card) => (
    <View key={card.id} style={{ width: width * 0.85}} className="justify-center">
      <Card 
        images={card.images}
        title={card.title}
        address={card.address}
        price={card.price}
        rating={card.rating}
        reviews={card.reviews}
      />
    </View>
  ))}
</View>

<View className="flex-1 items-center mt-10">
  {featuredCards.map((card) => (
    <View key={card.id} style={{ width: width * 0.85}} className="justify-center">
      <Card 
        images={card.images}
        title={card.title}
        address={card.address}
        price={card.price}
        rating={card.rating}
        reviews={card.reviews}
      />
    </View>
  ))}
</View>

<View className="flex-1 items-center mt-10">
  {featuredCards.map((card) => (
    <View key={card.id} style={{ width: width * 0.85}} className="justify-center">
      <Card 
        images={card.images}
        title={card.title}
        address={card.address}
        price={card.price}
        rating={card.rating}
        reviews={card.reviews}
      />
    </View>
  ))}
</View>

<View className="flex-1 items-center m-10">
  {featuredCards.map((card) => (
    <View key={card.id} style={{ width: width * 0.85}} className="justify-center">
      <Card 
        images={card.images}
        title={card.title}
        address={card.address}
        price={card.price}
        rating={card.rating}
        reviews={card.reviews}
      />
    </View>
  ))}
</View>


    </ScrollView>
  );
}