import { StyleSheet } from 'react-native';
import { colors } from './colors';

export const pageTexts = StyleSheet.create({ 
  title: {
    marginLeft: 20,
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
  },

  subtitle: {
    marginLeft: 20, 
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },

  labelInput: {
    color: colors.dark_gray,
    fontSize: 18,
    fontWeight: '600',
  }

});
