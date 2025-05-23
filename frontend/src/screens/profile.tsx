import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { profileStyles as styles } from '../styles/profileStyles';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import espacoImg from '../../assets/mansao.png';

type RootStackParamList = {
  Welcome: undefined;
  // ... other screens
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type MenuItem = {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  onPress: () => void;
};

export default function Profile() {
  const navigation = useNavigation<NavigationProp>();

  // Dados do usuário (simulados)
  const user = {
    name: 'João Silva',
    email: 'joao.silva@email.com',
    avatar: { uri: 'https://randomuser.me/api/portraits/men/32.jpg' },
    stats: {
      reservas: 12,
      favoritos: 8,
      avaliacoes: 15
    }
  };

  const menuItems: MenuItem[] = [
    {
      id: '1',
      icon: 'person-outline',
      title: 'Editar Perfil',
      onPress: () => console.log('Editar Perfil')
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
      onPress: () => console.log('Configurações')
    }
  ];

  const handleLogout = () => {
    // Aqui você pode adicionar lógica de limpeza de dados do usuário se necessário
    navigation.reset({
      index: 0,
      routes: [{ name: 'Welcome' }],
    });
  };

  return (
    <View style={styles.container}>
      {/* Header com informações do perfil */}
      <View style={styles.header}>
        <View style={styles.profileInfo}>
          <View style={styles.avatarContainer}>
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
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Minha Conta</Text>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.menuItem,
                index === menuItems.length - 1 && styles.menuItemLast
              ]}
              onPress={item.onPress}
              activeOpacity={0.7}
            >
              <View style={styles.menuIcon}>
                <Ionicons name={item.icon} size={24} color="#1EACE3" />
              </View>
              <Text style={styles.menuText}>{item.title}</Text>
              <Ionicons name="chevron-forward" size={24} style={styles.menuArrow} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Botão de Logout */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <Ionicons name="log-out-outline" size={24} color="#DC2626" />
          <Text style={styles.logoutText}>Sair da Conta</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}