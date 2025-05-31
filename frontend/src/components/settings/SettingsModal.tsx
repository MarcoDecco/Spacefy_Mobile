import { View, Text, Modal, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../styles/globalStyles/colors';
import { settingsStyles as styles } from '../../styles/settings.styles';
import BaseInput from '../inputs/baseInput';

interface SettingsModalProps {
  visible: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  onConfirm: () => void;
  confirmText?: string;
}

export function SettingsModal({
  visible,
  title,
  onClose,
  children,
  onConfirm,
  confirmText = 'Confirmar'
}: SettingsModalProps) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={colors.black} />
            </TouchableOpacity>
          </View>
          {children}
          <TouchableOpacity
            style={styles.modalButton}
            onPress={onConfirm}
          >
            <Text style={styles.modalButtonText}>{confirmText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
} 