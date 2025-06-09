import { View, FlatList } from "react-native";
import SearchBar from "../components/searchBar";
import { CardList } from "../components/cardList";
import Card from "../components/card";
import PromoCard from "../components/promoCard";
import { useCards } from "../hooks/useCards";
import { homeStyles as styles } from '../styles/homeStyles';
import { useTheme } from '../contexts/ThemeContext';

// Função para mapear os dados da API para o formato esperado pelo Card
function mapCard(item: any) {
  // Trata o campo location que pode vir como objeto
  const location = typeof item.location === 'object' && item.location !== null
    ? item.location.formatted_address || 'Endereço não disponível'
    : item.location || 'Endereço não disponível';

  return {
    _id: item._id,
    image_url: item.image_url || [],
    space_name: item.space_name || 'Sem nome',
    location,
    price_per_hour: item.price_per_hour || 0,
    space_description: item.space_description || '',
    space_amenities: item.space_amenities || [],
    space_type: item.space_type || '',
    max_people: item.max_people || 0,
    week_days: item.week_days || [],
    opening_time: item.opening_time || '',
    closing_time: item.closing_time || '',
    space_rules: item.space_rules || [],
    owner_name: item.owner_name || '',
    owner_phone: item.owner_phone || '',
    owner_email: item.owner_email || ''
  };
}

export default function Home() {
  const { cards, loading } = useCards();
  const { theme, isDarkMode } = useTheme();

  const renderCard = (item: any) => {
    // Se for promo, adapte conforme necessário
    if ('originalPrice' in item && 'discount' in item) {
      return (
        <PromoCard 
          id={item.id}
          images={item.images}
          title={item.title}
          address={item.address}
          price={item.price}
          originalPrice={item.originalPrice}
          rating={item.rating}
          reviews={item.reviews}
          discount={item.discount}
        />
      );
    }

    return (
      <Card 
        {...item}
      />
    );
  };

  const sections = [
    {
      id: 'featured',
      title: 'Espaços em Destaque',
      data: cards.map(mapCard),
      type: 'featured'
    },
    {
      id: 'promo',
      title: 'Promoções Imperdíveis',
      subtitle: 'Descontos exclusivos por tempo limitado',
      data: cards.map(mapCard),
      type: 'promo'
    },
  ];

  const renderSection = ({ item }: { item: any }) => (
    <CardList
      key={item.id}
      data={item.data}
      renderCard={renderCard}
      title={item.title}
      subtitle={item.subtitle}
    />
  );

  return (
    <View style={[styles.container, isDarkMode && { backgroundColor: theme.background }]}>
      <SearchBar />
      <FlatList
        data={sections}
        keyExtractor={(item) => item.id}
        renderItem={renderSection}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      />
    </View>
  );
}