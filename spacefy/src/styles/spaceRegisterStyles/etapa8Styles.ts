import { StyleSheet, Dimensions } from 'react-native';
import { colors } from '../globalStyles/colors';
import Constants from 'expo-constants';

const { width } = Dimensions.get('window');
const statusBarHeight = Constants.statusBarHeight;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light_gray,
    marginTop: statusBarHeight,
  },
  progressContainer: {
    backgroundColor: colors.white,
    paddingTop: 20,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: colors.light_gray,
    marginBottom: 16,
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.black,
    marginBottom: 8,
    marginTop: 16,
    paddingHorizontal: 4,
  },
  subtitle: {
    fontSize: 16,
    color: colors.dark_gray,
    lineHeight: 22,
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  secaoContainer: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.light_gray,
  },
  secaoTitulo: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.black,
    marginBottom: 12,
  },
  secaoConteudo: {
    gap: 12,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.light_gray,
  },
  itemContainerLargo: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.light_gray,
  },
  itemLabel: {
    fontSize: 14,
    color: colors.dark_gray,
    flex: 1,
  },
  itemValue: {
    fontSize: 14,
    color: colors.black,
    fontWeight: '500',
    textAlign: 'right',
    flex: 1,
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  amenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.light_blue,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  amenityText: {
    fontSize: 14,
    color: colors.blue,
    fontWeight: '500',
  },
  noAmenitiesText: {
    fontSize: 14,
    color: colors.dark_gray,
    fontStyle: 'italic',
  },
  termoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.light_gray,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.gray,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.blue,
    borderColor: colors.blue,
  },
  termoText: {
    flex: 1,
    fontSize: 14,
    color: colors.dark_gray,
    lineHeight: 20,
  },
  termoLink: {
    color: colors.blue,
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
  button: {
    flex: 1,
    height: 56,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonPrimary: {
    backgroundColor: colors.blue,
  },
  buttonSecondary: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.blue,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonTextPrimary: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  buttonTextSecondary: {
    color: colors.blue,
    fontSize: 16,
    fontWeight: '600',
  },
  navigationContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: colors.light_gray,
  },
}); 