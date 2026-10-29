import { apiClient } from './api-client';

export interface PlaceOrderPayload {
  customer_name: string;
  item_id: number | string;
  quantity: number;
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

/** 10. Place New Order */
export const placeOrderApi = async (payload: PlaceOrderPayload): Promise<OrderItem> => {
  return await apiClient<OrderItem>('/orders', {
    method: 'POST',
    body: JSON.stringify({
      customer_name: payload.customer_name,
      item_id: payload.item_id,
      quantity: payload.quantity,
    }),
  });
};

/** 11. Track Single Order by Order ID */
export const trackOrderApi = async (orderId: string | number): Promise<OrderItem> => {
  return await apiClient<OrderItem>(`/orders/${orderId}`);
};

/** 12. Get All Placed Orders (Order History) */
export const getOrderHistoryApi = async (): Promise<OrderItem[]> => {
  return await apiClient<OrderItem[]>('/orders');
};

/** 13. Update Order Status */
export const updateOrderStatusApi = async (
  orderId: string | number,
  status: string
): Promise<OrderItem> => {
  return await apiClient<OrderItem>(`/orders/${orderId}/status`, {
    method: 'PATCH',
    params: { new_status: status },
  });
};
