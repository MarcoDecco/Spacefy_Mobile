import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '~/styles/globalStyles/colors';

interface SpaceHeaderProps {
  title: string;
  address: string;
  isFavorite: boolean;
  onFavoritePress: () => void;
  theme: any;
  isDarkMode: boolean;
  styles: any;
}

export const SpaceHeader: React.FC<SpaceHeaderProps> = ({
  title,
  address,
  isFavorite,
  onFavoritePress,
  theme,
  isDarkMode,
  styles,
}) => (
  <View style={styles.headerRow}>
    <View style={styles.headerInfo}>
      <Text style={[styles.title, isDarkMode && { color: theme.text }]}>
        {title}
      </Text>
      <TouchableOpacity
        onPress={() => {
          const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
          // @ts-ignore
          if (typeof window !== 'undefined') {
            window.open(url, '_blank');
          } else {
            import('react-native').then(({ Linking }) => Linking.openURL(url));
          }
        }}
      >
        <Text style={[styles.headerAddress, isDarkMode && { color: theme.blue }]}>
          {address}
        </Text>
      </TouchableOpacity>
    </View>
    <TouchableOpacity onPress={onFavoritePress}>
      <MaterialIcons
        name={isFavorite ? 'favorite' : 'favorite-border'}
        color={isFavorite ? colors.blue : colors.gray}
        size={25}
      />
    </TouchableOpacity>
  </View>
);