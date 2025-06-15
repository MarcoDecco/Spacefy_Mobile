import React from 'react';
import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '~/styles/globalStyles/colors';

interface SpaceDetailsScrollProps {
  spaceDetails: {
    area: string;
    capacity: string;
    hasWifi: boolean;
    bathrooms: string;
  };
  space: {
    amenities?: string[];
  };
  isDarkMode: boolean;
  theme: any;
  styles: any;
  onSeeMore: () => void;
}

export const SpaceDetailsScroll: React.FC<SpaceDetailsScrollProps> = ({
  spaceDetails,
  space,
  isDarkMode,
  theme,
  styles,
  onSeeMore,
}) => (
  <ScrollView
    style={styles.detailsModalScrollView}
    contentContainerStyle={styles.detailsModalContent}
    showsVerticalScrollIndicator={false}
  >
    {/* Informações Básicas */}
    <View style={styles.detailsModalGrid}>
      {[
        { icon: 'crop-square', label: 'Área', value: spaceDetails.area },
        { icon: 'groups', label: 'Capacidade', value: spaceDetails.capacity },
        { icon: 'wifi', label: 'WiFi', value: spaceDetails.hasWifi ? 'Sim' : 'Não' },
        { icon: 'wc', label: 'Banheiros', value: spaceDetails.bathrooms },
      ].map((item, index) => (
        <View
          key={index}
          style={[
            styles.detailsModalGridItem,
            isDarkMode && {
              backgroundColor: theme.background,
              borderColor: theme.border,
            },
          ]}
        >
          <View
            style={[
              styles.detailsModalIconContainer,
              isDarkMode && {
                backgroundColor: theme.card,
                borderColor: theme.border,
                borderWidth: 1,
              },
            ]}
          >
            <MaterialIcons
              name={item.icon as any}
              size={24}
              color={isDarkMode ? theme.blue : colors.blue}
            />
          </View>
          <Text
            style={[
              styles.detailsModalGridLabel,
              isDarkMode && { color: theme.text },
            ]}
          >
            {item.label}
          </Text>
          <Text
            style={[
              styles.detailsModalGridValue,
              isDarkMode && { color: theme.text },
            ]}
          >
            {item.value}
          </Text>
        </View>
      ))}
    </View>

    {/* Comodidades */}
    <View
      style={[
        styles.detailsModalAmenities,
        isDarkMode && {
          borderTopColor: theme.border,
          backgroundColor: theme.background,
        },
      ]}
    >
      <Text
        style={[
          styles.detailsModalSectionTitle,
          isDarkMode && { color: theme.text },
        ]}
      >
        Comodidades ({space.amenities?.length || 0})
      </Text>

      <View style={styles.detailsModalAmenitiesList}>
        {space.amenities &&
        Array.isArray(space.amenities) &&
        space.amenities.length > 0 ? (
          space.amenities.map((amenity, index) => (
            <Text
              key={`${amenity}-${index}`}
              style={[
                styles.detailsModalAmenityText,
                isDarkMode && { color: theme.text },
              ]}
            >
              • {amenity}
            </Text>
          ))
        ) : (
          <Text
            style={[
              styles.detailsModalAmenityText,
              isDarkMode && { color: theme.text },
            ]}
          >
            {!space.amenities
              ? 'Carregando comodidades...'
              : !Array.isArray(space.amenities)
              ? 'Erro ao carregar comodidades'
              : 'Nenhuma comodidade disponível'}
          </Text>
        )}
      </View>
    </View>

    <TouchableOpacity
      onPress={onSeeMore}
      style={styles.detailsModalMoreButton}
    >
      <Text style={[styles.detailsMoreButton, isDarkMode && { color: theme.blue }]}>
        Ver mais
      </Text>
    </TouchableOpacity>
  </ScrollView>
);