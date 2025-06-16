import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../styles/globalStyles/colors';
import { useTheme } from '../../contexts/ThemeContext';

interface NavigationButtonsProps {
  onBack: () => void;
  onNext: () => void;
  nextText?: string;
  backText?: string;
  disabled?: boolean;
}

export function NavigationButtons({
  onBack,
  onNext,
  nextText = 'Prosseguir',
  backText = 'Voltar',
  disabled = false,
}: NavigationButtonsProps) {
  const { isDarkMode, theme } = useTheme();

  return (
    <View style={[styles.buttonRowFixed, isDarkMode && { backgroundColor: theme.card, borderTopColor: theme.border }]}>
      <TouchableOpacity
        style={[
          styles.backButton, 
          isDarkMode && { 
            backgroundColor: theme.card,
            borderWidth: 1,
            borderColor: theme.border
          }
        ]}
        onPress={onBack}
      >
        <Text style={[styles.backButtonText, isDarkMode && { color: theme.text }]}>
          {backText}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.nextButton, 
          disabled && styles.disabledButton,
          isDarkMode && { backgroundColor: theme.blue }
        ]}
        onPress={onNext}
        disabled={disabled}
      >
        <Text style={styles.nextButtonText}>
          {nextText}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonRowFixed: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 24,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.light_gray,
    gap: 12,
  },
  backButton: {
    flex: 1,
    backgroundColor: colors.light_gray,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  backButtonText: {
    color: colors.dark_gray,
    fontSize: 16,
    fontWeight: '600',
  },
  nextButton: {
    flex: 1,
    backgroundColor: colors.blue,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  nextButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: colors.gray,
    opacity: 0.7,
  },
}); 