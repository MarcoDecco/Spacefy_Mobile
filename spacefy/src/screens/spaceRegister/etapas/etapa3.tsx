import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Modal,
  ScrollView,
  Alert,
  Platform,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigation/types';
import { styles } from '../../../styles/spaceRegisterStyles/etapa3Styles';
import { colors } from '../../../styles/globalStyles/colors';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useSpaceRegister } from '../../../contexts/SpaceRegisterContext';
import { ProgressBar } from '../../../components/ProgressBar';
import { NavigationButtons } from '../../../components/buttons/NavigationButtons';

type Etapa3ScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Etapa3'>;

export default function Etapa3() {
  const navigation = useNavigation<Etapa3ScreenNavigationProp>();
  const { formData, updateFormData } = useSpaceRegister();
  const [images, setImages] = useState<string[]>(formData.image_url || []);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const pickImage = async () => {
    if (images.length >= 6) {
      Alert.alert('Limite atingido', 'Você pode adicionar no máximo 6 imagens.');
      return;
    }

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos de acesso à sua galeria para adicionar imagens.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0].uri) {
      setImages([...images, result.assets[0].uri]);
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

  const handleProsseguir = () => {
    if (images.length === 0) {
      Alert.alert('Erro', 'Por favor, adicione pelo menos uma imagem do seu espaço.');
      return;
    }

    updateFormData({
      ...formData,
      image_url: images,
    });

    navigation.navigate('SpaceAvailabilityScreen');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.progressContainer}>
        <ProgressBar progress={0.375} currentStep={3} totalSteps={8} />
      </View>

      <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Fotos do seu espaço</Text>
        <Text style={styles.subtitle}>
          Adicione fotos do seu espaço para que os usuários possam conhecê-lo melhor.
          Você pode adicionar até 6 fotos.
        </Text>

        <View style={styles.imageContainer}>
          <View style={styles.imageGrid}>
            {images.map((uri, index) => (
              <View key={index} style={styles.imageWrapper}>
                <TouchableOpacity onPress={() => setSelectedImage(uri)}>
                  <Image source={{ uri }} style={styles.image} />
                  <View style={styles.imageCounter}>
                    <Text style={styles.imageCounterText}>{index + 1}/6</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeImage(index)}
                >
                  <Ionicons name="close" size={16} color={colors.white} />
                </TouchableOpacity>
              </View>
            ))}
            {images.length < 6 && (
              <TouchableOpacity style={styles.addButton} onPress={pickImage}>
                <Ionicons name="add" size={32} color={colors.blue} />
              </TouchableOpacity>
            )}
          </View>
          <Text style={styles.imageTip}>
            Dica: Adicione fotos em boa qualidade e bem iluminadas do seu espaço
          </Text>
        </View>
      </ScrollView>

      <NavigationButtons
        onBack={() => navigation.goBack()}
        onNext={handleProsseguir}
        disabled={images.length === 0}
      />

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
            <Image source={{ uri: selectedImage }} style={styles.modalImage} />
          )}
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
} 