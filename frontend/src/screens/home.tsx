import { View, FlatList } from "react-native";
import SearchBar from "../components/searchBar";
import { CardList } from "../components/cardList";
import Card from "../components/card";
import PromoCard from "../components/promoCard";
import { useCards } from "../hooks/useCards";
import { homeStyles as styles } from '../styles/homeStyles';
import { BaseCard, PromoCard as PromoCardType } from "../types/card";

export default function Home() {
  const { cards: featuredCards } = useCards('featured');
  const { cards: promoCards } = useCards('promo');
  const { cards: quadraCards } = useCards('quadra');
  const { cards: auditorioCards } = useCards('auditorio');
  const { cards: eventSpaceCards } = useCards('eventSpace');

  const renderFeaturedCard = (item: BaseCard) => (
    <Card 
      images={item.images}
      title={item.title}
      address={item.address}
      price={item.price}
      rating={item.rating}
      reviews={item.reviews}
    />
  );

  const renderPromoCard = (item: PromoCardType) => (
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
          <>
            <CardList<BaseCard>
              data={featuredCards as BaseCard[]}
              renderCard={renderFeaturedCard}
              title="Espaços em Destaque"
            />

            <CardList<PromoCardType>
              data={promoCards as PromoCardType[]}
              renderCard={renderPromoCard}
              title="Promoções Imperdíveis"
              subtitle="Descontos exclusivos por tempo limitado"
            />

            <CardList<BaseCard>
              data={quadraCards as BaseCard[]}
              renderCard={renderFeaturedCard}
              title="As melhores quadras"
            />

            <CardList<BaseCard>
              data={auditorioCards as BaseCard[]}
              renderCard={renderFeaturedCard}
              title="Os auditórios mais qualificados"
            />

            <CardList<BaseCard>
              data={eventSpaceCards as BaseCard[]}
              renderCard={renderFeaturedCard}
              title="Espaços para eventos"
            />
          </>
        )}
      />
    </View>
  );
}