import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { colors } from '../styles/globalStyles/colors';
import BaseInput from '../components/inputs/baseInput';
import { useNavigation } from '@react-navigation/native';
import { NavigationProps } from '../navigation/types';
import { settingsStyles as styles } from '../styles/settings.styles';
import { SettingsSection } from '../components/settings/SettingsSection';
import { SettingsModal } from '../components/settings/SettingsModal';
import { useTheme } from '../contexts/ThemeContext';

interface SettingItem {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  type: 'toggle' | 'navigate' | 'action';
  value?: boolean;
  onPress?: () => void;
}

export default function Settings() {
  const navigation = useNavigation<NavigationProps>();
  const { isDarkMode, toggleTheme, theme } = useTheme();
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Estados para as preferências
  const [notifications, setNotifications] = useState({
    reservations: true,
    promotions: true,
    reviews: true
  });

  const [displayPreferences, setDisplayPreferences] = useState({
    darkMode: isDarkMode,
    largeText: false
  });

  const handleEmailChange = () => {
    // Aqui você implementaria a lógica de mudança de email
    Alert.alert('Sucesso', 'Email alterado com sucesso!');
    setShowEmailModal(false);
    setNewEmail('');
  };

  const handlePasswordChange = () => {
    if (newPassword !== confirmPassword) {
      Alert.alert('Erro', 'As senhas não coincidem!');
      return;
    }
    // Aqui você implementaria a lógica de mudança de senha
    
    Alert.alert('Sucesso', 'Senha alterada com sucesso!');
    setShowPasswordModal(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const notificationSettings: SettingItem[] = [
    {
      id: 'notif_reservations',
      title: 'Notificações de Reservas',
      icon: 'calendar-outline',
      type: 'toggle',
      value: notifications.reservations,
      onPress: () => setNotifications(prev => ({ ...prev, reservations: !prev.reservations }))
    },
    {
      id: 'notif_promotions',
      title: 'Notificações de Promoções',
      icon: 'pricetag-outline',
      type: 'toggle',
      value: notifications.promotions,
      onPress: () => setNotifications(prev => ({ ...prev, promotions: !prev.promotions }))
    },
    {
      id: 'notif_reviews',
      title: 'Notificações de Avaliações',
      icon: 'star-outline',
      type: 'toggle',
      value: notifications.reviews,
      onPress: () => setNotifications(prev => ({ ...prev, reviews: !prev.reviews }))
    }
  ];

  const privacySettings: SettingItem[] = [
    {
      id: 'change_email',
      title: 'Alterar Email',
      icon: 'mail-outline',
      type: 'action',
      onPress: () => setShowEmailModal(true)
    },
    {
      id: 'change_password',
      title: 'Alterar Senha',
      icon: 'lock-closed-outline',
      type: 'action',
      onPress: () => setShowPasswordModal(true)
    },
    {
      id: 'two_factor',
      title: 'Autenticação em Duas Etapas',
      icon: 'shield-checkmark-outline',
      type: 'toggle',
      value: false
    }
  ];

  const paymentSettings: SettingItem[] = [
    {
      id: 'payment_methods',
      title: 'Métodos de Pagamento',
      icon: 'card-outline',
      type: 'navigate',
      onPress: () => console.log('Navegar para métodos de pagamento')
    },
    {
      id: 'default_payment',
      title: 'Método de Pagamento Padrão',
      icon: 'star-outline',
      type: 'navigate',
      onPress: () => console.log('Navegar para método padrão')
    }
  ];

  const displaySettings: SettingItem[] = [
    {
      id: 'dark_mode',
      title: 'Modo Escuro',
      icon: 'moon-outline',
      type: 'toggle',
      value: isDarkMode,
      onPress: () => {
        toggleTheme();
        setDisplayPreferences(prev => ({ ...prev, darkMode: !prev.darkMode }));
      }
    }
  ];

  const supportSettings: SettingItem[] = [
    {
      id: 'help_center',
      title: 'Central de Ajuda',
      icon: 'help-circle-outline',
      type: 'navigate',
      onPress: () => console.log('Navegar para central de ajuda')
    },
    {
      id: 'contact_support',
      title: 'Contato com Suporte',
      icon: 'chatbubble-outline',
      type: 'navigate',
      onPress: () => console.log('Navegar para contato com suporte')
    },
    {
      id: 'terms',
      title: 'Termos de Uso',
      icon: 'document-text-outline',
      type: 'navigate',
      onPress: () => console.log('Navegar para termos de uso')
    },
    {
      id: 'privacy',
      title: 'Política de Privacidade',
      icon: 'shield-outline',
      type: 'navigate',
      onPress: () => console.log('Navegar para política de privacidade')
    }
  ];

  const aboutSettings: SettingItem[] = [
    {
      id: 'version',
      title: 'Versão do Aplicativo',
      icon: 'information-circle-outline',
      type: 'navigate',
      onPress: () => Alert.alert('Versão', 'BETA')
    },
    {
      id: 'licenses',
      title: 'Licenças',
      icon: 'document-outline',
      type: 'navigate',
      onPress: () => console.log('Navegar para licenças')
    }
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.card }]}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Configurações</Text>
      </View>

      <ScrollView>
        <SettingsSection title="Notificações" items={notificationSettings} />
        <SettingsSection title="Pagamento" items={paymentSettings} />
        <SettingsSection title="Exibição" items={displaySettings} />
        <SettingsSection title="Suporte e Ajuda" items={supportSettings} />
        <SettingsSection title="Sobre" items={aboutSettings} />
      </ScrollView>

      {/* Modal de Alteração de Email */}
      <SettingsModal
        visible={showEmailModal}
        title="Alterar Email"
        onClose={() => setShowEmailModal(false)}
        onConfirm={handleEmailChange}
      >
        <BaseInput
          label="Novo Email"
          value={newEmail}
          onChangeText={setNewEmail}
          placeholder="Digite seu novo email"
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </SettingsModal>

      {/* Modal de Alteração de Senha */}
      <SettingsModal
        visible={showPasswordModal}
        title="Alterar Senha"
        onClose={() => setShowPasswordModal(false)}
        onConfirm={handlePasswordChange}
      >
        <BaseInput
          label="Senha Atual"
          value={currentPassword}
          onChangeText={setCurrentPassword}
          placeholder="Digite sua senha atual"
          secureTextEntry
        />
        <BaseInput
          label="Nova Senha"
          value={newPassword}
          onChangeText={setNewPassword}
          placeholder="Digite sua nova senha"
          secureTextEntry
        />
        <BaseInput
          label="Confirmar Nova Senha"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Confirme sua nova senha"
          secureTextEntry
        />
      </SettingsModal>
    </View>
  );
} 