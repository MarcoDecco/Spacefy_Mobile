import { StyleSheet, Dimensions } from 'react-native';
import { colors } from './globalStyles/colors';

const { width: windowWidth } = Dimensions.get('window');
export const CARD_WIDTH = windowWidth * 0.8;

export const homeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light_gray,
  },

  contentContainer: {
    paddingTop: 130,
  },

  horizontalScroll: {
    marginHorizontal: 20,
    marginBottom: 20,
  },

  cardWrapper: {
    marginTop: 20,
    marginRight: 16,
  },
}); 