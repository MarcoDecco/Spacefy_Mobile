import { useState } from 'react';
import { View, SafeAreaView, Text, TouchableOpacity, ScrollView, TouchableWithoutFeedback, Keyboard, Modal, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NavigationProps } from '../../../navigation/types';
import { pageTexts } from '../../../styles/globalStyles/pageTexts';
import { styles } from '../../../styles/spaceRegisterStyles/etapa2Styles';
import RegisterSpaceInput from '../../../components/inputs/registerSpaceInput';
import RegisterSpaceButton from '../../../components/buttons/registerSpaceButton';
import { colors } from '../../../styles/globalStyles/colors';

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
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const handleStateSelect = (selectedState: string) => {
    setState(selectedState);
    setModalVisible(false);
  };

  const handleNext = () => {
    if (!street || !number || !neighborhood || !city || !state || !zipCode) {
      Alert.alert('Atenção', 'Preencha todos os campos do endereço.');
      return;
    }
    navigation.navigate('SpaceNextStepScreen' as never);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>Etapa 2 de 8</Text>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: '16%' }]} />
            <View style={[styles.progressBar, { width: '16%' }]} />
            <View style={styles.progressBarInactive} />
            <View style={styles.progressBarInactive} />
            <View style={styles.progressBarInactive} />
            <View style={styles.progressBarInactive} />
            <View style={styles.progressBarInactive} />
            <View style={styles.progressBarInactive} />
          </View>
        </View>

        <Text style={styles.title}>Endereço do Espaço</Text>
        <Text style={styles.subtitle}>Preencha os dados do endereço onde o espaço está localizado</Text>

        <ScrollView style={styles.scrollView}>
          <View style={styles.formContainer}>
            <RegisterSpaceInput
              label="Rua"
              placeholder="Digite o nome da rua"
              value={street}
              onChangeText={setStreet}
            />

            <View style={styles.rowContainer}>
              <View style={styles.halfInput}>
                <RegisterSpaceInput
                  label="Número"
                  placeholder="Número"
                  value={number}
                  onChangeText={setNumber}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.halfInput}>
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
              <View style={styles.halfInput}>
                <RegisterSpaceInput
                  label="Bairro"
                  placeholder="Bairro"
                  value={neighborhood}
                  onChangeText={setNeighborhood}
                />
              </View>
              <View style={styles.halfInput}>
                <RegisterSpaceInput
                  label="Cidade"
                  placeholder="Cidade"
                  value={city}
                  onChangeText={setCity}
                />
              </View>
            </View>

            <Text style={pageTexts.labelInput}>Estado</Text>
            <TouchableOpacity 
              style={styles.typeButton}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.typeButtonText}>
                {state || 'Selecione o estado'}
              </Text>
            </TouchableOpacity>

            <View style={styles.instructionsContainer}>
              <Text style={styles.instructionsTitle}>Instruções</Text>
              <View style={styles.instructionsList}>
                <Text style={styles.instructionItem}>• Digite o nome da rua para autopreenchimento do endereço</Text>
                <Text style={styles.instructionItem}>• Verifique se todos os dados estão corretos</Text>
                <Text style={styles.instructionItem}>• O endereço será usado para localização no mapa</Text>
                <Text style={styles.instructionItem}>• Certifique-se de que o endereço está completo e correto</Text>
              </View>
            </View>
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
            onPress={handleNext}
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