import { StyleSheet } from 'react-native';
import { colors } from '../globalStyles/colors';

export const styles = StyleSheet.create({
  notificationIconContainer: {
    position: 'relative',
  },

  notificationButton: {
    padding: 8,
  },

  notificationBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.blue,
  },

  notificationBadgeText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },

  notificationModal: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '80%',
    padding: 20,
  },

  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.light_gray,
  },

  notificationTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.black,
  },

  closeButton: {
    padding: 5,
  },

  notificationList: {
    flex: 1,
  },

  notificationItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.light_gray,
  },

  unreadNotification: {
    backgroundColor: 'rgba(30, 172, 227, 0.1)',
  },

  notificationContent: {
    flex: 1,
  },

  notificationItemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.black,
    marginBottom: 5,
  },

  notificationItemMessage: {
    fontSize: 14,
    color: colors.black,
    marginBottom: 5,
  },

  notificationItemTime: {
    fontSize: 12,
    color: '#666',
  },
}); 