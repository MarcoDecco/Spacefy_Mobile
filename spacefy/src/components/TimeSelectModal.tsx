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

interface TimeSelectModalProps {
  visible: boolean;
  onClose: () => void;
  timeGroups: Record<string, string[]>;
  onSelect: (time: string) => void;
  styles: any;
  isDarkMode: boolean;
  theme: any;
}

export const TimeSelectModal: React.FC<TimeSelectModalProps> = ({
  visible,
  onClose,
  timeGroups,
  onSelect,
  styles,
  isDarkMode,
  theme,
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
              styles.timeModal,
              isDarkMode && {
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
            ]}
          >
            <View
              style={[
                styles.timeModalHeader,
                isDarkMode && {
                  borderBottomColor: theme.border,
                  backgroundColor: theme.background,
                },
              ]}
            >
              <Text style={[styles.timeModalTitle, isDarkMode && { color: theme.text }]}>
                Selecione o horário
              </Text>
              <TouchableOpacity
                onPress={onClose}
                style={[
                  styles.timeModalCloseButton,
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

            <ScrollView
              style={styles.timeModalContent}
              contentContainerStyle={{ paddingBottom: 40 }}
              showsVerticalScrollIndicator={false}
            >
              {Object.entries(timeGroups).map(([period, times], index, array) => (
                <View
                  key={period}
                  style={[
                    styles.timePeriodContainer,
                    index === array.length - 1 && { marginBottom: 40 },
                  ]}
                >
                  <Text style={[styles.timePeriodTitle, isDarkMode && { color: theme.text }]}>
                    {period === 'manha'
                      ? 'Manhã'
                      : period === 'tarde'
                      ? 'Tarde'
                      : 'Noite'}
                  </Text>
                  <View style={styles.timeGrid}>
                    {times.map((time) => (
                      <TouchableOpacity
                        key={time}
                        style={[
                          styles.timeItem,
                          isDarkMode && {
                            backgroundColor: theme.background,
                            borderColor: theme.border,
                          },
                        ]}
                        onPress={() => onSelect(time)}
                      >
                        <Text style={[styles.timeText, isDarkMode && { color: theme.text }]}>
                          {time}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
  </Modal>
);