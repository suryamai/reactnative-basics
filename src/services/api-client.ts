import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// BASE API CONFIGURATION
// Configured to user's Python server IP http://192.168.1.11:8000
// With fallback to http://10.0.2.2:8000 for local Android Emulator testing
export const BASE_URL = 'http://192.168.1.11:8000';
export const EMULATOR_BASE_URL = 'http://10.0.2.2:8000';

const TOKEN_KEY = '@yumquick_auth_token';

export const setAuthToken = async (token: string) => {
  await AsyncStorage.setItem(TOKEN_KEY, token);
};

export const getAuthToken = async (): Promise<string | null> => {
  return await AsyncStorage.getItem(TOKEN_KEY);
};

export const removeAuthToken = async () => {
  await AsyncStorage.removeItem(TOKEN_KEY);
};

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number>;
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { params, headers, ...customConfig } = options;

  // Primary URL is 192.168.1.11:8000
  let primaryUrl = `${BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        searchParams.append(key, String(val));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      primaryUrl += `?${queryString}`;
    }
  }

  const token = await getAuthToken();

  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    method: customConfig.method || 'GET',
    headers: {
      ...defaultHeaders,
      ...headers,
    },
    ...customConfig,
  };

  try {
    // Attempt request to 192.168.1.11:8000 first
    const response = await fetch(primaryUrl, config);

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: response.statusText || 'Server error' };
      }
      throw new Error(
        errorData.detail || errorData.message || `HTTP Error ${response.status}`
      );
    }

    if (response.status === 204) {
      return {} as T;
    }

    return (await response.json()) as T;
  } catch (error: any) {
    // If primary IP fails on Android Emulator, try 10.0.2.2 fallback
    if (Platform.OS === 'android') {
      try {
        const fallbackUrl = primaryUrl.replace(BASE_URL, EMULATOR_BASE_URL);
        const fbResponse = await fetch(fallbackUrl, config);
        if (fbResponse.ok) {
          if (fbResponse.status === 204) return {} as T;
          return (await fbResponse.json()) as T;
        }
      } catch (e) {
        // rethrow original error
      }
    }
    throw error;
  }
}
