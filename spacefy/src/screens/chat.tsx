import { SafeAreaView } from "react-native-safe-area-context";
import { Text, TouchableOpacity, FlatList, View, StyleSheet } from 'react-native';
import { chatStyles as styles } from '../styles/chatStyles';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../contexts/ThemeContext';
import { useState, useEffect } from 'react';
import { chatService } from '../services/chatService';
import { useAuth } from '../contexts/AuthContext';

type RootStackParamList = {
  Messages: { conversation: Conversation };
};

type Conversation = {
  _id: string;
  otherUser: {
    id: string;
    name: string;
    role: string;
    photoURL: string;
  };
  lastMessage?: {
    text: string;
    timestamp: Date;
    senderId: string;
  };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function Chat() {
  const navigation = useNavigation<NavigationProp>();
  const { theme, isDarkMode } = useTheme();
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadConversations = async () => {
      try {
        setLoading(true);
        
        if (user?.id) {
          const userChats = await chatService.getUserChats(user.id);
          setConversations(userChats);
        }
      } catch (err) {
        setError('Erro ao carregar conversas');
        console.error('Erro ao carregar conversas:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      loadConversations();
    }
  }, [user?.id]);

  const formatTime = (timestamp: any) => {
    if (!timestamp) return "";
    
    let date;
    if (timestamp instanceof Date) {
      date = timestamp;
    } else if (typeof timestamp === 'object' && timestamp !== null && 'toDate' in timestamp) {
      date = timestamp.toDate();
    } else {
      return "";
    }
    
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  const themedStyles = StyleSheet.create({
    text: {
      color: isDarkMode ? theme.text : styles.conversationName.color,
    },
    container: {
      backgroundColor: isDarkMode ? theme.card : styles.conversationsList.backgroundColor,
    },
    item: {
      backgroundColor: isDarkMode ? theme.card : styles.conversationItem.backgroundColor,
      borderColor: isDarkMode ? theme.border : styles.conversationItem.borderColor,
    }
  });

  const renderConversationItem = ({ item }: { item: Conversation }) => (
    <TouchableOpacity
      style={[styles.conversationItem, themedStyles.item]}
      onPress={() => navigation.navigate('Messages', { conversation: item })}
    >
      <View style={styles.conversationHeader}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>{item.otherUser?.name?.[0] || "U"}</Text>
        </View>
        <View style={styles.conversationInfo}>
          <Text style={[styles.conversationName, themedStyles.text]}>{item.otherUser?.name || "Usuário"}</Text>
          <Text style={[styles.conversationRole, themedStyles.text]}>{item.otherUser?.role || "usuário"}</Text>
        </View>
        <Text style={[styles.conversationTime, themedStyles.text]}>
          {item.lastMessage?.timestamp && formatTime(item.lastMessage.timestamp)}
        </Text>
      </View>
      <Text style={[styles.lastMessage, themedStyles.text]}>
        {item.lastMessage?.text || "Nenhuma mensagem"}
      </Text>
    </TouchableOpacity>
  );

  if (!user) {
    return (
      <SafeAreaView style={[styles.container, isDarkMode && { backgroundColor: theme.background }]}>
        <Text style={[styles.sectionTitle, themedStyles.text]}>Por favor, faça login para acessar as mensagens</Text>
      </SafeAreaView>
    );
  }

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, isDarkMode && { backgroundColor: theme.background }]}>
        <Text style={[styles.sectionTitle, themedStyles.text]}>Carregando conversas...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.container, isDarkMode && { backgroundColor: theme.background }]}>
        <Text style={[styles.sectionTitle, { color: 'red' }]}>{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, isDarkMode && { backgroundColor: theme.background }]}>
      <View style={[styles.conversationsList, themedStyles.container]}>
        <Text style={[styles.sectionTitle, themedStyles.text]}>Conversas</Text>
        <FlatList
          data={conversations}
          renderItem={renderConversationItem}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
}