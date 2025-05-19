import { View, FlatList, ViewStyle, Text } from 'react-native';
import { CardType } from '../types/card';
import { CARD_WIDTH } from '../styles/homeStyles';
import { pageTexts } from '../styles/globalStyles/pageTexts';

interface CardListProps<T extends CardType> {
  data: T[];
  renderCard: (item: T) => React.ReactElement;
  title?: string;
  subtitle?: string;
  horizontal?: boolean;
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
  ListEmptyComponent?: React.ComponentType<any> | React.ReactElement | null;
}

export const CardList = <T extends CardType>({data, renderCard, title, subtitle, horizontal = true, style, contentContainerStyle, ListEmptyComponent }: CardListProps<T>) => {
  const renderItem = ({ item }: { item: T }) => (
    <View style={{ marginHorizontal: 8 }}>
      {renderCard(item)}
    </View>
  );

  return (
    <View style={style}>
      {title && <Text style={ pageTexts.titleCardList }>{title}</Text>}
      {subtitle && <Text style={pageTexts.subtitleCardList}>{subtitle}</Text>}
      
      <FlatList
        data={data}
        keyExtractor={item => item.id}
        horizontal={horizontal}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[
          horizontal ? { paddingHorizontal: 8 } : {},
          contentContainerStyle
        ]}
        snapToInterval={horizontal ? CARD_WIDTH + 16 : undefined}
        snapToAlignment={horizontal ? "center" : undefined}
        decelerationRate="fast"
        renderItem={renderItem}
        ListEmptyComponent={ListEmptyComponent}
      />
    </View>
  );
}; 