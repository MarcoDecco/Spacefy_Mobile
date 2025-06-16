import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  Image,
  Platform,
  KeyboardAvoidingView,
  Keyboard,
  Alert,
  TouchableWithoutFeedback,
  SafeAreaView,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { styles } from '../../../styles/spaceRegisterStyles/etapa7Styles';
import { ProgressBar } from '../../../components/ProgressBar';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../styles/globalStyles/colors';
import { useSpaceRegister } from '../../../contexts/SpaceRegisterContext';
import RegisterSpaceInput from '../../../components/inputs/registerSpaceInput';
import RegisterSpaceButton from '../../../components/buttons/registerSpaceButton';
import api from '../../../services/api';
import { CampoTexto } from '../../../components/CampoTexto';
import { CampoDocumento } from '../../../components/CampoDocumento';
import { NavigationButtons } from '../../../components/buttons/NavigationButtons';

interface CampoTextoProps {
  titulo: string;
  value: string;
  onChange: (e: { target: { name: string; value: string } }) => void;
}

interface CampoDocumentoProps {
  titulo: string;
  value: string;
  onChange: (e: { target: { name: string; value: string } }) => void;
}

interface VisualizadorDocumentoProps {
  url: string;
}

interface SpaceRegisterData {
  owner_name: string;
  owner_email: string;
  owner_phone: string;
  document_number: string;
  document_photo: string;
  space_document_photo: string;
  [key: string]: any;
}

const VisualizadorDocumento: React.FC<VisualizadorDocumentoProps> = ({ url }) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.documentPreview}>
      <TouchableOpacity
        style={styles.previewButton}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="document-text-outline" size={24} color={colors.blue} />
        <Text style={styles.previewText}>Visualizar Documento</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Ionicons name="close" size={24} color={colors.white} />
            </TouchableOpacity>
            <Image
              source={{ uri: url }}
              style={styles.modalImage}
              resizeMode="contain"
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const Etapa7: React.FC = () => {
  const navigation = useNavigation();
  const { formData, updateFormData } = useSpaceRegister();
  const [loading, setLoading] = useState(false);

  const handleChange = (e: { target: { name: string; value: string } }) => {
    updateFormData({ [e.target.name]: e.target.value });
  };

  const validarEtapa = () => {
    if (!formData.owner_name.trim()) {
      Alert.alert('Erro', 'Por favor, preencha o nome do proprietário.');
      return false;
    }
    if (!formData.owner_email.trim()) {
      Alert.alert('Erro', 'Por favor, preencha o e-mail do proprietário.');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.owner_email)) {
      Alert.alert('Erro', 'Digite um e-mail válido.');
      return false;
    }
    if (!formData.owner_phone.trim()) {
      Alert.alert('Erro', 'Por favor, preencha o telefone do proprietário.');
      return false;
    }
    if (!formData.document_number.trim()) {
      Alert.alert('Erro', 'Por favor, preencha o CPF ou CNPJ do proprietário.');
      return false;
    }
    return true;
  };

  const handleNext = async () => {
    if (!validarEtapa()) return;
    setLoading(true);
    try {
      navigation.navigate('Etapa8' as never);
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro ao salvar os documentos. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const isNextDisabled =
    loading ||
    !formData.owner_name?.trim() ||
    !formData.owner_email?.trim() ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.owner_email) ||
    !formData.owner_phone?.trim() ||
    !formData.document_number?.trim();

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <View style={styles.progressContainer}>
          <ProgressBar progress={0.875} currentStep={7} totalSteps={8} />
        </View>

        <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>Informações do Proprietário e Documentos</Text>
          <Text style={styles.subtitle}>
            Preencha os dados do proprietário e anexe os documentos necessários para o cadastro do seu espaço.
          </Text>

          <CampoTexto
            titulo="Nome do Proprietário"
            value={formData.owner_name || ''}
            onChange={handleChange}
            name="owner_name"
          />
          <CampoTexto
            titulo="E-mail"
            value={formData.owner_email || ''}
            onChange={handleChange}
            name="owner_email"
          />
          <CampoTexto
            titulo="Telefone"
            value={formData.owner_phone || ''}
            onChange={handleChange}
            name="owner_phone"
          />
          <CampoTexto
            titulo="CPF ou CNPJ"
            value={formData.document_number || ''}
            onChange={handleChange}
            name="document_number"
          />
          <CampoDocumento
            titulo="Documento do Proprietário"
            value={formData.document_photo || ''}
            onChange={handleChange}
            name="document_photo"
          />
          <CampoDocumento
            titulo="Documento do Espaço"
            value={formData.space_document_photo || ''}
            onChange={handleChange}
            name="space_document_photo"
          />
        </ScrollView>

        <NavigationButtons
          onBack={() => navigation.goBack()}
          onNext={handleNext}
          disabled={isNextDisabled}
        />
        {loading && (
          <View style={{
            ...StyleSheet.absoluteFillObject,
            backgroundColor: 'rgba(255,255,255,0.7)',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 10,
          }}>
            <ActivityIndicator size="large" color={colors.blue} />
          </View>
        )}
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default Etapa7; 