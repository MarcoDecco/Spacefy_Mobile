import { StyleSheet } from 'react-native';

export const cardStyles = StyleSheet.create({
    card: {
      backgroundColor: '#fff',
      borderRadius: 18,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 4,
      overflow: 'hidden',
      marginBottom: 18,
      position: 'relative',
    },

    carouselContainer: {
      position: 'relative',
    },

    image: {
      borderRadius: 0,
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
      backgroundColor: '#fff',
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
      color: '#fff',
      fontSize: 12,
    },

    content: {
      padding: 16,
      flex: 1,
      justifyContent: 'space-between',
    },

    header: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: 6,
    },

    title: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#222',
    },

    address: {
      fontSize: 13,
      color: '#888',
      marginTop: 2,
    },

    priceContainer: {
      flexDirection: 'row',
      alignItems: 'baseline',
      marginTop: 8,
    },

    price: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#222',
    },

    priceHour: {
      fontSize: 14,
      color: '#888',
      marginLeft: 4,
    },

    footer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 'auto',
      paddingTop: 16,
    },

    ratingRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },

    rating: {
      fontSize: 14,
      fontWeight: 'bold',
      color: '#222',
      marginLeft: 4,
    },

    reviews: {
      fontSize: 13,
      color: '#888',
      marginLeft: 4,
    },

    seeMoreButton: {
      backgroundColor: '#1EACE3',
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 8,
      minWidth: 100,
      alignItems: 'center',
    },
    
    seeMoreText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 14,
    },
  });