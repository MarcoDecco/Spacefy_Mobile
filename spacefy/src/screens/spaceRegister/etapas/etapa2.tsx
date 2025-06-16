import React, { useState } from 'react';
import { View, SafeAreaView, Text, TouchableOpacity, ScrollView, TouchableWithoutFeedback, Keyboard, Modal, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NavigationProps } from '../../../navigation/types';
import { pageTexts } from '../../../styles/globalStyles/pageTexts';
import { styles } from '../../../styles/spaceRegisterStyles/etapa2Styles';
import RegisterSpaceInput from '../../../components/inputs/registerSpaceInput';
import RegisterSpaceButton from '../../../components/buttons/registerSpaceButton';
import { colors } from '../../../styles/globalStyles/colors';
import { ProgressBar } from '../../../components/ProgressBar';
import { useSpaceRegister } from '../../../contexts/SpaceRegisterContext';

const estados = [
  { value: 'AC', label: 'Acre' },
  { value: 'AL', label: 'Alagoas' },
  { value: 'AP', label: 'Amapá' },
  { value: 'AM', label: 'Amazonas' },
  { value: 'BA', label: 'Bahia' },
  { value: 'CE', label: 'Ceará' },
  { value: 'DF', label: 'Distrito Federal' },
  { value: 'ES', label: 'Espírito Santo' },
  { value: 'GO', label: 'Goiás' },
  { value: 'MA', label: 'Maranhão' },
  { value: 'MT', label: 'Mato Grosso' },
  { value: 'MS', label: 'Mato Grosso do Sul' },
  { value: 'MG', label: 'Minas Gerais' },
  { value: 'PA', label: 'Pará' },
  { value: 'PB', label: 'Paraíba' },
  { value: 'PR', label: 'Paraná' },
  { value: 'PE', label: 'Pernambuco' },
  { value: 'PI', label: 'Piauí' },
  { value: 'RJ', label: 'Rio de Janeiro' },
  { value: 'RN', label: 'Rio Grande do Norte' },
  { value: 'RS', label: 'Rio Grande do Sul' },
  { value: 'RO', label: 'Rondônia' },
  { value: 'RR', label: 'Roraima' },
  { value: 'SC', label: 'Santa Catarina' },
  { value: 'SP', label: 'São Paulo' },
  { value: 'SE', label: 'Sergipe' },
  { value: 'TO', label: 'Tocantins' }
];

const Etapa2 = () => {
  const navigation = useNavigation<NavigationProps>();
  const { formData, updateFormData } = useSpaceRegister();
  const [street, setStreet] = useState(formData.street);
  const [number, setNumber] = useState(formData.number);
  const [complement, setComplement] = useState(formData.complement);
  const [neighborhood, setNeighborhood] = useState(formData.neighborhood);
  const [city, setCity] = useState(formData.city);
  const [state, setState] = useState(formData.state);
  const [zipCode, setZipCode] = useState(formData.zipCode);
  const [modalVisible, setModalVisible] = useState(false);

  const handleStateSelect = (selectedState: string) => {
    setState(selectedState);
    setModalVisible(false);
  };

  // Função para validar os campos da etapa
  const validarEtapa = () => {
    const erros = [];
    
    if (!street?.trim()) {
      erros.push('A rua é obrigatória');
    }

    if (!number?.trim()) {
      erros.push('O número é obrigatório');
    }

    if (!neighborhood?.trim()) {
      erros.push('O bairro é obrigatório');
    }

    if (!city?.trim()) {
      erros.push('A cidade é obrigatória');
    }

    if (!state) {
      erros.push('O estado é obrigatório');
    }

    if (!zipCode?.trim()) {
      erros.push('O CEP é obrigatório');
    } else if (!/^\d{5}-?\d{3}$/.test(zipCode)) {
      erros.push('O CEP deve estar no formato 00000-000');
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
      street,
      number,
      complement,
      neighborhood,
      city,
      state,
      zipCode,
    });
    navigation.navigate('SpaceNextStepScreen' as never);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <View style={styles.progressContainer}>
          <ProgressBar progress={0.25} currentStep={2} totalSteps={8} />
        </View>
        <Text style={styles.title}>Endereço do Espaço</Text>
        <Text style={styles.subtitle}>Preencha o endereço completo do seu espaço</Text>

        <ScrollView style={styles.scrollView}>
          <View style={styles.formContainer}>
            <RegisterSpaceInput
              label="Rua"
              placeholder="Digite o nome da rua"
              value={street}
              onChangeText={setStreet}
            />

            <View style={styles.rowContainer}>
              <View style={styles.halfContainer}>
                <RegisterSpaceInput
                  label="Número"
                  placeholder="Número"
                  value={number}
                  onChangeText={setNumber}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.halfContainer}>
                <RegisterSpaceInput
                  label="CEP"
                  placeholder="00000-000"
                  value={zipCode}
                  onChangeText={setZipCode}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.rowContainer}>
              <View style={styles.halfContainer}>
                <RegisterSpaceInput
                  label="Bairro"
                  placeholder="Bairro"
                  value={neighborhood}
                  onChangeText={setNeighborhood}
                />
              </View>

              <View style={styles.halfContainer}>
                <RegisterSpaceInput
                  label="Cidade"
                  placeholder="Cidade"
                  value={city}
                  onChangeText={setCity}
                />
              </View>
            </View>

            <TouchableOpacity
              style={styles.typeButton}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.typeButtonText}>
                {state || 'Selecione o estado'}
              </Text>
            </TouchableOpacity>

            <RegisterSpaceInput
              label="Complemento"
              placeholder="Complemento (opcional)"
              value={complement}
              onChangeText={setComplement}
            />
          </View>
        </ScrollView>

        <View style={styles.buttonRowFixed}>
          <RegisterSpaceButton
            title="Voltar"
            onPress={() => navigation.goBack()}
            variant="secondary"
          />
          <RegisterSpaceButton
            title="Continuar"
            onPress={handleProsseguir}
            variant="primary"
          />
        </View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
            <View style={styles.modalContainer}>
              <TouchableWithoutFeedback>
                <View style={styles.modalView}>
                  <Text style={styles.modalTitle}>Selecione o estado</Text>
                  <ScrollView style={styles.modalList}>
                    {estados.map((estado) => (
                      <TouchableOpacity
                        key={estado.value}
                        style={styles.modalItem}
                        onPress={() => handleStateSelect(estado.label)}
                      >
                        <Text style={styles.modalItemText}>{estado.label}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                  <TouchableOpacity
                    style={styles.modalCloseButton}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.modalCloseButtonText}>Fechar</Text>
                  </TouchableOpacity>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default Etapa2; 