import React from 'react';
import { ScrollView, View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '~/styles/globalStyles/colors';

interface SpaceDetailsScrollProps {
  spaceDetails: {
    capacity: string;
    hasWifi: boolean;
  };
  space: {
    amenities?: string[];
  };
  isDarkMode: boolean;
  theme: any;
  styles: any;
}

export const SpaceDetailsScroll: React.FC<SpaceDetailsScrollProps> = ({
  spaceDetails,
  isDarkMode,
  theme,
  styles,
}) => (
  <ScrollView
    style={styles.detailsModalScrollView}
    contentContainerStyle={styles.detailsModalContent}
    showsVerticalScrollIndicator={false}
  >
    {/* Informações Básicas */}
    <View style={styles.detailsModalGrid}>
      {[
        { icon: 'groups', label: 'Capacidade', value: spaceDetails.capacity },
        { icon: 'wifi', label: 'WiFi', value: spaceDetails.hasWifi ? 'Sim' : 'Não' },
      ].map((item, index) => (
        <View
          key={index}
          style={[
            styles.detailsModalGridItem,
            isDarkMode && {
              backgroundColor: theme.background,
              borderColor: theme.border,
            },
          ]}
        >
          <View
            style={[
              styles.detailsModalIconContainer,
              isDarkMode && {
                backgroundColor: theme.card,
                borderColor: theme.border,
                borderWidth: 1,
              },
            ]}
          >
            <MaterialIcons
              name={item.icon as any}
              size={24}
              color={isDarkMode ? theme.blue : colors.blue}
            />
          </View>
          <Text
            style={[
              styles.detailsModalGridLabel,
              isDarkMode && { color: theme.text },
            ]}
          >
            {item.label}
          </Text>
          <Text
            style={[
              styles.detailsModalGridValue,
              isDarkMode && { color: theme.text },
            ]}
          >
            {item.value}
          </Text>
        </View>
      ))}
    </View>
  </ScrollView>
);