import { StyleSheet, Dimensions } from "react-native";
import { colors } from "../globalStyles/colors";
import Constants from 'expo-constants';

const statusBarHeight = Constants.statusBarHeight;
const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: statusBarHeight,
    backgroundColor: colors.light_gray,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  header: {
    flex: 1,
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.black,
    marginBottom: 16,
    lineHeight: 40,
  },
  imageContainer: {
    width: width - 48,
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
    elevation: 3,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  description: {
    fontSize: 16,
    color: colors.dark_gray,
    marginBottom: 24,
    textAlign: 'justify',
    lineHeight: 24,
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
  button: {
    flex: 1,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  primaryButton: {
    backgroundColor: colors.blue,
  },
  secondaryButton: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.blue,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  primaryButtonText: {
    color: colors.white,
  },
  secondaryButtonText: {
    color: colors.blue,
  },
}); 