import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../styles/globalStyles/colors';

interface RentalConfirmationModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  spaceName: string;
  checkInDate: Date;
  checkOutDate: Date;
  checkInTime: Date;
  checkOutTime: Date;
  totalValue: string;
  isDarkMode: boolean;
  theme: any;
}

export const RentalConfirmationModal: React.FC<RentalConfirmationModalProps> = ({
  visible,
  onClose,
  onConfirm,
  spaceName,
  checkInDate,
  checkOutDate,
  checkInTime,
  checkOutTime,
  totalValue,
  isDarkMode,
  theme,
}) => {
  const formatDateTime = (date: Date, time: Date) => {
    const formattedDate = date.toLocaleDateString('pt-BR');
    const formattedTime = time.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
    return `${formattedDate} às ${formattedTime}`;
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View
              style={[
                styles.modalContent,
                isDarkMode && {
                  backgroundColor: theme.card,
                  borderColor: theme.border,
                },
              ]}
            >
              <View style={styles.header}>
                <Text
                  style={[
                    styles.title,
                    isDarkMode && { color: theme.text },
                  ]}
                >
                  Confirmar Reserva
                </Text>
                <TouchableOpacity
                  onPress={onClose}
                  style={[
                    styles.closeButton,
                    isDarkMode && {
                      backgroundColor: theme.background,
                      borderColor: theme.border,
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

              <View style={styles.content}>
                <Text
                  style={[
                    styles.spaceName,
                    isDarkMode && { color: theme.text },
                  ]}
                >
                  {spaceName}
                </Text>

                <View style={styles.infoContainer}>
                  <View style={styles.infoRow}>
                    <MaterialIcons
                      name="event-available"
                      size={20}
                      color={isDarkMode ? theme.blue : colors.blue}
                    />
                    <Text
                      style={[
                        styles.infoText,
                        isDarkMode && { color: theme.text },
                      ]}
                    >
                      Check-in: {formatDateTime(checkInDate, checkInTime)}
                    </Text>
                  </View>

                  <View style={styles.infoRow}>
                    <MaterialIcons
                      name="event-busy"
                      size={20}
                      color={isDarkMode ? theme.blue : colors.blue}
                    />
                    <Text
                      style={[
                        styles.infoText,
                        isDarkMode && { color: theme.text },
                      ]}
                    >
                      Check-out: {formatDateTime(checkOutDate, checkOutTime)}
                    </Text>
                  </View>

                  <View style={styles.infoRow}>
                    <MaterialIcons
                      name="attach-money"
                      size={20}
                      color={isDarkMode ? theme.blue : colors.blue}
                    />
                    <Text
                      style={[
                        styles.infoText,
                        isDarkMode && { color: theme.text },
                      ]}
                    >
                      Valor Total: {totalValue}
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={[
                    styles.confirmButton,
                    isDarkMode && { backgroundColor: theme.blue },
                  ]}
                  onPress={onConfirm}
                >
                  <Text style={styles.confirmButtonText}>Confirmar Reserva</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 20,
    elevation: 5,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.black,
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: colors.lightGray,
  },
  content: {
    gap: 20,
  },
  spaceName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.black,
    textAlign: 'center',
  },
  infoContainer: {
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    fontSize: 16,
    color: colors.black,
  },
  confirmButton: {
    backgroundColor: colors.blue,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  confirmButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
}); 