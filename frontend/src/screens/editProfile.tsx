import React, { useState, useEffect } from 'react';
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../styles/globalStyles/colors';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { NavigationProps } from '../navigation/types';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../services/userService';

const EditProfile = () => {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    telephone: '',
    password: '',
    confirmPassword: ''
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
        confirmPassword: ''
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
    if (!formData.name || !formData.surname || !formData.email || !formData.telephone) {
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
        password: formData.password || undefined
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

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor="transparent"
        translucent
      />
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Editar Perfil</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.profileImageContainer}>
          <View style={styles.profileImageWrapper}>
            <View style={[styles.profileImagePlaceholder, { backgroundColor: colors.blue }]}>
              <Text style={styles.profileImageText}>
                {formData.name.charAt(0)}{formData.surname.charAt(0)}
              </Text>
            </View>
            <TouchableOpacity style={styles.changePhotoButton}>
              <Ionicons name="camera" size={24} color={colors.white} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.formContainer}>
          {error ? (
            <View style={[styles.messageContainer, styles.errorContainer]}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          {success ? (
            <View style={[styles.messageContainer, styles.successContainer]}>
              <Text style={styles.successText}>{success}</Text>
            </View>
          ) : null}

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.text }]}>Nome *</Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: theme.card,
                color: theme.text,
                borderColor: theme.border
              }]}
              value={formData.name}
              onChangeText={(value) => handleChange('name', value)}
              placeholder="Seu nome"
              placeholderTextColor={theme.text + '80'}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.text }]}>Sobrenome *</Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: theme.card,
                color: theme.text,
                borderColor: theme.border
              }]}
              value={formData.surname}
              onChangeText={(value) => handleChange('surname', value)}
              placeholder="Seu sobrenome"
              placeholderTextColor={theme.text + '80'}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.text }]}>Email *</Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: theme.card,
                color: theme.text,
                borderColor: theme.border
              }]}
              value={formData.email}
              onChangeText={(value) => handleChange('email', value)}
              placeholder="seu@email.com"
              placeholderTextColor={theme.text + '80'}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.text }]}>Telefone *</Text>
            <View style={styles.phoneInputContainer}>
              <View style={[styles.phonePrefix, { backgroundColor: theme.card, borderColor: theme.border }]}>
                <Text style={{ color: theme.text }}>+55</Text>
              </View>
              <TextInput
                style={[styles.input, styles.phoneInput, { 
                  backgroundColor: theme.card,
                  color: theme.text,
                  borderColor: theme.border
                }]}
                value={formData.telephone}
                onChangeText={(value) => handleChange('telephone', value)}
                placeholder="(00) 00000-0000"
                placeholderTextColor={theme.text + '80'}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.text }]}>Nova Senha (opcional)</Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: theme.card,
                color: theme.text,
                borderColor: theme.border
              }]}
              value={formData.password}
              onChangeText={(value) => handleChange('password', value)}
              placeholder="Mínimo de 6 caracteres"
              placeholderTextColor={theme.text + '80'}
              secureTextEntry
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.text }]}>Confirme sua senha</Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: theme.card,
                color: theme.text,
                borderColor: theme.border
              }]}
              value={formData.confirmPassword}
              onChangeText={(value) => handleChange('confirmPassword', value)}
              placeholder="Confirme sua senha"
              placeholderTextColor={theme.text + '80'}
              secureTextEntry
            />
          </View>

          <TouchableOpacity 
            style={[styles.saveButton, { backgroundColor: colors.blue }]}
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: Platform.OS === 'ios' ? 48 : 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.light_gray,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 16,
  },
  profileImageContainer: {
    alignItems: 'center',
    padding: 24,
  },
  profileImageWrapper: {
    position: 'relative',
  },
  profileImagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImageText: {
    color: colors.white,
    fontSize: 40,
    fontWeight: 'bold',
  },
  changePhotoButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.blue,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.white,
  },
  formContainer: {
    padding: 16,
  },
  messageContainer: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorContainer: {
    backgroundColor: '#FEE2E2',
    borderColor: '#FCA5A5',
  },
  successContainer: {
    backgroundColor: '#DCFCE7',
    borderColor: '#86EFAC',
  },
  errorText: {
    color: '#DC2626',
  },
  successText: {
    color: '#16A34A',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  phonePrefix: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginRight: 8,
    minWidth: 60,
    alignItems: 'center',
  },
  phoneInput: {
    flex: 1,
  },
  saveButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  saveButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default EditProfile;
