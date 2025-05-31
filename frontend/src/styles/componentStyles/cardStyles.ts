import { StyleSheet } from 'react-native';
import { colors } from '../globalStyles/colors';

export const cardStyles = StyleSheet.create({
  card: {
    borderRadius: 18,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
    marginTop: 16,
    marginBottom: 30,
    position: 'relative',
  },

  discountTag: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#DC2626',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    zIndex: 2,
  },

  discountText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  },

  arrow: {
    position: 'absolute',
    top: '50%',
    marginTop: -24,
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 8,
    borderRadius: 20,
    zIndex: 2,
  },

  arrowLeft: {
    left: 8,
  },

  arrowRight: {
    right: 8,
  },

  dotsContainer: {
    position: 'absolute',
    bottom: 10,
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
    marginHorizontal: 3,
  },

  dotActive: {
    backgroundColor: colors.white,
  },

  dotInactive: {
    backgroundColor: 'rgba(255,255,255,0.5)',
  },

  counter: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },

  counterText: {
    color: colors.white,
    fontSize: 12,
  },

  content: {
    padding: 16, 
    flex: 1,
    gap: 10,
  },

  header: {
    flexDirection: 'row',
    marginBottom: 6,
  },

  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },

  address: {
    fontSize: 13,
  },

  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  price: {
    fontSize: 16,
    fontWeight: 'bold',
  },

  originalPrice: {
    fontSize: 14,
    textDecorationLine: 'line-through',
    marginLeft: 4,
  },

  priceHour: {
    fontSize: 14,
    marginLeft: 4,
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  rating: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 2,
  },

  reviews: {
    fontSize: 13,
    marginLeft: 4,
  },
});