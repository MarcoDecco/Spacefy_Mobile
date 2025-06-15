import { SafeAreaView } from "react-native-safe-area-context";
import { Text, View, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { chatStyles as styles } from '../styles/chatStyles';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../contexts/ThemeContext';
import { useState, useEffect, useRef } from 'react';
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
};

type Message = {
  id: string;
  text: string;
  timestamp: any;
  senderId: string;
};

type MessagesRouteProp = RouteProp<RootStackParamList, 'Messages'>;

export default function Messages() {
  const route = useRoute<MessagesRouteProp>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { conversation } = route.params;
  const { theme, isDarkMode } = useTheme();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<FlatList>(null);

  useEffect(() => {
    let unsubscribe = null;

    if (conversation?._id) {
      setLoading(true);
      unsubscribe = chatService.listenToMessages(conversation._id, (newMessages: Message[]) => {
        setMessages(newMessages);
        setLoading(false);
        scrollToBottom();
      });
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [conversation?._id]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollToEnd({ animated: true });
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user?.id) return;

    try {
      await chatService.sendMessage(conversation._id, user.id, newMessage);
      setNewMessage("");
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      setError("Erro ao enviar mensagem");
    }
  };

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

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={[
      styles.messageContainer,
      item.senderId === user?.id ? styles.ownMessage : styles.otherMessage
    ]}>
      <Text style={[
        styles.messageText,
        item.senderId === user?.id ? styles.ownMessageText : null
      ]}>{item.text}</Text>
      <Text style={[
        styles.messageTime,
        item.senderId === user?.id ? styles.ownMessageTime : null
      ]}>{formatTime(item.timestamp)}</Text>
    </View>
  );

  if (!user) {
    return (
      <SafeAreaView style={[styles.container, isDarkMode && { backgroundColor: theme.background }]}>
        <Text style={[styles.headerName, { color: 'red' }]}>Por favor, faça login para acessar as mensagens</Text>
      </SafeAreaView>
    );
  }

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, isDarkMode && { backgroundColor: theme.background }]}>
        <Text style={[styles.headerName]}>Carregando mensagens...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.container, isDarkMode && { backgroundColor: theme.background }]}>
        <Text style={[styles.headerName, { color: 'red' }]}>{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, isDarkMode && { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.headerName}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerName}>{conversation.otherUser.name}</Text>
          <Text style={styles.headerRole}>{conversation.otherUser.role}</Text>
        </View>
      </View>

      <FlatList
        ref={messagesEndRef}
        style={styles.messagesList}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        inverted={false}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Digite sua mensagem..."
          multiline
          value={newMessage}
          onChangeText={setNewMessage}
        />
        <TouchableOpacity 
          style={styles.sendButton}
          onPress={handleSendMessage}
        >
          <Text style={{ color: 'white' }}>→</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
} 