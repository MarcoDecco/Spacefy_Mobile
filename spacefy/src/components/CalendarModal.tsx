import React, { useEffect, useState } from 'react';
import { Modal, View, TouchableWithoutFeedback } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { blockedDatesService } from '../services/blockedDates';

interface RentedTime {
  startTime: string;
  endTime: string;
}

interface RentedDate {
  date: string;
  times: RentedTime[];
}

interface BlockedDatesResponse {
  blocked_dates: string[];
  rented_dates: RentedDate[];
}

interface CalendarModalProps {
  visible: boolean;
  onClose: () => void;
  onDayPress: (date: any) => void;
  markedDates: any;
  theme: any;
  styles: any;
  isDarkMode: boolean;
  spaceId: string;
  weekDays?: string[];
}

const diasSemana: Record<string, number> = {
  'domingo': 0,
  'segunda': 1,
  'terca': 2,
  'quarta': 3,
  'quinta': 4,
  'sexta': 5,
  'sabado': 6
};

export const CalendarModal: React.FC<CalendarModalProps> = ({
  visible,
  onClose,
  onDayPress,
  markedDates,
  theme,
  styles,
  isDarkMode,
  spaceId,
  weekDays = [],
}) => {
  const [blockedDatesData, setBlockedDatesData] = useState<BlockedDatesResponse | null>(null);

  useEffect(() => {
    async function fetchBlockedDates() {
      try {
        if (!spaceId) return;
        const data = await blockedDatesService.getBlockedDatesBySpaceId(spaceId) as BlockedDatesResponse;
        console.log('Datas bloqueadas (completo):', JSON.stringify(data, null, 2));
        setBlockedDatesData(data);
      } catch (error) {
        console.log('Erro ao buscar datas bloqueadas:', error);
      }
    }
    fetchBlockedDates();
  }, [spaceId]);

  // Combina as datas marcadas com as datas bloqueadas
  const combinedMarkedDates = {
    ...markedDates,
    ...(blockedDatesData?.blocked_dates?.reduce((acc, date) => {
      acc[date] = {
        disabled: true,
        disabledTouchEvent: true,
        dotColor: 'red',
      };
      return acc;
    }, {} as any) || {}),
    ...(blockedDatesData?.rented_dates?.reduce((acc, item) => {
      acc[item.date] = {
        ...acc[item.date],
        disabled: true,
        disabledTouchEvent: true,
        dotColor: 'red',
      };
      return acc;
    }, {} as any) || {}),
  };

  return (
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
                markedDates={combinedMarkedDates}
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
                disableAllTouchEventsForDisabledDays={true}
                disableAllTouchEventsForInactiveDays={true}
                disabledDaysIndexes={[0, 1, 2, 3, 4, 5, 6].filter(day => !weekDays.includes(Object.keys(diasSemana).find(key => diasSemana[key] === day) || ''))}
                minDate={new Date().toISOString().split('T')[0]}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};