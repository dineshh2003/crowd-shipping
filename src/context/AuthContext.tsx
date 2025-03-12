import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define UserType as a string literal type
export type UserType = 'user' | 'partner';

// Define User type
export type User = {
  id: string;
  name: string;
  email: string;
  userType: UserType;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string, userType: UserType) => Promise<void>;
  register: (name: string, email: string, password: string, userType: UserType) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already logged in
  useEffect(() => {
    const loadUser = async () => {
      try {
        const userJson = await AsyncStorage.getItem('user');
        if (userJson) {
          setUser(JSON.parse(userJson));
        }
      } catch (error) {
        console.error('Error loading user from storage:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string, userType: UserType) => {
    try {
      setIsLoading(true);
      
      // In a real app, you would validate credentials with your backend
      // For demo purposes, we'll just create a mock user
      const mockUser: User = {
        id: Math.random().toString(36).substring(7),
        name: email.split('@')[0], // Use part of email as name
        email,
        userType,
      };
      
      // Save user to storage
      await AsyncStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
      
      console.log(`Logged in as ${userType} with email: ${email}`);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, userType: UserType) => {
    try {
      setIsLoading(true);
      
      // In a real app, you would register with your backend
      // For demo purposes, we'll just create a mock user
      const mockUser: User = {
        id: Math.random().toString(36).substring(7),
        name,
        email,
        userType,
      };
      
      // Save user to storage
      await AsyncStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
      
      console.log(`Registered as ${userType} with email: ${email}`);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await AsyncStorage.removeItem('user');
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};