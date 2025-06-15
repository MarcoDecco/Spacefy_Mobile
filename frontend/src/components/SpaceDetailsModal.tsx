import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
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
            <SpaceDetailsScroll
              spaceDetails={spaceDetails}
              space={space}
              isDarkMode={isDarkMode}
              theme={theme}
              styles={styles}
              onSeeMore={onSeeMore}
            />
          </View>
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
  </Modal>
);