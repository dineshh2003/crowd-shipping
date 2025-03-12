// If this file doesn't exist, create it
import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  Welcome: { onComplete: () => Promise<void> };
  Auth: undefined;
  Dashboard: undefined;
  DeliveryPartnerDashboard: undefined; // Add this line
};

// If you have nested navigators, you can define their param lists here too
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

export type DashboardTabParamList = {
  Home: undefined;
  Map: undefined;
  Deliveries: undefined;
  Payments: undefined;
};