import { StyleSheet } from 'react-native';
import { colors } from './globalStyles/colors';
import { Colors } from 'react-native/Libraries/NewAppScreen';

export const profileStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light_gray,
  },

  header: {
    backgroundColor: colors.blue,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    boxShadow: '0 5px 6px 0 rgba(0, 0, 0, 0.2),'
  },

  headerTop: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    marginBottom: 16,
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
    boxShadow: '0 5px 6px 0 rgba(0, 0, 0, 0.2),'
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
    marginBottom: 4,
  },

  email: {
    fontSize: 16,
    color: colors.white,
    opacity: 0.9,
    marginBottom: 4,
  },

  telephone: {
    fontSize: 16,
    color: colors.white,
    marginBottom: 8,
    opacity: 0.9,
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
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.2)',
  },

  menuItemText: {
    flex: 1,
    fontSize: 16,
    color: colors.black,
    marginLeft: 12,
  },

  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    backgroundColor: colors.error,
    borderWidth: 0.8,
    borderColor: colors.error,
    borderRadius: 10,
    marginTop: 20,
    boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.1)',
  },

  logoutButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  
  bannerContainer: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },

  bannerTitle: {
    color: colors.dark_gray,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },

  bannerSubtitle: {
    fontSize: 14,
    color: colors.dark_gray,
    marginBottom: 16,
  },

  bannerButton: {
    backgroundColor: colors.blue,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },

  bannerButtonText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 16,
  },

  bannerImage: {
    flex: 1,
    height: 100,
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
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },

  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },

  modalTitleContainer: {
    flex: 1,
    marginRight: 10,
  },

  modalTitle: {
    fontSize: 22,
    fontWeight: '500',
    color: colors.black,
  },

  modalSubTittle: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'justify',
  },

  closeButton: {
    padding: 5,
  },

  editProfileContent: {
    gap: 15,
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
    marginBottom: 15,
  },

  inputLabel: {
    fontSize: 16,
    color: colors.black,
    marginBottom: 5,
  },

  input: {
    borderWidth: 0.8,
    borderColor: colors.gray,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },

  saveButton: {
    backgroundColor: colors.blue,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },

  saveButtonDisabled: {
    opacity: 0.5,
  },

  saveButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '600',
  },

  documentTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 8,
  },

  documentTypeButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.gray,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },

  documentTypeButtonActive: {
    backgroundColor: colors.blue,
    borderColor: colors.blue,
  },

  documentTypeButtonText: {
    fontSize: 17,
    color: colors.gray,
    fontWeight: '500',
  },

  documentTypeButtonTextActive: {
    color: colors.white,
  },

  paymentTerm: {
    flexDirection: 'row',
    padding: 10,
    marginBottom: 36,
    backgroundColor: colors.others[300],
    borderRadius: 6,
    borderWidth: 0.8,
    borderColor: colors.blue,
    gap: 8,
  },

  paymentTermText: {
    fontSize: 16,
    color: colors.blue,
    flexShrink: 1,
    textAlign: 'justify',
    paddingRight: 4,
  },

  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },

  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: colors.blue,
    borderRadius: 4,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  checkboxChecked: {
    backgroundColor: colors.blue,
  },

  termsText: {
    flex: 1,
    fontSize: 14,
    color: colors.dark_gray,
  },

  termsLink: {
    color: colors.blue,
    textDecorationLine: 'underline',
  },

  termsModalContent: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },

  termsContent: {
    marginTop: 20,
    marginBottom: 20,
  },

  termsSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.black,
    marginBottom: 12,
    marginTop: 20,
  },

  termsParagraph: {
    fontSize: 16,
    color: colors.dark_gray,
    lineHeight: 24,
    marginBottom: 16,
  },

  termsCloseButton: {
    backgroundColor: colors.blue,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },

  termsCloseButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },

  bottomSpacing: {
    paddingBottom: 60,
  },
}); 