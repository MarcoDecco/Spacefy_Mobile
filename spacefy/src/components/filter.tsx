import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView, Dimensions } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { colors } from '../styles/globalStyles/colors';

interface FilterProps {
  onFilterChange: (filters: FilterOptions) => void;
  isDarkMode: boolean;
  theme: any;
}

export interface FilterOptions {
  priceRange: string;
  spaceType: string;
  rating: string;
  sortBy: string;
}

const { width: windowWidth } = Dimensions.get('window');

export default function Filter({ onFilterChange, isDarkMode, theme }: FilterProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<FilterOptions>({
    priceRange: '',
    spaceType: '',
    rating: '',
    sortBy: '',
  });

  const priceRanges = [
    { label: 'Todos os preços', value: '', icon: 'attach-money' },
    { label: 'Até R$50/hora', value: '0-50', icon: 'attach-money' },
    { label: 'R$50 - R$100/hora', value: '50-100', icon: 'attach-money' },
    { label: 'R$100 - R$200/hora', value: '100-200', icon: 'attach-money' },
    { label: 'Acima de R$200/hora', value: '200+', icon: 'attach-money' },
  ];

  const sortOptions = [
    { label: 'Relevância', value: '', icon: 'sort' },
    { label: 'Menor Preço', value: 'price_asc', icon: 'arrow-upward' },
    { label: 'Maior Preço', value: 'price_desc', icon: 'arrow-downward' },
  ];

  const spaceTypes = [
    { label: 'Todos os tipos', value: '', icon: 'grid-on' },
    { label: 'Sala de Reunião', value: 'meeting_room', icon: 'groups' },
    { label: 'Escritório', value: 'office', icon: 'business' },
    { label: 'Auditório', value: 'auditorium', icon: 'event-seat' },
    { label: 'Sala de Eventos', value: 'event_room', icon: 'event' },
  ];

  const ratings = [
    { label: 'Todas as avaliações', value: '', icon: 'star' },
    { label: '4+ estrelas', value: '4+', icon: 'star' },
    { label: '3+ estrelas', value: '3+', icon: 'star' },
    { label: '2+ estrelas', value: '2+', icon: 'star' },
  ];

  const handleFilterSelect = (type: keyof FilterOptions, value: string) => {
    const newFilters = { ...selectedFilters, [type]: value };
    setSelectedFilters(newFilters);
    onFilterChange(newFilters);
  };

  const renderFilterSection = (
    title: string,
    options: { label: string; value: string; icon: string }[],
    type: keyof FilterOptions
  ) => (
    <View style={styles.filterSection}>
      <Text style={[styles.sectionTitle, { color: theme.text }]}>{title}</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={styles.optionsContainer}
        contentContainerStyle={styles.optionsContent}
      >
        {options.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.filterOption,
              selectedFilters[type] === option.value && {
                backgroundColor: theme.blue,
                borderColor: theme.blue,
              },
              { borderColor: isDarkMode ? theme.border : colors.light_gray }
            ]}
            onPress={() => handleFilterSelect(type, option.value)}
          >
            <MaterialIcons 
              name={option.icon} 
              size={20} 
              color={selectedFilters[type] === option.value ? 'white' : theme.text} 
              style={styles.optionIcon}
            />
            <Text
              style={[
                styles.optionText,
                { color: selectedFilters[type] === option.value ? 'white' : theme.text },
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <>
      <TouchableOpacity 
        onPress={() => setModalVisible(true)} 
        style={[styles.filterButton, { 
          backgroundColor: isDarkMode ? theme.dark_gray : theme.card,
          borderWidth: 1,
          borderColor: theme.border
        }]}
      >
        <Ionicons name="filter" size={24} color={theme.text} />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: isDarkMode ? theme.card : 'white' },
            ]}
          >
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>Filtros</Text>
              <TouchableOpacity 
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color={theme.text} />
              </TouchableOpacity>
            </View>

            <ScrollView 
              style={styles.modalBody}
              showsVerticalScrollIndicator={false}
            >
              {renderFilterSection('Ordenar por', sortOptions, 'sortBy')}
              {renderFilterSection('Preço', priceRanges, 'priceRange')}
              {renderFilterSection('Tipo de Espaço', spaceTypes, 'spaceType')}
              {renderFilterSection('Avaliação', ratings, 'rating')}
            </ScrollView>

            <View style={[styles.modalFooter, { borderTopColor: isDarkMode ? theme.border : colors.light_gray }]}>
              <TouchableOpacity
                style={[styles.resetButton, { borderColor: theme.blue }]}
                onPress={() => {
                  setSelectedFilters({ priceRange: '', spaceType: '', rating: '', sortBy: '' });
                  onFilterChange({ priceRange: '', spaceType: '', rating: '', sortBy: '' });
                }}
              >
                <Text style={[styles.resetButtonText, { color: theme.blue }]}>Limpar Filtros</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.applyButton, { backgroundColor: theme.blue }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.applyButtonText}>Aplicar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  filterButton: {
    width: 45,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    maxHeight: '75%',
  },
  filterSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  optionsContainer: {
    flexDirection: 'row',
  },
  optionsContent: {
    paddingRight: 20,
  },
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    marginRight: 12,
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  optionIcon: {
    marginRight: 8,
  },
  optionText: {
    fontSize: 15,
    fontWeight: '500',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
  },
  resetButton: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    flex: 1,
    marginRight: 12,
    alignItems: 'center',
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  applyButton: {
    padding: 14,
    borderRadius: 12,
    flex: 1,
    marginLeft: 12,
    alignItems: 'center',
  },
  applyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
}); 