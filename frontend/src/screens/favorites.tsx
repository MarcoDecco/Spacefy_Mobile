import { View, Text, FlatList } from "react-native";
import { CardList } from "../components/cardList";
import Card from "../components/card";
import { useCards } from "../hooks/useCards";
import { BaseCard } from "../types/card";
import { homeStyles as styles } from '../styles/homeStyles';
import SearchBar from "../components/searchBar";
import { pageTexts } from '../styles/globalStyles/pageTexts';
import { useTheme } from '../contexts/ThemeContext';

export default function Favorites() {
  const { cards: favoriteCards, loading } = useCards('favorites');
  const { theme } = useTheme();

  const renderCard = (item: BaseCard) => (
    <Card 
      id={item.id}
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
      <Text style={[pageTexts.title, { textAlign: 'center', color: theme.text }]}>
        Você ainda não tem espaços favoritos.
      </Text>
      <Text style={[pageTexts.title, { textAlign: 'center', marginTop: 8, color: theme.text }]}>
        Explore os espaços disponíveis e adicione seus favoritos!
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
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