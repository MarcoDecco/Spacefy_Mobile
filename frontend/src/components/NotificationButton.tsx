import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../styles/globalStyles/colors';
import { styles } from '../styles/componentStyles/NotificationButton.styles';

type Notification = {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
};

type NotificationButtonProps = {
  notifications: Notification[];
  onNotificationPress?: (notification: Notification) => void;
};

export const NotificationButton: React.FC<NotificationButtonProps> = ({
  notifications,
  onNotificationPress
}) => {
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <>
      <View style={styles.notificationIconContainer}>
        <TouchableOpacity 
          onPress={() => setShowNotifications(true)}
          style={styles.notificationButton}
        >
          <Ionicons name="notifications-outline" size={24} color={colors.white} />
          {unreadCount > 0 && (
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>
                {unreadCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <Modal
        visible={showNotifications}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowNotifications(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowNotifications(false)}
        >
          <TouchableOpacity 
            activeOpacity={1} 
            style={styles.notificationModal}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.notificationHeader}>
              <Text style={styles.notificationTitle}>Notificações</Text>
              <TouchableOpacity 
                onPress={() => setShowNotifications(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color={colors.black} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.notificationList}>
              {notifications.map((notification) => (
                <TouchableOpacity 
                  key={notification.id}
                  style={[
                    styles.notificationItem,
                    !notification.read && styles.unreadNotification
                  ]}
                  onPress={() => {
                    onNotificationPress?.(notification);
                    setShowNotifications(false);
                  }}
                >
                  <View style={styles.notificationContent}>
                    <Text style={styles.notificationItemTitle}>{notification.title}</Text>
                    <Text style={styles.notificationItemMessage}>{notification.message}</Text>
                    <Text style={styles.notificationItemTime}>{notification.time}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </>
  );
}; 