import React from 'react';
import { View, Text } from 'react-native';
import { SpaceDetailsGrid } from './SpaceDetailsGrid';

interface SpaceDetailsRowProps {
  aluguel: string | number;
  tipo: string;
  wifi: string;
  metragem: string;
  banheiros: string;
  capacidade: string;
  isDarkMode: boolean;
  theme: any;
  styles: any;
  onSeeMore: () => void;
}

export const SpaceDetailsRow: React.FC<SpaceDetailsRowProps> = ({
  aluguel,
  tipo,
  wifi,
  metragem,
  banheiros,
  capacidade,
  isDarkMode,
  theme,
  styles,
  onSeeMore,
}) => (
  <View style={styles.detailsRow}>
    {/* Coluna Aluguel e Tipo */}
    <View style={styles.detailsColLeft}>
      <Text style={[styles.detailsLabel, isDarkMode && { color: theme.text }]}>
        Aluguel:
      </Text>
      <View style={styles.detailsValueRow}>
        <Text style={[styles.detailsValue, isDarkMode && { color: theme.text }]}>
          {aluguel}
        </Text>
        <Text style={[styles.detailsDivider, isDarkMode && { color: theme.text }]}>
          /Hora
        </Text>
      </View>
      {/* Divisor interno */}
      <View
        style={[
          styles.detailsInnerDivider,
          isDarkMode && { backgroundColor: theme.border },
        ]}
      />
      <Text style={[styles.detailsLabel, isDarkMode && { color: theme.text }]}>
        Tipo:
      </Text>
      <Text style={[styles.detailsType, isDarkMode && { color: theme.text }]}>
        {tipo}
      </Text>
    </View>

    {/* Coluna Detalhes */}
    <SpaceDetailsGrid
      wifi={wifi}
      metragem={metragem}
      banheiros={banheiros}
      capacidade={capacidade}
      isDarkMode={isDarkMode}
      theme={theme}
      styles={styles}
      onSeeMore={onSeeMore}
    />
  </View>
);