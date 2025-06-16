import React, { useEffect, useState } from 'react';
import { Modal, View, TouchableWithoutFeedback } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { blockedDatesService } from '../services/blockedDates';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../styles/globalStyles/colors';

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
  const [currentMonth, setCurrentMonth] = useState(new Date());

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

  // Mapeia os dias da semana para índices
  const diasSemanaMap: Record<string, number> = {
    'domingo': 0,
    'segunda': 1,
    'terca': 2,
    'quarta': 3,
    'quinta': 4,
    'sexta': 5,
    'sabado': 6
  };

  // Calcula os índices dos dias que devem ser desabilitados
  const diasPermitidos = weekDays.map(dia => diasSemanaMap[dia.toLowerCase()]);
  const disabledDaysIndexes = [0, 1, 2, 3, 4, 5, 6].filter(
    dayIndex => !diasPermitidos.includes(dayIndex)
  );

  // Função para verificar se um dia deve ser desabilitado
  const isDayDisabled = (date: any) => {
    const dayOfWeek = new Date(date.timestamp).getDay();
    return !diasPermitidos.includes(dayOfWeek);
  };

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

  // Gera as datas marcadas para o mês atual
  const generateMarkedDates = () => {
    const month = currentMonth.getMonth();
    const year = currentMonth.getFullYear();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const markedDates = { ...combinedMarkedDates };
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateString = date.toISOString().split('T')[0];
      const dayOfWeek = date.getDay();
      
      if (!diasPermitidos.includes(dayOfWeek)) {
        markedDates[dateString] = {
          ...markedDates[dateString],
          disabled: true,
          disabledTouchEvent: true,
          dotColor: 'red',
        };
      }
    }
    
    return markedDates;
  };

  // Verifica se está no mês atual
  const isCurrentMonth = () => {
    const today = new Date();
    return currentMonth.getFullYear() === today.getFullYear() && 
           currentMonth.getMonth() === today.getMonth();
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
                markedDates={generateMarkedDates()}
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
                  disabledArrowColor: isDarkMode ? theme.border : theme.gray,
                }}
                disableAllTouchEventsForDisabledDays={true}
                disableAllTouchEventsForInactiveDays={true}
                disabledDaysIndexes={disabledDaysIndexes}
                minDate={new Date().toISOString().split('T')[0]}
                onDayLongPress={(day) => {
                  if (isDayDisabled(day)) {
                    return;
                  }
                }}
                onPressArrowLeft={(subtractMonth) => {
                  const newMonth = new Date(currentMonth);
                  newMonth.setMonth(newMonth.getMonth() - 1);
                  
                  // Verifica se o novo mês é anterior ao mês atual
                  const today = new Date();
                  const isPreviousMonth = newMonth.getFullYear() < today.getFullYear() || 
                    (newMonth.getFullYear() === today.getFullYear() && newMonth.getMonth() < today.getMonth());
                  
                  if (!isPreviousMonth) {
                    setCurrentMonth(newMonth);
                    subtractMonth();
                  }
                }}
                onPressArrowRight={(addMonth) => {
                  const newMonth = new Date(currentMonth);
                  newMonth.setMonth(newMonth.getMonth() + 1);
                  setCurrentMonth(newMonth);
                  addMonth();
                }}
                enableSwipeMonths={true}
                hideExtraDays={false}
                hideArrows={false}
                renderArrow={(direction) => {
                  if (direction === 'left' && isCurrentMonth()) {
                    return null;
                  }
                  return (
                    <MaterialIcons
                      name={direction === 'left' ? 'chevron-left' : 'chevron-right'}
                      size={24}
                      color={isDarkMode ? theme.blue : colors.blue}
                    />
                  );
                }}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};