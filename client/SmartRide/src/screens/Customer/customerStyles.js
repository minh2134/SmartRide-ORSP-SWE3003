import { StyleSheet, Dimensions } from 'react-native';
import colors from '../../theme/colors';

const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: colors.text,
  },
  
  // Location input styles
  locationInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: 8,
    backgroundColor: 'white',
    height: 50,
  },
  locationIconContainer: {
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationInput: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 8,
    color: colors.text,
  },
  locationAction: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  currentLocationText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  
  // Vehicle selection styles
  vehicleOptionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  vehicleOption: {
    width: width / 3.5,
    height: 120,
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    marginBottom: 10,
  },
  vehicleImage: {
    width: 50,
    height: 50,
    marginBottom: 5,
  },
  vehicleName: {
    marginTop: 5,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  vehiclePrice: {
    fontSize: 12,
    color: colors.gray,
    marginTop: 4,
    textAlign: 'center',
  },
  
  // Picker styles
  pickerContainer: {
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: 8,
    backgroundColor: 'white',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  
  // Custom dropdown styles
  customDropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 50,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: 8,
    backgroundColor: 'white',
  },
  customDropdownButtonText: {
    color: colors.text,
    fontSize: 16,
  },
  dropdownList: {
    position: 'absolute',
    top: 52,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: 8,
    maxHeight: 200,
    zIndex: 1000,
    elevation: 5,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  dropdownItemIcon: {
    marginRight: 10,
  },
  dropdownItemText: {
    fontSize: 16,
    color: colors.text,
  },
  
  // Selected state styles
  selectedOption: {
    borderColor: colors.primary,
    borderWidth: 2,
    backgroundColor: colors.primaryLight,
  },
  selectedText: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  
  // Fare estimation
  fareContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: colors.primaryLight,
    borderRadius: 8,
    marginVertical: 15,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  fareLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  fareAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  
  // Button
  confirmButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  // Map styles
  mapContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  mapHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: 'white',
    elevation: 2,
  },
  mapTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  mapCloseButton: {
    padding: 5,
  },
  // Simple map styles
  simpleMap: {
    flex: 1,
    backgroundColor: '#e6f2ff', // Light blue background
    position: 'relative',
    overflow: 'hidden',
  },
  gridLine: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  mapLocation: {
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.8)',
    padding: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.lightGray,
  },
  mapLocationText: {
    fontSize: 12,
    color: colors.text,
  },
  centerMarker: {
    position: 'absolute',
    width: 10,
    height: 10,
    backgroundColor: colors.primary,
    borderRadius: 5,
    marginLeft: -5,
    marginTop: -5,
  },
  mapMarker: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    marginLeft: -15,
    marginTop: -30,
    zIndex: 10,
  },
  mapInstructions: {
    position: 'absolute',
    bottom: 80,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    color: 'white',
    padding: 10,
    borderRadius: 5,
    textAlign: 'center',
  },
  mapCoordinates: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255,255,255,0.8)',
    padding: 10,
    borderRadius: 5,
    textAlign: 'center',
    fontSize: 12,
  },
  mapFooter: {
    padding: 15,
    backgroundColor: 'white',
    elevation: 2,
  },
  mapConfirmButton: {
    backgroundColor: colors.primary,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  mapConfirmText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: colors.primary,
    textAlign: 'center',
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  modalItemContent: {
    marginLeft: 15,
    flex: 1,
  },
  modalItemLabel: {
    fontSize: 14,
    color: colors.gray,
  },
  modalItemValue: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  modalVehicleImage: {
    width: 24,
    height: 24,
  },
  fareModalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 25,
    backgroundColor: colors.primaryLight,
    padding: 15,
    borderRadius: 8,
  },
  fareModalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  fareModalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalCancelButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    backgroundColor: colors.lightGray,
    alignItems: 'center',
    marginRight: 10,
  },
  modalCancelButtonText: {
    color: colors.text,
    fontWeight: 'bold',
  },
  modalConfirmButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    backgroundColor: colors.primary,
    alignItems: 'center',
    marginLeft: 10,
  },
  modalConfirmButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  
  // Loading overlay
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  
  // Active ride card styles
  activeRideCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: colors.lightGray,
  },
  activeRideHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  activeRideTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  activeRideStatus: {
    backgroundColor: '#FFF7E6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FFD166',
  },
  activeRideStatusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FF9900',
  },
  activeRideDetails: {
    marginBottom: 16,
  },
  activeRideItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  activeRideItemText: {
    fontSize: 14,
    color: colors.text,
    marginLeft: 10,
    flex: 1,
  },
  activeRidePrice: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.lighterGray,
    paddingTop: 10,
  },
  activeRidePriceLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
  },
  activeRidePriceValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
  cancelRideButton: {
    backgroundColor: '#FFE5E5',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFCCCC',
  },
  cancelRideButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF5555',
  },
  infoContainer: {
    padding: 20,
    backgroundColor: '#F0F8FF',
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#DDEEFF',
  },
  infoText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    textAlign: 'center',
  },
  activeRideDriverSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.lighterGray,
  },
  activeRideDriverTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: colors.primary,
  },
  driverAssignedMessage: {
    marginTop: 10,
    textAlign: 'center',
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: 14,
    paddingVertical: 5,
  },
  // Add new styles for completed ride and new ride button
  completedMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6FFF0',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  completedMessageText: {
    fontSize: 14,
    color: '#00AA55',
    marginLeft: 8,
    fontWeight: 'bold',
  },
  newRideButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  newRideButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
}); 