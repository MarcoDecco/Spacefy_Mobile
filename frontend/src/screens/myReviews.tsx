import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { homeStyles as styles } from '../styles/homeStyles';

export default function MyReviews() {
  const { theme, isDarkMode } = useTheme();

  // Dados simulados de avaliações
  const reviews = [
    {
      id: '1',
      spaceName: 'Casa na Praia',
      rating: 5,
      comment: 'Excelente espaço! Superou todas as expectativas.',
      date: '15/06/2024'
    },
    {
      id: '2',
      spaceName: 'Sala de Reuniões',
      rating: 4,
      comment: 'Bom espaço, mas poderia ter mais equipamentos.',
      date: '20/06/2024'
    }
  ];

  const renderReview = ({ item }: { item: typeof reviews[0] }) => (
    <View style={[localStyles.reviewCard, isDarkMode && { backgroundColor: theme.card }]}>
      <Text style={[localStyles.spaceName, isDarkMode && { color: theme.text }]}>{item.spaceName}</Text>
      <View style={localStyles.ratingContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Text
            key={star}
            style={[
              localStyles.star,
              star <= item.rating ? localStyles.starFilled : localStyles.starEmpty,
              isDarkMode && { color: theme.text }
            ]}
          >
            ★
          </Text>
        ))}
      </View>
      <Text style={[localStyles.comment, isDarkMode && { color: theme.text }]}>{item.comment}</Text>
      <Text style={[localStyles.date, isDarkMode && { color: theme.text }]}>{item.date}</Text>
    </View>
  );

  return (
    <View style={[styles.container, isDarkMode && { backgroundColor: theme.background }]}>
      <FlatList
        data={reviews}
        keyExtractor={(item) => item.id}
        renderItem={renderReview}
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
  reviewCard: {
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
  ratingContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  star: {
    fontSize: 20,
    marginRight: 4,
  },
  starFilled: {
    color: '#FFD700',
  },
  starEmpty: {
    color: '#E0E0E0',
  },
  comment: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
}); 