import { StyleSheet } from 'react-native';
import { colors } from './globalStyles/colors';

export const favoritesStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light_gray,
  },

  cardWrapper: {
    marginBottom: 18,
  },
  
  emptyText: {
    textAlign: 'center',
    color: '#888',
    fontSize: 16,
    marginTop: 40,
  },  
}); 