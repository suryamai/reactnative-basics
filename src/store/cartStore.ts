import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface CartItem {
  id: string | number;
  name: string;
  price: number;
  quantity: number;
  image_url?: string;
  category?: string;
  selectedSize?: string;
  selectedAddons?: string[];
}

interface CartState {
  items: CartItem[];
  discountAmount: number;
  promoCode: string | null;
  deliveryFee: number;
  taxRate: number;
  addItem: (item: CartItem) => Promise<void>;
  removeItem: (id: string | number) => Promise<void>;
  updateQuantity: (id: string | number, qty: number) => Promise<void>;
  applyPromo: (code: string, discount: number) => void;
  clearCart: () => Promise<void>;
  loadCart: () => Promise<void>;
  getSubtotal: () => number;
  getTotal: () => number;
}

const CART_STORAGE_KEY = '@yumquick_cart_v2';

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  discountAmount: 0,
  promoCode: null,
  deliveryFee: 1.99,
  taxRate: 0.08, // 8% tax

  addItem: async (item) => {
    const currentItems = get().items;
    const existingIndex = currentItems.findIndex((i) => i.id === item.id);

    let updated: CartItem[];
    if (existingIndex > -1) {
      updated = [...currentItems];
      updated[existingIndex].quantity += item.quantity;
    } else {
      updated = [...currentItems, item];
    }

    set({ items: updated });
    await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updated));
  },

  removeItem: async (id) => {
    const updated = get().items.filter((i) => i.id !== id);
    set({ items: updated });
    await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updated));
  },

  updateQuantity: async (id, qty) => {
    if (qty <= 0) {
      await get().removeItem(id);
      return;
    }
    const updated = get().items.map((i) =>
      i.id === id ? { ...i, quantity: qty } : i
    );
    set({ items: updated });
    await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updated));
  },

  applyPromo: (code, discount) => {
    set({ promoCode: code, discountAmount: discount });
  },

  clearCart: async () => {
    set({ items: [], promoCode: null, discountAmount: 0 });
    await AsyncStorage.removeItem(CART_STORAGE_KEY);
  },

  loadCart: async () => {
    try {
      const stored = await AsyncStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        set({ items: JSON.parse(stored) });
      }
    } catch (e) {
      console.error('Error loading cart', e);
    }
  },

  getSubtotal: () => {
    return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  },

  getTotal: () => {
    const subtotal = get().getSubtotal();
    const discount = get().discountAmount;
    const delivery = subtotal > 0 ? get().deliveryFee : 0;
    const tax = subtotal * get().taxRate;
    return Math.max(0, subtotal - discount + delivery + tax);
  },
}));
