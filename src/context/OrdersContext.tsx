import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { useAuth } from '../hooks/useAuth';

export type PackageSize = 'small' | 'medium' | 'large';
export type OrderStatus = 'pending' | 'accepted' | 'in_transit' | 'delivered' | 'cancelled';

export interface DeliveryLocation {
  id: string;
  latitude: number;
  longitude: number;
  address: string;
}

export interface Order {
  id: string;
  userId: string;
  partnerId: string | null;
  pickupLocation: DeliveryLocation;
  deliveryLocation: DeliveryLocation;
  status: OrderStatus;
  packageSize: PackageSize;
  amount: number;
  createdAt: string;
  updatedAt: string;
}

interface OrdersContextType {
  orders: Order[];
  userOrders: Order[];
  availableOrders: Order[];
  isLoading: boolean;
  createOrder: (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Order | null>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<boolean>;
  acceptOrder: (orderId: string) => Promise<boolean>;
  cancelOrder: (orderId: string) => Promise<boolean>;
  getOrderById: (orderId: string) => Order | undefined;
}

const OrdersContext = createContext<OrdersContextType>({
  orders: [],
  userOrders: [],
  availableOrders: [],
  isLoading: false,
  createOrder: async () => null,
  updateOrderStatus: async () => false,
  acceptOrder: async () => false,
  cancelOrder: async () => false,
  getOrderById: () => undefined,
});

export const useOrders = () => useContext(OrdersContext);

export const OrdersProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Filter orders based on user type and status
  const userOrders = user
    ? orders.filter(order => 
        user.userType === 'user' 
          ? order.userId === user.id 
          : order.partnerId === user.id
      )
    : [];

  const availableOrders = user?.userType === 'partner'
    ? orders.filter(order => order.status === 'pending' && !order.partnerId)
    : [];

  // Load orders from storage on mount
  useEffect(() => {
    loadOrders();
  }, []);

  // Load orders from AsyncStorage
  const loadOrders = async () => {
    try {
      setIsLoading(true);
      const storedOrders = await AsyncStorage.getItem('orders');
      if (storedOrders) {
        setOrders(JSON.parse(storedOrders));
      }
    } catch (error) {
      console.error('Error loading orders:', error);
      Alert.alert('Error', 'Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  };

  // Save orders to AsyncStorage
  const saveOrders = async (updatedOrders: Order[]) => {
    try {
      await AsyncStorage.setItem('orders', JSON.stringify(updatedOrders));
    } catch (error) {
      console.error('Error saving orders:', error);
      throw new Error('Failed to save orders');
    }
  };

  // Create a new order
  const createOrder = async (
    orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<Order | null> => {
    try {
      setIsLoading(true);
      
      if (!user) {
        Alert.alert('Error', 'You must be logged in to create an order');
        return null;
      }
      
      const newOrder: Order = {
        ...orderData,
        id: Math.random().toString(36).substring(7),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      const updatedOrders = [...orders, newOrder];
      await saveOrders(updatedOrders);
      setOrders(updatedOrders);
      
      return newOrder;
    } catch (error) {
      console.error('Error creating order:', error);
      Alert.alert('Error', 'Failed to create order');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Update order status
  const updateOrderStatus = async (orderId: string, status: OrderStatus): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      const orderIndex = orders.findIndex(order => order.id === orderId);
      if (orderIndex === -1) {
        Alert.alert('Error', 'Order not found');
        return false;
      }
      
      const updatedOrders = [...orders];
      updatedOrders[orderIndex] = {
        ...updatedOrders[orderIndex],
        status,
        updatedAt: new Date().toISOString(),
      };
      
      await saveOrders(updatedOrders);
      setOrders(updatedOrders);
      
      return true;
    } catch (error) {
      console.error('Error updating order status:', error);
      Alert.alert('Error', 'Failed to update order status');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Accept an order (for delivery partners)
  const acceptOrder = async (orderId: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      if (!user || user.userType !== 'partner') {
        Alert.alert('Error', 'Only delivery partners can accept orders');
        return false;
      }
      
      const orderIndex = orders.findIndex(order => order.id === orderId);
      if (orderIndex === -1) {
        Alert.alert('Error', 'Order not found');
        return false;
      }
      
      const updatedOrders = [...orders];
      updatedOrders[orderIndex] = {
        ...updatedOrders[orderIndex],
        partnerId: user.id,
        status: 'accepted',
        updatedAt: new Date().toISOString(),
      };
      
      await saveOrders(updatedOrders);
      setOrders(updatedOrders);
      
      return true;
    } catch (error) {
      console.error('Error accepting order:', error);
      Alert.alert('Error', 'Failed to accept order');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Cancel an order
  const cancelOrder = async (orderId: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      if (!user) {
        Alert.alert('Error', 'You must be logged in to cancel an order');
        return false;
      }
      
      const orderIndex = orders.findIndex(order => order.id === orderId);
      if (orderIndex === -1) {
        Alert.alert('Error', 'Order not found');
        return false;
      }
      
      const order = orders[orderIndex];
      
      // Check if user has permission to cancel
      if (user.userType === 'user' && order.userId !== user.id) {
        Alert.alert('Error', 'You can only cancel your own orders');
        return false;
      }
      
      if (user.userType === 'partner' && order.partnerId !== user.id) {
        Alert.alert('Error', 'You can only cancel orders assigned to you');
        return false;
      }
      
      const updatedOrders = [...orders];
      updatedOrders[orderIndex] = {
        ...updatedOrders[orderIndex],
        status: 'cancelled',
        updatedAt: new Date().toISOString(),
      };
      
      await saveOrders(updatedOrders);
      setOrders(updatedOrders);
      
      return true;
    } catch (error) {
      console.error('Error cancelling order:', error);
      Alert.alert('Error', 'Failed to cancel order');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Get order by ID
  const getOrderById = (orderId: string): Order | undefined => {
    return orders.find(order => order.id === orderId);
  };

  return (
    <OrdersContext.Provider
      value={{
        orders,
        userOrders,
        availableOrders,
        isLoading,
        createOrder,
        updateOrderStatus,
        acceptOrder,
        cancelOrder,
        getOrderById,
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
};