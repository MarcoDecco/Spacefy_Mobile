import { StyleSheet } from 'react-native';
import { colors } from './globalStyles/colors';

export const reviewBoxStyles = StyleSheet.create({
  reviewBoxHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  reviewBoxTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.black,
  },
  clearButton: {
    padding: 8,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 8,
  },
}); 