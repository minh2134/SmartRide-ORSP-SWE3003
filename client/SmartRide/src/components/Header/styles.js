import { StyleSheet } from 'react-native';
import colors from '../../theme/colors';

export default StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 60,
    paddingHorizontal: 15,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
    elevation: 3,
  },
  logoContainer: {
    flex: 1,
    alignItems: 'flex-start',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: -20,
    marginLeft: -20

  },
  titleContainer: {
    flex: 2,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  themeToggle: {
    flex: 1,
    alignItems: 'flex-end',
  },
  themeIcon: {
    fontSize: 20,
  }
}); 