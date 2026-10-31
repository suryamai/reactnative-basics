import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL, EMULATOR_BASE_URL } from './apiConfig';

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
  timeoutMs?: number;
}

const fetchWithTimeout = async (url: string, options: RequestInit, timeoutMs = 8000) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
};

export async function apiClient<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { params, headers, timeoutMs = 8000, ...customConfig } = options;

  let primaryUrl = endpoint.startsWith('http')
    ? endpoint
    : `${BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        searchParams.append(key, String(val));
      }
    });
    const queryString = searchParams.toString();
    if (queryString && !primaryUrl.includes('?')) {
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

  console.log(`🌐 [API Request] ${config.method || 'GET'} -> ${primaryUrl}`);
  if (config.body) {
    console.log(`📦 [API Payload]:`, config.body);
  }

  try {
    const response = await fetchWithTimeout(primaryUrl, config, timeoutMs);

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: response.statusText || 'Server error' };
      }
      console.warn(`❌ [API Error] ${primaryUrl} (${response.status}):`, errorData);
      throw new Error(
        errorData.detail || errorData.message || `HTTP Error ${response.status}`
      );
    }

    console.log(`✅ [API Success] ${primaryUrl} (${response.status})`);

    if (response.status === 204) {
      return {} as T;
    }

    return (await response.json()) as T;
  } catch (error: any) {
    if (Platform.OS === 'android' && primaryUrl.includes(BASE_URL)) {
      try {
        const fallbackUrl = primaryUrl.replace(BASE_URL, EMULATOR_BASE_URL);
        console.log(`🔄 [API Fallback] Trying emulator loopback -> ${fallbackUrl}`);
        const fbResponse = await fetchWithTimeout(fallbackUrl, config, 3000);
        if (fbResponse.ok) {
          console.log(`✅ [API Fallback Success] ${fallbackUrl}`);
          if (fbResponse.status === 204) return {} as T;
          return (await fbResponse.json()) as T;
        }
      } catch (e) {
        // Fallback network error
      }
    }
    console.warn(`❌ [API Network Exception] ${primaryUrl}:`, error.message);
    throw error;
  }
}
