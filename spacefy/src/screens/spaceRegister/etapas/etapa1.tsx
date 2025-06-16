import React, { useState } from 'react';
import { View, SafeAreaView, Text, TouchableOpacity, Modal, FlatList, StyleSheet, TouchableWithoutFeedback, Keyboard, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NavigationProps } from '../../../navigation/types';
import { inputStyles } from '../../../styles/componentStyles/inputStyles';
import { pageTexts } from '../../../styles/globalStyles/pageTexts';
import { styles } from '../../../styles/spaceRegisterStyles/etapa1Styles';
import { colors } from '../../../styles/globalStyles/colors';
import RegisterSpaceInput from '../../../components/inputs/registerSpaceInput';
import RegisterSpaceButton from '../../../components/buttons/registerSpaceButton';
import { ProgressBar } from '../../../components/ProgressBar';
import { useSpaceRegister } from '../../../contexts/SpaceRegisterContext';
import { NavigationButtons } from '../../../components/buttons/NavigationButtons';

const tiposEspaco = [
  { id: '1', label: 'Espaço para Eventos' },
  { id: '2', label: 'Sala de Reuniões' },
  { id: '3', label: 'Auditório' },
  { id: '4', label: 'Espaço de Coworking' },
  { id: '5', label: 'Estúdio' },
  { id: '6', label: 'Galeria' },
  { id: '7', label: 'Salão de Festas' },
  { id: '8', label: 'Espaço Cultural' },
  { id: '9', label: 'Sala de Treino/Academia' },
  { id: '10', label: 'Sala de Aula' },
  { id: '11', label: 'Espaço Gastronômico' },
  { id: '12', label: 'Espaço de Beleza' },
  { id: '13', label: 'Espaço Médico/Consultório' },
  { id: '14', label: 'Espaço Religioso' },
  { id: '15', label: 'Espaço Esportivo' },
  { id: '16', label: 'Espaço para Teatro' },
  { id: '17', label: 'Espaço para Música' },
  { id: '18', label: 'Espaço para Exposição' },
  { id: '19', label: 'Espaço para Workshops' },
  { id: '20', label: 'Espaço para Yoga/Meditação' },
  { id: '21', label: 'Espaço para Dança' },
  { id: '22', label: 'Espaço para Artes Marciais' },
  { id: '23', label: 'Estúdio Fotográfico' },
  { id: '24', label: 'Espaço para Gráfica' },
  { id: '25', label: 'Espaço para Cerimônias' },
  { id: '26', label: 'Espaço para Conferências' },
  { id: '27', label: 'Showroom' },
  { id: '28', label: 'Espaço para Loja' },
  { id: '29', label: 'Espaço para Escritório' },
  { id: '30', label: 'Estúdio de TV' },
  { id: '31', label: 'Estúdio de Rádio' },
  { id: '32', label: 'Estúdio de Podcast' },
  { id: '33', label: 'Estúdio de Gravação' },
  { id: '34', label: 'Estúdio de Dança' },
  { id: '35', label: 'Estúdio de Música' },
  { id: '36', label: 'Estúdio de Arte' },
  { id: '37', label: 'Estúdio de Fitness' },
  { id: '38', label: 'Estúdio de Pilates' },
  { id: '39', label: 'Espaço para Massagem' },
  { id: '40', label: 'Espaço para Spa' },
  { id: '41', label: 'Espaço para Sauna' },
  { id: '42', label: 'Espaço com Piscina' },
  { id: '43', label: 'Espaço com Quadra' },
  { id: '44', label: 'Espaço com Campo' },
  { id: '45', label: 'Espaço com Parque' },
  { id: '46', label: 'Outro' }
];

const Etapa1 = () => {
  const navigation = useNavigation();
  const { formData, updateFormData } = useSpaceRegister();
  const [space_name, setSpaceName] = useState(formData.space_name);
  const [space_description, setSpaceDescription] = useState(formData.space_description);
  const [space_type, setSpaceType] = useState(formData.space_type);
  const [max_people, setMaxPeople] = useState(formData.max_people);
  const [modalVisible, setModalVisible] = useState(false);

  const handleTypeSelect = (selectedType: string) => {
    setSpaceType(selectedType);
    setModalVisible(false);
  };

  // Função para validar os campos da etapa
  const validarEtapa = () => {
    const erros = [];
    
    if (!space_name?.trim()) {
      erros.push('O nome do espaço é obrigatório');
    }

    if (!space_type) {
      erros.push('O tipo do espaço é obrigatório');
    }

    if (!max_people || parseInt(max_people) <= 0) {
      erros.push('A capacidade máxima deve ser maior que zero');
    }

    return {
      valido: erros.length === 0,
      erros
    };
  };

  const handleProsseguir = () => {
    const validacao = validarEtapa();
    
    if (!validacao.valido) {
      Alert.alert(
        'Campos Obrigatórios',
        validacao.erros.join('\n'),
        [{ text: 'OK' }]
      );
      return;
    }

    updateFormData({
      space_name,
      space_description,
      space_type,
      max_people,
    });
    navigation.navigate('SpaceAddressScreen' as never);
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={styles.container}>
          <View style={styles.progressContainer}>
            <ProgressBar progress={0.125} currentStep={1} totalSteps={8} />
          </View>

          <ScrollView 
            style={styles.contentContainer}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ flexGrow: 1 }}
          >
            <View style={styles.header}>
              <Text style={styles.title}>Informações Básicas</Text>
              <Text style={styles.description}>
                Preencha as informações básicas do seu espaço
              </Text>
            </View>

            <View style={styles.formContainer}>
              <View style={styles.inputContainer}>
                <RegisterSpaceInput
                  label="Nome do Espaço"
                  placeholder="Digite o nome do seu espaço"
                  value={space_name}
                  onChangeText={setSpaceName}
                />
              </View>

              <View style={styles.inputContainer}>
                <RegisterSpaceInput
                  label="Descrição"
                  placeholder="Descreva seu espaço"
                  value={space_description}
                  onChangeText={setSpaceDescription}
                  multiline
                  numberOfLines={4}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Tipo do Espaço</Text>
                <TouchableOpacity
                  style={[styles.input, !space_type && styles.inputError]}
                  onPress={() => setModalVisible(true)}
                >
                  <Text style={{ color: space_type ? colors.black : colors.gray }}>
                    {space_type || 'Selecione o tipo de espaço'}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.inputContainer}>
                <RegisterSpaceInput
                  label="Capacidade Máxima"
                  placeholder="Número de pessoas"
                  value={max_people}
                  onChangeText={setMaxPeople}
                  keyboardType="numeric"
                />
              </View>
            </View>
          </ScrollView>

          <NavigationButtons
            onBack={() => navigation.goBack()}
            onNext={handleProsseguir}
            disabled={!space_name || !space_description || !space_type || !max_people}
          />

          <Modal
            visible={modalVisible}
            transparent
            animationType="slide"
            onRequestClose={() => setModalVisible(false)}
          >
            <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
              <View style={modalStyles.centeredView}>
                <TouchableWithoutFeedback>
                  <View style={modalStyles.modalView}>
                    <Text style={modalStyles.modalTitle}>Escolha o tipo do espaço</Text>
                    <FlatList
                      data={tiposEspaco}
                      keyExtractor={(item) => item.id}
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          style={modalStyles.modalOption}
                          onPress={() => handleTypeSelect(item.label)}
                        >
                          <Text style={modalStyles.modalOptionText}>{item.label}</Text>
                        </TouchableOpacity>
                      )}
                    />
                    <TouchableOpacity
                      style={modalStyles.modalCloseButton}
                      onPress={() => setModalVisible(false)}
                    >
                      <Text style={modalStyles.modalCloseButtonText}>Fechar</Text>
                    </TouchableOpacity>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const modalStyles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.light_gray,
  },
  modalOptionText: {
    fontSize: 16,
    color: colors.black,
  },
  modalCloseButton: {
    marginTop: 16,
    padding: 12,
    backgroundColor: colors.blue,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalCloseButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Etapa1;