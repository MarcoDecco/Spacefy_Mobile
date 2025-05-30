import React, { useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, SafeAreaView, StatusBar, Modal, TouchableWithoutFeedback, FlatList, TextInput, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
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
        type?: string;
        area?: string;
        hasWifi?: boolean;
        capacity?: string;
        bathrooms?: string;
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
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
        {review.avatar ? (
          <Image source={review.avatar} style={{ width: 36, height: 36, borderRadius: 18, marginRight: 8 }} />
        ) : (
          <MaterialIcons name="account-circle" size={36} color={colors.gray} style={{ marginRight: 8 }} />
        )}
        <View>
          <Text style={[styles.reviewUser, isDarkMode && { color: theme.text }]}>{review.user}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
            {[...Array(5)].map((_, index) => (
              <MaterialIcons
                key={index}
                name={index < review.rating ? "star" : "star-border"}
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

    // Verifica se a data de check-out é posterior ao check-in
    if (checkOut <= checkIn) {
      return 'R$ 0,00';
    }

    // Diferença em milissegundos
    const diffMs = checkOut.getTime() - checkIn.getTime();
    // Diferença em horas (arredondando para cima)
    const diffHoras = Math.ceil(diffMs / (1000 * 60 * 60));
    
    // Extrai o valor numérico do preço do espaço (remove R$, espaços e converte vírgula para ponto)
    const precoPorHora = parseFloat(space.price.replace(/[R$\s.]/g, '').replace(',', '.'));
    
    // Calcula o total
    const total = diffHoras * precoPorHora;
    
    // Formata para moeda brasileira
    return total.toLocaleString('pt-BR', { 
      style: 'currency', 
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
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

  return (
    <SafeAreaView style={[styles.safeArea, isDarkMode && { backgroundColor: theme.background }]}>
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor="transparent"
        translucent
      />
      <View style={styles.statusBarGradient} />
      {/* Botão de voltar fixo */}
      <TouchableOpacity
        style={styles.backButtonFixed}
        onPress={() => navigation.goBack()}
      >
        <MaterialIcons name="arrow-back" size={24} color={colors.white} />
      </TouchableOpacity>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <ScrollView
            style={[styles.container, isDarkMode && { backgroundColor: theme.background }]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Carrossel de imagens */}
            <View style={styles.imageContainer}>
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
              >
                {space.images.map((img, index) => (
                  <Image
                    key={index}
                    source={img}
                    style={styles.image}
                    resizeMode="cover"
                  />
                ))}
              </ScrollView>
              {/* Dots de navegação */}
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
              {/* Nome, endereço e favorito */}
              <View style={styles.headerRow}>
                <View style={styles.headerInfo}>
                  <Text style={[styles.title, isDarkMode && { color: theme.text }]}>{space.title}</Text>
                  <TouchableOpacity
                    onPress={() => {
                      const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(space.address)}`;
                      // @ts-ignore
                      if (typeof window !== 'undefined') {
                        window.open(url, '_blank');
                      } else {
                        // React Native Linking
                        import('react-native').then(({ Linking }) => Linking.openURL(url));
                      }
                    }}
                  >
                    <Text style={[styles.headerAddress, isDarkMode && { color: theme.blue }]}>
                      {space.address}
                    </Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  onPress={() => setIsFavorite(!isFavorite)}
                >
                  <MaterialIcons
                    name={isFavorite ? "favorite" : "favorite-border"}
                    color={isFavorite ? colors.blue : colors.blue}
                    size={25}
                  />
                </TouchableOpacity>
              </View>

              {/* Avaliação */}
              <View style={styles.headerRatingRow}>
                {[1,2,3,4,5].map(i => (
                  <MaterialIcons
                    key={i}
                    name={i <= Math.round(space.rating) ? 'star' : 'star-border'}
                    size={22}
                    color={isDarkMode ? theme.text : colors.black}
                  />
                ))}
                <Text style={[styles.headerReviews, isDarkMode && { color: theme.text }]}>({space.reviews})</Text>
              </View>

              {/* Divisor horizontal */}
              <View style={styles.horizontalDivider} />

              {/* Seção de Aluguel, Tipo e Detalhes */}
              <View style={styles.detailsRow}>
                {/* Coluna Aluguel e Tipo */}
                <View style={styles.detailsColLeft}>
                  <Text style={[styles.detailsLabel, isDarkMode && { color: theme.text }]}>Aluguel:</Text>

                  <View style={styles.detailsValueRow}>
                    <Text style={[styles.detailsValue, isDarkMode && { color: theme.text }]}>{aluguel}</Text>
                    <Text style={[styles.detailsDivider, isDarkMode && { color: theme.text }]}>/Hora</Text>
                  </View>

                  {/* Divisor interno */}
                  <View style={[styles.detailsInnerDivider, isDarkMode && { backgroundColor: theme.border }]} />

                  <Text style={[styles.detailsLabel, isDarkMode && { color: theme.text }]}>Tipo:</Text>
                  <Text style={[styles.detailsType, isDarkMode && { color: theme.text }]}>{tipo}</Text>
                </View>
                
                {/* Coluna Detalhes */}
                <View style={styles.detailsColRight}>
                  <Text style={[styles.detailsLabel, { marginBottom: 8 }, isDarkMode && { color: theme.text }]}>Detalhes:</Text>

                  <View style={styles.detailsGrid}>
                    <View style={styles.detailsGridItem}>
                      <MaterialIcons 
                        name="crop-square" 
                        size={20} 
                        color={isDarkMode ? theme.text : colors.gray} 
                        style={styles.detailsIcon} 
                      />
                      <Text style={[styles.detailsInfoTextNoMargin, isDarkMode && { color: theme.text }]}>{metragem}</Text>
                    </View>

                    <View style={styles.detailsGridItem}>
                      <Feather 
                        name="wifi" 
                        size={20} 
                        color={isDarkMode ? theme.text : colors.gray} 
                        style={styles.detailsIcon} 
                      />
                      <Text style={[styles.detailsInfoTextNoMargin, isDarkMode && { color: theme.text }]}>{wifi}</Text>
                    </View>

                    <View style={styles.detailsGridItem}>
                      <MaterialIcons 
                        name="groups" 
                        size={20} 
                        color={isDarkMode ? theme.text : colors.gray} 
                        style={styles.detailsIcon} 
                      />
                      <Text style={[styles.detailsInfoTextNoMargin, isDarkMode && { color: theme.text }]}>{capacidade}</Text>
                    </View>

                    <View style={styles.detailsGridItem}>
                      <MaterialIcons 
                        name="wc" 
                        size={20} 
                        color={isDarkMode ? theme.text : colors.gray} 
                        style={styles.detailsIcon} 
                      />
                      <Text style={[styles.detailsInfoTextNoMargin, isDarkMode && { color: theme.text }]}>{banheiros}</Text>
                    </View>
                  </View>
                  
                  <TouchableOpacity onPress={() => setDetailsModalVisible(true)}>
                    <Text style={[styles.detailsMoreButton, isDarkMode && { color: theme.blue }]}>Ver mais</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Divisor horizontal */}
              <View style={styles.horizontalDivider} />
              
              {/* Seção de aluguel do espaço - Layout igual à imagem */}
              <View style={styles.rentalSection}>
                <Text style={[styles.rentalTitle, isDarkMode && { color: theme.text }]}>
                  Está pensando em Alugar este espaço?
                </Text>
                <Text style={[styles.rentalSubtitle, isDarkMode && { color: theme.text }]}>
                  Informe a data e horário que deseja.
                </Text>
                <View style={[styles.rentalCard, isDarkMode && { backgroundColor: theme.card }]}>
                  <View style={styles.rentalRow}>
                    {/* Check-in */}
                    <View style={styles.rentalColumn}>
                      <Text style={[styles.rentalLabel, isDarkMode && { color: theme.text }]}>Check-in</Text>
                      <TouchableOpacity
                        style={[styles.rentalValueBox, isDarkMode && { backgroundColor: theme.background }]}
                        onPress={() => openPicker('checkInDate', 'date')}
                      >
                        <Text style={[styles.rentalValueText, isDarkMode && { color: theme.text }]}>
                          {checkInDate.toLocaleDateString()}
                        </Text>
                      </TouchableOpacity>
                      <Text style={[styles.rentalLabel, isDarkMode && { color: theme.text }]}>Hora:</Text>
                      <TouchableOpacity
                        style={[styles.rentalValueBox, isDarkMode && { backgroundColor: theme.background }]}
                        onPress={() => openTimeModal('checkInTime')}
                      >
                        <Text style={[styles.rentalValueText, isDarkMode && { color: theme.text }]}>
                          {checkInTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Text>
                      </TouchableOpacity>
                    </View>
                    {/* Divisor vertical */}
                    <View style={[styles.rentalVerticalDivider, isDarkMode && { backgroundColor: theme.border }]} />
                    {/* Check-out */}
                    <View style={styles.rentalColumn}>
                      <Text style={[styles.rentalLabel, isDarkMode && { color: theme.text }]}>Check-out</Text>
                      <TouchableOpacity
                        style={[styles.rentalValueBox, isDarkMode && { backgroundColor: theme.background }]}
                        onPress={() => openPicker('checkOutDate', 'date')}
                      >
                        <Text style={[styles.rentalValueText, isDarkMode && { color: theme.text }]}>
                          {checkOutDate.toLocaleDateString()}
                        </Text>
                      </TouchableOpacity>
                      <Text style={[styles.rentalLabel, isDarkMode && { color: theme.text }]}>Hora:</Text>
                      <TouchableOpacity
                        style={[styles.rentalValueBox, isDarkMode && { backgroundColor: theme.background }]}
                        onPress={() => openTimeModal('checkOutTime')}
                      >
                        <Text style={[styles.rentalValueText, isDarkMode && { color: theme.text }]}>
                          {checkOutTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  {/* Linha divisória horizontal */}
                  <View style={[styles.rentalHorizontalDivider, isDarkMode && { backgroundColor: theme.border }]} />
                  {/* Total e botão */}
                  <View style={styles.rentalTotalRow}>
                    <View>
                      <Text style={[styles.rentalLabel, isDarkMode && { color: theme.text }]}>Total:</Text>
                      <Text style={[styles.rentalTotalValue, isDarkMode && { color: theme.text }]}>{calcularTotal()}</Text>
                    </View>
                    <TouchableOpacity 
                      style={[styles.rentalButton, isDarkMode && { backgroundColor: theme.blue }]} 
                      onPress={handleRent}
                    >
                      <Text style={styles.rentalButtonText}>Alugar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {/* Divisor horizontal */}
              <View style={styles.horizontalDivider} />

              {/* Descrição */}
              <View>
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

              {/* Divisor horizontal */}
              <View style={styles.horizontalDivider} />

              {/* Avaliações */}
              <View>
                <Text style={[styles.sectionTitle, isDarkMode && { color: theme.text }]}>Avaliações do Espaço</Text>
                <FlatList
                  data={reviews}
                  keyExtractor={item => item.id.toString()}
                  renderItem={({ item }) => renderReview(item)}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ gap: 16 }}
                />
              </View>

              {/* Bloco de avaliação do local */}
              <View style={[styles.reviewBox, { marginTop: 24 }, isDarkMode && { backgroundColor: theme.card }]}> 
                <Text style={[styles.reviewBoxTitle, isDarkMode && { color: theme.text }]}>
                  Avalie este local também
                </Text>
                <View style={styles.reviewStarsRow}>
                  {[1,2,3,4,5].map(i => (
                    <TouchableOpacity key={i} onPress={() => setNewRating(i)}>
                      <MaterialIcons
                        name={newRating >= i ? 'star' : 'star-border'}
                        size={24}
                        color={newRating >= i ? colors.blue : (isDarkMode ? theme.text : colors.gray)}
                      />
                    </TouchableOpacity>
                  ))}
                </View>
                <TextInput
                  style={[
                    styles.reviewInput,
                    isDarkMode && {
                      backgroundColor: theme.background,
                      color: theme.text,
                      borderColor: theme.border
                    }
                  ]}
                  placeholder="Digite seu comentário aqui..."
                  placeholderTextColor={isDarkMode ? theme.text : colors.gray}
                  multiline
                  value={newComment}
                  onChangeText={setNewComment}
                />
                <TouchableOpacity
                  style={[styles.reviewButton, isDarkMode && { backgroundColor: theme.blue }]}
                  onPress={() => {/* lógica para comentar */}}
                >
                  <Text style={styles.reviewButtonText}>COMENTAR</Text>
                </TouchableOpacity>
              </View>

              {/* Divisor horizontal */}
              <View style={styles.horizontalDivider} />

              {/* Bloco de apresentação do locador do espaço */}
              <View style={{ alignItems: 'center', marginBottom: 32 }}>
                <Text style={[styles.sectionTitle, { textAlign: 'center' }, isDarkMode && { color: theme.text }]}>
                  Conheça o locador do espaço
                </Text>
                <Text style={[styles.rentalSubtitle, { textAlign: 'center' }, isDarkMode && { color: theme.text }]}>
                  Clique para ver mais
                </Text>
                <TouchableOpacity
                  style={[
                    styles.rentalCard,
                    {
                      width: 320,
                      alignItems: 'center',
                      padding: 24,
                    },
                    isDarkMode && { backgroundColor: theme.card }
                  ]}
                  activeOpacity={0.85}
                  onPress={() => {/* lógica para abrir detalhes do locador */}}
                >
                  <View style={{ alignItems: 'center', marginBottom: 8 }}>
                    <Image
                      source={require('../../assets/perfil-login.png')}
                      style={{ width: 70, height: 70, borderRadius: 35, marginBottom: 8, backgroundColor: '#e6f0fa' }}
                    />
                    <Text style={[styles.rentalTitle, { marginBottom: 4 }, isDarkMode && { color: theme.text }]}>
                      Ricardo Penne
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                    <View style={{ alignItems: 'center', flex: 1 }}>
                      <Text style={[styles.rentalTotalValue, isDarkMode && { color: theme.text }]}>10</Text>
                      <Text style={[styles.rentalSubtitle, isDarkMode && { color: theme.text }]}>avaliações</Text>
                    </View>
                    <View style={{ alignItems: 'center', flex: 1 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={[styles.rentalTotalValue, isDarkMode && { color: theme.text }]}>4,8</Text>
                        <MaterialIcons name="star" size={16} color={isDarkMode ? theme.text : colors.gray} style={{ marginLeft: 2 }} />
                      </View>
                      <Text style={[styles.rentalSubtitle, isDarkMode && { color: theme.text }]}>estrelas</Text>
                    </View>
                    <View style={{ alignItems: 'center', flex: 1 }}>
                      <Text style={[styles.rentalTotalValue, isDarkMode && { color: theme.text }]}>4</Text>
                      <Text style={[styles.rentalSubtitle, isDarkMode && { color: theme.text }]}>espaços</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

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

      {/* Modal de Comodidades */}
      <Modal
        visible={detailsModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setDetailsModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setDetailsModalVisible(false)}>
          <View style={styles.calendarOverlay}>
            <TouchableWithoutFeedback>
              <View style={[
                styles.calendarModal, 
                { width: 340, maxHeight: 500 },
                isDarkMode && { backgroundColor: theme.card }
              ]}> 
                <Text style={[
                  styles.sectionTitle, 
                  { marginBottom: 16 },
                  isDarkMode && { color: theme.text }
                ]}>
                  Comodidades de <Text style={{ color: colors.blue }}>{space.title}</Text>
                </Text>

                {/* Ajustar esse bloco referente aos detalhes do espaço de acordo com a API */}
                <View style={{ marginBottom: 12 }}>
                  {space.amenities && space.amenities.map((amenity, index) => (
                    <Text 
                      key={index} 
                      style={[
                        { fontSize: 16, marginBottom: 8 },
                        isDarkMode ? { color: theme.text } : { color: colors.black }
                      ]}
                    >
                      • {amenity}
                    </Text>
                  ))}
                  <Text style={[
                    { fontSize: 16, marginBottom: 8 },
                    isDarkMode ? { color: theme.text } : { color: colors.black }
                  ]}>
                    • Área: {space.area}
                  </Text>
                  <Text style={[
                    { fontSize: 16, marginBottom: 8 },
                    isDarkMode ? { color: theme.text } : { color: colors.black }
                  ]}>
                    • Capacidade: {space.capacity}
                  </Text>
                  <Text style={[
                    { fontSize: 16, marginBottom: 8 },
                    isDarkMode ? { color: theme.text } : { color: colors.black }
                  ]}>
                    • Banheiros: {space.bathrooms}
                  </Text>
                  <Text style={[
                    { fontSize: 16, marginBottom: 8 },
                    isDarkMode ? { color: theme.text } : { color: colors.black }
                  ]}>
                    • WiFi: {space.hasWifi ? 'Sim' : 'Não'}
                  </Text>
                </View>
                
                <TouchableOpacity 
                  onPress={() => setDetailsModalVisible(false)} 
                  style={{ alignSelf: 'flex-end', marginTop: 8 }}
                >
                  <Text style={[
                    styles.detailsMoreButton,
                    isDarkMode && { color: theme.blue }
                  ]}>
                    Fechar
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
} 