import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AuthProvider from './src/context/AuthContext';
import { LocationProvider } from './src/context/LocationContext';
import { OrdersProvider } from './src/context/OrdersContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <AuthProvider>
        <LocationProvider>
          <OrdersProvider>
            <AppNavigator />
          </OrdersProvider>
        </LocationProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}