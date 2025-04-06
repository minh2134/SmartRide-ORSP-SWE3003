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
    marginBottom: 20,
    textAlign: 'center',
  },
  loginContainer: {
    width: '100%',
    maxWidth: 400,
  },
  // Login credential hint
  loginCredentialHint: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  credentialHintText: {
    color: colors.textDark,
    fontSize: 14,
    marginLeft: 10,
    flex: 1,
  },
  credentialHighlight: {
    fontWeight: 'bold',
    color: colors.primary,
  },
  debugButton: {
    backgroundColor: '#333',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 4,
    marginTop: 20,
    alignSelf: 'center',
  },
  debugButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '500',
  },
  // Server status styles
  serverStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.background,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.lightGray,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  serverStatusText: {
    fontSize: 14,
    marginLeft: 6,
    color: colors.textMedium,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
    padding: 5,
  },
  retryText: {
    fontSize: 12,
    marginLeft: 4,
    color: colors.primary,
  },
  offlineMessageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEEEE',
    borderRadius: 5,
    padding: 10,
    marginTop: 15,
  },
  offlineMessageText: {
    fontSize: 14,
    color: colors.error,
    marginLeft: 8,
    flex: 1,
  },
}); 