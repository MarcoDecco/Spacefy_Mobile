import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { rentedStyles as styles } from '../styles/rented.styles';
import Card from '../components/Card';
import SearchBar from '../components/SearchBar';

const rentedSpaces = [
  // Exemplo de dados alugados
  {
    id: '1',
    images: [require('../../assets/espaco.jpg'), require('../../assets/espaco.jpg')],
    title: 'Porto Belo, Muriaé - MG',
    address: 'Rua Leonídio Valentim Ferreira',
    price: 'R$ 2.000',
    rating: 4.8,
    reviews: 24
  },
  {
    id: '2',
    images: [require('../../assets/espaco.jpg')],
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
  },
  // Adicione mais itens conforme necessário
];

const RentedScreen = () => {
  return (
    <View style={styles.container}>
      <SearchBar />
      <Text style={styles.title}>Alugados</Text>
      <FlatList
        data={rentedSpaces}
        keyExtractor={item => item.id}
        style={styles.list}
        contentContainerStyle={{ alignItems: 'center', paddingBottom: 40 }}
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
        ListEmptyComponent={<Text style={styles.emptyText}>Nenhum espaço alugado encontrado.</Text>}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default RentedScreen;