import { StyleSheet } from 'react-native';
import { colors } from './globalStyles/colors';

export const rentedStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light_gray,
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 20,
    marginLeft: 4,
    marginTop: 16,
  },

  list: {
    flex: 1,
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