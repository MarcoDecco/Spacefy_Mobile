import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '~/styles/globalStyles/colors';

interface CheckOutDateTimeProps {
  checkOutDate: Date;
  checkOutTime: Date;
  isDarkMode: boolean;
  theme: any;
  styles: any;
  openPicker: (field: "checkOutDate", mode: "date") => void;
  openTimeModal: (field: "checkOutTime") => void;
}

export const CheckOutDateTime: React.FC<CheckOutDateTimeProps> = ({
  checkOutDate,
  checkOutTime,
  isDarkMode,
  theme,
  styles,
  openPicker,
  openTimeModal,
}) => (
  <View style={styles.rentalDateTimeContainer}>
    <View style={styles.rentalDateTimeHeader}>
      <View
        style={[
          styles.rentalIconCircle,
          isDarkMode && {
            backgroundColor: theme.background,
            borderColor: theme.border,
            borderWidth: 1,
          },
        ]}
      >
        <MaterialIcons
          name="logout"
          size={20}
          color={isDarkMode ? theme.blue : colors.blue}
        />
      </View>
      <Text
        style={[styles.rentalDateTimeTitle, isDarkMode && { color: theme.text }]}
      >
        Check-out
      </Text>
    </View>
    <View style={styles.rentalDateTimeContent}>
      <TouchableOpacity
        style={[
          styles.rentalDateTimeBox,
          isDarkMode && {
            backgroundColor: theme.background,
            borderColor: theme.border,
          },
        ]}
        onPress={() => openPicker('checkOutDate', 'date')}
      >
        <View
          style={[
            styles.rentalDateTimeIconContainer,
            isDarkMode && {
              backgroundColor: theme.card,
              borderColor: theme.border,
              borderWidth: 1,
            },
          ]}
        >
          <MaterialIcons
            name="calendar-today"
            size={20}
            color={isDarkMode ? theme.text : colors.gray}
          />
        </View>
        <View style={styles.rentalDateTimeTextContainer}>
          <Text
            style={[
              styles.rentalDateTimeLabel,
              isDarkMode && { color: theme.text },
            ]}
          >
            Data
          </Text>
          <Text
            style={[
              styles.rentalDateTimeText,
              isDarkMode && { color: theme.text },
            ]}
          >
            {checkOutDate.toLocaleDateString()}
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.rentalDateTimeBox,
          isDarkMode && {
            backgroundColor: theme.background,
            borderColor: theme.border,
          },
        ]}
        onPress={() => openTimeModal('checkOutTime')}
      >
        <View
          style={[
            styles.rentalDateTimeIconContainer,
            isDarkMode && {
              backgroundColor: theme.card,
              borderColor: theme.border,
              borderWidth: 1,
            },
          ]}
        >
          <MaterialIcons
            name="access-time"
            size={20}
            color={isDarkMode ? theme.text : colors.gray}
          />
        </View>
        <View style={styles.rentalDateTimeTextContainer}>
          <Text
            style={[
              styles.rentalDateTimeLabel,
              isDarkMode && { color: theme.text },
            ]}
          >
            Hora
          </Text>
          <Text
            style={[
              styles.rentalDateTimeText,
              isDarkMode && { color: theme.text },
            ]}
          >
            {checkOutTime.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  </View>
);