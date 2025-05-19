import React, { useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, SafeAreaView, StatusBar, Modal, TouchableWithoutFeedback, FlatList, TextInput } from 'react-native';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import { colors } from '../styles/globalStyles/colors';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Calendar } from 'react-native-calendars';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import Constants from 'expo-constants';
import { spaceDetailsStyles as styles, windowWidth } from '../styles/spaceDetails.style';

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
  const [showFullDescription, setShowFullDescription] = useState(false);
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

  // Estados para avaliações
  const [reviews, setReviews] = useState([
    {
      id: 1,
      user: 'Ricardo Fernandes',
      rating: 5,
      text: 'Experiência incrível! O espaço para festas superou todas as expectativas – amplo, bem organizado e exatamente como descrito. A estrutura é perfeita para eventos, com iluminação, som e conforto impecáveis. A comunicação com o anfitrião foi rápida e eficiente. Recomendo muito!',
      expanded: false,
    },
    {
      id: 2,
      user: 'Maria Souza',
      rating: 4,
      text: 'Pode melhorar em alguns pontos, mas no geral foi uma ótima experiência. O espaço é bem localizado e o anfitrião foi muito prestativo.',
      expanded: false,
    },
  ]);
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState('');

  const MAX_DESCRIPTION_LENGTH = 150;
  const shouldShowMoreButton = space.description && space.description.length > MAX_DESCRIPTION_LENGTH;
  const displayDescription = showFullDescription
    ? space.description
    : space.description?.substring(0, MAX_DESCRIPTION_LENGTH) + '...';

  const MAX_REVIEW_LENGTH = 120;
  const toggleReview = (id: number) => {
    setReviews(reviews.map(r =>
      r.id === id ? { ...r, expanded: !r.expanded } : r
    ));
  };
  const renderReview = (review: any) => (
    <View key={review.id} style={{ backgroundColor: '#fff', borderRadius: 8, padding: 12, marginBottom: 12, elevation: 2 }}>
      <Text style={{ fontWeight: 'bold' }}>{review.user}</Text>
      <Text style={{ color: '#888', fontSize: 12 }}>{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</Text>
      <Text>
        {review.expanded || review.text.length <= MAX_REVIEW_LENGTH
          ? review.text
          : review.text.substring(0, MAX_REVIEW_LENGTH) + '...'}
      </Text>
      {review.text.length > MAX_REVIEW_LENGTH && (
        <TouchableOpacity onPress={() => toggleReview(review.id)}>
          <Text style={{ color: '#1976d2', fontWeight: 'bold' }}>
            {review.expanded ? 'Mostrar menos' : 'Mostrar mais'} &gt;
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );

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
    setConfirmModalVisible(true);
    // Fecha o modal após 2 segundos
    setTimeout(() => {
      setConfirmModalVisible(false);
    }, 2000);
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
              <Text style={styles.description}>{displayDescription}</Text>
              {shouldShowMoreButton && (
                <TouchableOpacity
                  onPress={() => setShowFullDescription(!showFullDescription)}
                  style={styles.moreButton}
                >
                  <Text style={styles.moreButtonText}>
                    {showFullDescription ? 'Ver menos' : 'Ver mais'}
                  </Text>
                </TouchableOpacity>
              )}
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
        </View>

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

        {/* Avaliações e comentários */}
        <View style={{ marginBottom: 24, paddingHorizontal: 16 }}>
          <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 8 }}>Avaliações do local</Text>
          <FlatList
            data={reviews}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => (
              <View style={{
                backgroundColor: '#fff',
                borderRadius: 12,
                padding: 14,
                marginRight: 12,
                borderWidth: 1,
                borderColor: '#e0e0e0',
                minWidth: 240,
                maxWidth: 280,
                elevation: 2,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.08,
                shadowRadius: 3,
              }}>
                {renderReview(item)}
              </View>
            )}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginBottom: 8 }}
            contentContainerStyle={{ paddingHorizontal: 0 }}
          />
        </View>

        <View style={{ marginBottom: 24, paddingHorizontal: 16, alignItems: 'center' }}>
          <Text style={{ color: '#1976d2', fontWeight: 'bold', fontSize: 16, marginBottom: 8, textAlign: 'center' }}>Avalie este local</Text>
          <View style={{ flexDirection: 'row', marginBottom: 12, justifyContent: 'center' }}>
            {[1, 2, 3, 4, 5].map(star => (
              <TouchableOpacity key={star} onPress={() => setNewRating(star)}>
                <Text style={{ fontSize: 28, color: newRating >= star ? '#FFD700' : '#ccc' }}>★</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={{ color: '#1976d2', fontWeight: 'bold', fontSize: 16, marginBottom: 8, textAlign: 'center' }}>Adicione um comentário</Text>
          <TextInput
            style={{ backgroundColor: '#fff', borderRadius: 8, minHeight: 60, padding: 8, borderWidth: 1, borderColor: '#ccc', marginBottom: 12, width: '100%' }}
            multiline
            value={newComment}
            onChangeText={setNewComment}
            placeholder="Digite seu comentário..."
          />
          <TouchableOpacity
            style={{ backgroundColor: '#1976d2', borderRadius: 6, paddingVertical: 8, paddingHorizontal: 24, alignItems: 'center', alignSelf: 'center' }}
            onPress={() => {
              if (newRating && newComment) {
                setReviews([
                  { id: Date.now(), user: 'Você', rating: newRating, text: newComment, expanded: false },
                  ...reviews,
                ]);
                setNewRating(0);
                setNewComment('');
              }
            }}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 15 }}>Comentar</Text>
          </TouchableOpacity>
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
          animationType="none"
          onRequestClose={() => setConfirmModalVisible(false)}
        >
          <View style={styles.confirmModalContainer}>
            <View style={styles.confirmModal}>
              <MaterialIcons name="check-circle" size={24} color={colors.blue} />
              <Text style={styles.confirmTitle}>Reserva confirmada!</Text>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
} 