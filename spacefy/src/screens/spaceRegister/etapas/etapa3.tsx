import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  Modal,
  SafeAreaView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { NavigationProps } from '../../../navigation/types';
import RegisterSpaceButton from '../../../components/buttons/registerSpaceButton';
import { styles } from '../../../styles/spaceRegisterStyles/etapa3Styles';
import { colors } from '../../../styles/globalStyles/colors';
import { ProgressBar } from '../../../components/ProgressBar';
import { useSpaceRegister } from '../../../contexts/SpaceRegisterContext';

const MAX_IMAGES = 10;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const Etapa3 = () => {
  const navigation = useNavigation<NavigationProps>();
  const { formData, updateFormData } = useSpaceRegister();
  const [fotos, setFotos] = useState<string[]>(formData.image_url || []);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const pickImage = async () => {
    if (fotos.length >= MAX_IMAGES) {
      Alert.alert('Limite atingido', `Você pode adicionar no máximo ${MAX_IMAGES} imagens.`);
      return;
    }

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos de permissão para acessar suas fotos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      const newImage = result.assets[0].uri;
      
      // Verificar tamanho do arquivo
      const response = await fetch(newImage);
      const blob = await response.blob();
      
      if (blob.size > MAX_FILE_SIZE) {
        Alert.alert('Arquivo muito grande', 'A imagem deve ter no máximo 5MB.');
        return;
      }

      setFotos([...fotos, newImage]);
    }
  };

  const removeImage = (index: number) => {
    Alert.alert(
      'Remover imagem',
      'Tem certeza que deseja remover esta imagem?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: () => {
            const newImages = [...fotos];
            newImages.splice(index, 1);
            setFotos(newImages);
          },
        },
      ]
    );
  };

  // Função para validar os campos da etapa
  const validarEtapa = () => {
    const erros = [];
    
    if (fotos.length === 0) {
      erros.push('É necessário adicionar pelo menos uma foto do espaço');
    }

    if (fotos.length > MAX_IMAGES) {
      erros.push(`O número máximo de fotos é ${MAX_IMAGES}`);
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
      image_url: fotos,
    });
    navigation.navigate('SpaceAvailabilityScreen' as never);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <View style={styles.progressContainer}>
          <ProgressBar progress={0.375} currentStep={3} totalSteps={8} />
        </View>
        <Text style={styles.title}>Fotos do Espaço</Text>
        <Text style={styles.subtitle}>
          Adicione fotos do seu espaço para que os usuários possam conhecê-lo melhor
        </Text>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.formContainer}>
            <View style={styles.imageContainer}>
              <View style={styles.imageGrid}>
                {fotos.map((image, index) => (
                  <View key={index} style={styles.imageWrapper}>
                    <Image source={{ uri: image }} style={styles.image} />
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => removeImage(index)}
                    >
                      <Text style={styles.removeButtonText}>X</Text>
                    </TouchableOpacity>
                  </View>
                ))}
                {fotos.length < MAX_IMAGES && (
                  <TouchableOpacity style={styles.addButton} onPress={pickImage}>
                    <Text style={styles.addButtonText}>+</Text>
                  </TouchableOpacity>
                )}
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
            onPress={handleProsseguir}
            variant="primary"
          />
        </View>

        <Modal
          visible={!!selectedImage}
          transparent={true}
          onRequestClose={() => setSelectedImage(null)}
        >
          <TouchableWithoutFeedback onPress={() => setSelectedImage(null)}>
            <View style={styles.modalContainer}>
              {selectedImage && (
                <Image source={{ uri: selectedImage }} style={styles.modalImage} />
              )}
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default Etapa3; 