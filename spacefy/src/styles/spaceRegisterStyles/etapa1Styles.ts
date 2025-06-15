import { StyleSheet } from 'react-native';
import { colors } from '../globalStyles/colors';
import Constants from 'expo-constants';

const statusBarHeight = Constants.statusBarHeight;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: statusBarHeight,
    backgroundColor: colors.light_gray,
    paddingHorizontal: 30,
    paddingTop: 30,
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressText: {
    fontSize: 13,
    color: colors.dark_gray,
    marginBottom: 4,
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 6,
    marginBottom: 16,
    gap: 6,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.blue,
    flex: 1,
  },
  progressBarInactive: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.gray,
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.black,
    marginBottom: 24,
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
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    gap: 12,
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