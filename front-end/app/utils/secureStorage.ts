import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const TOKEN_KEY = 'user_auth_token';
const USER_DATA_KEY = 'user_data';

/**
 * Save authentication token securely
 * Uses SecureStore for native platforms and AsyncStorage fallback for web
 */
export const saveToken = async (token: string): Promise<void> => {
  try {
    if (Platform.OS === 'web') {
      // For web, use localStorage as SecureStore is not available
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      await SecureStore.setItemAsync(TOKEN_KEY, token);
    }
  } catch (error) {
    console.error('Error saving token:', error);
    throw error;
  }
};

/**
 * Get stored authentication token
 */
export const getToken = async (): Promise<string | null> => {
  try {
    if (Platform.OS === 'web') {
      return localStorage.getItem(TOKEN_KEY);
    } else {
      return await SecureStore.getItemAsync(TOKEN_KEY);
    }
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

/**
 * Remove authentication token (logout)
 */
export const removeToken = async (): Promise<void> => {
  try {
    if (Platform.OS === 'web') {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_DATA_KEY);
    } else {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      await SecureStore.deleteItemAsync(USER_DATA_KEY);
    }
  } catch (error) {
    console.error('Error removing token:', error);
    throw error;
  }
};

/**
 * Save user data securely
 */
export const saveUserData = async (userData: object): Promise<void> => {
  try {
    const userDataString = JSON.stringify(userData);
    if (Platform.OS === 'web') {
      localStorage.setItem(USER_DATA_KEY, userDataString);
    } else {
      await SecureStore.setItemAsync(USER_DATA_KEY, userDataString);
    }
  } catch (error) {
    console.error('Error saving user data:', error);
    throw error;
  }
};

/**
 * Get stored user data
 */
export const getUserData = async (): Promise<any | null> => {
  try {
    let userDataString: string | null;
    if (Platform.OS === 'web') {
      userDataString = localStorage.getItem(USER_DATA_KEY);
    } else {
      userDataString = await SecureStore.getItemAsync(USER_DATA_KEY);
    }
    
    return userDataString ? JSON.parse(userDataString) : null;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = async (): Promise<boolean> => {
  const token = await getToken();
  return !!token;
};
