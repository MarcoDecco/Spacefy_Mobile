import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '~/styles/globalStyles/colors';
import { SpaceDetailsScroll } from './SpaceDetailsScroll';

interface SpaceDetailsModalProps {
  visible: boolean;
  onClose: () => void;
  spaceDetails: any;
  space: any;
  isDarkMode: boolean;
  theme: any;
  styles: any;
  onSeeMore: () => void;
}

export const SpaceDetailsModal: React.FC<SpaceDetailsModalProps> = ({
  visible,
  onClose,
  spaceDetails,
  space,
  isDarkMode,
  theme,
  styles,
  onSeeMore,
}) => (
  <Modal
    visible={visible}
    transparent={true}
    animationType="fade"
    onRequestClose={onClose}
  >
    <TouchableWithoutFeedback onPress={onClose}>
      <View style={styles.calendarOverlay}>
        <TouchableWithoutFeedback>
          <View
            style={[
              styles.detailsModal,
              isDarkMode && {
                backgroundColor: theme.card,
                borderColor: theme.border,
                borderWidth: 1,
              },
            ]}
          >
            {/* Header do Modal */}
            <View
              style={[
                styles.detailsModalHeader,
                isDarkMode && {
                  backgroundColor: theme.background,
                  borderBottomColor: theme.border,
                },
              ]}
            >
              <Text style={[styles.detailsModalTitle, isDarkMode && { color: theme.text }]}>
                Detalhes do Espaço
              </Text>
              <TouchableOpacity
                onPress={onClose}
                style={[
                  styles.detailsModalCloseButton,
                  isDarkMode && {
                    backgroundColor: theme.card,
                    borderColor: theme.border,
                    borderWidth: 1,
                  },
                ]}
              >
                <MaterialIcons
                  name="close"
                  size={24}
                  color={isDarkMode ? theme.text : colors.black}
                />
              </TouchableOpacity>
            </View>

            {/* Conteúdo Rolável */}
            <ScrollView style={styles.detailsModalContent}>
              {/* Detalhes do Espaço */}
              <SpaceDetailsScroll
                spaceDetails={spaceDetails}
                space={space}
                isDarkMode={isDarkMode}
                theme={theme}
                styles={styles}
                onSeeMore={onSeeMore}
              />

              {/* Seção de Amenities */}
              <View style={[styles.detailsModalAmenities, isDarkMode && { borderTopColor: theme.border }]}>
                <Text style={[styles.detailsModalSectionTitle, isDarkMode && { color: theme.text }]}>
                  Comodidades ({space.space_amenities?.length || 0})
                </Text>

                <View style={styles.detailsModalAmenitiesList}>
                  {space.space_amenities && Array.isArray(space.space_amenities) && space.space_amenities.length > 0 ? (
                    space.space_amenities.map((amenity: string, index: number) => (
                      <View key={`${amenity}-${index}`} style={styles.amenityItem}>
                        <MaterialIcons
                          name="check-circle"
                          size={20}
                          color={isDarkMode ? theme.blue : colors.blue}
                        />
                        <Text style={[styles.amenityText, isDarkMode && { color: theme.text }]}>
                          {amenity}
                        </Text>
                      </View>
                    ))
                  ) : (
                    <Text style={[styles.amenityText, isDarkMode && { color: theme.text }]}>
                      Nenhuma comodidade disponível
                    </Text>
                  )}
                </View>
              </View>
            </ScrollView>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
  </Modal>
);