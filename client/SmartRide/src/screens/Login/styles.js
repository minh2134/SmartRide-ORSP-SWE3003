import { StyleSheet, Dimensions } from 'react-native';
import colors from '../../theme/colors';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
  containerWithBackground: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  bigLogo: {
    width: width * 0.6,
    height: width * 0.3,
    tintColor: colors.primary,
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: 8,
    textAlign: 'center',
  },
  subheading: {
    fontSize: 16,
    color: colors.textMedium,
    marginBottom: 30,
    textAlign: 'center',
  },
  loginContainer: {
    width: '100%',
    maxWidth: 400,
  },
}); 