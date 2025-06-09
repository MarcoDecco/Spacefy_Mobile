import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

interface FilterProps {
  onFilterChange: (filters: FilterOptions) => void;
  isDarkMode: boolean;
  theme: any;
}

export interface FilterOptions {
  priceRange: string;
  spaceType: string;
  rating: string;
}

export default function Filter({ onFilterChange, isDarkMode, theme }: FilterProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<FilterOptions>({
    priceRange: '',
    spaceType: '',
    rating: '',
  });

  const priceRanges = [
    { label: 'Todos os preços', value: '' },
    { label: 'Até R$50/hora', value: '0-50' },
    { label: 'R$50 - R$100/hora', value: '50-100' },
    { label: 'R$100 - R$200/hora', value: '100-200' },
    { label: 'Acima de R$200/hora', value: '200+' },
  ];

  const spaceTypes = [
    { label: 'Todos os tipos', value: '' },
    { label: 'Sala de Reunião', value: 'meeting_room' },
    { label: 'Escritório', value: 'office' },
    { label: 'Auditório', value: 'auditorium' },
    { label: 'Sala de Eventos', value: 'event_room' },
  ];

  const ratings = [
    { label: 'Todas as avaliações', value: '' },
    { label: '4+ estrelas', value: '4+' },
    { label: '3+ estrelas', value: '3+' },
    { label: '2+ estrelas', value: '2+' },
  ];

  const handleFilterSelect = (type: keyof FilterOptions, value: string) => {
    const newFilters = { ...selectedFilters, [type]: value };
    setSelectedFilters(newFilters);
    onFilterChange(newFilters);
  };

  const renderFilterSection = (
    title: string,
    options: { label: string; value: string }[],
    type: keyof FilterOptions
  ) => (
    <View style={styles.filterSection}>
      <Text style={[styles.sectionTitle, { color: theme.text }]}>{title}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.optionsContainer}>
        {options.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.filterOption,
              selectedFilters[type] === option.value && {
                backgroundColor: theme.blue,
              },
            ]}
            onPress={() => handleFilterSelect(type, option.value)}
          >
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
        <Ionicons name="filter" size={30} color={theme.text} />
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
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={theme.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              {renderFilterSection('Preço', priceRanges, 'priceRange')}
              {renderFilterSection('Tipo de Espaço', spaceTypes, 'spaceType')}
              {renderFilterSection('Avaliação', ratings, 'rating')}
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.resetButton, { borderColor: theme.blue }]}
                onPress={() => {
                  setSelectedFilters({ priceRange: '', spaceType: '', rating: '' });
                  onFilterChange({ priceRange: '', spaceType: '', rating: '' });
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
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    backgroundColor: 'white',
    marginRight: 20,
    boxShadow: '0px 0px 10px 2px rgba(0, 0, 0, 0.1)',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalBody: {
    maxHeight: '70%',
  },
  filterSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  optionsContainer: {
    flexDirection: 'row',
  },
  filterOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: '#f0f0f0',
  },
  optionText: {
    fontSize: 14,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  resetButton: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  applyButton: {
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginLeft: 8,
    alignItems: 'center',
  },
  applyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
}); 