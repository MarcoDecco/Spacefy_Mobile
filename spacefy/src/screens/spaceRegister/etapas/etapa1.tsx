import { useState } from 'react';
import { View, SafeAreaView, Text, TouchableOpacity, Modal, FlatList, StyleSheet, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NavigationProps } from '../../../navigation/types';
import { inputStyles } from '../../../styles/componentStyles/inputStyles';
import { pageTexts } from '../../../styles/globalStyles/pageTexts';
import { styles } from '../../../styles/spaceRegisterStyles/etapa1Styles';
import RegisterSpaceInput from '../../../components/inputs/registerSpaceInput';
import RegisterSpaceButton from '../../../components/buttons/registerSpaceButton';

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

export default function SpaceInfoScreen() {
  const navigation = useNavigation<NavigationProps>();
  const [name, setName] = useState('');
  const [capacity, setCapacity] = useState('');
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const handleTypeSelect = (selectedType: string) => {
    setType(selectedType);
    setModalVisible(false);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>Etapa 1 de 8</Text>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: '16%' }]} />
            <View style={styles.progressBarInactive} />
            <View style={styles.progressBarInactive} />
            <View style={styles.progressBarInactive} />
            <View style={styles.progressBarInactive} />
            <View style={styles.progressBarInactive} />
            <View style={styles.progressBarInactive} />
            <View style={styles.progressBarInactive} />
          </View>
        </View>
        <Text style={styles.title}>Informações do Espaço</Text>
        <View style={{ paddingBottom: 80 }}>
          <RegisterSpaceInput
            label="Nome do espaço"
            placeholder="Insira o nome do espaço"
            value={name}
            onChangeText={setName}
          />

          <Text style={pageTexts.labelInput}>Tipo de espaço</Text>
          <TouchableOpacity 
            style={styles.typeButton}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.typeButtonText}>
              {type || 'Escolher tipo'}
            </Text>
          </TouchableOpacity>

          <RegisterSpaceInput
            label="Capacidade máxima de pessoas"
            placeholder="Insira o número máximo de pessoas"
            value={capacity}
            onChangeText={setCapacity}
            keyboardType="numeric"
          />

          <RegisterSpaceInput
            label="Breve descrição do espaço"
            placeholder="Descreva como é o seu espaço"
            value={description}
            onChangeText={setDescription}
            multiline
            maxLength={250}
            hint="MAX 250 caracteres"
          />
        </View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
            <View style={modalStyles.centeredView}>
              <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
                <View style={modalStyles.modalView}>
                  <Text style={modalStyles.modalTitle}>Selecione o tipo de espaço</Text>
                  <FlatList
                    data={tiposEspaco}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={modalStyles.typeItem}
                        onPress={() => handleTypeSelect(item.label)}
                      >
                        <Text style={modalStyles.typeItemText}>{item.label}</Text>
                      </TouchableOpacity>
                    )}
                    style={modalStyles.list}
                  />
                  <TouchableOpacity
                    style={modalStyles.closeButton}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={modalStyles.closeButtonText}>Fechar</Text>
                  </TouchableOpacity>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        <View style={styles.buttonRowFixed}>
          <RegisterSpaceButton
            title="Voltar"
            onPress={() => navigation.goBack()}
            variant="secondary"
          />

          <RegisterSpaceButton
            title="Prosseguir"
            onPress={() => navigation.navigate('SpaceAddressScreen')}
          />
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
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
    alignItems: 'center',
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
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  list: {
    width: '100%',
  },
  typeItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  typeItemText: {
    fontSize: 16,
  },
  closeButton: {
    marginTop: 15,
    backgroundColor: '#2196F3',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    width: '100%',
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});