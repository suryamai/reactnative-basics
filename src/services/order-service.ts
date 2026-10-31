import { apiClient } from './api-client';
import { ENDPOINTS } from './apiConfig';

export interface PlaceOrderPayload {
  customer_name: string;
  item_id: number | string;
  quantity: number;
  address_id?: number | string;
  payment_method?: string;
  promo_code?: string;
}

export interface OrderItem {
  id: number | string;
  customer_name: string;
  item_id: number | string;
  quantity: number;
  status: 'received' | 'preparing' | 'delivered' | string;
  dish_name?: string;
  image_url?: string;
  price?: number;
  total_price?: number;
  created_at?: string;
}

export interface PromoValidationResponse {
  valid: boolean;
  discount: number;
  message: string;
}

export interface CartQuotePayload {
  items: Array<{ item_id: string | number; quantity: number }>;
  promo_code?: string;
  address_id?: number | string;
}

export interface CartQuoteResponse {
  subtotal: number;
  discount: number;
  delivery_fee: number;
  tax: number;
  total: number;
}

export const placeOrderApi = async (payload: PlaceOrderPayload): Promise<OrderItem> => {
  return await apiClient<OrderItem>(ENDPOINTS.PLACE_ORDER, {
    method: 'POST',
    body: JSON.stringify({
      customer_name: payload.customer_name,
      item_id: payload.item_id,
      quantity: payload.quantity,
      address_id: payload.address_id || 1,
      payment_method: payload.payment_method || 'cod',
    }),
  });
};

export const getCartQuoteApi = async (payload: CartQuotePayload): Promise<CartQuoteResponse> => {
  return await apiClient<CartQuoteResponse>(ENDPOINTS.CART_QUOTE, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};

export const validatePromoApi = async (code: string): Promise<PromoValidationResponse> => {
  try {
    return await apiClient<PromoValidationResponse>(ENDPOINTS.VALIDATE_PROMO(code), {
      method: 'POST',
    });
  } catch (e) {
    const upper = code.trim().toUpperCase();
    if (upper === 'YUM30' || upper === 'WELCOME50' || upper === 'BIRYANILOVER') {
      return { valid: true, discount: 5.0, message: 'Promo code applied successfully!' };
    }
    return { valid: false, discount: 0, message: 'Invalid or expired promo code.' };
  }
};

export const trackOrderApi = async (orderId: string | number): Promise<OrderItem> => {
  return await apiClient<OrderItem>(ENDPOINTS.TRACK_ORDER(Number(orderId)));
};

export const getOrderHistoryApi = async (status?: 'active' | 'past'): Promise<OrderItem[]> => {
  return await apiClient<OrderItem[]>(ENDPOINTS.GET_ORDERS(status));
};
