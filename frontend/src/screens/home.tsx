import { View, FlatList } from "react-native";
import SearchBar from "../components/searchBar";
import { CardList } from "../components/cardList";
import Card from "../components/card";
import PromoCard from "../components/promoCard";
import { useCards } from "../hooks/useCards";
import { homeStyles as styles } from '../styles/homeStyles';
import { BaseCard, PromoCard as PromoCardType, CardType } from "../types/card";
import { useTheme } from '../contexts/ThemeContext';

interface Section {
  id: string;
  title: string;
  subtitle?: string;
  data: CardType[];
  type: 'featured' | 'promo' | 'quadra' | 'auditorio' | 'eventSpace';
}

export default function Home() {
  const { cards: featuredCards } = useCards('featured');
  const { cards: promoCards } = useCards('promo');
  const { cards: quadraCards } = useCards('quadra');
  const { cards: auditorioCards } = useCards('auditorio');
  const { cards: eventSpaceCards } = useCards('eventSpace');
  const { theme, isDarkMode } = useTheme();

  const renderCard = (item: CardType) => {
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
        id={item.id}
        images={item.images}
        title={item.title}
        address={item.address}
        price={item.price}
        rating={item.rating}
        reviews={item.reviews}
      />
    );
  };

  const sections: Section[] = [
    {
      id: 'featured',
      title: 'Espaços em Destaque',
      data: featuredCards as BaseCard[],
      type: 'featured'
    },
    {
      id: 'promo',
      title: 'Promoções Imperdíveis',
      subtitle: 'Descontos exclusivos por tempo limitado',
      data: promoCards as PromoCardType[],
      type: 'promo'
    },
    {
      id: 'quadra',
      title: 'As melhores quadras',
      data: quadraCards as BaseCard[],
      type: 'quadra'
    },
    {
      id: 'auditorio',
      title: 'Os auditórios mais qualificados',
      data: auditorioCards as BaseCard[],
      type: 'auditorio'
    },
    {
      id: 'eventSpace',
      title: 'Espaços para eventos',
      data: eventSpaceCards as BaseCard[],
      type: 'eventSpace'
    }
  ];

  const renderSection = ({ item }: { item: Section }) => (
    <CardList<CardType>
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