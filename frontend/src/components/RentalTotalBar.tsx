import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '~/styles/globalStyles/colors';

interface RentalTotalBarProps {
  isDarkMode: boolean;
  theme: any;
  styles: any;
  calcularTotal: () => string | number;
  handleRent: () => void;
  isLoading: boolean;
}

export const RentalTotalBar: React.FC<RentalTotalBarProps> = ({
  isDarkMode,
  theme,
  styles,
  calcularTotal,
  handleRent,
  isLoading,
}) => (
  <View style={styles.rentalTotalContainer}>
    <View style={styles.rentalTotalInfo}>
      <Text style={[styles.rentalTotalLabel, isDarkMode && { color: theme.text }]}>
        Valor Total
      </Text>
      <Text style={[styles.rentalTotalValue, isDarkMode && { color: theme.text }]}>
        {calcularTotal()}
      </Text>
    </View>
    <TouchableOpacity
      style={[
        styles.rentalButton,
        isDarkMode && {
          backgroundColor: theme.blue,
          borderColor: theme.border,
          borderWidth: 1,
        },
      ]}
      onPress={handleRent}
      disabled={isLoading}
    >
      <MaterialIcons
        name="check-circle"
        size={20}
        color={colors.white}
        style={{ marginRight: 8 }}
      />
      <Text style={styles.rentalButtonText}>
        {isLoading ? 'Processando...' : 'Alugar'}
      </Text>
    </TouchableOpacity>
  </View>
);