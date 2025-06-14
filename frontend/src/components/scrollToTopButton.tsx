import React from 'react';
import { TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { colors } from '../styles/globalStyles/colors';

interface ScrollToTopButtonProps {
  onPress: () => void;
  visible: boolean;
}

export default function ScrollToTopButton({ onPress, visible }: ScrollToTopButtonProps) {
  const { theme, isDarkMode } = useTheme();

  if (!visible) return null;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: colors.blue,
          borderColor: colors.blue,
        }
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <MaterialIcons name="keyboard-arrow-up" size={32} color="white" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
}); 