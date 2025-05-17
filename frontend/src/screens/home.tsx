import React from 'react';
import { View, Text, FlatList } from "react-native";
import SearchBar from "../components/searchBar";
import Card from "../components/card";
import PromoCard from "../components/promoCard";
import { homeStyles as styles, CARD_WIDTH } from '../styles/home.styles';
import { pageTexts } from '../styles/globalStyles/pageTexts';

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

  // Dados dos cards em promoção
  const promoCards = [
    {
      id: '1',
      images: [require('../../assets/espaco.jpg'), require('../../assets/espaco.jpg')],
      title: 'Espaço Luxuoso, São Paulo',
      address: 'Av. Brigadeiro Faria Lima, 1500',
      price: 'R$ 2.800',
      originalPrice: 'R$ 3.500',
      rating: 4.9,
      reviews: 45,
      discount: '-20%'
    },
    {
      id: '2',
      images: [require('../../assets/espaco.jpg')],
      title: 'Salão Moderno, Rio de Janeiro',
      address: 'Rua Visconde de Pirajá, 500',
      price: 'R$ 1.900',
      originalPrice: 'R$ 2.400',
      rating: 4.7,
      reviews: 28,
      discount: '-15%'
    },
    {
      id: '3',
      images: [require('../../assets/espaco.jpg'), require('../../assets/espaco.jpg')],
      title: 'Espaço Premium, Belo Horizonte',
      address: 'Av. Afonso Pena, 1000',
      price: 'R$ 2.200',
      originalPrice: 'R$ 2.800',
      rating: 4.8,
      reviews: 32,
      discount: '-25%'
    }
  ];

  const renderFeaturedSection = () => (
    <View>
      <Text style={pageTexts.title}>Espaços em Destaque</Text>
      <FlatList
        data={featuredCards}
        keyExtractor={item => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalScroll}
        snapToInterval={CARD_WIDTH + 16}
        snapToAlignment="center"
        decelerationRate="fast"
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}>
            <Card 
              images={item.images}
              title={item.title}
              address={item.address}
              price={item.price}
              rating={item.rating}
              reviews={item.reviews}
            />
          </View>
        )}
      />
    </View>
  );

  const renderPromoSection = () => (
    <View>
      <Text style={pageTexts.title}>Promoções Imperdíveis</Text>
      <Text style={pageTexts.subtitle}>Descontos exclusivos por tempo limitado</Text>
      <FlatList
        data={promoCards}
        keyExtractor={item => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalScroll}
        snapToInterval={CARD_WIDTH + 16}
        snapToAlignment="center"
        decelerationRate="fast"
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}>
            <PromoCard 
              images={item.images}
              title={item.title}
              address={item.address}
              price={item.price}
              originalPrice={item.originalPrice}
              rating={item.rating}
              reviews={item.reviews}
              discount={item.discount}
            />
          </View>
        )}
      />
    </View>
  );

  return (
    <View style={styles.Container}>
      <SearchBar />
      <FlatList
        data={[1]} // Dados fictícios pois só precisamos renderizar uma vez
        keyExtractor={() => '1'}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 130 }}
        renderItem={() => (
          <>
            {renderFeaturedSection()}
            {renderPromoSection()}

          </>
        )}
      />
    </View>
  );
}