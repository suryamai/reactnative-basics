// src/services/apiConfig.ts

// 1. Choose your active environment
// export const BASE_URL = "https://yummy-backend-igrf.onrender.com"; // Live Render Cloud
// export const BASE_URL = "http://192.168.1.11:8000";             // Local Wi-Fi Testing
// export const BASE_URL = "http://10.0.2.2:8000";                  // Android Emulator (Maps to PC 127.0.0.1:8000)

export const BASE_URL = "http://127.0.0.1:8000"
export const EMULATOR_BASE_URL = "http://127.0.0.1:8000";

export const ENDPOINTS = {
  // 🔐 AUTH & PROFILE
  SIGNUP: `${BASE_URL}/auth/signup`,
  LOGIN: `${BASE_URL}/auth/login`,
  REFRESH_TOKEN: `${BASE_URL}/auth/refresh`,
  LOGOUT: `${BASE_URL}/auth/logout`,
  FORGOT_PASSWORD: `${BASE_URL}/auth/forgot-password`,
  VERIFY_OTP: `${BASE_URL}/auth/verify-otp`,
  RESET_PASSWORD: `${BASE_URL}/auth/reset-password`,
  CHANGE_PASSWORD: `${BASE_URL}/auth/change-password`,
  MY_PROFILE: `${BASE_URL}/users/me`,
  SETTINGS: `${BASE_URL}/users/me/settings`,

  // 📍 LOCATION & ADDRESSES
  REVERSE_GEOCODE: (lat: number, lng: number) =>
    `${BASE_URL}/location/reverse-geocode?lat=${lat}&lng=${lng}`,
  AUTOCOMPLETE: (query: string) =>
    `${BASE_URL}/location/autocomplete?q=${encodeURIComponent(query)}`,
  CHECK_SERVICEABILITY: (lat: number, lng: number) =>
    `${BASE_URL}/location/serviceability?lat=${lat}&lng=${lng}`,
  ADDRESSES: `${BASE_URL}/addresses`,
  ADDRESS_BY_ID: (id: number) => `${BASE_URL}/addresses/${id}`,

  // 🏠 HOME & DISCOVERY
  HOME_FEED: (lat?: number, lng?: number) =>
    lat && lng ? `${BASE_URL}/home?lat=${lat}&lng=${lng}` : `${BASE_URL}/home`,
  BANNERS: `${BASE_URL}/banners`,
  CATEGORIES: `${BASE_URL}/menu/categories`,
  POPULAR_SEARCHES: `${BASE_URL}/search/popular`,
  SEARCH_SUGGESTIONS: (q: string) =>
    `${BASE_URL}/search/suggestions?q=${encodeURIComponent(q)}`,

  // 🍛 RESTAURANTS & MENU
  RESTAURANTS: (lat?: number, lng?: number, sortBy = "rating", vegOnly = false) =>
    `${BASE_URL}/restaurants?lat=${lat || 12.9716}&lng=${lng || 77.5946}&sort_by=${sortBy}&veg_only=${vegOnly}`,
  RESTAURANT_DETAILS: (id: number, lat?: number, lng?: number) =>
    `${BASE_URL}/restaurants/${id}?lat=${lat || 12.9716}&lng=${lng || 77.5946}`,
  RESTAURANT_MENU: (id: number) => `${BASE_URL}/restaurants/${id}/menu`,
  MENU_ITEMS: (category?: string, search?: string, vegOnly?: boolean) => {
    let url = `${BASE_URL}/menu?limit=50`;
    if (category) url += `&category=${encodeURIComponent(category)}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;
    if (vegOnly !== undefined) url += `&is_veg=${vegOnly}`;
    return url;
  },
  DISH_DETAILS: (id: number) => `${BASE_URL}/menu/${id}`,

  // 🛒 CART & BILLING
  CART_QUOTE: `${BASE_URL}/cart/quote`,
  VALIDATE_PROMO: (code: string) => `${BASE_URL}/promos/validate?code=${code}`,

  // 📦 ORDERS & TRACKING
  PLACE_ORDER: `${BASE_URL}/orders`,
  GET_ORDERS: (status?: "active" | "past") =>
    status ? `${BASE_URL}/orders?status=${status}` : `${BASE_URL}/orders`,
  ORDER_BY_ID: (id: number) => `${BASE_URL}/orders/${id}`,
  TRACK_ORDER: (id: number) => `${BASE_URL}/orders/${id}/track`,
  CANCEL_ORDER: (id: number) => `${BASE_URL}/orders/${id}/cancel`,
  REORDER: (id: number) => `${BASE_URL}/orders/${id}/reorder`,
  ORDER_INVOICE: (id: number) => `${BASE_URL}/orders/${id}/invoice`,

  // 💳 PAYMENTS
  CREATE_PAYMENT: `${BASE_URL}/payments/create`,
  VERIFY_PAYMENT: `${BASE_URL}/payments/verify`,

  // ❤️ FAVORITES, REVIEWS & NOTIFICATIONS
  FAVORITES: `${BASE_URL}/favorites`,
  FAVORITE_BY_ID: (id: number) => `${BASE_URL}/favorites/${id}`,
  NOTIFICATIONS: `${BASE_URL}/notifications`,
  MARK_NOTIFICATION_READ: (id: number) => `${BASE_URL}/notifications/${id}/read`,
  MARK_ALL_NOTIFICATIONS_READ: `${BASE_URL}/notifications/read-all`,
  REVIEWS: `${BASE_URL}/reviews`,
  REVIEWS_BY_RESTAURANT: (id: number) => `${BASE_URL}/restaurants/${id}/reviews`,
  FAQ: `${BASE_URL}/faq`,
  SUPPORT_TICKETS: `${BASE_URL}/support/tickets`,
  PUSH_TOKEN: `${BASE_URL}/devices/push-token`,
};
