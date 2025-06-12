import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { homeStyles as styles } from '../styles/homeStyles';
import { assessmentService } from '../services/assessmentService';
import { useAuth } from '../contexts/AuthContext';

interface Space {
  _id: string;
  space_name: string;
}

interface Assessment {
  _id: string;
  score: number;
  comment: string;
  evaluation_date: string;
  userID: string;
  spaceID: Space;
}

export default function MyReviews() {
  const { theme, isDarkMode } = useTheme();
  const { user } = useAuth();
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAllAssessments = async () => {
    try {
      let allAssessments: Assessment[] = [];
      let currentPage = 1;
      let hasNextPage = true;

      while (hasNextPage) {
        const response = await assessmentService.getAssessmentsByUser(user?.id, currentPage);
        allAssessments = [...allAssessments, ...response.assessments];
        hasNextPage = response.pagination.hasNextPage;
        currentPage++;
      }

      setAssessments(allAssessments);
    } catch (error) {
      console.error('Erro ao buscar avaliações:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAllAssessments();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchAllAssessments();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const renderReview = ({ item }: { item: Assessment }) => (
    <View style={[localStyles.reviewCard, isDarkMode && { backgroundColor: theme.card }]}>
      <Text style={[localStyles.spaceName, isDarkMode && { color: theme.text }]}>
        {item.spaceID.space_name}
      </Text>
      <View style={localStyles.ratingContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Text
            key={star}
            style={[
              localStyles.star,
              star <= item.score ? localStyles.starFilled : localStyles.starEmpty,
              isDarkMode && { color: theme.text }
            ]}
          >
            ★
          </Text>
        ))}
      </View>
      <Text style={[localStyles.comment, isDarkMode && { color: theme.text }]}>{item.comment}</Text>
      <Text style={[localStyles.date, isDarkMode && { color: theme.text }]}>
        {formatDate(item.evaluation_date)}
      </Text>
    </View>
  );

  if (loading && !refreshing) {
    return (
      <View style={[styles.container, localStyles.loadingContainer, isDarkMode && { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.blue} />
      </View>
    );
  }

  return (
    <View style={[styles.container, isDarkMode && { backgroundColor: theme.background }]}>
      <FlatList
        data={assessments}
        keyExtractor={(item) => item._id}
        renderItem={renderReview}
        contentContainerStyle={localStyles.listContainer}
        showsVerticalScrollIndicator={false}
        onRefresh={handleRefresh}
        refreshing={refreshing}
        ListEmptyComponent={
          <Text style={[localStyles.emptyText, isDarkMode && { color: theme.text }]}>
            Nenhuma avaliação encontrada
          </Text>
        }
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
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 20,
  },
}); 