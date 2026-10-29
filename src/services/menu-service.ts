import { apiClient } from './api-client';

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

export interface MenuStats {
  total_items: number;
  category_breakdown?: Record<string, number>;
}

export interface GetMenuParams {
  category?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

/** 3. Get All Food Categories */
export const getCategoriesApi = async (): Promise<string[]> => {
  return await apiClient<string[]>('/menu/categories');
};

/** 4. Get Menu Statistics */
export const getMenuStatsApi = async (): Promise<MenuStats> => {
  return await apiClient<MenuStats>('/menu/stats');
};

/** 5-8. Get Dishes with Filtering, Searching, & Pagination */
export const getDishesApi = async (params: GetMenuParams = {}): Promise<DishItem[]> => {
  return await apiClient<DishItem[]>('/menu', {
    params: {
      category: params.category || '',
      search: params.search || '',
      limit: params.limit || 50,
      offset: params.offset || 0,
    },
  });
};

/** 9. Get Single Dish Details by ID */
export const getDishByIdApi = async (dishId: string | number): Promise<DishItem> => {
  return await apiClient<DishItem>(`/menu/${dishId}`);
};

/** Admin: 14. Add New Dish */
export const createDishApi = async (dish: Partial<DishItem>): Promise<DishItem> => {
  return await apiClient<DishItem>('/menu', {
    method: 'POST',
    body: JSON.stringify(dish),
  });
};

/** Admin: 15. Update Dish */
export const updateDishApi = async (
  dishId: string | number,
  updates: Partial<DishItem>
): Promise<DishItem> => {
  return await apiClient<DishItem>(`/menu/${dishId}`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
  });
};

/** Admin: 16. Delete Dish */
export const deleteDishApi = async (dishId: string | number): Promise<{ success: boolean }> => {
  return await apiClient<{ success: boolean }>(`/menu/${dishId}`, {
    method: 'DELETE',
  });
};
