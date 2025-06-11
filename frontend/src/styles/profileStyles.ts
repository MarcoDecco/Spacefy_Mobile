import { StyleSheet } from 'react-native';
import { colors } from './globalStyles/colors';

export const profileStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },

  header: {
    backgroundColor: colors.blue,
    paddingTop: 60,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  headerTop: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    marginBottom: 20,
  },

  profileInfo: {
    alignItems: 'center',
  },

  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.white,
    padding: 3,
    marginBottom: 15,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
  },

  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 5,
  },

  email: {
    fontSize: 16,
    color: colors.white,
    marginBottom: 5,
  },

  telephone: {
    fontSize: 16,
    color: colors.white,
    marginBottom: 15,
  },

  content: {
    flex: 1,
    padding: 20,
  },
  
  section: {
    backgroundColor: colors.white,
    borderRadius: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    boxShadow: '0 2px 8px 1px rgba(0, 0, 0, 0.2)',
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.black,
    marginBottom: 15,
  },

  menuContainer: {
    padding: 20,
  },

  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: colors.white,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },

  menuItemText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 15,
    color: colors.black,
  },

  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    backgroundColor: colors.white,
    borderRadius: 10,
    marginTop: 20,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },

  logoutButtonText: {
    color: colors.error,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  
  bannerContainer: {
    flexDirection: 'row',
    backgroundColor: colors.blue,
    borderRadius: 20,
    margin: 20,
    padding: 20,
    alignItems: 'center',
    boxShadow: '0 0 6px 2px rgba(0, 0, 0, 0.2)',
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
    justifyContent: 'center',
    alignItems: 'center',
  },

  editProfileModal: {
    width: '90%',
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 20,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.black,
  },

  closeButton: {
    padding: 5,
  },

  editProfileContent: {
    alignItems: 'center',
  },

  avatarEditContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
    position: 'relative',
  },

  avatarEdit: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
  },

  avatarEditOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.blue,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },

  inputLabel: {
    fontSize: 16,
    color: colors.black,
    marginBottom: 8,
  },

  input: {
    backgroundColor: colors.light_gray,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.black,
  },

  saveButton: {
    backgroundColor: colors.blue,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 20,
    width: '100%',
  },

  saveButtonDisabled: {
    opacity: 0.7,
  },

  saveButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
}); 