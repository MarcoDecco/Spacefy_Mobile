import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  SafeAreaView,
  Platform,
  Modal,
  TextInput,
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
    <SafeAreaView style={styles.container}>
      <View style={styles.progressContainer}>
        <ProgressBar progress={0.5} currentStep={4} totalSteps={8} />
      </View>
      <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Disponibilidade do espaço</Text>
        <Text style={styles.subtitle}>
          Selecione os dias e horários em que seu espaço estará disponível para reserva.
        </Text>

        {/* Campo de preço por hora */}
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Preço por hora (R$)</Text>
          <TextInput
            style={styles.priceInput}
            value={pricePerHour}
            onChangeText={setPricePerHour}
            keyboardType="numeric"
            placeholder="0,00"
            placeholderTextColor={colors.gray}
          />
        </View>

        <View style={styles.availabilityContainer}>
          {weekDays.map(day => (
            <View key={day.key} style={{ marginBottom: 16 }}>
              <TouchableOpacity
                style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}
                onPress={() => toggleDay(day.key)}
              >
                <View style={{
                  width: 24, height: 24, borderRadius: 6, borderWidth: 2, borderColor: days[day.key].enabled ? colors.blue : colors.gray, backgroundColor: days[day.key].enabled ? colors.blue : 'transparent', marginRight: 12, justifyContent: 'center', alignItems: 'center',
                }}>
                  {days[day.key].enabled && <Ionicons name="checkmark" size={18} color={colors.white} />}
                </View>
                <Text style={{ fontSize: 16, color: colors.black, fontWeight: '500' }}>{day.label}</Text>
              </TouchableOpacity>
              {days[day.key].enabled && days[day.key].slots.map((slot, idx) => (
                <View key={idx} style={styles.timeSlotRow}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                    <Text style={{ fontSize: 14, color: colors.dark_gray, marginRight: 8 }}>Início:</Text>
                    <TouchableOpacity
                      style={{
                        borderWidth: 1,
                        borderColor: colors.light_gray,
                        borderRadius: 6,
                        paddingHorizontal: 12,
                        paddingVertical: Platform.OS === 'ios' ? 8 : 4,
                        marginRight: 8,
                        backgroundColor: colors.white,
                      }}
                      onPress={() => openEditModal(day.key, idx, 'start', slot.start)}
                    >
                      <Text style={{ fontSize: 16, color: colors.black }}>{slot.start}</Text>
                    </TouchableOpacity>
                    <Text style={{ fontSize: 14, color: colors.dark_gray, marginRight: 8 }}>Fim:</Text>
                    <TouchableOpacity
                      style={{
                        borderWidth: 1,
                        borderColor: colors.light_gray,
                        borderRadius: 6,
                        paddingHorizontal: 12,
                        paddingVertical: Platform.OS === 'ios' ? 8 : 4,
                        backgroundColor: colors.white,
                      }}
                      onPress={() => openEditModal(day.key, idx, 'end', slot.end)}
                    >
                      <Text style={{ fontSize: 16, color: colors.black }}>{slot.end}</Text>
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
                <TouchableOpacity style={styles.addTimeSlotButton} onPress={() => addSlot(day.key)}>
                  <Ionicons name="add-circle" size={20} color={colors.blue} />
                  <Text style={styles.addTimeSlotText}>Adicionar horário</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
          <TouchableOpacity style={[styles.addTimeSlotButton, { marginTop: 8 }]} onPress={replicateFirstDay}>
            <Ionicons name="copy" size={20} color={colors.blue} />
            <Text style={styles.addTimeSlotText}>Replicar horários do primeiro dia</Text>
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
          <View style={{ backgroundColor: colors.white, borderRadius: 16, padding: 24, width: 280, alignItems: 'center' }}>
            <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 16 }}>Editar horário</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 24 }}>
              <View style={{ alignItems: 'center', marginRight: 16 }}>
                <Text style={{ fontSize: 14, color: colors.dark_gray }}>Hora</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <TouchableOpacity onPress={() => setEditModal(m => ({ ...m, hour: Math.max(0, m.hour - 1) }))}>
                    <Ionicons name="remove-circle-outline" size={28} color={colors.blue} />
                  </TouchableOpacity>
                  <Text style={{ fontSize: 24, marginHorizontal: 8, minWidth: 32, textAlign: 'center' }}>{pad(editModal.hour)}</Text>
                  <TouchableOpacity onPress={() => setEditModal(m => ({ ...m, hour: Math.min(23, m.hour + 1) }))}>
                    <Ionicons name="add-circle-outline" size={28} color={colors.blue} />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 14, color: colors.dark_gray }}>Minuto</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <TouchableOpacity onPress={() => setEditModal(m => ({ ...m, minute: Math.max(0, m.minute - 5) }))}>
                    <Ionicons name="remove-circle-outline" size={28} color={colors.blue} />
                  </TouchableOpacity>
                  <Text style={{ fontSize: 24, marginHorizontal: 8, minWidth: 32, textAlign: 'center' }}>{pad(editModal.minute)}</Text>
                  <TouchableOpacity onPress={() => setEditModal(m => ({ ...m, minute: Math.min(55, m.minute + 5) }))}>
                    <Ionicons name="add-circle-outline" size={28} color={colors.blue} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between' }}>
              <TouchableOpacity
                style={{ flex: 1, backgroundColor: colors.light_gray, padding: 12, borderRadius: 8, alignItems: 'center', marginRight: 8 }}
                onPress={() => setEditModal({ ...editModal, visible: false })}
              >
                <Text style={{ color: colors.dark_gray, fontWeight: '600' }}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ flex: 1, backgroundColor: colors.blue, padding: 12, borderRadius: 8, alignItems: 'center' }}
                onPress={saveEditModal}
              >
                <Text style={{ color: colors.white, fontWeight: '600' }}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
} 