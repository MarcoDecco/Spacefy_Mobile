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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.black,
    marginBottom: 24,
  },
  subtitle: {
    fontSize: 16,
    color: colors.dark_gray,
    marginBottom: 24,
  },
  secaoContainer: {
    marginBottom: 24,
  },
  secaoTitulo: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.black,
    marginBottom: 16,
  },
  secaoConteudo: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 16,
  },
  itemContainer: {
    marginBottom: 12,
  },
  itemContainerLargo: {
    marginBottom: 12,
  },
  itemLabel: {
    fontSize: 14,
    color: colors.gray,
    marginBottom: 4,
  },
  itemValue: {
    fontSize: 16,
    color: colors.black,
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  amenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.light_gray,
    gap: 8,
  },
  amenityText: {
    fontSize: 14,
    color: colors.black,
  },
  noAmenitiesText: {
    fontSize: 14,
    color: colors.gray,
  },
  termoContainer: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 16,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 8,
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
    fontSize: 16,
    color: colors.black,
    fontWeight: '500',
    marginBottom: 4,
  },
  checkboxDescription: {
    fontSize: 14,
    color: colors.dark_gray,
    lineHeight: 20,
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
}); 