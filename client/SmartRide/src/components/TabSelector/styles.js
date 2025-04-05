import { StyleSheet } from 'react-native';
import colors from '../../theme/colors';

export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.inputBackground,
    borderRadius: 6,
    marginBottom: 20,
    position: 'relative',
    height: 48,
  },
  indicator: {
    position: 'absolute',
    height: '100%',
    backgroundColor: colors.card,
    borderRadius: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    zIndex: 1,
  },
  activeTab: {
    // No additional styling needed since we use the animated indicator
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.gray,
  },
  activeTabText: {
    color: colors.textDark,
    fontWeight: '600',
  },
  tabIcon: {
    marginRight: 6,
  }
}); 