import { StyleSheet, Dimensions, Platform, StatusBar } from 'react-native';
import { colors } from '../globalStyles/colors';
import Constants from 'expo-constants';

const { width, height } = Dimensions.get('window');
const statusBarHeight = Platform.OS === 'ios' ? Constants.statusBarHeight : StatusBar.currentHeight || 0;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingTop: statusBarHeight,
  },
  progressContainer: {
    backgroundColor: colors.white,
    paddingTop: 20,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: colors.light_gray,
    marginBottom: 16,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.light_gray,
    borderRadius: 4,
    marginHorizontal: 24,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.blue,
    borderRadius: 4,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 24,
  },
  header: {
    marginBottom: 32,
    paddingTop: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.black,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: colors.dark_gray,
    lineHeight: 24,
  },
  formContainer: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.black,
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderColor: colors.light_gray,
  },
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    color: colors.error,
    fontSize: 14,
    marginTop: 4,
  },
  buttonContainer: {
    padding: 24,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.light_gray,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  mapsHint: {
    fontSize: 12,
    color: colors.gray,
    fontWeight: '400',
  },
  descHint: {
    fontSize: 12,
    color: colors.gray,
    fontWeight: '400',
  },
  typeButton: {
    backgroundColor: colors.blue,
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
    marginBottom: 8,
    marginTop: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  typeButtonText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 15,
  },
  textArea: {
    minHeight: 60,
    textAlignVertical: 'top',
  },
  backButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.blue,
    backgroundColor: colors.white,
    borderRadius: 6,
    alignItems: 'center',
    paddingVertical: 10,
    marginRight: 8,
  },
  backButtonText: {
    color: colors.blue,
    fontSize: 16,
    fontWeight: '600',
  },
  proceedButton: {
    flex: 1,
    backgroundColor: colors.blue,
    borderRadius: 6,
    alignItems: 'center',
    paddingVertical: 10,
  },
  proceedButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
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
}); 