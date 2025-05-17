import { StyleSheet } from 'react-native';
import { SEARCH_BAR_HEIGHT } from './globalStyles/searchBarStyles';

export const favoritesStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: SEARCH_BAR_HEIGHT,
  },
  titleContainer: {
    paddingHorizontal: 16,
    marginTop: 16,
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