import React from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '~/styles/globalStyles/colors';

interface ReviewBoxProps {
  isDarkMode: boolean;
  theme: any;
  styles: any;
  newRating: number;
  setNewRating: (rating: number) => void;
  newComment: string;
  setNewComment: (comment: string) => void;
  handleAddReview: () => void;
  onClear?: () => void;
}

export const ReviewBox: React.FC<ReviewBoxProps> = ({
  isDarkMode,
  theme,
  styles,
  newRating,
  setNewRating,
  newComment,
  setNewComment,
  handleAddReview,
  onClear,
}) => (
  <View
    style={[
      styles.reviewBox,
      { marginTop: 24 },
      isDarkMode && { backgroundColor: theme.card },
    ]}
  >
    <View style={styles.reviewBoxHeader}>
      <Text style={[styles.reviewBoxTitle, isDarkMode && { color: theme.text }]}>
        Avalie este local também
      </Text>
      <TouchableOpacity
        style={[
          styles.clearButton,
          isDarkMode && {
            backgroundColor: theme.background,
            borderColor: theme.border,
          },
        ]}
        onPress={onClear}
      >
        <MaterialIcons
          name="delete"
          size={20}
          color={isDarkMode ? theme.text : colors.gray}
        />
      </TouchableOpacity>
    </View>
    <View style={styles.reviewStarsRow}>
      {[1, 2, 3, 4, 5].map((i) => (
        <TouchableOpacity key={i} onPress={() => setNewRating(i)}>
          <MaterialIcons
            name={newRating >= i ? 'star' : 'star-border'}
            size={24}
            color={newRating >= i ? colors.blue : isDarkMode ? theme.text : colors.gray}
          />
        </TouchableOpacity>
      ))}
    </View>
    <TextInput
      style={[
        styles.reviewInput,
        isDarkMode && {
          backgroundColor: theme.background,
          color: theme.text,
          borderColor: theme.border,
        },
      ]}
      placeholder="Digite seu comentário aqui..."
      placeholderTextColor={isDarkMode ? theme.text : colors.gray}
      multiline
      value={newComment}
      onChangeText={setNewComment}
    />
    <TouchableOpacity
      style={[styles.reviewButton, isDarkMode && { backgroundColor: theme.blue }]}
      onPress={handleAddReview}
    >
      <Text style={styles.reviewButtonText}>COMENTAR</Text>
    </TouchableOpacity>
  </View>
);