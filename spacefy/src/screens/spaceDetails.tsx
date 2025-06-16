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
import { blockedDatesService } from '../services/blockedDates';
import { Space, ReceivedSpace } from '../types/space';
import { spaceService } from '../services/spaceService';
import { useSpaceDetails } from '../hooks/useSpaceDetails';
import { userService } from '../services/userService';
import { RentalConfirmationModal } from '../components/RentalConfirmationModal';
import { rentalService } from '../services/rentalService';

interface SpaceDetailsProps {
  route: {
    params: {
      space: ReceivedSpace;
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

// Função utilitária para arredondar para o próximo intervalo de 30 minutos
function roundToNextHalfHour(date = new Date()): Date {
  const result = new Date(date);
  const minutes = result.getMinutes();
  if (minutes === 0 || minutes === 30) {
    result.setSeconds(0, 0);
    return result;
  }
  if (minutes < 30) {
    result.setMinutes(30, 0, 0);
  } else {
    result.setHours(result.getHours() + 1, 0, 0, 0);
  }
  return result;
}

export default function SpaceDetails({ route }: SpaceDetailsProps) {
  const { space: receivedSpace } = route.params;
  const { space, isLoading } = useSpaceDetails(receivedSpace.id);
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
  const [checkInTime, setCheckInTime] = useState(roundToNextHalfHour());
  const [checkOutTime, setCheckOutTime] = useState(roundToNextHalfHour());
  const [pickerVisible, setPickerVisible] = useState(false);
  const [pickerMode, setPickerMode] = useState<'date' | 'time'>('date');
  const [pickerTarget, setPickerTarget] = useState<
    'checkInDate' | 'checkOutDate' | 'checkInTime' | 'checkOutTime'
  >('checkInDate');
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [calendarTarget, setCalendarTarget] = useState<'checkInDate' | 'checkOutDate'>('checkInDate');
  const [timeModalVisible, setTimeModalVisible] = useState(false);
  const [timeModalTarget, setTimeModalTarget] = useState<'checkInTime' | 'checkOutTime'>('checkInTime');
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [rentalConfirmationVisible, setRentalConfirmationVisible] = useState(false);
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
  const [ownerSpaces, setOwnerSpaces] = useState<number>(0);
  const [ownerName, setOwnerName] = useState<string>('Locador');

  const MAX_DESCRIPTION_LENGTH = 150;
  const shouldShowMoreButton =
    space?.space_description && space?.space_description.length > MAX_DESCRIPTION_LENGTH;
  const displayDescription = showFullDescription
    ? space?.space_description
    : space?.space_description?.substring(0, MAX_DESCRIPTION_LENGTH) + '...';

  const MAX_REVIEW_LENGTH = 120;
  const toggleReview = (id: number) => {
    setReviews(reviews.map((r) => (r.id === id ? { ...r, expanded: !r.expanded } : r)));
  };

  const renderReview = (review: Review) => (
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
    if (!space?.image_url || !Array.isArray(space?.image_url)) return;
    
    const newIndex = Math.max(0, Math.min(index, space?.image_url.length - 1));
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
    if (!space?.image_url || !Array.isArray(space?.image_url) || space?.image_url.length <= 1 || isAutoPlayPaused || !isFocused) return;
    
    const timer = setInterval(() => {
      scrollToIndex((activeIndex + 1) % space?.image_url.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [activeIndex, isAutoPlayPaused, space?.image_url, isFocused]);

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

  const handleCalendarSelect = (day: { dateString: string }) => {
    const selected = new Date(day.dateString + 'T00:00:00');
    if (calendarTarget === 'checkInDate') setCheckInDate(selected);
    if (calendarTarget === 'checkOutDate') setCheckOutDate(selected);
    setCalendarVisible(false);
  };

  const handleRent = async () => {
    try {
      const checkIn = new Date(
        checkInDate.getFullYear(),
        checkInDate.getMonth(),
        checkInDate.getDate(),
        checkInTime.getHours(),
        checkInTime.getMinutes(),
        0,
        0
      );

      const checkOut = new Date(
        checkOutDate.getFullYear(),
        checkOutDate.getMonth(),
        checkOutDate.getDate(),
        checkOutTime.getHours(),
        checkOutTime.getMinutes(),
        0,
        0
      );

      if (checkOut <= checkIn) {
        Alert.alert('Data Inválida', 'A data de check-out deve ser posterior à data de check-in.', [
          { text: 'OK' },
        ]);
        return;
      }

      setRentalConfirmationVisible(true);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível realizar a reserva. Tente novamente mais tarde.', [
        { text: 'OK' },
      ]);
    }
  };

  const handleConfirmRental = async () => {
    try {
      if (!user?.id || !space?._id) {
        Alert.alert('Erro', 'Dados do usuário ou espaço não encontrados.');
        return;
      }

      // Formata as datas no formato YYYY-MM-DD
      const start_date = checkInDate.toISOString().split('T')[0];
      const end_date = checkOutDate.toISOString().split('T')[0];

      // Formata os horários no formato HH:mm
      const startTime = checkInTime.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
      const endTime = checkOutTime.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });

      // Remove o símbolo da moeda e converte para número
      const totalValue = calcularTotal().replace(/[^\d,]/g, '').replace(',', '.');

      console.log('📅 Datas formatadas:', {
        start_date,
        end_date,
        startTime,
        endTime,
        totalValue
      });

      const reservationData = {
        userId: user.id,
        spaceId: space._id,
        start_date,
        end_date,
        startTime,
        endTime,
        value: totalValue
      };

      console.log('📝 Enviando dados da reserva:', reservationData);

      await rentalService.createRental(reservationData);

      setRentalConfirmationVisible(false);
      setConfirmModalVisible(true);
      setTimeout(() => {
        setConfirmModalVisible(false);
      }, 2000);
    } catch (error: any) {
      console.error('❌ Erro ao criar reserva:', error);
      Alert.alert(
        'Erro ao criar reserva',
        error.message || 'Não foi possível realizar a reserva. Tente novamente mais tarde.',
        [{ text: 'OK' }]
      );
    }
  };

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

  const handleTimeSelect = (timeStr: string) => {
    const [hour, minute] = timeStr.split(':').map(Number);
    const selected = new Date();
    selected.setHours(hour, minute, 0, 0);

    if (timeModalTarget === 'checkInTime') {
      setCheckInTime(selected);

      // Se o novo check-in for maior ou igual ao check-out, ajuste o check-out
      if (
        checkOutDate.toISOString().split('T')[0] === checkInDate.toISOString().split('T')[0] &&
        (selected.getTime() >= checkOutTime.getTime())
      ) {
        // Adiciona 30 minutos ao check-in para sugerir um check-out válido
        const newCheckOut = new Date(selected.getTime() + 30 * 60000);
        setCheckOutTime(newCheckOut);
      }
    }

    if (timeModalTarget === 'checkOutTime') {
      // Não permitir check-out menor ou igual ao check-in
      if (
        checkOutDate.toISOString().split('T')[0] === checkInDate.toISOString().split('T')[0] &&
        (selected.getTime() <= checkInTime.getTime())
      ) {
        alert('O horário de check-out deve ser maior que o de check-in.');
        return;
      }
      setCheckOutTime(selected);
    }

    setTimeModalVisible(false);
  };

  const calcularTotal = () => {
    const checkIn = new Date(
      checkInDate.getFullYear(),
      checkInDate.getMonth(),
      checkInDate.getDate(),
      checkInTime.getHours(),
      checkInTime.getMinutes(),
      0,
      0
    );
    const checkOut = new Date(
      checkOutDate.getFullYear(),
      checkOutDate.getMonth(),
      checkOutDate.getDate(),
      checkOutTime.getHours(),
      checkOutTime.getMinutes(),
      0,
      0
    );

    if (checkOut <= checkIn) {
      return 'R$ 0,00';
    }

    const diffMs = checkOut.getTime() - checkIn.getTime();
    const diffMinutos = diffMs / (1000 * 60);
    const diffHoras = diffMinutos / 60;
    const precoPorHora = space?.price_per_hour || 0;
    const precoPorMinuto = precoPorHora / 60;
    const total = diffMinutos * precoPorMinuto;

    return total.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const aluguel = `R$ ${space?.price_per_hour?.toFixed(2) || '0.00'}`;
  const tipo = space?.space_type || 'Não especificado';
  const capacidade = `${space?.max_people || 0} Pessoas`;

  const spaceDetails = {
    amenities: space?.space_amenities || [],
    type: space?.space_type || 'Não especificado',
    capacity: `${space?.max_people || 0} Pessoas`,
    hasWifi: space?.space_amenities?.some(amenity => 
      amenity.toLowerCase().includes('wifi')
    ) || false
  };

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

  const openTimeModal = (target: typeof timeModalTarget) => {
    setTimeModalTarget(target);
    setTimeModalVisible(true);
  };

  const handleFavoritePress = async () => {
    try {
      if (!space?._id) {
        Alert.alert('Erro', 'ID do espaço não encontrado');
        return;
      }

      const spaceData = {
        _id: space._id,
        space_name: space.space_name,
        image_url: space.image_url,
        location: space.location.formatted_address,
        price_per_hour: space.price_per_hour,
        space_description: space.space_description,
        space_amenities: space.space_amenities,
        space_type: space.space_type,
        max_people: space.max_people,
        week_days: space.week_days,
        opening_time: space.weekly_days?.[0]?.time_ranges?.[0]?.open || '',
        closing_time: space.weekly_days?.[0]?.time_ranges?.[0]?.close || '',
        space_rules: space.space_rules,
        owner_name: space.owner_name,
        owner_phone: space.owner_phone,
        owner_email: space.owner_email,
      };

      await toggleFavorite(spaceData);
    } catch (error: any) {
      console.error('Erro ao favoritar:', error);
      Alert.alert('Erro', error.message || 'Não foi possível favoritar o espaço. Tente novamente.');
    }
  };

  const isFavorite = favorites.some((fav) => fav.spaceId?._id === space?._id);

  // Formatar as imagens para o formato esperado pelo ImageCarousel
  const formattedImages = React.useMemo(() => {
    if (!space?.image_url) return [];
    
    const images = Array.isArray(space.image_url) 
      ? space.image_url 
      : [space.image_url];
    
    return images.map(url => ({ uri: url }));
  }, [space?.image_url]);

  useEffect(() => {
    const fetchOwnerSpaces = async () => {
      if (space?.owner_id) {
        try {
          const spaces = await spaceService.getSpacesByOwnerId(space.owner_id);
          setOwnerSpaces(spaces.length);
        } catch (error) {
          setOwnerSpaces(0);
        }
      }
    };
    fetchOwnerSpaces();
  }, [space?.owner_id]);

  useEffect(() => {
    const fetchOwnerName = async () => {
      try {
        if (space?.owner_id) {
          const ownerData = await userService.getUserById(space.owner_id);
          setOwnerName(`${ownerData.name} ${ownerData.surname}`);
        }
      } catch (error) {
        setOwnerName('Locador');
        console.error('Erro ao buscar dados do proprietário:', error);
      }
    };
    if (space?.owner_id) {
      fetchOwnerName();
    }
  }, [space?.owner_id]);

  if (isLoading || !space) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>Carregando...</Text>
      </View>
    );
  }

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
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <Text>Carregando...</Text>
              </View>
            ) : (
              <>
                <ImageCarousel
                  images={formattedImages}
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
                    title={space.space_name || 'Sem título'}
                    address={typeof space.location === 'string' ? space.location : space.location?.formatted_address || 'Endereço não disponível'}
                    isFavorite={isFavorite}
                    onFavoritePress={handleFavoritePress}
                    theme={theme}
                    isDarkMode={isDarkMode}
                    styles={styles}
                  />

                  {/* Avaliação */}
                  <RatingRow
                    rating={space?.rating || 0}
                    reviews={space?.reviews || 0}
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
                    wifi={space?.space_amenities?.some(amenity => 
                      amenity.toLowerCase().includes('wifi') || 
                      amenity.toLowerCase().includes('wi-fi')
                    ) ? 'Sim' : 'Não'}
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
                    displayDescription={displayDescription || ''}
                    shouldShowMoreButton={!!shouldShowMoreButton}
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
                      setNewRating(0);
                      setNewComment('');
                    }}
                  />

                  {/* Divisor horizontal */}
                  <View style={styles.horizontalDivider} />

                  {/* Bloco de apresentação do locador do espaço */}
                  <LandlordCard
                    name={ownerName}
                    reviews={space?.rating ? Math.round(space.rating * 2) : 0}
                    rating={space?.rating || 0}
                    spaces={ownerSpaces}
                    isDarkMode={isDarkMode}
                    theme={theme}
                    styles={styles}
                    onPress={() => {
                      // lógica para abrir detalhes do locador
                    }}
                  />
                </View>
              </>
            )}
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
        spaceId={space?._id}
        weekDays={space?.week_days || []}
      />

      {/* Modal de Horário */}
      <TimeSelectModal
        visible={timeModalVisible}
        onClose={() => setTimeModalVisible(false)}
        onSelect={handleTimeSelect}
        styles={styles}
        isDarkMode={isDarkMode}
        theme={theme}
        weekly_days={space?.weekly_days || []}
        selectedDate={timeModalTarget === 'checkInTime' ? checkInDate.toISOString().split('T')[0] : checkOutDate.toISOString().split('T')[0]}
        spaceId={space?._id}
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

      {/* Modal de Confirmação de Reserva */}
      <RentalConfirmationModal
        visible={rentalConfirmationVisible}
        onClose={() => setRentalConfirmationVisible(false)}
        onConfirm={handleConfirmRental}
        spaceName={space?.space_name || 'Sem título'}
        checkInDate={checkInDate}
        checkOutDate={checkOutDate}
        checkInTime={checkInTime}
        checkOutTime={checkOutTime}
        totalValue={calcularTotal()}
        isDarkMode={isDarkMode}
        theme={theme}
      />
    </SafeAreaView>
  );
}