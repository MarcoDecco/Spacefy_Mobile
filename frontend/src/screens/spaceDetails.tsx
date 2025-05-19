import React, { useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, Dimensions, SafeAreaView, StatusBar, Modal, TouchableWithoutFeedback, FlatList } from 'react-native';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import { colors } from '../styles/globalStyles/colors';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Calendar } from 'react-native-calendars';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import Constants from 'expo-constants';

const { width: windowWidth } = Dimensions.get('window');
const statusBarHeight = Constants.statusBarHeight;

interface SpaceDetailsProps {
  route: {
    params: {
      space: {
        id: string;
        images: any[];
        title: string;
        address: string;
        price: string;
        rating: number;
        reviews: number;
        description?: string;
        amenities?: string[];
      }
    }
  }
}

export default function SpaceDetails({ route }: SpaceDetailsProps) {
  const { space } = route.params;
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlayPaused, setIsAutoPlayPaused] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const [checkInDate, setCheckInDate] = useState(new Date());
  const [checkOutDate, setCheckOutDate] = useState(new Date());
  const [checkInTime, setCheckInTime] = useState(new Date());
  const [checkOutTime, setCheckOutTime] = useState(new Date());
  const [pickerVisible, setPickerVisible] = useState(false);
  const [pickerMode, setPickerMode] = useState<'date' | 'time'>('date');
  const [pickerTarget, setPickerTarget] = useState<'checkInDate' | 'checkOutDate' | 'checkInTime' | 'checkOutTime'>('checkInDate');

  // Estados para modal do calendário customizado
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [calendarTarget, setCalendarTarget] = useState<'checkInDate' | 'checkOutDate'>('checkInDate');

  const [timeModalVisible, setTimeModalVisible] = useState(false);
  const [timeModalTarget, setTimeModalTarget] = useState<'checkInTime' | 'checkOutTime'>('checkInTime');

  const [confirmModalVisible, setConfirmModalVisible] = useState(false);

  const handleScroll = (event: any) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    setActiveIndex(Math.round(index));
  };

  const scrollToIndex = (index: number) => {
    const newIndex = Math.max(0, Math.min(index, space.images.length - 1));
    scrollRef.current?.scrollTo({
      x: newIndex * windowWidth,
      animated: true
    });
    setActiveIndex(newIndex);
  };

  const handleMomentumScrollEnd = (event: any) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    const roundedIndex = Math.round(index);

    if (roundedIndex !== activeIndex) {
      scrollToIndex(roundedIndex);
    }
  };

  useEffect(() => {
    if (space.images.length <= 1 || isAutoPlayPaused || !isFocused) return;
    const timer = setInterval(() => {
      scrollToIndex((activeIndex + 1) % space.images.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [activeIndex, isAutoPlayPaused, space.images.length, isFocused]);

  const openPicker = (target: typeof pickerTarget, mode: typeof pickerMode) => {
    if (mode === 'date') {
      setCalendarTarget(target as 'checkInDate' | 'checkOutDate');
      setCalendarVisible(true);
    } else {
      setPickerTarget(target);
      setPickerMode(mode);
      setPickerVisible(true);
    }
  };

  const handlePickerConfirm = (date: Date) => {
    setPickerVisible(false);
    if (pickerTarget === 'checkInDate') setCheckInDate(date);
    if (pickerTarget === 'checkOutDate') setCheckOutDate(date);
    if (pickerTarget === 'checkInTime') setCheckInTime(date);
    if (pickerTarget === 'checkOutTime') setCheckOutTime(date);
  };

  // Função para tratar a seleção do calendário
  const handleCalendarSelect = (day: { dateString: string }) => {
    const selected = new Date(day.dateString + 'T00:00:00');
    if (calendarTarget === 'checkInDate') setCheckInDate(selected);
    if (calendarTarget === 'checkOutDate') setCheckOutDate(selected);
    setCalendarVisible(false);
  };

  const handleRent = () => {
    // Aqui você implementará a lógica de aluguel
    setConfirmModalVisible(true);
    // Se quiser, pode adicionar lógica de envio para backend aqui
  };

  // Função para abrir o modal de horário
  const openTimeModal = (target: typeof timeModalTarget) => {
    setTimeModalTarget(target);
    setTimeModalVisible(true);
  };

  // Gerar lista de horários de 30 em 30 minutos
  const generateTimeList = () => {
    const times = [];
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += 30) {
        const hour = h.toString().padStart(2, '0');
        const min = m.toString().padStart(2, '0');
        times.push(`${hour}:${min}`);
      }
    }
    return times;
  };
  const timeList = generateTimeList();

  // Função para selecionar horário
  const handleTimeSelect = (timeStr: string) => {
    const [hour, minute] = timeStr.split(':').map(Number);
    const selected = new Date();
    selected.setHours(hour, minute, 0, 0);
    if (timeModalTarget === 'checkInTime') setCheckInTime(selected);
    if (timeModalTarget === 'checkOutTime') setCheckOutTime(selected);
    setTimeModalVisible(false);
  };

  // Função para calcular o total
  function calcularTotal() {
    // Junta data e hora de check-in
    const checkIn = new Date(
      checkInDate.getFullYear(),
      checkInDate.getMonth(),
      checkInDate.getDate(),
      checkInTime.getHours(),
      checkInTime.getMinutes(),
      0, 0
    );
    // Junta data e hora de check-out
    const checkOut = new Date(
      checkOutDate.getFullYear(),
      checkOutDate.getMonth(),
      checkOutDate.getDate(),
      checkOutTime.getHours(),
      checkOutTime.getMinutes(),
      0, 0
    );
    // Diferença em milissegundos
    const diffMs = checkOut.getTime() - checkIn.getTime();
    // Diferença em horas
    const diffHoras = Math.max(diffMs / (1000 * 60 * 60), 0);
    // Preço por hora (convertendo para número)
    const precoPorHora = Number(space.price.replace(/[^0-9,.-]+/g, '').replace(',', '.'));
    // Total
    const total = diffHoras * precoPorHora;
    // Formatar para moeda brasileira
    return total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <View style={styles.statusBarGradient} />
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.imageContainer}>
          {/* Botão de voltar */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Feather name="arrow-left" size={24} color="white" />
          </TouchableOpacity>

          {/* Carrossel de Imagens */}
          {space.images.length > 1 ? (
            <View>
              <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={handleScroll}
                onMomentumScrollEnd={handleMomentumScrollEnd}
                ref={scrollRef}
                scrollEventThrottle={16}
                onTouchStart={() => setIsAutoPlayPaused(true)}
                onTouchEnd={() => setIsAutoPlayPaused(false)}
                decelerationRate="fast"
                snapToInterval={windowWidth}
                snapToAlignment="center"
              >
                {space.images.map((image, index) => (
                  <Image
                    key={index}
                    source={image}
                    style={styles.image}
                    resizeMode="cover"
                  />
                ))}
              </ScrollView>

              {/* Dots */}
              <View style={styles.dotsContainer}>
                {space.images.map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.dot,
                      index === activeIndex ? styles.dotActive : styles.dotInactive
                    ]}
                  />
                ))}
              </View>

              {/* Contador de imagens */}
              <View style={styles.counter}>
                <Text style={styles.counterText}>
                  {activeIndex + 1}/{space.images.length}
                </Text>
              </View>

              {/* Botão de favoritar */}
              <TouchableOpacity
                style={styles.favoriteButton}
                onPress={() => setIsFavorite(!isFavorite)}
              >
                <MaterialIcons
                  name={isFavorite ? "favorite" : "favorite-outline"}
                  size={24}
                  color={isFavorite ? colors.blue : "white"}
                />
              </TouchableOpacity>
            </View>
          ) : (
            <Image
              source={space.images[0]}
              style={styles.image}
              resizeMode="cover"
            />
          )}
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>{space.title}</Text>
          <Text style={styles.address}>{space.address}</Text>

          <View style={styles.ratingContainer}>
            <MaterialIcons name="star" size={20} color="#F59E0B" />
            <Text style={styles.rating}>{space.rating.toFixed(1)}</Text>
            <Text style={styles.reviews}>({space.reviews} avaliações)</Text>
          </View>

          <Text style={styles.price}>{space.price} por hora</Text>

          {space.description && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Descrição</Text>
              <Text style={styles.description}>{space.description}</Text>
            </View>
          )}

          {space.amenities && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Comodidades</Text>
              {space.amenities.map((amenity, index) => (
                <View key={index} style={styles.amenityItem}>
                  <MaterialIcons name="check-circle" size={20} color={colors.blue} />
                  <Text style={styles.amenityText}>{amenity}</Text>
                </View>
              ))}
            </View>
          )}

          <View style={styles.bookingCard}>
            <View style={styles.row}>
              {/* Check-in */}
              <View style={styles.column}>
                <Text style={styles.label}>Check-in</Text>
                <TouchableOpacity style={styles.valueBox} onPress={() => openPicker('checkInDate', 'date')}>
                  <Text style={styles.valueText}>{checkInDate.toLocaleDateString()}</Text>
                </TouchableOpacity>
                <Text style={styles.label}>Hora:</Text>
                <TouchableOpacity style={styles.valueBox} onPress={() => openTimeModal('checkInTime')}>
                  <Text style={styles.valueText}>{checkInTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.verticalDivider} />
              {/* Check-out */}
              <View style={styles.column}>
                <Text style={styles.label}>Check-out</Text>
                <TouchableOpacity style={styles.valueBox} onPress={() => openPicker('checkOutDate', 'date')}>
                  <Text style={styles.valueText}>{checkOutDate.toLocaleDateString()}</Text>
                </TouchableOpacity>
                <Text style={styles.label}>Hora:</Text>
                <TouchableOpacity style={styles.valueBox} onPress={() => openTimeModal('checkOutTime')}>
                  <Text style={styles.valueText}>{checkOutTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.horizontalDivider} />
            <View style={styles.totalRow}>
              <View>
                <Text style={styles.label}>Total:</Text>
                <Text style={styles.totalValue}>{calcularTotal()}</Text>
              </View>
              <TouchableOpacity style={styles.rentButton} onPress={handleRent}>
                <Text style={styles.rentButtonText}>Alugar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Modal do calendário customizado */}
        <Modal
          visible={calendarVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setCalendarVisible(false)}
        >
          <TouchableWithoutFeedback onPress={() => setCalendarVisible(false)}>
            <View style={styles.calendarOverlay}>
              <TouchableWithoutFeedback>
                <View style={styles.calendarModal}>
                  <Calendar
                    onDayPress={handleCalendarSelect}
                    markedDates={{
                      [(calendarTarget === 'checkInDate' ? checkInDate : checkOutDate).toISOString().split('T')[0]]: { selected: true, selectedColor: colors.blue }
                    }}
                    minDate={calendarTarget === 'checkOutDate' ? checkInDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}
                    theme={{
                      backgroundColor: '#fff',
                      calendarBackground: '#fff',
                      textSectionTitleColor: '#222',
                      selectedDayBackgroundColor: colors.blue,
                      selectedDayTextColor: '#fff',
                      todayTextColor: colors.blue,
                      dayTextColor: '#222',
                      textDisabledColor: '#ccc',
                      arrowColor: colors.blue,
                      monthTextColor: colors.blue,
                      indicatorColor: colors.blue,
                      textDayFontWeight: 'bold',
                      textMonthFontWeight: 'bold',
                      textDayHeaderFontWeight: 'bold',
                      textDayFontSize: 16,
                      textMonthFontSize: 18,
                      textDayHeaderFontSize: 14,
                    }}
                  />
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        {/* DateTimePickerModal para horários */}
        <DateTimePickerModal
          isVisible={pickerVisible}
          mode={pickerMode}
          date={
            pickerTarget === 'checkInDate' ? checkInDate :
            pickerTarget === 'checkOutDate' ? checkOutDate :
            pickerTarget === 'checkInTime' ? checkInTime :
            checkOutTime
          }
          minimumDate={pickerTarget === 'checkOutDate' ? checkInDate : new Date()}
          onConfirm={handlePickerConfirm}
          onCancel={() => setPickerVisible(false)}
          locale="pt-BR"
          confirmTextIOS="Confirmar"
          cancelTextIOS="Cancelar"
        />

        {/* Modal customizado para horários */}
        <Modal
          visible={timeModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setTimeModalVisible(false)}
        >
          <TouchableWithoutFeedback onPress={() => setTimeModalVisible(false)}>
            <View style={styles.calendarOverlay}>
              <TouchableWithoutFeedback>
                <View style={styles.timeModal}>
                  <Text style={styles.timeModalTitle}>Selecione o horário</Text>
                  <FlatList
                    data={timeList}
                    keyExtractor={item => item}
                    style={{ maxHeight: 320 }}
                    renderItem={({ item }) => (
                      <TouchableOpacity style={styles.timeItem} onPress={() => handleTimeSelect(item)}>
                        <Text style={styles.timeItemText}>{item}</Text>
                      </TouchableOpacity>
                    )}
                    showsVerticalScrollIndicator={false}
                  />
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        <Modal
          visible={confirmModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setConfirmModalVisible(false)}
        >
          <TouchableWithoutFeedback onPress={() => setConfirmModalVisible(false)}>
            <View style={styles.calendarOverlay}>
              <TouchableWithoutFeedback>
                <View style={styles.confirmModal}>
                  <Text style={styles.confirmTitle}>Sua reserva foi feita!</Text>
                  <TouchableOpacity style={styles.confirmButton} onPress={() => setConfirmModalVisible(false)}>
                    <Text style={styles.confirmButtonText}>OK</Text>
                  </TouchableOpacity>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  statusBarGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: statusBarHeight + 0,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    zIndex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  imageContainer: {
    height: 300,
    position: 'relative',
  },
  image: {
    width: windowWidth,
    height: 300,
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: 8,
    borderRadius: 20,
  },
  favoriteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: 8,
    borderRadius: 20,
  },
  dotsContainer: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 3,
  },
  dotActive: {
    backgroundColor: colors.white,
  },
  dotInactive: {
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  counter: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  counterText: {
    color: colors.white,
    fontSize: 12,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.black,
    marginBottom: 8,
  },
  address: {
    fontSize: 16,
    color: colors.gray,
    marginBottom: 16,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  rating: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.black,
    marginLeft: 4,
  },
  reviews: {
    fontSize: 14,
    color: colors.gray,
    marginLeft: 4,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.blue,
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.black,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: colors.gray,
    lineHeight: 24,
  },
  amenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  amenityText: {
    fontSize: 16,
    color: colors.gray,
    marginLeft: 8,
  },
  bookingCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  column: {
    flex: 1,
    alignItems: 'flex-start',
  },
  verticalDivider: {
    width: 1,
    backgroundColor: '#eee',
    marginHorizontal: 12,
  },
  horizontalDivider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 12,
  },
  label: {
    fontWeight: 'bold',
    color: '#444',
    marginBottom: 4,
    fontSize: 15,
  },
  valueBox: {
    backgroundColor: '#fff',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  valueText: {
    fontSize: 18,
    color: '#222',
    fontWeight: 'bold',
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
    marginTop: 2,
  },
  rentButton: {
    backgroundColor: colors.blue,
    paddingVertical: 10,
    paddingHorizontal: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    elevation: 2,
  },
  rentButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  calendarOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarModal: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    width: 340,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  timeModal: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    width: 220,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    alignItems: 'center',
  },
  timeModalTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    color: colors.blue,
    marginBottom: 12,
  },
  timeItem: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 4,
    alignItems: 'center',
  },
  timeItemText: {
    fontSize: 18,
    color: '#222',
  },
  confirmModal: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    width: 260,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    alignItems: 'center',
  },
  confirmTitle: {
    fontWeight: 'bold',
    fontSize: 20,
    color: colors.blue,
    marginBottom: 18,
    textAlign: 'center',
  },
  confirmButton: {
    backgroundColor: colors.blue,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 32,
    marginTop: 8,
  },
  confirmButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
}); 