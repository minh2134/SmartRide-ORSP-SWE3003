import { StyleSheet } from 'react-native';
import colors from '../../theme/colors';

export default StyleSheet.create({
  footerContainer: {
    backgroundColor: colors.primary,
    paddingVertical: 15,
    width: '100%',
  },
  footerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  footerText: {
    color: colors.background,
    fontSize: 14,
  },
  iconsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  socialIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  iconText: {
    color: colors.background,
    fontSize: 14,
    fontWeight: 'bold',
  },
}); 