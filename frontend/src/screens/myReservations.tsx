import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { homeStyles as styles } from '../styles/homeStyles';
import { rentalService } from '../services/rentalService';
import { useAuth } from '../contexts/AuthContext';
import { RentalSpace } from '../types/card';

export default function MyReservations() {
  const { theme, isDarkMode } = useTheme();
  const { user } = useAuth();
  const [reservations, setReservations] = useState<RentalSpace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        if (!user?.id) return;
        const data = await rentalService.getRentalsByUserID(user.id);
        setReservations(data);
      } catch (err) {
        setError('Erro ao carregar suas reservas');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [user?.id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const renderReservation = ({ item }: { item: RentalSpace }) => (
    <View style={[localStyles.reservationCard, isDarkMode && { backgroundColor: theme.card }]}>
      <Text style={[localStyles.spaceName, isDarkMode && { color: theme.text }]}>
        {item.space.space_name}
      </Text>
      <Text style={[localStyles.addressText, isDarkMode && { color: theme.text }]}>
        {item.space.location.formatted_address}
      </Text>
      <View style={localStyles.detailsContainer}>
        <View style={localStyles.detailRow}>
          <Text style={[localStyles.detailLabel, isDarkMode && { color: theme.text }]}>Data:</Text>
          <Text style={[localStyles.detailValue, isDarkMode && { color: theme.text }]}>
            {formatDate(item.start_date)}
          </Text>
        </View>
        <View style={localStyles.detailRow}>
          <Text style={[localStyles.detailLabel, isDarkMode && { color: theme.text }]}>Horário:</Text>
          <Text style={[localStyles.detailValue, isDarkMode && { color: theme.text }]}>
            {item.startTime} - {item.endTime}
          </Text>
        </View>
        <View style={localStyles.detailRow}>
          <Text style={[localStyles.detailLabel, isDarkMode && { color: theme.text }]}>Valor:</Text>
          <Text style={[localStyles.detailValue, isDarkMode && { color: theme.text }]}>
            R$ {item.value.toFixed(2)}
          </Text>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, localStyles.centerContent, isDarkMode && { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.blue} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, localStyles.centerContent, isDarkMode && { backgroundColor: theme.background }]}>
        <Text style={[localStyles.errorText, isDarkMode && { color: theme.text }]}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, isDarkMode && { backgroundColor: theme.background }]}>
      <FlatList
        data={reservations}
        keyExtractor={(item) => item._id}
        renderItem={renderReservation}
        contentContainerStyle={localStyles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={localStyles.emptyContainer}>
            <Text style={[localStyles.emptyText, isDarkMode && { color: theme.text }]}>
              Você ainda não possui reservas
            </Text>
          </View>
        }
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
    marginBottom: 8,
    color: '#333',
  },
  addressText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
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
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
}); 