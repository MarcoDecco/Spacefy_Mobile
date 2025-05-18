import { View, Text, FlatList } from "react-native";
import { CardList } from "../components/cardList";
import Card from "../components/card";
import { useCards } from "../hooks/useCards";
import { BaseCard } from "../types/card";
import { homeStyles as styles } from '../styles/homeStyles';
import SearchBar from "../components/searchBar";
import { pageTexts } from '../styles/globalStyles/pageTexts';

export default function Favorites() {
  const { cards: favoriteCards, loading } = useCards('favorites');

  const renderCard = (item: BaseCard) => (
    <Card 
      images={item.images}
      title={item.title}
      address={item.address}
      price={item.price}
      rating={item.rating}
      reviews={item.reviews}
    />
  );

  const EmptyComponent = () => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 50 }}>
      <Text style={[pageTexts.subtitle, { textAlign: 'center' }]}>
        Você ainda não tem espaços favoritos.
      </Text>
      <Text style={[pageTexts.subtitle, { textAlign: 'center', marginTop: 8 }]}>
        Explore os espaços disponíveis e adicione seus favoritos!
      </Text>
    </View>
  );

  return (
    <View style={styles.Container}>
      <SearchBar />
      <FlatList
        data={[1]}
        keyExtractor={() => '1'}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 130 }}
        renderItem={() => (
          <CardList
            data={favoriteCards}
            renderCard={renderCard}
            title="Meus Favoritos"
            horizontal={false}
            style={{ alignItems: 'center' }}
            contentContainerStyle={{ 
              padding: 16,
              width: '100%',
              maxWidth: 400,
              alignSelf: 'center'
            }}
            ListEmptyComponent={loading ? null : EmptyComponent}
          />
        )}
      />
    </View>
  );
}