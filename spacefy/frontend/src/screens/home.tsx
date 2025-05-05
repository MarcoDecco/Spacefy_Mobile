import SearchBar from "../components/searchBar";
import Card from "../components/card";
import PromoCard from "../components/PromoCard";
import { ScrollView, Dimensions, View, Text } from "react-native";

const { width } = Dimensions.get('window');

export default function Home() {
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
    {
      id: '2',
      images: [require('../../assets/espaco.jpg'), require('../../assets/espaco.jpg')],
      title: 'Espaço Elegante, Rio de Janeiro',
      address: 'Av. Atlântica, 200',
      price: 'R$ 3.500',
      rating: 4.9,
      reviews: 32
    },
    {
      id: '3',
      images: [require('../../assets/espaco.jpg')],
      title: 'Salão Premium, São Paulo',
      address: 'Av. Paulista, 1000',
      price: 'R$ 4.200',
      rating: 4.7,
      reviews: 18
    }
  ];

  // Novos dados para promoções (adicionado sem alterar o existente)
  const promoCards = [
    {
      id: 'p1',
      images: [require('../../assets/espaco.jpg')],
      title: 'Espaço Verão - Promoção',
      address: 'Praia de Ipanema, 50',
      price: 'R$ 1.200',
      originalPrice: 'R$ 2.000',
      rating: 4.5,
      reviews: 15,
      discount: '40% OFF'
    },
    {
      id: 'p2',
      images: [require('../../assets/espaco.jpg')],
      title: 'Salão Primavera',
      address: 'Av. Brasil, 1000',
      price: 'R$ 1.500',
      originalPrice: 'R$ 2.500',
      rating: 4.7,
      reviews: 22,
      discount: '35% OFF'
    },
    {
      id: 'p3',
      images: [require('../../assets/espaco.jpg')],
      title: 'Galpão Criativo',
      address: 'Rua da Liberdade, 300',
      price: 'R$ 1.800',
      originalPrice: 'R$ 3.000',
      rating: 4.6,
      reviews: 19,
      discount: '40% OFF'
    }
  ];

  return (
    <ScrollView className="bg-gray-50">
      <SearchBar />
      
      {/* Seção Destaques (original inalterada) */}
      <View className="px-4 mt-4">
        <Text className="text-xl font-bold text-gray-900">Espaços em Destaque</Text>
      </View>
      
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        className="mt-4 pb-4"
      >
        {featuredCards.map((card) => (
          <View key={card.id} style={{ width: width * 0.8, marginRight: 16 }}>
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
      </ScrollView>

      {/* Nova Seção Promoções (adicionada sem conflitos) */}
      <View className="px-4 mt-4">
        <Text className="text-xl font-bold text-gray-900">Promoções Imperdíveis</Text>
        <Text className="text-sm text-gray-500">Descontos exclusivos por tempo limitado</Text>
      </View>
      
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        className="mt-4 pb-8"
      >
        {promoCards.map((card) => (
          <View key={card.id} style={{ width: width * 0.8, marginRight: 16 }}>
            <PromoCard 
              images={card.images}
              title={card.title}
              address={card.address}
              price={card.price}
              originalPrice={card.originalPrice}
              rating={card.rating}
              reviews={card.reviews}
              discount={card.discount}
            />
          </View>
        ))}
      </ScrollView>
    </ScrollView>
  );
}