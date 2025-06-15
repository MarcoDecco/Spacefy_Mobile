import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { colors } from '~/styles/globalStyles/colors';

interface SpaceDetailsGridProps {
  wifi: string;
  metragem: string;
  banheiros: string;
  capacidade: string;
  isDarkMode: boolean;
  theme: any;
  styles: any;
  onSeeMore: () => void;
}

export const SpaceDetailsGrid: React.FC<SpaceDetailsGridProps> = ({
  wifi,
  metragem,
  banheiros,
  capacidade,
  isDarkMode,
  theme,
  styles,
  onSeeMore,
}) => (
  <View style={styles.detailsColRight}>
    <Text
      style={[
        styles.detailsLabel,
        { marginBottom: 8 },
        isDarkMode && { color: theme.text },
      ]}>
      Detalhes:
    </Text>

    <View style={[styles.detailsGrid, { flexDirection: 'column', gap: 16 }]}>
      {/* Top row */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 16 }}>
        <View style={[styles.detailsGridItem, { flex: 1 }]}>
          <Feather
            name="wifi"
            size={20}
            color={isDarkMode ? theme.text : colors.gray}
            style={{ marginRight: 8 }}
          />
          <Text
            style={[
              styles.detailsInfoTextNoMargin,
              isDarkMode && { color: theme.text },
            ]}>
            {wifi}
          </Text>
        </View>

        <View style={[styles.detailsGridItem, { flex: 1 }]}>
          <MaterialIcons
            name="crop-square"
            size={20}
            color={isDarkMode ? theme.text : colors.gray}
            style={{ marginRight: 8 }}
          />
          <Text
            style={[
              styles.detailsInfoTextNoMargin,
              isDarkMode && { color: theme.text },
            ]}>
            {metragem}
          </Text>
        </View>

        <View style={[styles.detailsGridItem, { flex: 1 }]}>
          <MaterialIcons
            name="wc"
            size={20}
            color={isDarkMode ? theme.text : colors.gray}
            style={{ marginRight: 8 }}
          />
          <Text
            style={[
              styles.detailsInfoTextNoMargin,
              isDarkMode && { color: theme.text },
            ]}>
            {banheiros}
          </Text>
        </View>
      </View>

      {/* Bottom row */}
      <View style={styles.detailsGridItem}>
        <MaterialIcons
          name="groups"
          size={20}
          color={isDarkMode ? theme.text : colors.gray}
          style={{ marginRight: 8 }}
        />
        <Text
          style={[
            styles.detailsInfoTextNoMargin,
            isDarkMode && { color: theme.text },
          ]}>
          {capacidade}
        </Text>
      </View>
    </View>

    <TouchableOpacity onPress={onSeeMore}>
      <Text style={[styles.detailsMoreButton, isDarkMode && { color: theme.blue }]}>
        Ver mais
      </Text>
    </TouchableOpacity>
  </View>
);