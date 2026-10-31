import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';

export interface SavedAddress {
  id: string;
  label: 'Home' | 'Work' | 'Other';
  title: string;
  address: string;
  lat: number;
  lng: number;
  isDefault?: boolean;
}

interface LocationState {
  activeAddress: string;
  areaName: string;
  lat: number;
  lng: number;
  serviceable: boolean;
  permissionGranted: boolean;
  savedAddresses: SavedAddress[];
  setLocation: (address: string, areaName: string, lat: number, lng: number) => Promise<void>;
  requestGpsLocation: () => Promise<boolean>;
  addSavedAddress: (addr: SavedAddress) => Promise<void>;
  loadLocation: () => Promise<void>;
}

const LOCATION_STORAGE_KEY = '@yumquick_location_v3';

export const useLocationStore = create<LocationState>((set, get) => ({
  activeAddress: '242 Park Avenue, Floor 4',
  areaName: 'Home - Park Ave',
  lat: 12.9716,
  lng: 77.5946,
  serviceable: true,
  permissionGranted: false,
  savedAddresses: [
    {
      id: '1',
      label: 'Home',
      title: 'Home - Park Ave',
      address: '242 Park Avenue, Floor 4, Suite 12',
      lat: 12.9716,
      lng: 77.5946,
      isDefault: true,
    },
    {
      id: '2',
      label: 'Work',
      title: 'Work - Tech Park',
      address: 'Tech Park Tower B, Sector 62',
      lat: 12.9812,
      lng: 77.6012,
      isDefault: false,
    },
  ],

  setLocation: async (address, areaName, lat, lng) => {
    const updated = {
      activeAddress: address,
      areaName,
      lat,
      lng,
      serviceable: true,
    };
    set(updated);
    await AsyncStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(updated));
  },

  requestGpsLocation: async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        set({ permissionGranted: false });
        return false;
      }

      set({ permissionGranted: true });
      const gps = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const [geocode] = await Location.reverseGeocodeAsync({
        latitude: gps.coords.latitude,
        longitude: gps.coords.longitude,
      });

      let formattedAddress = 'Current Location';
      let area = 'Current Location';

      if (geocode) {
        area = geocode.district || geocode.subregion || geocode.city || 'Nearby';
        formattedAddress = `${geocode.name || ''} ${geocode.street || ''}, ${area}`;
      }

      await get().setLocation(
        formattedAddress,
        area,
        gps.coords.latitude,
        gps.coords.longitude
      );

      return true;
    } catch (e) {
      console.warn('Error getting GPS location', e);
      return false;
    }
  },

  addSavedAddress: async (addr) => {
    const current = get().savedAddresses;
    const updated = [...current, addr];
    set({ savedAddresses: updated });
  },

  loadLocation: async () => {
    try {
      const stored = await AsyncStorage.getItem(LOCATION_STORAGE_KEY);
      if (stored) {
        set(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Error loading location', e);
    }
  },
}));
