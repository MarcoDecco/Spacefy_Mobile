import { StyleSheet } from 'react-native';
import { colors } from './globalStyles/colors';

export const profileStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light_gray,
  },

  header: {
    backgroundColor: colors.blue,
    paddingTop: 60,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    boxShadow: '0px 4px 6px 0px rgba(0, 0, 0, 0.20)',
  },

  profileInfo: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.white,
    padding: 3,
    boxShadow: '0px 4px 6px 0px rgba(0, 0, 0, 0.20)',
  },

  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 100,
  },

  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.white,
    marginTop: 16,
  },

  email: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 4,
  },

  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    paddingHorizontal: 40,
    width: '100%',
  },
  
  statItem: {
    alignItems: 'center',
    minWidth: 80,
  },

  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.white,
  },

  statLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 2,
  },

  content: {
    flex: 1,
    paddingTop: 20,
  },
  
  section: {
    backgroundColor: colors.white,
    borderRadius: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    boxShadow: '0px 4px 6px 0px rgba(0, 0, 0, 0.15)',
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.black,
    marginBottom: 15,
  },

  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.light_gray,
  },

  menuItemLast: {
    borderBottomWidth: 0,
  },

  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.light_gray,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  menuText: {
    fontSize: 16,
    color: colors.black,
    flex: 1,
  },

  menuArrow: {
    color: '#999',
  },

  logoutButton: {
    backgroundColor: colors.white,
    borderRadius: 20,
    marginHorizontal: 20,
    marginBottom: 30,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 4px 6px 0px rgba(0, 0, 0, 0.15)',
  },

  logoutText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#DC2626',
    marginLeft: 8,
  },
  
  bannerContainer: {
    flexDirection: 'row',
    backgroundColor: colors.blue,
    borderRadius: 20,
    margin: 20,
    padding: 20,
    alignItems: 'center',
  },

  bannerTitle: {
    color: colors.white,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },

  bannerSubtitle: {
    color: colors.white,
    fontSize: 14, 
    marginBottom: 16,
  },

  bannerButton: {
    backgroundColor: colors.white,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
  },

  bannerButtonText: {
    color: colors.blue,
    fontWeight: 'bold',
    fontSize: 16,
  },

  bannerImage: {
    width: 80,
    height: 80,
    marginLeft: 16,
    flex: 1,
  },

  headerTop: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 10,
  },

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