import { StyleSheet } from 'react-native';
import { colors } from './globalStyles/colors';

export const favoritesStyles = StyleSheet.create({
  container: {
    flex: 1,
<<<<<<< HEAD
    backgroundColor: colors.light_gray,
=======
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
>>>>>>> aeccf6b8d5b720be6b1952298e57fdb3bd867d25
  },

  // Verificar a necessidade de utilizar o Título
  // title: {
  //   fontSize: 24,
  //   fontWeight: 'bold',
  //   color: '#222',
  //   marginBottom: 20,
  //   marginLeft: 4,
  //   marginTop: 16,
  // },

  
  emptyText: {
    textAlign: 'center',
    color: '#888',
    fontSize: 16,
    marginTop: 40,
  },
  
  cardWrapper: {
    marginBottom: 18,
  },
}); 