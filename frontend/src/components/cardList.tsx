import React from 'react';
import { View, FlatList, ViewStyle, Text } from 'react-native';
import { CARD_WIDTH } from '../styles/homeStyles';
import { pageTexts } from '../styles/globalStyles/pageTexts';
import { useTheme } from '../contexts/ThemeContext';

interface CardListProps<T> {
  data: T[];
  renderCard: (item: T) => React.ReactElement;
  title?: string;
  subtitle?: string;
  horizontal?: boolean;
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
  ListEmptyComponent?: React.ComponentType<any> | React.ReactElement | null;
}

export const CardList = <T extends { id?: string | number; _id?: string | number }>({
  data,
  renderCard,
  title,
  subtitle,
  horizontal = true,
  style,
  contentContainerStyle,
  ListEmptyComponent,
}: CardListProps<T>) => {
  const { theme } = useTheme();

  // Garante que data é sempre um array e que os itens possuem id ou _id
  const safeData = Array.isArray(data) ? data : [];

  const renderItem = ({ item }: { item: T }) => (
    <View key={String(item.id ?? item._id)} style={{ marginHorizontal: 8 }}>
      {renderCard(item)}
    </View>
  );

  // Debug: veja o que está chegando
  // Remova depois de testar!
  console.log('CardList data:', safeData);

  return (
    <View style={style}>
      {title && <Text style={[pageTexts.titleCardList, { color: theme.text }]}>{title}</Text>}
      {subtitle && <Text style={[pageTexts.subtitleCardList, { color: theme.text }]}>{subtitle}</Text>}

      <FlatList
        data={safeData}
        keyExtractor={item => String(item.id ?? item._id ?? Math.random())}
        horizontal={horizontal}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[
          horizontal ? { paddingHorizontal: 8 } : {},
          contentContainerStyle,
        ]}
        snapToInterval={horizontal ? CARD_WIDTH + 16 : undefined}
        snapToAlignment={horizontal ? 'center' : undefined}
        decelerationRate="fast"
        renderItem={renderItem}
        ListEmptyComponent={ListEmptyComponent}
      />
    </View>
  );
};