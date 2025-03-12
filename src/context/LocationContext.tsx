import React, { createContext, useState, useContext, useEffect } from 'react';
import * as Location from 'expo-location';

export interface LocationPoint {
  latitude: number;
  longitude: number;
  address?: string;
}

interface LocationContextType {
  currentLocation: LocationPoint | null;
  isLoading: boolean;
  errorMsg: string | null;
  requestLocationPermission: () => Promise<boolean>;
  updateCurrentLocation: () => Promise<void>;
  getAddressFromCoordinates: (location: LocationPoint) => Promise<string>;
}

const LocationContext = createContext<LocationContextType>({
  currentLocation: null,
  isLoading: true,
  errorMsg: null,
  requestLocationPermission: async () => false,
  updateCurrentLocation: async () => {},
  getAddressFromCoordinates: async () => '',
});

export const useLocation = () => useContext(LocationContext);

export const LocationProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentLocation, setCurrentLocation] = useState<LocationPoint | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Request location permission and get initial location
  useEffect(() => {
    (async () => {
      await requestLocationPermission();
      await updateCurrentLocation();
    })();
  }, []);

  // Request location permission
  const requestLocationPermission = async (): Promise<boolean> => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        setIsLoading(false);
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error requesting location permission:', error);
      setErrorMsg('Error requesting location permission');
      setIsLoading(false);
      return false;
    }
  };

  // Update current location
  const updateCurrentLocation = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const permission = await requestLocationPermission();
      
      if (!permission) {
        return;
      }
      
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      
      setCurrentLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      
      setErrorMsg(null);
    } catch (error) {
      console.error('Error getting current location:', error);
      setErrorMsg('Error getting current location');
    } finally {
      setIsLoading(false);
    }
  };

  // Get address from coordinates
  const getAddressFromCoordinates = async (location: LocationPoint): Promise<string> => {
    try {
      const addressResponse = await Location.reverseGeocodeAsync({
        latitude: location.latitude,
        longitude: location.longitude,
      });
      
      if (addressResponse && addressResponse.length > 0) {
        const address = addressResponse[0];
        return [
          address.street,
          address.city,
          address.region,
          address.postalCode,
          address.country,
        ]
          .filter(Boolean)
          .join(', ');
      }
      
      return 'Unknown location';
    } catch (error) {
      console.error('Error getting address:', error);
      return 'Error getting address';
    }
  };

  return (
    <LocationContext.Provider
      value={{
        currentLocation,
        isLoading,
        errorMsg,
        requestLocationPermission,
        updateCurrentLocation,
        getAddressFromCoordinates,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};