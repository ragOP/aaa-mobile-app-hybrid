import {PermissionsAndroid, Platform} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
const requestLocationPermission = async () => {
  try {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message:
            'This app requires access to your location to provide location-based services.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Location permission granted');
        return true;
      } else {
        console.log('Location permission denied');
        return false;
      }
    }
    // On iOS, permissions are handled differently
    return true;
  } catch (err) {
    console.warn(err);
    return false;
  }
};

// Function to get the current location
export const getLocation = async () => {
  const hasPermission = await requestLocationPermission();

  if (!hasPermission) {
    throw new Error('Location permission not granted');
  }

  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        console.log('Position:', position);
        resolve({latitude, longitude});
      },
      error => {
        console.error('Location Error:', error);

        switch (error.code) {
          case 1: // PERMISSION_DENIED
            reject(
              new Error('Permission denied. Please allow location access.'),
            );
            break;
          case 2: // POSITION_UNAVAILABLE
            reject(new Error('Position unavailable. Ensure GPS is enabled.'));
            break;
          case 3: // TIMEOUT
            reject(new Error('Location request timed out. Try again.'));
            break;
          default:
            reject(
              new Error('An unknown error occurred while fetching location.'),
            );
        }
      },
      {
        enableHighAccuracy: false, // Use GPS for precise location
        timeout: 30000, // Wait for up to 15 seconds
        maximumAge: 60000,  // Accept cached location if it is less than 10 seconds old
      },
    );
  });
};
