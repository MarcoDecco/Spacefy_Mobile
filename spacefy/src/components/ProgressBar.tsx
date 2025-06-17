import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../styles/globalStyles/colors';
import { useTheme } from '../contexts/ThemeContext';

interface ProgressBarProps {
  progress: number;
  currentStep: number;
  totalSteps: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress, currentStep, totalSteps }) => {
  const { theme } = useTheme();

  return (
    <View style={styles.progressContainer}>
      <Text style={[styles.progressText, { color: theme.text }]}>
        Etapa {currentStep} de {totalSteps}
      </Text>
      <View style={styles.progressBarContainer}>
        {Array.from({ length: totalSteps }).map((_, index) => (
          <View
            key={index}
            style={[
              index < currentStep ? styles.progressBar : styles.progressBarInactive,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  progressContainer: {
    marginBottom: 16,
    alignItems: 'center',
  },
  progressText: {
    fontSize: 15,
    marginBottom: 4,
    fontWeight: '500',
    textAlign: 'center',
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 6,
    marginBottom: 16,
    gap: 6,
    width: '100%',
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.blue,
    flex: 1,
  },
  progressBarInactive: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.gray,
    flex: 1,
  },
}); 