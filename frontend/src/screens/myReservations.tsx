import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { homeStyles as styles } from '../styles/homeStyles';

export default function MyReservations() {
  const { theme, isDarkMode } = useTheme();

  // Dados simulados de reservas
  const reservations = [
    {
      id: '1',
      spaceName: 'Casa na Praia',
      date: '15/06/2024',
      time: '14:00 - 18:00',
      status: 'confirmada',
      price: 'R$ 200,00'
    },
    {
      id: '2',
      spaceName: 'Sala de Reuniões',
      date: '20/06/2024',
      time: '09:00 - 12:00',
      status: 'pendente',
      price: 'R$ 150,00'
    }
  ];

  const renderReservation = ({ item }: { item: typeof reservations[0] }) => (
    <View style={[localStyles.reservationCard, isDarkMode && { backgroundColor: theme.card }]}>
      <Text style={[localStyles.spaceName, isDarkMode && { color: theme.text }]}>{item.spaceName}</Text>
      <View style={localStyles.detailsContainer}>
        <View style={localStyles.detailRow}>
          <Text style={[localStyles.detailLabel, isDarkMode && { color: theme.text }]}>Data:</Text>
          <Text style={[localStyles.detailValue, isDarkMode && { color: theme.text }]}>{item.date}</Text>
        </View>
        <View style={localStyles.detailRow}>
          <Text style={[localStyles.detailLabel, isDarkMode && { color: theme.text }]}>Horário:</Text>
          <Text style={[localStyles.detailValue, isDarkMode && { color: theme.text }]}>{item.time}</Text>
        </View>
        <View style={localStyles.detailRow}>
          <Text style={[localStyles.detailLabel, isDarkMode && { color: theme.text }]}>Valor:</Text>
          <Text style={[localStyles.detailValue, isDarkMode && { color: theme.text }]}>{item.price}</Text>
        </View>
      </View>
      <View style={[
        localStyles.statusContainer,
        { backgroundColor: item.status === 'confirmada' ? '#4CAF50' : '#FFC107' }
      ]}>
        <Text style={localStyles.statusText}>
          {item.status === 'confirmada' ? 'Confirmada' : 'Pendente'}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, isDarkMode && { backgroundColor: theme.background }]}>
      <FlatList
        data={reservations}
        keyExtractor={(item) => item.id}
        renderItem={renderReservation}
        contentContainerStyle={localStyles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const localStyles = StyleSheet.create({
  listContainer: {
    padding: 16,
  },
  reservationCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  spaceName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  detailsContainer: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  statusContainer: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
}); 