import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
  Modal,
  TextInput,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigation/types';
import { styles } from '../../../styles/spaceRegisterStyles/etapa4Styles';
import { colors } from '../../../styles/globalStyles/colors';
import { ProgressBar } from '../../../components/ProgressBar';
import { useSpaceRegister } from '../../../contexts/SpaceRegisterContext';
import { NavigationButtons } from '../../../components/buttons/NavigationButtons';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../contexts/ThemeContext';

const weekDays = [
  { key: 'mon', label: 'Segunda' },
  { key: 'tue', label: 'Terça' },
  { key: 'wed', label: 'Quarta' },
  { key: 'thu', label: 'Quinta' },
  { key: 'fri', label: 'Sexta' },
  { key: 'sat', label: 'Sábado' },
  { key: 'sun', label: 'Domingo' },
];

type Etapa4ScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'SpaceAvailabilityScreen'>;

interface DaySlot {
  enabled: boolean;
  slots: { start: string; end: string }[];
}

function pad(num: number) {
  return num < 10 ? `0${num}` : `${num}`;
}

function splitTime(time: string) {
  const [h, m] = time.split(':').map(Number);
  return { hour: h, minute: m };
}

export default function Etapa4() {
  const navigation = useNavigation<Etapa4ScreenNavigationProp>();
  const { formData, updateFormData } = useSpaceRegister();
  const { isDarkMode, theme } = useTheme();
  const [pricePerHour, setPricePerHour] = useState(formData.price_per_hour || '');
  const [days, setDays] = useState<Record<string, DaySlot>>(() => {
    const initial: Record<string, DaySlot> = {};
    weekDays.forEach(day => {
      initial[day.key] = { enabled: false, slots: [{ start: '08:00', end: '18:00' }] };
    });
    return initial;
  });

  // Modal customizado para editar horário
  const [editModal, setEditModal] = useState<{
    visible: boolean;
    dayKey: string;
    slotIdx: number;
    field: 'start' | 'end';
    hour: number;
    minute: number;
  }>({ visible: false, dayKey: '', slotIdx: 0, field: 'start', hour: 8, minute: 0 });

  // Checkbox para ativar/desativar o dia
  const toggleDay = (key: string) => {
    setDays(prev => ({
      ...prev,
      [key]: { ...prev[key], enabled: !prev[key].enabled },
    }));
  };

  // Atualiza horário de um slot
  const updateSlot = (dayKey: string, slotIdx: number, field: 'start' | 'end', value: string) => {
    setDays(prev => {
      const newSlots = prev[dayKey].slots.map((slot, idx) =>
        idx === slotIdx ? { ...slot, [field]: value } : slot
      );
      return {
        ...prev,
        [dayKey]: { ...prev[dayKey], slots: newSlots },
      };
    });
  };

  // Adiciona novo slot ao dia
  const addSlot = (dayKey: string) => {
    setDays(prev => ({
      ...prev,
      [dayKey]: {
        ...prev[dayKey],
        slots: [...prev[dayKey].slots, { start: '08:00', end: '18:00' }],
      },
    }));
  };

  // Remove slot do dia
  const removeSlot = (dayKey: string, slotIdx: number) => {
    setDays(prev => {
      const newSlots = prev[dayKey].slots.filter((_, idx) => idx !== slotIdx);
      return {
        ...prev,
        [dayKey]: { ...prev[dayKey], slots: newSlots.length ? newSlots : [{ start: '08:00', end: '18:00' }] },
      };
    });
  };

  // Replicar horários do primeiro dia ativo para os outros
  const replicateFirstDay = () => {
    const firstActive = weekDays.find(day => days[day.key].enabled);
    if (!firstActive) {
      Alert.alert('Erro', 'Selecione pelo menos um dia da semana.');
      return;
    }

    const slotsToReplicate = [...days[firstActive.key].slots];
    
    setDays(prev => {
      const newDays = { ...prev };
      weekDays.forEach(day => {
        if (day.key !== firstActive.key && prev[day.key].enabled) {
          newDays[day.key] = {
            ...prev[day.key],
            slots: slotsToReplicate.map(slot => ({
              start: slot.start,
              end: slot.end
            }))
          };
        }
      });
      return newDays;
    });

    Alert.alert('Sucesso', 'Horários replicados com sucesso!');
  };

  // Abrir modal customizado
  const openEditModal = (dayKey: string, slotIdx: number, field: 'start' | 'end', value: string) => {
    const { hour, minute } = splitTime(value);
    setEditModal({ visible: true, dayKey, slotIdx, field, hour, minute });
  };

  // Salvar horário do modal
  const saveEditModal = () => {
    const { dayKey, slotIdx, field, hour, minute } = editModal;
    updateSlot(dayKey, slotIdx, field, `${pad(hour)}:${pad(minute)}`);
    setEditModal({ ...editModal, visible: false });
  };

  const handleProsseguir = () => {
    const selected = weekDays.filter(day => days[day.key].enabled);
    if (selected.length === 0) {
      Alert.alert('Erro', 'Selecione pelo menos um dia da semana.');
      return;
    }
    if (!pricePerHour || isNaN(Number(pricePerHour)) || Number(pricePerHour) <= 0) {
      Alert.alert('Erro', 'Digite um preço por hora válido.');
      return;
    }
    for (const day of selected) {
      for (const slot of days[day.key].slots) {
        if (!slot.start || !slot.end) {
          Alert.alert('Erro', 'Preencha todos os horários.');
          return;
        }
      }
    }

    // Converter o formato dos dados
    const weekly_days = selected.map(day => ({
      day: day.key,
      time_ranges: days[day.key].slots.map(slot => ({
        open: slot.start,
        close: slot.end
      }))
    }));

    updateFormData({
      ...formData,
      weekly_days,
      price_per_hour: pricePerHour,
    });
    navigation.navigate('Etapa5');
  };

  return (
    <View style={[styles.container, isDarkMode && { backgroundColor: theme.background }]}>
      <StatusBar 
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={isDarkMode ? theme.background : colors.white}
      />
      
      <View style={[styles.progressContainer, isDarkMode && { backgroundColor: theme.card }]}>
        <ProgressBar progress={0.5} currentStep={4} totalSteps={8} />
      </View>
      
      <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
        <Text style={[styles.title, isDarkMode && { color: theme.text }]}>Disponibilidade do espaço</Text>
        <Text style={[styles.subtitle, isDarkMode && { color: theme.text }]}>
          Selecione os dias e horários em que seu espaço estará disponível para reserva.
        </Text>

        {/* Campo de preço por hora */}
        <View style={[styles.priceContainer, isDarkMode && { backgroundColor: theme.card }]}>
          <Text style={[styles.priceLabel, isDarkMode && { color: theme.text }]}>Preço por hora (R$)</Text>
          <TextInput
            style={[styles.priceInput, isDarkMode && { 
              backgroundColor: theme.background,
              color: theme.text,
              borderColor: theme.border
            }]}
            value={pricePerHour}
            onChangeText={setPricePerHour}
            keyboardType="numeric"
            placeholder="0,00"
            placeholderTextColor={isDarkMode ? theme.gray : colors.gray}
          />
        </View>

        <View style={[styles.availabilityContainer, isDarkMode && { backgroundColor: theme.card }]}>
          {weekDays.map(day => (
            <View key={day.key} style={{ marginBottom: 16 }}>
              <TouchableOpacity
                style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}
                onPress={() => toggleDay(day.key)}
              >
                <View style={{
                  width: 24, height: 24, borderRadius: 6, borderWidth: 2, 
                  borderColor: days[day.key].enabled ? colors.blue : (isDarkMode ? theme.border : colors.gray), 
                  backgroundColor: days[day.key].enabled ? colors.blue : 'transparent', 
                  marginRight: 12, justifyContent: 'center', alignItems: 'center',
                }}>
                  {days[day.key].enabled && <Ionicons name="checkmark" size={18} color={colors.white} />}
                </View>
                <Text style={{ fontSize: 16, color: isDarkMode ? theme.text : colors.black, fontWeight: '500' }}>{day.label}</Text>
              </TouchableOpacity>
              {days[day.key].enabled && days[day.key].slots.map((slot, idx) => (
                <View key={idx} style={[styles.timeSlotRow, isDarkMode && { backgroundColor: theme.background }]}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                    <Text style={{ fontSize: 14, color: isDarkMode ? theme.text : colors.dark_gray, marginRight: 8 }}>Início:</Text>
                    <TouchableOpacity
                      style={{
                        borderWidth: 1,
                        borderColor: isDarkMode ? theme.border : colors.light_gray,
                        borderRadius: 6,
                        paddingHorizontal: 12,
                        paddingVertical: Platform.OS === 'ios' ? 8 : 4,
                        marginRight: 8,
                        backgroundColor: isDarkMode ? theme.card : colors.white,
                      }}
                      onPress={() => openEditModal(day.key, idx, 'start', slot.start)}
                    >
                      <Text style={{ fontSize: 16, color: isDarkMode ? theme.text : colors.black }}>{slot.start}</Text>
                    </TouchableOpacity>
                    <Text style={{ fontSize: 14, color: isDarkMode ? theme.text : colors.dark_gray, marginRight: 8 }}>Fim:</Text>
                    <TouchableOpacity
                      style={{
                        borderWidth: 1,
                        borderColor: isDarkMode ? theme.border : colors.light_gray,
                        borderRadius: 6,
                        paddingHorizontal: 12,
                        paddingVertical: Platform.OS === 'ios' ? 8 : 4,
                        backgroundColor: isDarkMode ? theme.card : colors.white,
                      }}
                      onPress={() => openEditModal(day.key, idx, 'end', slot.end)}
                    >
                      <Text style={{ fontSize: 16, color: isDarkMode ? theme.text : colors.black }}>{slot.end}</Text>
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity
                    style={styles.removeTimeSlotButton}
                    onPress={() => removeSlot(day.key, idx)}
                  >
                    <Ionicons name="close-circle" size={22} color={colors.error} />
                  </TouchableOpacity>
                </View>
              ))}
              {days[day.key].enabled && (
                <TouchableOpacity style={[styles.addTimeSlotButton, isDarkMode && { backgroundColor: theme.background }]} onPress={() => addSlot(day.key)}>
                  <Ionicons name="add-circle" size={20} color={colors.blue} />
                  <Text style={[styles.addTimeSlotText, isDarkMode && { color: theme.blue }]}>Adicionar horário</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
          <TouchableOpacity 
            style={[
              styles.addTimeSlotButton, 
              { marginTop: 8 }, 
              isDarkMode && { 
                backgroundColor: theme.background,
                borderWidth: 1,
                borderColor: theme.blue
              }
            ]} 
            onPress={replicateFirstDay}
          >
            <Ionicons name="copy" size={20} color={isDarkMode ? theme.blue : colors.blue} />
            <Text style={[styles.addTimeSlotText, isDarkMode && { color: theme.blue }]}>
              Replicar horários do primeiro dia
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <NavigationButtons
        onBack={() => navigation.goBack()}
        onNext={handleProsseguir}
        disabled={weekDays.every(day => !days[day.key].enabled)}
      />
      <Modal
        visible={editModal.visible}
        transparent
        animationType="fade"
        onRequestClose={() => setEditModal({ ...editModal, visible: false })}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View style={[styles.modalContent, isDarkMode && { backgroundColor: theme.card }]}>
            <Text style={[styles.modalTitle, isDarkMode && { color: theme.text }]}>Editar horário</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 24 }}>
              <View style={{ alignItems: 'center', marginRight: 16 }}>
                <Text style={{ fontSize: 14, color: isDarkMode ? theme.text : colors.dark_gray }}>Hora</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <TouchableOpacity onPress={() => setEditModal(m => ({ ...m, hour: Math.max(0, m.hour - 1) }))}>
                    <Ionicons name="remove-circle-outline" size={28} color={colors.blue} />
                  </TouchableOpacity>
                  <Text style={[styles.modalTimeText, isDarkMode && { color: theme.text }]}>{pad(editModal.hour)}</Text>
                  <TouchableOpacity onPress={() => setEditModal(m => ({ ...m, hour: Math.min(23, m.hour + 1) }))}>
                    <Ionicons name="add-circle-outline" size={28} color={colors.blue} />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 14, color: isDarkMode ? theme.text : colors.dark_gray }}>Minuto</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <TouchableOpacity onPress={() => setEditModal(m => ({ ...m, minute: Math.max(0, m.minute - 5) }))}>
                    <Ionicons name="remove-circle-outline" size={28} color={colors.blue} />
                  </TouchableOpacity>
                  <Text style={[styles.modalTimeText, isDarkMode && { color: theme.text }]}>{pad(editModal.minute)}</Text>
                  <TouchableOpacity onPress={() => setEditModal(m => ({ ...m, minute: Math.min(55, m.minute + 5) }))}>
                    <Ionicons name="add-circle-outline" size={28} color={colors.blue} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between' }}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel, isDarkMode && { backgroundColor: theme.background }]}
                onPress={() => setEditModal({ ...editModal, visible: false })}
              >
                <Text style={[styles.modalButtonText, isDarkMode && { color: theme.text }]}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonSave]}
                onPress={saveEditModal}
              >
                <Text style={styles.modalButtonText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
} 