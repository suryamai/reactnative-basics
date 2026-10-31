import { Platform } from 'react-native';

export const BASE_URL = 'http://192.168.1.11:8000';
export const EMULATOR_BASE_URL = 'http://127.0.0.1:8000'; // http://10.0.2.2:8000

export const CURRENCY_SYMBOL = '₹';

export const API_CONFIG = {
  baseUrl: Platform.select({
    android: BASE_URL,
    default: BASE_URL,
  }),
  currency: CURRENCY_SYMBOL,
  timeoutMs: 1800,
  refreshThresholdSec: 300,
};
