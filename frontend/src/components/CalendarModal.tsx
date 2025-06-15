import React from 'react';
import { Modal, View, TouchableWithoutFeedback } from 'react-native';
import { Calendar } from 'react-native-calendars';

interface CalendarModalProps {
  visible: boolean;
  onClose: () => void;
  onDayPress: (date: any) => void;
  markedDates: any;
  theme: any;
  styles: any;
  isDarkMode: boolean;
}

export const CalendarModal: React.FC<CalendarModalProps> = ({
  visible,
  onClose,
  onDayPress,
  markedDates,
  theme,
  styles,
  isDarkMode,
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
          <View style={[styles.calendarModal, isDarkMode && { backgroundColor: theme.card }]}>
            <Calendar
              onDayPress={onDayPress}
              markedDates={markedDates}
              theme={{
                backgroundColor: isDarkMode ? theme.card : theme.white,
                calendarBackground: isDarkMode ? theme.card : theme.white,
                textSectionTitleColor: isDarkMode ? theme.text : theme.black,
                selectedDayBackgroundColor: theme.blue,
                selectedDayTextColor: theme.white,
                todayTextColor: theme.blue,
                dayTextColor: isDarkMode ? theme.text : theme.black,
                textDisabledColor: isDarkMode ? theme.border : theme.gray,
                monthTextColor: isDarkMode ? theme.text : theme.black,
                arrowColor: theme.blue,
              }}
            />
          </View>
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
  </Modal>
);