import React from 'react';
import { Modal, View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '~/styles/globalStyles/colors';

interface ConfirmModalProps {
  visible: boolean;
  styles: any;
  isDarkMode: boolean;
  theme: any;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  visible,
  styles,
  isDarkMode,
  theme,
}) => (
  <Modal visible={visible} transparent={true} animationType="fade">
    <View style={styles.calendarOverlay}>
      <View style={[styles.confirmModal, isDarkMode && { backgroundColor: theme.card }]}>
        <MaterialIcons name="check-circle" size={48} color={colors.blue} />
        <Text style={[styles.confirmText, isDarkMode && { color: theme.text }]}>
          Reserva realizada com sucesso!
        </Text>
      </View>
    </View>
  </Modal>
);