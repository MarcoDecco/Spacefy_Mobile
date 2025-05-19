import { StyleSheet } from 'react-native';
import { colors } from './colors';

export const pageTexts = StyleSheet.create({ 
  titleCardList: {
    marginLeft: 20,
    marginTop: 10,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
  },

  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
  },

  subtitleCardList: {
    marginLeft: 20, 
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },

  labelInput: {
    color: colors.dark_gray,
    fontSize: 18,
    fontWeight: '600',
  },
});
