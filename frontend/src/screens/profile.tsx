import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, Modal, TextInput, Alert, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import * as ImagePicker from 'expo-image-picker';
import { profileStyles as styles } from '../styles/profileStyles';
import { colors } from '../styles/globalStyles/colors';
import { RootStackParamList } from '../navigation/types';
import { NotificationButton } from '../components/NotificationButton';
import EditProfile from './editProfile';
import mansao from '../../assets/mansao.png';
import { userService } from '../services/userService';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const formatDocument = (value: string, type: 'CPF' | 'CNPJ') => {
  // Remove todos os caracteres não numéricos
  const numbers = value.replace(/\D/g, '');
  
  if (type === 'CPF') {
    // Aplica a máscara de CPF: 000.000.000-00
    return numbers
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  } else {
    // Aplica a máscara de CNPJ: 00.000.000/0000-00
    return numbers
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  }
};

const isValidDocument = (document: string, type: 'CPF' | 'CNPJ'): boolean => {
  const numbers = document.replace(/\D/g, '');
  return type === 'CPF' ? numbers.length === 11 : numbers.length === 14;
};

export default function Profile() {
  const navigation = useNavigation<NavigationProp>();
  const { user, updateUser, signOut } = useAuth();
  const { theme, isDarkMode } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [isSpaceOwnerModalVisible, setIsSpaceOwnerModalVisible] = useState(false);
  const [isTermsModalVisible, setIsTermsModalVisible] = useState(false);
  const [documentNumber, setDocumentNumber] = useState('');
  const [documentType, setDocumentType] = useState<'CPF' | 'CNPJ'>('CPF');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [editedUser, setEditedUser] = useState({
    name: '',
    surname: '',
    telephone: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      console.log('👤 Dados do usuário carregados:', user);
      setEditedUser({
        name: user.name || '',
        surname: user.surname || '',
        telephone: user.telephone || '',
      });
    }
  }, [user]);

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      console.log('📝 Salvando perfil:', editedUser);
      await updateUser(editedUser);
      setIsEditing(false);
      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
    } catch (error) {
      console.error('❌ Erro ao salvar perfil:', error);
      Alert.alert('Erro', 'Não foi possível atualizar o perfil. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        console.log('🖼️ Imagem selecionada:', result.assets[0].uri);
        // Aqui você pode implementar o upload da imagem para o servidor
      }
    } catch (error) {
      console.error('❌ Erro ao selecionar imagem:', error);
      Alert.alert('Erro', 'Não foi possível selecionar a imagem. Tente novamente.');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigation.reset({
        index: 0,
        routes: [{ name: 'Welcome' }],
      });
    } catch (error) {
      console.error('❌ Erro ao fazer logout:', error);
    }
  };

  const handleOpenSpaceOwnerModal = () => {
    if (user?.userType === 'locador') {
      navigation.navigate('SpaceWelcomeScreen');
    } else {
      setIsSpaceOwnerModalVisible(true);
    }
  };

  const handleConfirmUserTypeChange = async () => {
    try {
      if (!user) {
        Alert.alert('Erro', 'Usuário não autenticado');
        return;
      }

      if (!isValidDocument(documentNumber, documentType)) {
        Alert.alert(
          'Documento Inválido',
          `Por favor, informe um ${documentType} válido com todos os dígitos.`,
          [{ text: 'Entendi' }]
        );
        return;
      }

      setLoading(true);
      const response = await userService.updateUserType(user.id, documentNumber, documentType);
      
      // Atualiza o usuário no contexto com todos os campos necessários
      await updateUser({
        ...user,
        userType: 'locador',
        documentNumber,
        documentType
      });
      
      setIsSpaceOwnerModalVisible(false);
      Alert.alert(
        'Sucesso',
        'Seu tipo de usuário foi alterado para locador. Agora você pode anunciar espaços!',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('SpaceWelcomeScreen')
          }
        ]
      );
    } catch (error) {
      console.error('Erro ao atualizar tipo de usuário:', error);
      Alert.alert(
        'Erro',
        'Não foi possível atualizar seu tipo de usuário. Tente novamente mais tarde.'
      );
    } finally {
      setLoading(false);
    }
  };

  //Formatação do documento no momento em que o usuário estiver digitando o número.
  const handleDocumentChange = (text: string) => {
    // Remove caracteres não numéricos antes de formatar
    const numbers = text.replace(/\D/g, '');
    // Limita o tamanho baseado no tipo de documento
    const maxLength = documentType === 'CPF' ? 11 : 14;
    const limitedNumbers = numbers.slice(0, maxLength);
    // Aplica a formatação
    const formatted = formatDocument(limitedNumbers, documentType);
    setDocumentNumber(formatted);
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, isDarkMode && { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <NotificationButton notifications={[]} />
        </View>
        <View style={styles.profileInfo}>
          <View style={[styles.avatarContainer, isDarkMode && { backgroundColor: theme.card }]}>
            <Image
              source={user.profilePhoto ? { uri: user.profilePhoto } : { uri: 'https://via.placeholder.com/120' }}
              style={styles.avatar}
            />
          </View>
          <Text style={styles.name}>{user.name} {user.surname}</Text>
          <Text style={styles.email}>{user.email}</Text>
          {user.telephone && <Text style={styles.telephone}>{user.telephone}</Text>}
        </View>
      </View>

      <ScrollView style={styles.content}>
        {/* Banner para anunciar espaço */}
        <View style={[styles.bannerContainer, isDarkMode && { backgroundColor: theme.card }]}>
          <View style={{ flex: 2 }}>
            <Text style={[styles.bannerTitle, isDarkMode && { color: theme.text }]}>Anuncie seu Espaço na Spacefy</Text>
            <Text style={[styles.bannerSubtitle, isDarkMode && { color: theme.text }]}>
              Veja fica mais fácil anunciar o seu local para aluguel.
            </Text>
            <TouchableOpacity 
              style={styles.bannerButton}
              onPress={handleOpenSpaceOwnerModal}
            >
              <Text style={styles.bannerButtonText}>Anunciar Espaço</Text>
            </TouchableOpacity>
          </View>
          <Image source={mansao} style={styles.bannerImage} resizeMode="contain" />
        </View>

        <TouchableOpacity 
          style={[styles.menuItem, isDarkMode && { backgroundColor: theme.card }]} 
          onPress={() => navigation.navigate('EditProfile')}
        >
          <Ionicons name="person-outline" size={24} color={isDarkMode ? theme.text : colors.black} />
          <Text style={[styles.menuItemText, isDarkMode && { color: theme.text }]}>Editar Perfil</Text>
          <Ionicons name="chevron-forward" size={24} color={isDarkMode ? theme.text : colors.black} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.menuItem, isDarkMode && { backgroundColor: theme.card }]} 
          onPress={() => navigation.navigate('MyReservations')}
        >
          <Ionicons name="calendar" size={24} color={isDarkMode ? theme.text : colors.black} />
          <Text style={[styles.menuItemText, isDarkMode && { color: theme.text }]}>Minhas Reservas</Text>
          <Ionicons name="chevron-forward" size={24} color={isDarkMode ? theme.text : colors.black} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.menuItem, isDarkMode && { backgroundColor: theme.card }]} 
          onPress={() => navigation.navigate('Favorites', { from: 'profile' })}
        >
          <Ionicons name="heart-outline" size={24} color={isDarkMode ? theme.text : colors.black} />
          <Text style={[styles.menuItemText, isDarkMode && { color: theme.text }]}>Favoritos</Text>
          <Ionicons name="chevron-forward" size={24} color={isDarkMode ? theme.text : colors.black} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.menuItem, isDarkMode && { backgroundColor: theme.card }]} 
          onPress={() => navigation.navigate('Rented')}
        >
          <Ionicons name="home-outline" size={24} color={isDarkMode ? theme.text : colors.black} />
          <Text style={[styles.menuItemText, isDarkMode && { color: theme.text }]}>Alugados</Text>
          <Ionicons name="chevron-forward" size={24} color={isDarkMode ? theme.text : colors.black} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.menuItem, isDarkMode && { backgroundColor: theme.card }]} 
          onPress={() => navigation.navigate('MyReviews')}
        >
          <Ionicons name="star-outline" size={24} color={isDarkMode ? theme.text : colors.black} />
          <Text style={[styles.menuItemText, isDarkMode && { color: theme.text }]}>Minhas Avaliações</Text>
          <Ionicons name="chevron-forward" size={24} color={isDarkMode ? theme.text : colors.black} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.menuItem, isDarkMode && { backgroundColor: theme.card }]}
          onPress={() => navigation.navigate('Settings')}
        >
          <Ionicons name="settings-outline" size={24} color={isDarkMode ? theme.text : colors.black} />
          <Text style={[styles.menuItemText, isDarkMode && { color: theme.text }]}>Configurações</Text>
          <Ionicons name="chevron-forward" size={24} color={isDarkMode ? theme.text : colors.black} />
        </TouchableOpacity>

        <View style={styles.bottomSpacing}>
          <TouchableOpacity style={[styles.logoutButton, isDarkMode && { backgroundColor: theme.card }]} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={24} color={colors.white} />
            <Text style={styles.logoutButtonText}>Sair</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal
        visible={isEditing}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsEditing(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsEditing(false)}
        >
          <TouchableOpacity 
            activeOpacity={1} 
            style={styles.editProfileModal}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Editar Perfil</Text>
              <TouchableOpacity 
                onPress={() => setIsEditing(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color={colors.black} />
              </TouchableOpacity>
            </View>

            <View style={styles.editProfileContent}>
              <TouchableOpacity 
                style={styles.avatarEditContainer}
                onPress={handlePickImage}
              >
                <Image
                  source={user.profilePhoto ? { uri: user.profilePhoto } : { uri: 'https://via.placeholder.com/120' }}
                  style={styles.avatarEdit}
                />
                <View style={styles.avatarEditOverlay}>
                  <Ionicons name="camera" size={24} color={colors.white} />
                </View>
              </TouchableOpacity>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Nome</Text>
                <TextInput
                  style={styles.input}
                  value={editedUser.name}
                  onChangeText={(text) => setEditedUser(prev => ({ ...prev, name: text }))}
                  placeholder="Seu nome"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Sobrenome</Text>
                <TextInput
                  style={styles.input}
                  value={editedUser.surname}
                  onChangeText={(text) => setEditedUser(prev => ({ ...prev, surname: text }))}
                  placeholder="Seu sobrenome"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Telefone</Text>
                <TextInput
                  style={styles.input}
                  value={editedUser.telephone}
                  onChangeText={(text) => setEditedUser(prev => ({ ...prev, telephone: text }))}
                  placeholder="Seu telefone"
                  keyboardType="phone-pad"
                />
              </View>

              <TouchableOpacity
                style={[styles.saveButton, loading && styles.saveButtonDisabled]}
                onPress={handleSaveProfile}
                disabled={loading}
              >
                <Text style={styles.saveButtonText}>
                  {loading ? 'Salvando...' : 'Salvar Alterações'}
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* Modal de Registro para se tornar um Locador dentro da Plataforma */}
      <Modal
        visible={isSpaceOwnerModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setIsSpaceOwnerModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
              <View style={[styles.editProfileModal, isDarkMode && { backgroundColor: theme.card }]}>
                <View style={styles.modalHeader}>
                  <Text style={[styles.modalTitle, isDarkMode && { color: theme.text }]}>Registre-se como Locador(a)</Text>
                  
                  <TouchableOpacity onPress={() => setIsSpaceOwnerModalVisible(false)} >
                    <Ionicons name="close" size={24} color={isDarkMode ? theme.text : colors.black} />
                  </TouchableOpacity>
                </View>
                
                <Text style={[styles.modalSubTittle, isDarkMode && { color: theme.text }]}>
                  Para anunciar seus espaços, informe seu CPF ou CNPJ para verificarmos sua identidade e garantir transações seguras.
                </Text>

                <View>
                  <View style={styles.documentTypeContainer}>
                    <TouchableOpacity
                      style={[
                        styles.documentTypeButton,
                        documentType === 'CPF' && styles.documentTypeButtonActive,
                        isDarkMode && documentType !== 'CPF' && { 
                          backgroundColor: theme.background,
                          borderColor: theme.border
                        }
                      ]}
                      onPress={() => setDocumentType('CPF')}
                    >
                      <Text style={[
                        styles.documentTypeButtonText,
                        documentType === 'CPF' && styles.documentTypeButtonTextActive,
                        isDarkMode && documentType !== 'CPF' && { color: colors.white }
                      ]}>CPF</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.documentTypeButton,
                        documentType === 'CNPJ' && styles.documentTypeButtonActive,
                        isDarkMode && documentType !== 'CNPJ' && { 
                          backgroundColor: theme.background,
                          borderColor: theme.border
                        }
                      ]}
                      onPress={() => setDocumentType('CNPJ')}
                    >
                      <Text style={[
                        styles.documentTypeButtonText,
                        documentType === 'CNPJ' && styles.documentTypeButtonTextActive,
                        isDarkMode && documentType !== 'CNPJ' && { color: colors.white }
                      ]}>CNPJ</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={[styles.inputLabel, isDarkMode && { color: theme.text }]}>{documentType}</Text>
                    <TextInput
                      style={[styles.input, isDarkMode && { 
                        backgroundColor: theme.background,
                        color: theme.text,
                        borderColor: theme.border,
                        borderWidth: 1
                      }]}
                      value={documentNumber}
                      onChangeText={handleDocumentChange}
                      placeholder={documentType === 'CPF' ? '000.000.000-00' : '00.000.000/0000-00'}
                      placeholderTextColor={isDarkMode ? theme.gray : colors.gray}
                      keyboardType="numeric"
                    />
                  </View>

                  <View style={styles.termsContainer}>
                    <TouchableOpacity onPress={() => setAcceptedTerms(!acceptedTerms)} >
                      <View style={[styles.checkbox, acceptedTerms && styles.checkboxChecked]}>
                        {acceptedTerms && <Ionicons name="checkmark" size={16} color={colors.white} />}
                      </View>
                    </TouchableOpacity>

                    <Text style={[styles.termsText, isDarkMode && { color: theme.text }]}>
                      Eu li e concordo com os{' '}
                      <Text 
                        style={styles.termsLink}
                        onPress={() => navigation.navigate('PaymentTerms')}
                      >
                        termos de distribuição de pagamento
                      </Text>
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={[
                      styles.saveButton, 
                      (!acceptedTerms || loading || !isValidDocument(documentNumber, documentType)) && styles.saveButtonDisabled
                    ]}
                    onPress={handleConfirmUserTypeChange}
                    disabled={!acceptedTerms || loading || !isValidDocument(documentNumber, documentType)}
                  >
                    <Text style={styles.saveButtonText}>
                      {loading ? 'Processando...' : 'Confirmar'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}