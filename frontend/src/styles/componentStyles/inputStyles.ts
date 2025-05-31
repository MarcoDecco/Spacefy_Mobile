import { StyleSheet } from 'react-native';
import { colors } from '../globalStyles/colors';

export const inputStyles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 20,
  },

  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },

  required: {
    color: colors.error,
    marginLeft: 4,
  },

  inputContainer: {
    width: '100%',
    borderBottomWidth: 0.5,
    borderBottomColor: colors.dark_gray,
    flexDirection: 'row',
    alignItems: 'center',
  },

  input: {
    flex: 1,
    height: 40,
    color: colors.dark_gray,
    fontSize: 16,
    paddingVertical: 8,
  },

  iconContainer: {
    padding: 8,
  },

  errorContainer: {
    marginTop: 4,
  },

  errorText: {
    color: colors.error,
    fontSize: 12,
  },

  marginBottom: {
    marginBottom: 40,
  }
}); 