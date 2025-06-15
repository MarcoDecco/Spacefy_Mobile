import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface DescriptionSectionProps {
  displayDescription: string;
  shouldShowMoreButton: boolean;
  showFullDescription: boolean;
  setShowFullDescription: (show: boolean) => void;
  isDarkMode: boolean;
  theme: any;
  styles: any;
}

export const DescriptionSection: React.FC<DescriptionSectionProps> = ({
  displayDescription,
  shouldShowMoreButton,
  showFullDescription,
  setShowFullDescription,
  isDarkMode,
  theme,
  styles,
}) => (
  <View>
    <Text style={[styles.sectionTitle, isDarkMode && { color: theme.text }]}>
      Descrição
    </Text>
    <Text style={[styles.description, isDarkMode && { color: theme.text }]}>
      {displayDescription}
    </Text>
    {shouldShowMoreButton && (
      <TouchableOpacity
        style={styles.moreButton}
        onPress={() => setShowFullDescription(!showFullDescription)}
      >
        <Text style={[styles.moreButtonText, isDarkMode && { color: theme.blue }]}>
          {showFullDescription ? 'Mostrar menos' : 'Mostrar mais'}
        </Text>
      </TouchableOpacity>
    )}
  </View>
);