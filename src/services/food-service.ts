import { apiClient } from './api-client';

export interface CategoryItem {
  id: string;
  name: string;
  icon: string;
}

export interface FoodItem {
  id: string;
  name: string;
  category: string;
  price: string;
  rating: string;
  reviews: string;
  time: string;
  image: string;
  description?: string;
  ingredients?: string[];
}

export interface RestaurantItem {
  id: string;
  name: string;
  tags: string;
  rating: string;
  time: string;
  deliveryFee: string;
  discount: string;
  image: string;
}

export const getCategoriesApi = async (): Promise<CategoryItem[]> => {
  return await apiClient<CategoryItem[]>('/categories');
};

export const getPopularFoodsApi = async (): Promise<FoodItem[]> => {
  return await apiClient<FoodItem[]>('/foods/popular');
};

export const getFoodDetailsApi = async (id: string): Promise<FoodItem> => {
  return await apiClient<FoodItem>(`/foods/${id}`);
};

export const getNearbyRestaurantsApi = async (): Promise<RestaurantItem[]> => {
  return await apiClient<RestaurantItem[]>('/restaurants/nearby');
};
