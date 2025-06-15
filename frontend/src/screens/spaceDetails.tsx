import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Modal,
  TouchableWithoutFeedback,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Alert,
} from 'react-native';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import { colors } from '../styles/globalStyles/colors';
import { Calendar } from 'react-native-calendars';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { spaceDetailsStyles as styles, windowWidth } from '../styles/spaceDetails.style';
import { useTheme } from '../contexts/ThemeContext';
import api from '../services/api';
import { useFavorites } from '../hooks/useFavorites';
import { useAuth } from '../contexts/AuthContext';
import { CalendarModal } from '../components/CalendarModal';
import { LandlordCard } from '../components/LandlordCard';
import { SpaceDetailsGrid } from '../components/SpaceDetailsGrid';
import { TimeSelectModal } from '../components/TimeSelectModal';
import { SpaceDetailsModal } from '../components/SpaceDetailsModal';
import { ConfirmModal } from '../components/ConfirmModal';
import { CheckInDateTime } from '../components/CheckInDateTime';
import { CheckOutDateTime } from '../components/CheckOutDateTime';
import { ReviewBox } from '../components/ReviewBox';
import { RentalTotalBar } from '../components/RentalTotalBar';
import { DescriptionSection } from '../components/DescriptionSection';
import { ImageCarousel } from '../components/ImageCarousel';
import { SpaceHeader } from '../components/SpaceHeader';
import { RatingRow } from '../components/RatingRow';
import { SpaceDetailsRow } from '../components/SpaceDetailsRow';

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
        type?: string;
        area?: string;
        hasWifi?: boolean;
        capacity?: string;
        bathrooms?: string;
      };
    };
  };
}

interface Review {
  id: number;
  user: string;
  rating: number;
  text: string;
  expanded: boolean;
  avatar: any;
}

interface ReviewResponse {
  id: number;
  userName: string;
  rating: number;
  comment: string;
}

export default function SpaceDetails({ route }: SpaceDetailsProps) {
  const { space } = route.params;
  const navigation = useNavigation<any>();
  const isFocused = useIsFocused();
  const { theme, isDarkMode } = useTheme();
  const { user } = useAuth();
  const { favorites, toggleFavorite } = useFavorites();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlayPaused, setIsAutoPlayPaused] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const [checkInDate, setCheckInDate] = useState(new Date());
  const [checkOutDate, setCheckOutDate] = useState(new Date());
  const [checkInTime, setCheckInTime] = useState(new Date());
  const [checkOutTime, setCheckOutTime] = useState(new Date());
  const [pickerVisible, setPickerVisible] = useState(false);
  const [pickerMode, setPickerMode] = useState<'date' | 'time'>('date');
  const [pickerTarget, setPickerTarget] = useState<
    'checkInDate' | 'checkOutDate' | 'checkInTime' | 'checkOutTime'
  >('checkInDate');

  // Estados para modal do calendário customizado
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [calendarTarget, setCalendarTarget] = useState<'checkInDate' | 'checkOutDate'>(
    'checkInDate'
  );

  const [timeModalVisible, setTimeModalVisible] = useState(false);
  const [timeModalTarget, setTimeModalTarget] = useState<'checkInTime' | 'checkOutTime'>(
    'checkInTime'
  );

  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);

  // Estados para avaliações
  const [reviews, setReviews] = useState([
    {
      id: 1,
      user: 'Ricardo Fernandes',
      rating: 5,
      text: 'Experiência incrível! O espaço para festas superou todas as expectativas – amplo, bem organizado e exatamente como descrito. A estrutura é perfeita para eventos, com iluminação, som e conforto impecáveis. A comunicação com o anfitrião foi rápida e eficiente. Recomendo muito!',
      expanded: false,
      avatar: require('../../assets/perfil-login.png'),
    },
    {
      id: 2,
      user: 'Maria Souza',
      rating: 4,
      text: 'Pode melhorar em alguns pontos, mas no geral foi uma ótima experiência. O espaço é bem localizado e o anfitrião foi muito prestativo.',
      expanded: false,
      avatar: require('../../assets/perfil-login.png'),
    },
  ]);
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState('');

  const MAX_DESCRIPTION_LENGTH = 150;
  const shouldShowMoreButton =
    space.description && space.description.length > MAX_DESCRIPTION_LENGTH;
  const displayDescription = showFullDescription
    ? space.description
    : space.description?.substring(0, MAX_DESCRIPTION_LENGTH) + '...';

  const MAX_REVIEW_LENGTH = 120;
  const toggleReview = (id: number) => {
    setReviews(reviews.map((r) => (r.id === id ? { ...r, expanded: !r.expanded } : r)));
  };
  const renderReview = (review: any) => (
    <View
      key={review.id}
      style={[styles.reviewCard, isDarkMode && { backgroundColor: theme.card }]}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
        {review.avatar ? (
          <Image
            source={review.avatar}
            style={{ width: 36, height: 36, borderRadius: 18, marginRight: 8 }}
          />
        ) : (
          <MaterialIcons
            name="account-circle"
            size={36}
            color={colors.gray}
            style={{ marginRight: 8 }}
          />
        )}
        <View>
          <Text style={[styles.reviewUser, isDarkMode && { color: theme.text }]}>
            {review.user}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
            {[...Array(5)].map((_, index) => (
              <MaterialIcons
                key={index}
                name={index < review.rating ? 'star' : 'star-border'}
                size={16}
                color={index < review.rating ? colors.blue : colors.gray}
                style={{ marginRight: 2 }}
              />
            ))}
          </View>
        </View>
      </View>
      <Text style={[styles.reviewText, isDarkMode && { color: theme.text }]}>
        {review.expanded || review.text.length <= MAX_REVIEW_LENGTH
          ? review.text
          : review.text.substring(0, MAX_REVIEW_LENGTH) + '...'}
      </Text>
      {review.text.length > MAX_REVIEW_LENGTH && (
        <TouchableOpacity onPress={() => toggleReview(review.id)} style={{ flexDirection: 'row' }}>
          <Text style={[styles.reviewMoreButton, isDarkMode && { color: theme.blue }]}>
            {review.expanded ? 'Mostrar menos' : 'Mostrar mais'}
          </Text>
          <Feather
            name={review.expanded ? 'chevron-up' : 'chevron-down'}
            size={16}
            color={isDarkMode ? theme.blue : colors.blue}
            style={{ marginTop: 8, marginLeft: 4 }}
          />
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
      animated: true,
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

  // Estado para controle de loading
  const [isLoading, setIsLoading] = useState(false);

  // Função para fazer a reserva do espaço
  const handleRent = async () => {
    try {
      setIsLoading(true);

      // Junta data e hora de check-in
      const checkIn = new Date(
        checkInDate.getFullYear(),
        checkInDate.getMonth(),
        checkInDate.getDate(),
        checkInTime.getHours(),
        checkInTime.getMinutes(),
        0,
        0
      );

      // Junta data e hora de check-out
      const checkOut = new Date(
        checkOutDate.getFullYear(),
        checkOutDate.getMonth(),
        checkOutDate.getDate(),
        checkOutTime.getHours(),
        checkOutTime.getMinutes(),
        0,
        0
      );

      // Verifica se a data de check-out é posterior ao check-in
      if (checkOut <= checkIn) {
        Alert.alert('Data Inválida', 'A data de check-out deve ser posterior à data de check-in.', [
          { text: 'OK' },
        ]);
        return;
      }

      const reservationData = {
        spaceId: space.id,
        checkIn: checkIn.toISOString(),
        checkOut: checkOut.toISOString(),
        totalValue: calcularTotal(),
      };

      await api.post('/reservations', reservationData);

      setConfirmModalVisible(true);
      setTimeout(() => {
        setConfirmModalVisible(false);
      }, 2000);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível realizar a reserva. Tente novamente mais tarde.', [
        { text: 'OK' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Gerar lista de horários agrupados por período
  const generateTimeList = () => {
    const periods = {
      manha: { start: 6, end: 12 },
      tarde: { start: 12, end: 18 },
      noite: { start: 18, end: 24 },
    };

    const timeGroups = {
      manha: [] as string[],
      tarde: [] as string[],
      noite: [] as string[],
    };

    // Primeiro, geramos os horários normais
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += 30) {
        const hour = h.toString().padStart(2, '0');
        const min = m.toString().padStart(2, '0');
        const timeStr = `${hour}:${min}`;

        if (h >= periods.manha.start && h < periods.manha.end) {
          timeGroups.manha.push(timeStr);
        } else if (h >= periods.tarde.start && h < periods.tarde.end) {
          timeGroups.tarde.push(timeStr);
        } else if (h >= periods.noite.start) {
          timeGroups.noite.push(timeStr);
        }
      }
    }

    // Adiciona os horários de 00:00 até 05:00 no final do período noturno
    for (let h = 0; h <= 5; h++) {
      for (let m = 0; m < 60; m += 30) {
        const hour = h.toString().padStart(2, '0');
        const min = m.toString().padStart(2, '0');
        const timeStr = `${hour}:${min}`;
        timeGroups.noite.push(timeStr);
      }
    }

    return timeGroups;
  };

  const timeGroups = generateTimeList();

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
      0,
      0
    );
    // Junta data e hora de check-out
    const checkOut = new Date(
      checkOutDate.getFullYear(),
      checkOutDate.getMonth(),
      checkOutDate.getDate(),
      checkOutTime.getHours(),
      checkOutTime.getMinutes(),
      0,
      0
    );

    // Verifica se a data de check-out é posterior ao check-in
    if (checkOut <= checkIn) {
      return 'R$ 0,00';
    }

    // Diferença em milissegundos
    const diffMs = checkOut.getTime() - checkIn.getTime();
    // Diferença em minutos
    const diffMinutos = diffMs / (1000 * 60);
    // Converte para horas com decimais (ex: 1.5 para 1 hora e 30 minutos)
    const diffHoras = diffMinutos / 60;

    // Extrai o valor numérico do preço do espaço (remove R$, espaços e converte vírgula para ponto)
    const precoPorHora = parseFloat(space.price.replace(/[R$\s.]/g, '').replace(',', '.'));

    // Calcula o preço por minuto
    const precoPorMinuto = precoPorHora / 60;

    // Calcula o total usando os minutos exatos
    const total = diffMinutos * precoPorMinuto;

    // Formata para moeda brasileira
    return total.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  // Dados dinâmicos para facilitar integração futura com API
  const aluguel = space.price || 'R$1250,00';
  const tipo = space.type || 'Salão de Festas';
  const metragem = space.area || '2500 m²';
  const wifi = space.hasWifi !== undefined ? (space.hasWifi ? 'Sim' : 'Não') : 'Sim';
  const capacidade = space.capacity || '250 Pessoas';
  const banheiros = space.bathrooms || '6 Banheiros';

  const [detailsModalVisible, setDetailsModalVisible] = useState(false);

  // Adicionar verificação de dados do espaço
  const spaceDetails = {
    amenities: space.amenities || [
      'Wi-Fi',
      'Ar Condicionado',
      'Cozinha',
      'Estacionamento',
      'Acessibilidade',
    ],
    type: space.type || 'Não especificado',
    area: space.area || 'Não especificado',
    capacity: space.capacity || 'Não especificado',
    bathrooms: space.bathrooms || 'Não especificado',
    hasWifi: space.hasWifi !== undefined ? space.hasWifi : true,
  };

  // Função para adicionar nova avaliação
  const handleAddReview = () => {
    if (newRating === 0) {
      Alert.alert(
        'Avaliação Incompleta',
        'Por favor, selecione uma avaliação com as estrelas antes de enviar.',
        [{ text: 'OK' }]
      );
      return;
    }

    const newReview: Review = {
      id: reviews.length + 1,
      user: 'Você',
      rating: newRating,
      text: newComment.trim() || 'Sem comentário',
      expanded: false,
      avatar: require('../../assets/perfil-login.png'),
    };

    setReviews([newReview, ...reviews]);
    setNewRating(0);
    setNewComment('');
    setSuccessModalVisible(true);

    setTimeout(() => {
      setSuccessModalVisible(false);
    }, 1500);
  };

  // Função para abrir o modal de horário
  const openTimeModal = (target: typeof timeModalTarget) => {
    setTimeModalTarget(target);
    setTimeModalVisible(true);
  };

  const handleFavoritePress = async () => {
    try {
      if (!space.id) {
        Alert.alert('Erro', 'ID do espaço não encontrado');
        return;
      }

      const spaceData = {
        _id: space.id,
        space_name: space.title,
        image_url: space.images.map((img) => (typeof img === 'string' ? img : img.uri)),
        location: space.address,
        price_per_hour: parseFloat(space.price.replace(/[^0-9.-]+/g, '')),
        space_description: space.description || '',
        space_amenities: space.amenities || [],
        space_type: space.type || '',
        max_people: parseInt(space.capacity?.replace(/[^0-9]/g, '') || '0'),
        week_days: [],
        opening_time: '',
        closing_time: '',
        space_rules: [],
        owner_name: '',
        owner_phone: '',
        owner_email: '',
      };

      await toggleFavorite(spaceData);
    } catch (error: any) {
      console.error('Erro ao favoritar:', error);
      Alert.alert('Erro', error.message || 'Não foi possível favoritar o espaço. Tente novamente.');
    }
  };

  const isFavorite = favorites.some((fav) => fav.spaceId?._id === space.id);

  return (
    <SafeAreaView style={[styles.safeArea, isDarkMode && { backgroundColor: theme.background }]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />
      <View style={styles.statusBarGradient} />
      {/* Botão de voltar fixo */}
      <TouchableOpacity style={styles.backButtonFixed} onPress={() => navigation.goBack()}>
        <MaterialIcons name="arrow-back" size={24} color={colors.white} />
      </TouchableOpacity>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <ScrollView
            style={[styles.container, isDarkMode && { backgroundColor: theme.background }]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled">
            {/* Carrossel de imagens */}
            <ImageCarousel
              images={space.images}
              activeIndex={activeIndex}
              onScroll={handleScroll}
              onMomentumScrollEnd={handleMomentumScrollEnd}
              scrollRef={scrollRef}
              setIsAutoPlayPaused={setIsAutoPlayPaused}
              styles={styles}
            />

            <View style={styles.content}>
              {/* Nome, endereço e favorito */}
              <SpaceHeader
                title={space.title}
                address={space.address}
                isFavorite={isFavorite}
                onFavoritePress={handleFavoritePress}
                theme={theme}
                isDarkMode={isDarkMode}
                styles={styles}
              />

              {/* Avaliação */}
              <RatingRow
                rating={space.rating}
                reviews={space.reviews}
                theme={theme}
                isDarkMode={isDarkMode}
                styles={styles}
              />

              {/* Divisor horizontal */}
              <View style={styles.horizontalDivider} />

              {/* Seção de Aluguel, Tipo e Detalhes */}
              <SpaceDetailsRow
                aluguel={aluguel}
                tipo={tipo}
                wifi={wifi}
                metragem={metragem}
                banheiros={banheiros}
                capacidade={capacidade}
                isDarkMode={isDarkMode}
                theme={theme}
                styles={styles}
                onSeeMore={() => setDetailsModalVisible(true)}
              />

              {/* Divisor horizontal */}
              <View style={styles.horizontalDivider} />

              {/* Seção de aluguel do espaço */}
              <View style={styles.rentalSection}>
                <View style={styles.rentalHeader}>
                  <MaterialIcons
                    name="event-available"
                    size={28}
                    color={isDarkMode ? theme.blue : colors.blue}
                  />
                  <Text style={[styles.rentalTitle, isDarkMode && { color: theme.text }]}>
                    Reserve Este Espaço
                  </Text>
                </View>
                <Text style={[styles.rentalSubtitle, isDarkMode && { color: theme.text }]}>
                  Selecione o período desejado para sua reserva
                </Text>

                <View
                  style={[
                    styles.rentalCard,
                    isDarkMode && {
                      backgroundColor: theme.card,
                      borderColor: theme.border,
                      borderWidth: 1,
                    },
                  ]}>
                  {/* Data e Hora de Check-in */}
                  <CheckInDateTime
                    checkInDate={checkInDate}
                    checkInTime={checkInTime}
                    isDarkMode={isDarkMode}
                    theme={theme}
                    styles={styles}
                    openPicker={openPicker}
                    openTimeModal={openTimeModal}
                  />

                  {/* Divisor */}
                  <View
                    style={[styles.rentalDivider, isDarkMode && { backgroundColor: theme.border }]}
                  />

                  {/* Data e Hora de Check-out */}
                  <CheckOutDateTime
                    checkOutDate={checkOutDate}
                    checkOutTime={checkOutTime}
                    isDarkMode={isDarkMode}
                    theme={theme}
                    styles={styles}
                    openPicker={openPicker}
                    openTimeModal={openTimeModal}
                  />

                  {/* Divisor */}
                  <View
                    style={[styles.rentalDivider, isDarkMode && { backgroundColor: theme.border }]}
                  />

                  {/* Total e Botão */}
                  <RentalTotalBar
                    isDarkMode={isDarkMode}
                    theme={theme}
                    styles={styles}
                    calcularTotal={calcularTotal}
                    handleRent={handleRent}
                    isLoading={isLoading}
                  />
                </View>
              </View>

              {/* Divisor horizontal */}
              <View style={styles.horizontalDivider} />

              {/* Descrição */}
              <DescriptionSection
                displayDescription={displayDescription}
                shouldShowMoreButton={shouldShowMoreButton}
                showFullDescription={showFullDescription}
                setShowFullDescription={setShowFullDescription}
                isDarkMode={isDarkMode}
                theme={theme}
                styles={styles}
              />

              {/* Divisor horizontal */}
              <View style={styles.horizontalDivider} />

              {/* Avaliações */}
              <View>
                <Text style={[styles.sectionTitle, isDarkMode && { color: theme.text }]}>
                  Avaliações do Espaço
                </Text>
                <FlatList
                  data={reviews}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => renderReview(item)}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ gap: 16 }}
                />
              </View>

              {/* Bloco de avaliação do local */}
              <ReviewBox
                isDarkMode={isDarkMode}
                theme={theme}
                styles={styles}
                newRating={newRating}
                setNewRating={setNewRating}
                newComment={newComment}
                setNewComment={setNewComment}
                handleAddReview={handleAddReview}
                onClear={() => {
                  // lógica para limpar ou abrir detalhes do locador
                }}
              />

              {/* Divisor horizontal */}
              <View style={styles.horizontalDivider} />

              {/* Bloco de apresentação do locador do espaço */}
              <LandlordCard
                name="Ricardo Penne"
                reviews={10}
                rating={4.8}
                spaces={4}
                isDarkMode={isDarkMode}
                theme={theme}
                styles={styles}
                onPress={() => {
                  // lógica para abrir detalhes do locador
                }}
              />
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

      {/* Modal do Calendário */}
      <CalendarModal
        visible={calendarVisible}
        onClose={() => setCalendarVisible(false)}
        onDayPress={handleCalendarSelect}
        markedDates={{
          [checkInDate.toISOString().split('T')[0]]: { selected: true, selectedColor: colors.blue },
          [checkOutDate.toISOString().split('T')[0]]: {
            selected: true,
            selectedColor: colors.blue,
          },
        }}
        theme={theme}
        styles={styles}
        isDarkMode={isDarkMode}
      />

      {/* Modal de Horário */}
      <TimeSelectModal
        visible={timeModalVisible}
        onClose={() => setTimeModalVisible(false)}
        timeGroups={timeGroups}
        onSelect={handleTimeSelect}
        styles={styles}
        isDarkMode={isDarkMode}
        theme={theme}
      />

      {/* Modal de Confirmação */}
      <ConfirmModal
        visible={confirmModalVisible}
        styles={styles}
        isDarkMode={isDarkMode}
        theme={theme}
      />

      {/* Modal de Sucesso */}
      <Modal visible={successModalVisible} transparent={true} animationType="fade">
        <View style={styles.calendarOverlay}>
          <View style={[styles.successModal, isDarkMode && { backgroundColor: theme.card }]}>
            <MaterialIcons name="check-circle" size={48} color={colors.blue} />
            <Text style={[styles.successText, isDarkMode && { color: theme.text }]}>
              Avaliação enviada com sucesso!
            </Text>
          </View>
        </View>
      </Modal>

      {/* Modal de Comodidades */}
      <SpaceDetailsModal
        visible={detailsModalVisible}
        onClose={() => setDetailsModalVisible(false)}
        spaceDetails={spaceDetails}
        space={space}
        isDarkMode={isDarkMode}
        theme={theme}
        styles={styles}
        onSeeMore={() => setDetailsModalVisible(true)}
      />
    </SafeAreaView>
  );
}
