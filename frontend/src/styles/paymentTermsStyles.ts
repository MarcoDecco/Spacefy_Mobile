import { StyleSheet } from 'react-native';
import { colors } from './globalStyles/colors';

export const paymentTermsStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },

  header: {
    backgroundColor: colors.dark_gray,
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },

  backButton: {
    marginRight: 16,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.white,
    flex: 1,
  },

  content: {
    flex: 1,
    padding: 32,
  },

  section: {
    marginBottom: 24,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.black,
  },

  paragraph: {
    fontSize: 16,
    color: colors.dark_gray,
    lineHeight: 24,
    textAlign: 'justify',
  },

  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 8,
    paddingLeft: 8,
  },

  bulletPoint: {
    fontSize: 16,
    color: colors.dark_gray,
    marginRight: 8,
  },

  listText: {
    fontSize: 16,
    color: colors.dark_gray,
    flex: 1,
    marginRight: 10,
    lineHeight: 24,
    textAlign: 'justify',
  },
}); 