import { StyleSheet } from 'react-native';
import colors from '../../theme/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundColor,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  message: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: colors.text,
  },
  subMessage: {
    fontSize: 16,
    color: colors.darkGray,
    textAlign: 'center',
  },
  // Driver screen specific styles
  rideCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: colors.lightGray,
  },
  rideCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  rideCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  rideStatusBadge: {
    backgroundColor: '#FFE8C3',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#FFCB8B',
  },
  rideStatusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FF9500',
  },
  activeStatusBadge: {
    backgroundColor: '#D1F2EB',
    borderColor: '#A3E4D7',
  },
  activeStatusText: {
    color: '#16A085',
  },
  rideDetails: {
    marginBottom: 16,
  },
  rideInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  rideInfoText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
    flex: 1,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  locationText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
    flex: 1,
  },
  completeButton: {
    backgroundColor: '#27AE60',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonIcon: {
    marginRight: 8,
  },
  waitingContainer: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.lightGray,
  },
  waitingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    color: colors.text,
  },
  waitingText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
    color: colors.gray,
    lineHeight: 20,
  },
  scrollContentContainer: {
    flexGrow: 1,
  },
  // Profile screen styles
  profileContent: {
    flex: 1,
    padding: 20,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  profileTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  username: {
    fontSize: 14,
    color: colors.gray,
    marginBottom: 10,
  },
  profileCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  fieldContainer: {
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
    paddingVertical: 15,
  },
  fieldLabel: {
    color: colors.gray,
    fontSize: 14,
    marginBottom: 5,
  },
  fieldValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  fieldValue: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  editButton: {
    padding: 5,
  },
  editActionsContainer: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 5,
    marginLeft: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    borderBottomWidth: 1,
    borderBottomColor: colors.primary,
    paddingVertical: 5,
    marginRight: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: colors.gray,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: colors.error,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
}); 