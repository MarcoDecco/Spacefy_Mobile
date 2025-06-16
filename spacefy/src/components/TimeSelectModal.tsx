import React, { useEffect, useState } from 'react';
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
import { blockedDatesService } from '../services/blockedDates';

interface TimeRange {
  open: string;
  close: string;
  _id: string;
}

interface WeeklyDay {
  day: string;
  time_ranges: TimeRange[];
  _id: string;
}

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

interface TimeSelectModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (time: string) => void;
  styles: any;
  isDarkMode: boolean;
  theme: any;
  weekly_days: WeeklyDay[];
  selectedDate?: string;
  spaceId?: string;
}

export const TimeSelectModal: React.FC<TimeSelectModalProps> = ({
  visible,
  onClose,
  onSelect,
  styles,
  isDarkMode,
  theme,
  weekly_days,
  selectedDate,
  spaceId,
}) => {
  const [blockedDatesData, setBlockedDatesData] = useState<BlockedDatesResponse | null>(null);

  const roundToNextHalfHour = (): string => {
    const now = new Date();
    const minutes = now.getMinutes();
    const hours = now.getHours();
    
    let roundedMinutes = Math.ceil(minutes / 30) * 30;
    let roundedHours = hours;
    
    if (roundedMinutes === 60) {
      roundedMinutes = 0;
      roundedHours = (hours + 1) % 24;
    }
    
    return `${roundedHours.toString().padStart(2, '0')}:${roundedMinutes.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    async function fetchBlockedDates() {
      try {
        if (!spaceId) return;
        const data = await blockedDatesService.getBlockedDatesBySpaceId(spaceId);
        setBlockedDatesData(data);
      } catch (error) {
        console.error('Erro ao buscar datas bloqueadas:', error);
      }
    }
    fetchBlockedDates();
  }, [spaceId]);

  const generateTimeSlots = (): string[] => {
    const times: string[] = [];
    
    if (!weekly_days || weekly_days.length === 0) {
      return times;
    }

    const allTimeRanges = weekly_days.flatMap(day => day.time_ranges);
    
    if (!allTimeRanges || allTimeRanges.length === 0) {
      return times;
    }
    
    const timeRangesInMinutes = allTimeRanges.map(range => {
      const openMinutes = convertTimeToMinutes(range.open);
      const closeMinutes = convertTimeToMinutes(range.close);
      
      if (closeMinutes < openMinutes) {
        return {
          open: openMinutes,
          close: closeMinutes + 24 * 60
        };
      }
      
      return {
        open: openMinutes,
        close: closeMinutes
      };
    });

    const blockedTimes = selectedDate && blockedDatesData?.rented_dates
      ? blockedDatesData.rented_dates
          .find(date => date.date === selectedDate)?.times || []
      : [];

    const blockedTimeRanges = blockedTimes.map(time => ({
      start: convertTimeToMinutes(time.startTime),
      end: convertTimeToMinutes(time.endTime)
    }));

    const isToday = selectedDate === new Date().toISOString().split('T')[0];
    const startTime = isToday ? convertTimeToMinutes(roundToNextHalfHour()) : 0;

    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeInMinutes = hour * 60 + minute;
        
        if (isToday && timeInMinutes < startTime) {
          continue;
        }

        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        
        const adjustedTimeInMinutes = timeInMinutes < timeRangesInMinutes[0].open 
          ? timeInMinutes + 24 * 60 
          : timeInMinutes;

        const isWithinRange = timeRangesInMinutes.some(range => 
          adjustedTimeInMinutes >= range.open && adjustedTimeInMinutes <= range.close
        );

        const isBlocked = blockedTimeRanges.some(blocked => {
          const adjustedBlockedStart = blocked.start;
          const adjustedBlockedEnd = blocked.end;
          
          return (
            (adjustedTimeInMinutes >= adjustedBlockedStart && adjustedTimeInMinutes < adjustedBlockedEnd) ||
            (adjustedTimeInMinutes + 24 * 60 >= adjustedBlockedStart && adjustedTimeInMinutes + 24 * 60 < adjustedBlockedEnd)
          );
        });

        if (isWithinRange && !isBlocked) {
          times.push(timeString);
        }
      }
    }

    return times;
  };

  const convertTimeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const timeSlots = generateTimeSlots();

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
                <View style={styles.timeGrid}>
                  {timeSlots.length > 0 ? (
                    timeSlots.map((time) => (
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
                    ))
                  ) : (
                    <Text style={[styles.timeText, isDarkMode && { color: theme.text }]}>
                      Nenhum horário disponível
                    </Text>
                  )}
                </View>
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};