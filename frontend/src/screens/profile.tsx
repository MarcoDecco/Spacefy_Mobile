import { View, Text, Image, ScrollView, TouchableOpacity, Modal, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { profileStyles as styles } from '../styles/profileStyles';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import espacoImg from '../../assets/mansao.png';
import { useState } from 'react';
import { colors } from '../styles/globalStyles/colors';
import * as ImagePicker from 'expo-image-picker';
import BaseInput from '../components/inputs/baseInput';
import { NotificationButton } from '../components/NotificationButton';
import { RootStackParamList } from '../navigation/types';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type MenuItem = {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  onPress: () => void;
};

export default function Profile() {
  const navigation = useNavigation<NavigationProp>();
  const { theme, isDarkMode } = useTheme();
  const { signOut } = useAuth();
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [editedAvatar, setEditedAvatar] = useState<string | null>(null);

  // Dados do usuário (simulados)
  const [user, setUser] = useState({
    name: 'João Silva',
    email: 'joao.silva@email.com',
    avatar: { uri: 'https://randomuser.me/api/portraits/men/32.jpg' },
    stats: {
      reservas: 12,
      favoritos: 8,
      avaliacoes: 15
    }
  });

  // Dados simulados de notificações
  const notifications = [
    {
      id: '1',
      title: 'Nova reserva confirmada',
      message: 'Sua reserva para o espaço "Casa na Praia" foi confirmada',
      time: '5 min atrás',
      read: false
    },
    {
      id: '2',
      title: 'Lembrete de pagamento',
      message: 'Não se esqueça de realizar o pagamento da sua próxima reserva',
      time: '1 hora atrás',
      read: true
    },
    {
      id: '3',
      title: 'Avaliação recebida',
      message: 'Você recebeu uma nova avaliação do seu espaço',
      time: '2 horas atrás',
      read: true
    }
  ];

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Desculpe', 'Precisamos de permissão para acessar suas fotos!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setEditedAvatar(result.assets[0].uri);
    }
  };

  const handleSaveProfile = () => {
    setUser(prev => ({
      ...prev,
      name: editedName || prev.name,
      avatar: editedAvatar ? { uri: editedAvatar } : prev.avatar
    }));
    setShowEditProfile(false);
    setEditedName('');
    setEditedAvatar(null);
  };

  const menuItems: MenuItem[] = [
    {
      id: '1',
      icon: 'person-outline',
      title: 'Editar Perfil',
      onPress: () => {
        setEditedName(user.name);
        setShowEditProfile(true);
      }
    },
    {
      id: '2',
      icon: 'calendar-outline',
      title: 'Minhas Reservas',
      onPress: () => console.log('Minhas Reservas')
    },
    {
      id: '3',
      icon: 'heart-outline',
      title: 'Favoritos',
      onPress: () => console.log('Favoritos')
    },
    {
      id: '4',
      icon: 'star-outline',
      title: 'Minhas Avaliações',
      onPress: () => console.log('Minhas Avaliações')
    },
    {
      id: '5',
      icon: 'settings-outline',
      title: 'Configurações',
      onPress: () => navigation.navigate('Settings')
    }
  ];

  const handleLogout = async () => {
    try {
      await signOut();
      navigation.reset({
        index: 0,
        routes: [{ name: 'Welcome' }],
      });
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <View style={[styles.container, isDarkMode && { backgroundColor: theme.background }]}>
      {/* Header com informações do perfil */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <NotificationButton notifications={notifications} />
        </View>
        <View style={styles.profileInfo}>
          <View style={[styles.avatarContainer, isDarkMode && { backgroundColor: theme.background }]}>
            <Image
              source={user.avatar}
              style={styles.avatar}
              resizeMode="cover"
            />
          </View>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.email}>{user.email}</Text>

          {/* Estatísticas */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{user.stats.reservas}</Text>
              <Text style={styles.statLabel}>Reservas</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{user.stats.favoritos}</Text>
              <Text style={styles.statLabel}>Favoritos</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{user.stats.avaliacoes}</Text>
              <Text style={styles.statLabel}>Avaliações</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Modal de Edição de Perfil */}
      <Modal
        visible={showEditProfile}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowEditProfile(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowEditProfile(false)}
        >
          <TouchableOpacity 
            activeOpacity={1} 
            style={[styles.editProfileModal, isDarkMode && { backgroundColor: theme.background }]}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, isDarkMode && { color: theme.text }]}>Editar Perfil</Text>
              <TouchableOpacity 
                onPress={() => setShowEditProfile(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color={isDarkMode ? theme.text : colors.black} />
              </TouchableOpacity>
            </View>

            <View style={styles.editProfileContent}>
              <TouchableOpacity 
                style={styles.avatarEditContainer}
                onPress={pickImage}
              >
                <Image
                  source={editedAvatar ? { uri: editedAvatar } : user.avatar}
                  style={styles.avatarEdit}
                />
                <View style={styles.avatarEditOverlay}>
                  <Ionicons name="camera" size={24} color={colors.white} />
                </View>
              </TouchableOpacity>

              <BaseInput
                label="Nome"
                value={editedName}
                onChangeText={setEditedName}
                placeholder="Seu nome"
              />

              <TouchableOpacity 
                style={styles.saveButton}
                onPress={handleSaveProfile}
              >
                <Text style={styles.saveButtonText}>Salvar Alterações</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* Conteúdo */}
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Banner promocional */}
        <View style={styles.bannerContainer}>
          <View style={{ flex: 2 }}>
            <Text style={styles.bannerTitle}>Anuncie seu Espaço na Spacefy</Text>
            <Text style={styles.bannerSubtitle}>
              Veja fica mais fácil anunciar o seu local para aluguel.
            </Text>
            <TouchableOpacity style={styles.bannerButton}>
              <Text style={styles.bannerButtonText}>Anunciar Espaço</Text>
            </TouchableOpacity>
          </View>
          <Image source={espacoImg} style={styles.bannerImage} resizeMode="contain" />
        </View>

        {/* Menu de opções */}
        <View style={[styles.section, isDarkMode && { backgroundColor: theme.card }]}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.menuItem,
                index === menuItems.length - 1 && styles.menuItemLast,
                isDarkMode && { borderBottomColor: theme.border }
              ]}
              onPress={item.onPress}
            >
              <View style={styles.menuIcon}>
                <Ionicons name={item.icon} size={20} color={colors.blue} />
              </View>
              <Text style={[styles.menuText, isDarkMode && { color: theme.text }]}>{item.title}</Text>
              <Ionicons name="chevron-forward" size={20} style={[styles.menuArrow, isDarkMode && { color: theme.text }]} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Botão de logout */}
        <TouchableOpacity 
          style={[styles.logoutButton, isDarkMode && { backgroundColor: theme.card }]}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={24} color="#DC2626" />
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}