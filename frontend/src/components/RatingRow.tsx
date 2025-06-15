import React from 'react';
import { View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '~/styles/globalStyles/colors';

interface RatingRowProps {
  rating: number;
  reviews: number;
  isDarkMode: boolean;
  theme: any;
  styles: any;
}

export const RatingRow: React.FC<RatingRowProps> = ({
  rating,
  reviews,
  isDarkMode,
  theme,
  styles,
}) => (
  <View style={styles.headerRatingRow}>
    {[1, 2, 3, 4, 5].map((i) => (
      <MaterialIcons
        key={i}
        name={i <= Math.round(rating) ? 'star' : 'star-border'}
        size={22}
        color={isDarkMode ? theme.text : colors.black}
      />
    ))}
    <Text style={[styles.headerReviews, isDarkMode && { color: theme.text }]}>
      ({reviews})
    </Text>
  </View>
);