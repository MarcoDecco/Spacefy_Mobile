import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Image, Alert, SafeAreaView } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { homeStyles as styles } from '../styles/homeStyles';
import { rentalService } from '../services/rentalService';
import { useAuth } from '../contexts/AuthContext';
import { RentalSpace } from '../types/card';
import { colors } from '../styles/globalStyles/colors';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';

type NavigationPropType = NavigationProp<RootStackParamList>;

export default function MyReservations() {
  const { theme, isDarkMode } = useTheme();
  const { user } = useAuth();
  const navigation = useNavigation<NavigationPropType>();
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
    <TouchableOpacity 
      style={[localStyles.reservationCard, isDarkMode && { backgroundColor: theme.card }]}
      onPress={() => navigation.navigate('SpaceDetails', {
        space: {
          id: item.space._id,
          images: item.space.image_url,
          title: item.space.space_name,
          address: item.space.location.formatted_address,
          price: String(item.value),
          rating: 0,
          reviews: 0,
          capacity: '10'
        }
      })}
    >
      <View style={localStyles.reservationHeader}>
        <View style={localStyles.reservationStatus}>
          <View style={[
            localStyles.statusDot, 
            { backgroundColor: colors.blue }
          ]} />
          <Text style={[
            localStyles.statusText,
            isDarkMode && { color: theme.text }
          ]}>
            Confirmado
          </Text>
        </View>
        <Text style={[localStyles.reservationDate, isDarkMode && { color: theme.text }]}>
          {new Date(item.createdAt).toLocaleDateString('pt-BR')}
        </Text>
      </View>

      <View style={localStyles.spaceInfo}>
        <Image 
          source={{ uri: item.space.image_url[0] }} 
          style={localStyles.spaceImage}
        />
        <View style={localStyles.spaceDetails}>
          <Text style={[localStyles.spaceName, isDarkMode && { color: theme.text }]} numberOfLines={1}>
            {item.space.space_name}
          </Text>
          <Text style={[localStyles.spaceAddress, isDarkMode && { color: theme.text }]} numberOfLines={1}>
            {item.space.location.formatted_address}
          </Text>
          <View style={localStyles.spaceRating}>
            <Ionicons name="star" size={16} color={colors.dark_yellow} />
            <Text style={[localStyles.ratingText, isDarkMode && { color: theme.text }]}>
              0.0 (0 avaliações)
            </Text>
          </View>
        </View>
      </View>

      <View style={localStyles.reservationDetails}>
        <View style={localStyles.detailItem}>
          <Ionicons name="calendar-outline" size={20} color={colors.blue} />
          <Text style={[localStyles.detailText, isDarkMode && { color: theme.text }]}>
            {formatDate(item.start_date)}
          </Text>
        </View>
        <View style={localStyles.detailItem}>
          <Ionicons name="time-outline" size={20} color={colors.blue} />
          <Text style={[localStyles.detailText, isDarkMode && { color: theme.text }]}>
            {item.startTime} - {item.endTime}
          </Text>
        </View>
        <View style={localStyles.detailItem}>
          <Ionicons name="cash-outline" size={20} color={colors.blue} />
          <Text style={[localStyles.detailText, isDarkMode && { color: theme.text }]}>
            R$ {item.value.toFixed(2)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={[styles.container, localStyles.centerContent, isDarkMode && { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={colors.blue} />
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
    <SafeAreaView style={[styles.container, isDarkMode && { backgroundColor: theme.background }]}>
      <View style={[localStyles.header, isDarkMode && { backgroundColor: theme.background }]}>
        <TouchableOpacity 
          style={localStyles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Ionicons 
            name="arrow-back" 
            size={24} 
            color={isDarkMode ? theme.text : colors.black} 
          />
        </TouchableOpacity>
        <Text style={[localStyles.headerTitle, isDarkMode && { color: theme.text }]}>
          Minhas Reservas
        </Text>
        <View style={localStyles.rightPlaceholder} />
      </View>

      <FlatList
        data={reservations}
        keyExtractor={(item) => item._id}
        renderItem={renderReservation}
        contentContainerStyle={localStyles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={localStyles.emptyContainer}>
            <Ionicons name="calendar-outline" size={64} color={colors.blue} style={localStyles.emptyIcon} />
            <Text style={[localStyles.emptyTitle, isDarkMode && { color: theme.text }]}>
              Nenhuma reserva encontrada
            </Text>
            <Text style={[localStyles.emptyText, isDarkMode && { color: theme.text }]}>
              Você ainda não possui reservas ativas. Explore os espaços disponíveis e faça sua primeira reserva!
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
    backgroundColor: colors.white,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.black,
  },
  rightPlaceholder: {
    width: 40,
  },
  listContainer: {
    padding: 16,
  },
  reservationCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  reservationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  reservationStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  statusText: {
    color: colors.blue,
    fontSize: 12,
    fontWeight: '600',
  },
  reservationDate: {
    color: colors.gray,
    fontSize: 14,
  },
  spaceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spaceImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 16,
  },
  spaceDetails: {
    flex: 1,
  },
  spaceName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: colors.black,
  },
  spaceAddress: {
    fontSize: 14,
    color: colors.gray,
    marginBottom: 4,
  },
  spaceRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    color: colors.gray,
    marginLeft: 8,
  },
  reservationDetails: {
    borderTopWidth: 1,
    borderTopColor: colors.line,
    paddingTop: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  detailText: {
    fontSize: 14,
    color: colors.black,
    fontWeight: '500',
    marginLeft: 8,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: colors.error,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 24,
  },
  emptyIcon: {
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.black,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: colors.gray,
    textAlign: 'center',
    lineHeight: 24,
  },
}); 