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
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { NavigationProps } from '../../../navigation/types';
import RegisterSpaceButton from '../../../components/buttons/registerSpaceButton';
import { styles } from '../../../styles/spaceRegisterStyles/etapa3Styles';
import { colors } from '../../../styles/globalStyles/colors';

const MAX_IMAGES = 10;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const Etapa3 = () => {
  const navigation = useNavigation<NavigationProps>();
  const [images, setImages] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const pickImage = async () => {
    if (images.length >= MAX_IMAGES) {
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

      setImages([...images, newImage]);
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
            const newImages = [...images];
            newImages.splice(index, 1);
            setImages(newImages);
          },
        },
      ]
    );
  };

  const handleNext = () => {
    if (images.length === 0) {
      Alert.alert('Atenção', 'Selecione pelo menos uma imagem.');
      return;
    }
    navigation.navigate('SpaceAvailabilityScreen' as never);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>Etapa 3 de 8</Text>
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: '16%' }]} />
          <View style={[styles.progressBar, { width: '16%' }]} />
          <View style={[styles.progressBar, { width: '16%' }]} />
          <View style={styles.progressBarInactive} />
          <View style={styles.progressBarInactive} />
          <View style={styles.progressBarInactive} />
          <View style={styles.progressBarInactive} />
          <View style={styles.progressBarInactive} />
        </View>
      </View>

      <Text style={styles.title}>Adicione fotos do seu espaço</Text>
      <Text style={styles.subtitle}>
        Adicione até 10 fotos do seu espaço. A primeira foto será a foto principal.
      </Text>

      <ScrollView style={styles.imageContainer}>
        <View style={styles.imageGrid}>
          {images.map((image, index) => (
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
          {images.length < MAX_IMAGES && (
            <TouchableOpacity style={styles.addButton} onPress={pickImage}>
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
          )}
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
        visible={!!selectedImage}
        transparent={true}
        onRequestClose={() => setSelectedImage(null)}
      >
        <TouchableOpacity
          style={styles.modalContainer}
          activeOpacity={1}
          onPress={() => setSelectedImage(null)}
        >
          {selectedImage && (
            <Image
              source={{ uri: selectedImage }}
              style={styles.modalImage}
              resizeMode="contain"
            />
          )}
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

export default Etapa3; 