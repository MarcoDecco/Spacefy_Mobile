import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '~/styles/globalStyles/colors';

interface CheckInDateTimeProps {
  checkInDate: Date;
  checkInTime: Date;
  isDarkMode: boolean;
  theme: any;
  styles: any;
  openPicker: (field: "checkInDate" | "checkOutDate" | "checkInTime" | "checkOutTime",
  mode: "date" | "time") => void;
  openTimeModal: (field: "checkInTime" | "checkOutTime") => void;
}

export const CheckInDateTime: React.FC<CheckInDateTimeProps> = ({
  checkInDate,
  checkInTime,
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
          name="login"
          size={20}
          color={isDarkMode ? theme.blue : colors.blue}
        />
      </View>
      <Text
        style={[styles.rentalDateTimeTitle, isDarkMode && { color: theme.text }]}
      >
        Check-in
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
        onPress={() => openPicker('checkInDate', 'date')}
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
            {checkInDate.toLocaleDateString()}
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
        onPress={() => openTimeModal('checkInTime')}
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
            {checkInTime.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  </View>
);