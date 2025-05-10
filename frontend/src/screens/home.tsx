import React from 'react';
import { ScrollView, View, Text, FlatList } from "react-native";
import SearchBar from "../components/SearchBar";
import Card from "../components/Card";
import PromoCard from "../components/PromoCard";
import { homeStyles as styles, CARD_WIDTH } from '../styles/home.styles';
import Constants from 'expo-constants';

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
    <View style={styles.mainContainer}>
      <SearchBar />
      <ScrollView 
        style={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.scrollContent}>
          {/* Seção Destaques */}
          <View style={[styles.sectionHeader, { marginTop: 20, marginBottom: 16 }]}>
            <Text style={styles.sectionTitle}>Espaços em Destaque</Text>
          </View>
          
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

          {/* Seção Promoções */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Promoções Imperdíveis</Text>
            <Text style={styles.sectionSubtitle}>Descontos exclusivos por tempo limitado</Text>
          </View>
          
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
          <View style={styles.bottomSpace} />
        </View>
      </ScrollView>
    </View>
  );
}