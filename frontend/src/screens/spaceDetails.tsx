import React, { useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, SafeAreaView, StatusBar, Modal, TouchableWithoutFeedback, FlatList, TextInput } from 'react-native';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import { colors } from '../styles/globalStyles/colors';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Calendar } from 'react-native-calendars';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import Constants from 'expo-constants';
import { spaceDetailsStyles as styles, windowWidth } from '../styles/spaceDetails.style';
import { useTheme } from '../contexts/ThemeContext';

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
  const { theme, isDarkMode } = useTheme();
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
    <View key={review.id} style={[styles.reviewCard, isDarkMode && { backgroundColor: theme.card }]}>
      <Text style={[styles.reviewUser, isDarkMode && { color: theme.text }]}>{review.user}</Text>
      <Text style={[styles.reviewRating, isDarkMode && { color: theme.text }]}>{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</Text>
      <Text style={[styles.reviewText, isDarkMode && { color: theme.text }]}>
        {review.expanded || review.text.length <= MAX_REVIEW_LENGTH
          ? review.text
          : review.text.substring(0, MAX_REVIEW_LENGTH) + '...'}
      </Text>
      {review.text.length > MAX_REVIEW_LENGTH && (
        <TouchableOpacity onPress={() => toggleReview(review.id)}>
          <Text style={[styles.reviewMoreButton, isDarkMode && { color: theme.blue }]}>
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
    <SafeAreaView style={[styles.safeArea, isDarkMode && { backgroundColor: theme.background }]}>
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor="transparent"
        translucent
      />
      <View style={styles.statusBarGradient} />
      <ScrollView
        style={[styles.container, isDarkMode && { backgroundColor: theme.background }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.imageContainer}>
          {/* Botão de voltar */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <MaterialIcons name="arrow-back" size={24} color={colors.white} />
          </TouchableOpacity>

          {/* Botão de favorito */}
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={() => setIsFavorite(!isFavorite)}
          >
            <MaterialIcons
              name={isFavorite ? "favorite" : "favorite-border"}
              size={24}
              color={isFavorite ? "#FF3B30" : colors.white}
            />
          </TouchableOpacity>

          {/* Carrossel de imagens */}
          <ScrollView
            ref={scrollRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            onMomentumScrollEnd={handleMomentumScrollEnd}
            scrollEventThrottle={16}
            onTouchStart={() => setIsAutoPlayPaused(true)}
            onTouchEnd={() => setIsAutoPlayPaused(false)}
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

          {/* Indicadores de página */}
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
        </View>

        <View style={styles.content}>
          <Text style={[styles.title, isDarkMode && { color: theme.text }]}>{space.title}</Text>
          <Text style={[styles.address, isDarkMode && { color: theme.text }]}>{space.address}</Text>

          <View style={styles.ratingContainer}>
            <MaterialIcons name="star" size={20} color={colors.blue} />
            <Text style={[styles.rating, isDarkMode && { color: theme.text }]}>{space.rating}</Text>
            <Text style={[styles.reviews, isDarkMode && { color: theme.text }]}>({space.reviews} avaliações)</Text>
          </View>

          <Text style={styles.price}>{space.price}</Text>

          {/* Descrição */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, isDarkMode && { color: theme.text }]}>Descrição</Text>
            <Text style={[styles.description, isDarkMode && { color: theme.text }]}>
              {displayDescription}
            </Text>
            {shouldShowMoreButton && (
              <TouchableOpacity
                style={styles.moreButton}
                onPress={() => setShowFullDescription(!showFullDescription)}
              >
                <Text style={[styles.moreButtonText, isDarkMode && { color: theme.blue }]}>
                  {showFullDescription ? 'Mostrar menos' : 'Mostrar mais'}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Comodidades */}
          {space.amenities && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, isDarkMode && { color: theme.text }]}>Comodidades</Text>
              {space.amenities.map((amenity, index) => (
                <View key={index} style={styles.amenityItem}>
                  <MaterialIcons name="check-circle" size={20} color={colors.blue} />
                  <Text style={[styles.amenityText, isDarkMode && { color: theme.text }]}>{amenity}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Card de reserva */}
          <View style={[styles.bookingCard, isDarkMode && { backgroundColor: theme.card }]}>
            <View style={styles.row}>
              <View style={styles.column}>
                <Text style={[styles.label, isDarkMode && { color: theme.text }]}>Check-in</Text>
                <TouchableOpacity
                  style={[styles.valueBox, isDarkMode && { backgroundColor: theme.background }]}
                  onPress={() => openPicker('checkInDate', 'date')}
                >
                  <Text style={[styles.valueText, isDarkMode && { color: theme.text }]}>
                    {checkInDate.toLocaleDateString()}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.valueBox, isDarkMode && { backgroundColor: theme.background }]}
                  onPress={() => openTimeModal('checkInTime')}
                >
                  <Text style={[styles.valueText, isDarkMode && { color: theme.text }]}>
                    {checkInTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={[styles.verticalDivider, isDarkMode && { backgroundColor: theme.border }]} />

              <View style={styles.column}>
                <Text style={[styles.label, isDarkMode && { color: theme.text }]}>Check-out</Text>
                <TouchableOpacity
                  style={[styles.valueBox, isDarkMode && { backgroundColor: theme.background }]}
                  onPress={() => openPicker('checkOutDate', 'date')}
                >
                  <Text style={[styles.valueText, isDarkMode && { color: theme.text }]}>
                    {checkOutDate.toLocaleDateString()}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.valueBox, isDarkMode && { backgroundColor: theme.background }]}
                  onPress={() => openTimeModal('checkOutTime')}
                >
                  <Text style={[styles.valueText, isDarkMode && { color: theme.text }]}>
                    {checkOutTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={[styles.horizontalDivider, isDarkMode && { backgroundColor: theme.border }]} />

            <View style={styles.totalRow}>
              <Text style={[styles.label, isDarkMode && { color: theme.text }]}>Total</Text>
              <Text style={[styles.totalValue, isDarkMode && { color: theme.text }]}>{calcularTotal()}</Text>
            </View>

            <TouchableOpacity style={styles.rentButton} onPress={handleRent}>
              <Text style={styles.rentButtonText}>Alugar</Text>
            </TouchableOpacity>
          </View>

          {/* Avaliações */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, isDarkMode && { color: theme.text }]}>Avaliações</Text>
            {reviews.map(renderReview)}
          </View>
        </View>
      </ScrollView>

      {/* Modal do Calendário */}
      <Modal
        visible={calendarVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setCalendarVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setCalendarVisible(false)}>
          <View style={styles.calendarOverlay}>
            <TouchableWithoutFeedback>
              <View style={[styles.calendarModal, isDarkMode && { backgroundColor: theme.card }]}>
                <Calendar
                  onDayPress={handleCalendarSelect}
                  markedDates={{
                    [checkInDate.toISOString().split('T')[0]]: { selected: true, selectedColor: colors.blue },
                    [checkOutDate.toISOString().split('T')[0]]: { selected: true, selectedColor: colors.blue }
                  }}
                  theme={{
                    backgroundColor: isDarkMode ? theme.card : colors.white,
                    calendarBackground: isDarkMode ? theme.card : colors.white,
                    textSectionTitleColor: isDarkMode ? theme.text : colors.black,
                    selectedDayBackgroundColor: colors.blue,
                    selectedDayTextColor: colors.white,
                    todayTextColor: colors.blue,
                    dayTextColor: isDarkMode ? theme.text : colors.black,
                    textDisabledColor: isDarkMode ? theme.border : colors.gray,
                    monthTextColor: isDarkMode ? theme.text : colors.black,
                    arrowColor: colors.blue,
                  }}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Modal de Horário */}
      <Modal
        visible={timeModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setTimeModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setTimeModalVisible(false)}>
          <View style={styles.calendarOverlay}>
            <TouchableWithoutFeedback>
              <View style={[styles.calendarModal, isDarkMode && { backgroundColor: theme.card }]}>
                <Text style={[styles.sectionTitle, isDarkMode && { color: theme.text }]}>
                  Selecione o horário
                </Text>
                <FlatList
                  data={timeList}
                  keyExtractor={(item) => item}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={[styles.timeItem, isDarkMode && { backgroundColor: theme.background }]}
                      onPress={() => handleTimeSelect(item)}
                    >
                      <Text style={[styles.timeText, isDarkMode && { color: theme.text }]}>{item}</Text>
                    </TouchableOpacity>
                  )}
                  numColumns={3}
                  contentContainerStyle={styles.timeList}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Modal de Confirmação */}
      <Modal
        visible={confirmModalVisible}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.calendarOverlay}>
          <View style={[styles.confirmModal, isDarkMode && { backgroundColor: theme.card }]}>
            <MaterialIcons name="check-circle" size={48} color={colors.blue} />
            <Text style={[styles.confirmText, isDarkMode && { color: theme.text }]}>
              Reserva realizada com sucesso!
            </Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
} 