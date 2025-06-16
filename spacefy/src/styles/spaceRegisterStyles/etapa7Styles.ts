import { StyleSheet } from 'react-native';
import { colors } from '../globalStyles/colors';
import Constants from 'expo-constants';

const statusBarHeight = Constants.statusBarHeight;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 0,
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  progressContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.dark_gray,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.dark_gray,
    marginBottom: 24,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.black,
    marginBottom: 8,
  },
  formContainer: {
    flex: 1,
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    color: colors.dark_gray,
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    color: colors.dark_gray,
  },
  textArea: {
    borderWidth: 1,
    borderColor: colors.light_gray,
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
    color: colors.black,
    height: 120,
    textAlignVertical: 'top',
  },
  documentContainer: {
    marginBottom: 24,
  },
  documentTitle: {
    fontSize: 16,
    color: colors.dark_gray,
    marginBottom: 8,
  },
  documentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.blue,
    borderRadius: 6,
    padding: 12,
    gap: 8,
  },
  documentButtonText: {
    fontSize: 16,
    color: colors.blue,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.blue,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.blue,
  },
  checkboxLabel: {
    flex: 1,
    fontSize: 16,
    color: colors.black,
  },
  checkboxDescription: {
    fontSize: 14,
    color: colors.gray,
    marginTop: 4,
    marginLeft: 36,
  },
  buttonRowFixed: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 30,
    marginBottom: '8%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  documentButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  selectButton: {
    flex: 1,
    height: 48,
    backgroundColor: colors.blue,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  removeButton: {
    flex: 1,
    height: 48,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.blue,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: colors.blue,
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    color: colors.error,
    fontSize: 14,
    marginTop: 4,
  },
  documentPreview: {
    marginTop: 16,
  },
  previewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    backgroundColor: colors.light_gray,
    borderRadius: 8,
  },
  previewText: {
    color: colors.blue,
    fontSize: 16,
    fontWeight: '500',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    height: '80%',
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 16,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.blue,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImage: {
    width: '100%',
    height: '100%',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 24,
  },
  disabled: {
    opacity: 0.5,
  },
}); 