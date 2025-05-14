import { StyleSheet, Dimensions } from 'react-native';
import { SEARCH_BAR_HEIGHT } from './globalStyles/searchBarStyles';

const { width: windowWidth } = Dimensions.get('window');
export const CARD_WIDTH = windowWidth * 0.8;

export const homeStyles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: SEARCH_BAR_HEIGHT,
  },
  
  horizontalScroll: {
    marginHorizontal: 20,
  },
  
  cardWrapper: {
    marginTop: 20,
    marginRight: 16,
  },

  bottomSpace: {
    height: 50,
  },
}); 