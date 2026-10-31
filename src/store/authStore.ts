import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  mobile?: string;
  dob?: string;
  avatar_url?: string;
}

interface AuthState {
  user: UserProfile | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  biometricEnabled: boolean;
  isLoading: boolean;
  setAuth: (user: UserProfile, accessToken: string, refreshToken?: string) => Promise<void>;
  setBiometricEnabled: (enabled: boolean) => Promise<void>;
  logout: () => Promise<void>;
  loadSession: () => Promise<void>;
}

const SECURE_ACCESS_TOKEN_KEY = 'yumquick_access_token';
const SECURE_REFRESH_TOKEN_KEY = 'yumquick_refresh_token';
const ASYNC_USER_KEY = '@yumquick_user_profile_v2';
const ASYNC_BIOMETRIC_KEY = '@yumquick_biometric_enabled';

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  biometricEnabled: false,
  isLoading: true,

  setAuth: async (user, accessToken, refreshToken) => {
    try {
      await SecureStore.setItemAsync(SECURE_ACCESS_TOKEN_KEY, accessToken);
      if (refreshToken) {
        await SecureStore.setItemAsync(SECURE_REFRESH_TOKEN_KEY, refreshToken);
      }
      await AsyncStorage.setItem(ASYNC_USER_KEY, JSON.stringify(user));

      set({
        user,
        accessToken,
        refreshToken: refreshToken || get().refreshToken,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (e) {
      console.error('Error saving auth session', e);
    }
  },

  setBiometricEnabled: async (enabled: boolean) => {
    try {
      await AsyncStorage.setItem(ASYNC_BIOMETRIC_KEY, JSON.stringify(enabled));
      set({ biometricEnabled: enabled });
    } catch (e) {
      console.error('Error setting biometric preference', e);
    }
  },

  logout: async () => {
    try {
      await SecureStore.deleteItemAsync(SECURE_ACCESS_TOKEN_KEY);
      await SecureStore.deleteItemAsync(SECURE_REFRESH_TOKEN_KEY);
      await AsyncStorage.removeItem(ASYNC_USER_KEY);

      set({
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
      });
    } catch (e) {
      console.error('Error during logout', e);
    }
  },

  loadSession: async () => {
    set({ isLoading: true });
    try {
      const accessToken = await SecureStore.getItemAsync(SECURE_ACCESS_TOKEN_KEY);
      const refreshToken = await SecureStore.getItemAsync(SECURE_REFRESH_TOKEN_KEY);
      const storedUser = await AsyncStorage.getItem(ASYNC_USER_KEY);
      const storedBio = await AsyncStorage.getItem(ASYNC_BIOMETRIC_KEY);

      if (accessToken && storedUser) {
        set({
          accessToken,
          refreshToken,
          user: JSON.parse(storedUser),
          isAuthenticated: true,
          biometricEnabled: storedBio ? JSON.parse(storedBio) : false,
          isLoading: false,
        });
      } else {
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    } catch (e) {
      console.error('Error loading session', e);
      set({ isLoading: false });
    }
  },
}));
