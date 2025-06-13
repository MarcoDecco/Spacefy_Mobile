import React, { useState } from 'react';
import { View, FlatList, ViewStyle, Text, Dimensions } from 'react-native';
import { CARD_WIDTH } from '../styles/homeStyles';
import { pageTexts } from '../styles/globalStyles/pageTexts';
import { useTheme } from '../contexts/ThemeContext';

const { width: windowWidth } = Dimensions.get('window');
const CARD_MARGIN = 8;
const CARD_TOTAL_WIDTH = CARD_WIDTH + (CARD_MARGIN * 2);

interface CardListProps<T> {
  data: T[];
  renderCard: (item: T & { isSelected?: boolean }) => React.ReactElement;
  title?: string;
  subtitle?: string;
  horizontal?: boolean;
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
  ListEmptyComponent?: React.ComponentType<any> | React.ReactElement | null;
}

export const CardList = <T extends { id?: string | number; _id?: string | number }>(
  {
    data,
    renderCard,
    title,
    subtitle,
    horizontal = true,
    style,
    contentContainerStyle,
    ListEmptyComponent,
  }: CardListProps<T>
) => {
  const { theme } = useTheme();
  const [selectedCardIndex, setSelectedCardIndex] = useState(0);

  const safeData = Array.isArray(data) ? data : [];

  const renderItem = ({ item, index }: { item: T; index: number }) => (
    <View
      key={String(item.id ?? item._id)}
      style={{
        marginHorizontal: CARD_MARGIN,
        alignItems: 'center',
        width: CARD_WIDTH
      }}
    >
      {renderCard({ ...item, isSelected: index === selectedCardIndex })}
    </View>
  );

  return (
    <View style={[style, { alignItems: 'center' }]}>
      {title && (
        <Text style={[
          pageTexts.titleCardList,
          {
            color: theme.text,
            textAlign: 'center',
            marginBottom: 8
          }
        ]}>
          {title}
        </Text>
      )}
      {subtitle && (
        <Text style={[
          pageTexts.subtitleCardList,
          {
            color: theme.text,
            textAlign: 'center',
            marginBottom: 16
          }
        ]}>
          {subtitle}
        </Text>
      )}

      <FlatList
        data={safeData}
        keyExtractor={item => String(item.id ?? item._id ?? Math.random())}
        horizontal={horizontal}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[
          horizontal ? {
            paddingHorizontal: (windowWidth - CARD_TOTAL_WIDTH) / 2,
            alignItems: 'center'
          } : {
            paddingHorizontal: 16,
            alignItems: 'center'
          },
          contentContainerStyle,
        ]}
        snapToInterval={horizontal ? CARD_TOTAL_WIDTH : undefined}
        snapToAlignment="center"
        decelerationRate="fast"
        renderItem={renderItem}
        ListEmptyComponent={ListEmptyComponent}
        onMomentumScrollEnd={e => {
          const index = Math.round(e.nativeEvent.contentOffset.x / CARD_TOTAL_WIDTH);
          setSelectedCardIndex(index);
        }}
      />
    </View>
  );
};