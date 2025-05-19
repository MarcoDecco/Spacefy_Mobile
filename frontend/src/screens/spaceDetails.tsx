import React, { useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import { colors } from '../styles/globalStyles/colors';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation, useIsFocused } from '@react-navigation/native';

const { width: windowWidth } = Dimensions.get('window');

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
  const scrollRef = useRef<ScrollView>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

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

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setSelectedDate(selectedDate);
    }
  };

  const handleStartTimeChange = (event: any, selectedTime?: Date) => {
    setShowStartTimePicker(false);
    if (selectedTime) {
      setStartTime(selectedTime);
    }
  };

  const handleEndTimeChange = (event: any, selectedTime?: Date) => {
    setShowEndTimePicker(false);
    if (selectedTime) {
      setEndTime(selectedTime);
    }
  };

  const handleRent = () => {
    // Aqui você implementará a lógica de aluguel
    console.log('Alugando espaço:', {
      spaceId: space.id,
      date: selectedDate,
      startTime,
      endTime
    });
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
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

        {/* Setas de navegação */}
        {space.images.length > 1 && (
          <>
            <TouchableOpacity
              style={[styles.arrow, styles.arrowLeft]}
              onPress={() => {
                setIsAutoPlayPaused(true);
                scrollToIndex(activeIndex - 1);
                setTimeout(() => setIsAutoPlayPaused(false), 5000);
              }}
            >
              <Feather name="chevron-left" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.arrow, styles.arrowRight]}
              onPress={() => {
                setIsAutoPlayPaused(true);
                scrollToIndex(activeIndex + 1);
                setTimeout(() => setIsAutoPlayPaused(false), 5000);
              }}
            >
              <Feather name="chevron-right" size={24} color="white" />
            </TouchableOpacity>

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
          </>
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

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Selecione a Data e Horário</Text>

          <TouchableOpacity
            style={styles.dateTimeButton}
            onPress={() => setShowDatePicker(true)}
          >
            <MaterialIcons name="calendar-today" size={20} color={colors.blue} />
            <Text style={styles.dateTimeText}>
              {selectedDate.toLocaleDateString()}
            </Text>
          </TouchableOpacity>

          <View style={styles.timeContainer}>
            <TouchableOpacity
              style={[styles.dateTimeButton, { flex: 1, marginRight: 8 }]}
              onPress={() => setShowStartTimePicker(true)}
            >
              <MaterialIcons name="access-time" size={20} color={colors.blue} />
              <Text style={styles.dateTimeText}>
                {startTime.toLocaleTimeString()}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.dateTimeButton, { flex: 1, marginLeft: 8 }]}
              onPress={() => setShowEndTimePicker(true)}
            >
              <MaterialIcons name="access-time" size={20} color={colors.blue} />
              <Text style={styles.dateTimeText}>
                {endTime.toLocaleTimeString()}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.rentButton} onPress={handleRent}>
          <Text style={styles.rentButtonText}>Alugar Espaço</Text>
        </TouchableOpacity>
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
          minimumDate={new Date()}
        />
      )}

      {showStartTimePicker && (
        <DateTimePicker
          value={startTime}
          mode="time"
          display="default"
          onChange={handleStartTimeChange}
        />
      )}

      {showEndTimePicker && (
        <DateTimePicker
          value={endTime}
          mode="time"
          display="default"
          onChange={handleEndTimeChange}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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
  arrow: {
    position: 'absolute',
    top: '50%',
    marginTop: -24,
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 8,
    borderRadius: 20,
    zIndex: 2,
  },
  arrowLeft: {
    left: 8,
  },
  arrowRight: {
    right: 8,
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
    top: 10,
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
  dateTimeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.light_gray,
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  dateTimeText: {
    fontSize: 16,
    color: colors.black,
    marginLeft: 8,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rentButton: {
    backgroundColor: colors.blue,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  rentButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
}); 