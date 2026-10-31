import { apiClient } from './api-client';
import { ENDPOINTS } from './apiConfig';

export interface DishItem {
  id: number | string;
  name: string;
  description?: string;
  price: number;
  category: string;
  image_url?: string;
  image?: string;
  is_available?: boolean;
  rating?: string | number;
  time?: string;
}

export interface RestaurantItem {
  id: number | string;
  name: string;
  cover_url?: string;
  image?: string;
  cuisines?: string;
  tags?: string;
  rating: string | number;
  distance?: string;
  delivery_time?: string;
  time?: string;
  delivery_fee?: string;
  deliveryFee?: string;
  discount?: string;
}

export interface HomeFeedResponse {
  banners?: any[];
  categories?: string[];
  popular_dishes?: DishItem[];
  nearby_restaurants?: RestaurantItem[];
}

export interface GetMenuParams {
  category?: string;
  search?: string;
  vegOnly?: boolean;
  limit?: number;
  offset?: number;
}

export const getHomeFeedApi = async (lat?: number, lng?: number): Promise<HomeFeedResponse> => {
  return await apiClient<HomeFeedResponse>(ENDPOINTS.HOME_FEED(lat, lng));
};

export const getBannersApi = async (): Promise<any[]> => {
  return await apiClient<any[]>(ENDPOINTS.BANNERS);
};

export const getCategoriesApi = async (): Promise<string[]> => {
  return await apiClient<string[]>(ENDPOINTS.CATEGORIES);
};

export const getRestaurantsApi = async (lat?: number, lng?: number, sortBy = 'rating', vegOnly = false): Promise<RestaurantItem[]> => {
  return await apiClient<RestaurantItem[]>(ENDPOINTS.RESTAURANTS(lat, lng, sortBy, vegOnly));
};

export const getDishesApi = async (params: GetMenuParams = {}): Promise<DishItem[]> => {
  const url = ENDPOINTS.MENU_ITEMS(params.category, params.search, params.vegOnly);
  return await apiClient<DishItem[]>(url);
};

export const getDishByIdApi = async (dishId: string | number): Promise<DishItem> => {
  return await apiClient<DishItem>(ENDPOINTS.DISH_DETAILS(Number(dishId)));
};
