import { View, Text, FlatList } from "react-native";
import { CardList } from "../components/cardList";
import Card from "../components/card";
import { useCards } from "../hooks/useCards";
import { BaseCard } from "../types/card";
import { homeStyles as styles } from '../styles/homeStyles';
import SearchBar from "../components/searchBar";
import { pageTexts } from '../styles/globalStyles/pageTexts';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

export default function Rented() {
  const { cards: rentedCards, loading } = useCards('rented');
  const { theme } = useTheme();
  const { user } = useAuth();

  const renderCard = (item: BaseCard) => (
    <Card
      id={item.id}
      images={item.image_url.map(url => ({ uri: url }))}
      title={item.space_name}
      address={typeof item.location === 'object' ? item.location.formatted_address : item.location}
      price={item.price_per_hour.toString()}
      rating={0}
      reviews={0}
    />
  );

  const EmptyComponent = () => (
    <View style={{ 
      flex: 1, 
      justifyContent: 'center', 
      alignItems: 'center', 
      paddingTop: 50,
      paddingHorizontal: 20
    }}>
      {!user ? (
        <>
          <Text style={[pageTexts.title, { 
            textAlign: 'center', 
            color: theme.text,
            fontSize: 24,
            marginBottom: 16
          }]}>
            Faça login para ver seus aluguéis
          </Text>
          <Text style={[pageTexts.title, { 
            textAlign: 'center', 
            color: theme.text,
            fontSize: 16,
            opacity: 0.7,
            lineHeight: 24
          }]}>
            Entre com sua conta para ver os espaços que você alugou.
          </Text>
        </>
      ) : (
        <>
          <Text style={[pageTexts.title, { 
            textAlign: 'center', 
            color: theme.text,
            fontSize: 24,
            marginBottom: 16
          }]}>
            Nenhum espaço alugado ainda
          </Text>
          <Text style={[pageTexts.title, { 
            textAlign: 'center', 
            color: theme.text,
            fontSize: 16,
            opacity: 0.7,
            lineHeight: 24
          }]}>
            Explore os espaços disponíveis e faça seu primeiro aluguel para ver seus espaços alugados aqui.
          </Text>
        </>
      )}
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <SearchBar />
      <CardList
        data={user ? (rentedCards || []) : []}
        renderCard={renderCard}
        title="Meus Aluguéis"
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
    </View>
  );
}