import { StyleSheet, Dimensions } from 'react-native';
import { colors } from '../globalStyles/colors';

const { width: windowWidth } = Dimensions.get('window');
export const CARD_WIDTH = windowWidth * 0.8;
export const CARD_HEIGHT = 400; // Altura fixa para todos os cards

export const cardStyles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 20,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
    overflow: 'hidden',
    marginTop: 16,
    marginBottom: 30,
    position: 'relative',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },

  discountTag: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#DC2626',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    zIndex: 2,
  },

  discountText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },

  arrow: {
    position: 'absolute',
    top: '50%',
    marginTop: -24,
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 10,
    borderRadius: 25,
    zIndex: 2,
  },

  arrowLeft: {
    left: 12,
  },

  arrowRight: {
    right: 12,
  },

  dotsContainer: {
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },

  dotActive: {
    backgroundColor: colors.white,
    width: 10,
    height: 10,
  },

  dotInactive: {
    backgroundColor: 'rgba(255,255,255,0.5)',
  },

  counter: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },

  counterText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '500',
  },

  content: {
    padding: 18,
    height: CARD_HEIGHT - 180, // Altura total menos a altura da imagem
    display: 'flex',
    flexDirection: 'column',
  },

  header: {
    flexDirection: 'row',
    marginBottom: 4,
  },

  title: {
    fontSize: 19,
    fontWeight: 'bold',
    letterSpacing: 0.2,
  },

  address: {
    fontSize: 14,
    marginTop: 2,
  },

  description: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 4,
    marginBottom: 4,
    maxHeight: 40, // Limita a altura da descrição
  },

  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },

  price: {
    fontSize: 17,
    fontWeight: 'bold',
    color: colors.blue,
  },

  originalPrice: {
    fontSize: 15,
    textDecorationLine: 'line-through',
    marginLeft: 6,
    color: colors.gray,
  },

  priceHour: {
    fontSize: 14,
    marginLeft: 4,
    color: colors.gray,
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 8,
  },

  rating: {
    fontSize: 15,
    fontWeight: 'bold',
    marginLeft: 4,
  },

  reviews: {
    fontSize: 14,
    marginLeft: 4,
    color: colors.gray,
  },

  spaceType: {
    fontSize: 13,
    marginTop: 4,
    textTransform: 'capitalize',
  },
});