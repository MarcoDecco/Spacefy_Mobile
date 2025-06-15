import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Platform,
  SafeAreaView,
  StatusBar,
  Alert,
  ActivityIndicator,
  Linking,
  KeyboardAvoidingView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { colors } from '../styles/globalStyles/colors';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { NavigationProps } from '../navigation/types';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../services/userService';
import { uploadImages } from '../services/imageService';

const EditProfile = () => {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    telephone: '',
    password: '',
    confirmPassword: '',
    profilePhoto: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { theme, isDarkMode } = useTheme();
  const navigation = useNavigation<NavigationProps>();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        surname: user.surname || '',
        email: user.email || '',
        telephone: user.telephone || '',
        password: '',
        confirmPassword: '',
        profilePhoto: user.profilePhoto || ''
      });
    }
  }, [user]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError('');
    setSuccess('');
  };

  const validateForm = () => {
    if (!formData.name || !formData.surname || !formData.email || !formData.telephone || !formData.profilePhoto) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      return false;
    }

    if (formData.password && formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem.');
      return false;
    }

    if (formData.password && formData.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return false;
    }

    return true;
  };

  const handleUpdateProfile = async () => {
    if (!user) {
      Alert.alert('Erro', 'Usuário não encontrado');
      return;
    }

    setError('');
    setSuccess('');

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const userData = {
        name: formData.name,
        surname: formData.surname,
        email: formData.email,
        telephone: formData.telephone,
        password: formData.password || undefined,
        profilePhoto: formData.profilePhoto
      };

      await userService.updateUser(user.id, userData);
      setSuccess('Perfil atualizado com sucesso!');
      
      // Limpa os campos de senha
      setFormData(prev => ({
        ...prev,
        password: '',
        confirmPassword: ''
      }));

      setTimeout(() => {
        navigation.goBack();
      }, 1500);
    } catch (error: any) {
      setError(error?.response?.data?.message || 'Erro ao atualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  const openSettings = async () => {
    try {
      if (Platform.OS === 'ios') {
        await Linking.openURL('app-settings:');
      } else {
        await Linking.openSettings();
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível abrir as configurações');
    }
  };

  const handleCameraPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert(
        'Permissão da Câmera Necessária',
        'Para tirar fotos, precisamos de acesso à sua câmera. Sem esta permissão, você não poderá tirar fotos para seu perfil.',
        [
          {
            text: 'Não Permitir',
            style: 'cancel'
          },
          {
            text: 'Permitir Acesso',
            onPress: async () => {
              const newStatus = await ImagePicker.requestCameraPermissionsAsync();
              if (newStatus.status === 'granted') {
                handleTakePhoto();
              } else {
                Alert.alert(
                  'Configurações',
                  'Para permitir o acesso, você precisa ativar a permissão nas configurações do aplicativo.',
                  [
                    {
                      text: 'Cancelar',
                      style: 'cancel'
                    },
                    {
                      text: 'Abrir Configurações',
                      onPress: openSettings
                    }
                  ]
                );
              }
            }
          }
        ]
      );
      return false;
    }
    return true;
  };

  const handleGalleryPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert(
        'Permissão da Galeria Necessária',
        'Para selecionar fotos, precisamos de acesso à sua galeria. Sem esta permissão, você não poderá escolher fotos para seu perfil.',
        [
          {
            text: 'Não Permitir',
            style: 'cancel'
          },
          {
            text: 'Permitir Acesso',
            onPress: async () => {
              const newStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
              if (newStatus.status === 'granted') {
                handlePickImage();
              } else {
                Alert.alert(
                  'Configurações',
                  'Para permitir o acesso, você precisa ativar a permissão nas configurações do aplicativo.',
                  [
                    {
                      text: 'Cancelar',
                      style: 'cancel'
                    },
                    {
                      text: 'Abrir Configurações',
                      onPress: openSettings
                    }
                  ]
                );
              }
            }
          }
        ]
      );
      return false;
    }
    return true;
  };

  const handleTakePhoto = async () => {
    try {
      const hasPermission = await handleCameraPermission();
      if (!hasPermission) return;

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        await uploadAndUpdatePhoto(result.assets[0].uri);
      }
    } catch (error) {
      setError('Erro ao tirar foto');
    }
  };

  const handlePickImage = async () => {
    try {
      const hasPermission = await handleGalleryPermission();
      if (!hasPermission) return;

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        await uploadAndUpdatePhoto(result.assets[0].uri);
      }
    } catch (error) {
      setError('Erro ao selecionar imagem');
    }
  };

  const uploadAndUpdatePhoto = async (imageUri: string) => {
    setLoading(true);
    try {
      const imageFile = {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'profile-photo.jpg'
      };

      const uploadedUrls = await uploadImages([imageFile]);
      if (uploadedUrls.length > 0) {
        setFormData(prev => ({
          ...prev,
          profilePhoto: uploadedUrls[0]
        }));
        setSuccess('Foto de perfil atualizada com sucesso!');
      }
    } catch (error) {
      setError('Erro ao fazer upload da imagem');
    } finally {
      setLoading(false);
    }
  };

  const handleImagePicker = () => {
    Alert.alert(
      'Escolher Foto',
      'Como você deseja adicionar sua foto de perfil?',
      [
        {
          text: 'Tirar Foto',
          onPress: handleTakePhoto
        },
        {
          text: 'Escolher da Galeria',
          onPress: handlePickImage
        },
        {
          text: 'Cancelar',
          style: 'cancel'
        }
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, isDarkMode && { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      
      {/* Header */}
      <View style={[styles.header, isDarkMode && { backgroundColor: theme.background }]}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Ionicons 
            name="arrow-back" 
            size={24} 
            color={isDarkMode ? theme.text : colors.black} 
          />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, isDarkMode && { color: theme.text }]}>
          Editar Perfil
        </Text>
        <View style={styles.rightPlaceholder} />
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView 
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Foto de Perfil */}
          <View style={styles.photoContainer}>
            <TouchableOpacity onPress={handleImagePicker} style={styles.photoButton}>
              <Image
                source={
                  formData.profilePhoto
                    ? { uri: formData.profilePhoto }
                    : { uri: 'https://via.placeholder.com/120' }
                }
                style={styles.profilePhoto}
              />
              <View style={styles.editPhotoButton}>
                <Ionicons name="camera" size={20} color={colors.white} />
              </View>
            </TouchableOpacity>
          </View>

          {/* Campos do Formulário */}
          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, isDarkMode && { color: theme.text }]}>Nome</Text>
              <TextInput
                style={[styles.input, isDarkMode && { 
                  backgroundColor: theme.card,
                  color: theme.text,
                  borderColor: theme.border
                }]}
                value={formData.name}
                onChangeText={(value) => handleChange('name', value)}
                placeholder="Seu nome"
                placeholderTextColor={theme.gray}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, isDarkMode && { color: theme.text }]}>Sobrenome</Text>
              <TextInput
                style={[styles.input, isDarkMode && { 
                  backgroundColor: theme.card,
                  color: theme.text,
                  borderColor: theme.border
                }]}
                value={formData.surname}
                onChangeText={(value) => handleChange('surname', value)}
                placeholder="Seu sobrenome"
                placeholderTextColor={theme.gray}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, isDarkMode && { color: theme.text }]}>Email</Text>
              <TextInput
                style={[styles.input, isDarkMode && { 
                  backgroundColor: theme.card,
                  color: theme.text,
                  borderColor: theme.border
                }]}
                value={formData.email}
                onChangeText={(value) => handleChange('email', value)}
                placeholder="Seu email"
                placeholderTextColor={theme.gray}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, isDarkMode && { color: theme.text }]}>Telefone</Text>
              <TextInput
                style={[styles.input, isDarkMode && { 
                  backgroundColor: theme.card,
                  color: theme.text,
                  borderColor: theme.border
                }]}
                value={formData.telephone}
                onChangeText={(value) => handleChange('telephone', value)}
                placeholder="Seu telefone"
                placeholderTextColor={theme.gray}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, isDarkMode && { color: theme.text }]}>Nova Senha (opcional)</Text>
              <TextInput
                style={[styles.input, isDarkMode && { 
                  backgroundColor: theme.card,
                  color: theme.text,
                  borderColor: theme.border
                }]}
                value={formData.password}
                onChangeText={(value) => handleChange('password', value)}
                placeholder="Nova senha"
                placeholderTextColor={theme.gray}
                secureTextEntry
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, isDarkMode && { color: theme.text }]}>Confirmar Nova Senha</Text>
              <TextInput
                style={[styles.input, isDarkMode && { 
                  backgroundColor: theme.card,
                  color: theme.text,
                  borderColor: theme.border
                }]}
                value={formData.confirmPassword}
                onChangeText={(value) => handleChange('confirmPassword', value)}
                placeholder="Confirme a nova senha"
                placeholderTextColor={theme.gray}
                secureTextEntry
              />
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            {success ? <Text style={styles.successText}>{success}</Text> : null}

            <TouchableOpacity
              style={[styles.saveButton, loading && styles.saveButtonDisabled]}
              onPress={handleUpdateProfile}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <Text style={styles.saveButtonText}>Salvar Alterações</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.black,
  },
  rightPlaceholder: {
    width: 40,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 32,
  },
  photoContainer: {
    alignItems: 'center',
    marginVertical: 24,
  },
  photoButton: {
    position: 'relative',
  },
  profilePhoto: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.light_gray,
  },
  editPhotoButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.blue,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.white,
  },
  formContainer: {
    paddingHorizontal: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: colors.black,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: colors.white,
  },
  errorText: {
    color: colors.error,
    marginBottom: 16,
    textAlign: 'center',
  },
  successText: {
    color: colors.blue,
    marginBottom: 16,
    textAlign: 'center',
  },
  saveButton: {
    backgroundColor: colors.blue,
    height: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    marginBottom: 32,
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EditProfile;
