# 🍔 YumQuick — Complete End-to-End Application Documentation

---

## 📌 1. Executive Summary

**YumQuick** is a production-grade, cross-platform food delivery mobile application built with **React Native**, **Expo SDK 58**, **Expo Router v58**, and **TypeScript**. The application connects seamlessly to a **Python REST API Backend** (FastAPI / Django running at `http://192.168.1.11:8000`) supporting over 540+ dishes, live search, categories, cart management, orders, live tracking, biometrics, and user settings.

---

## 🎨 2. Design System & Visual Guidelines

Centralized in [`src/constants/colors.ts`](./src/constants/colors.ts), [`spacing.ts`](./src/constants/spacing.ts), and [`typography.ts`](./src/constants/typography.ts):

### A. Brand Color Palette
| Hex Code | Name | Role & Application |
| :--- | :--- | :--- |
| **`#F5CB58`** | Primary Gold | Headers, active category pills, rating badges, progress bars, CTA buttons |
| **`#F3E9B5`** | Soft Cream | Input field backgrounds, icon circles, rating boxes |
| **`#E95322`** | Brand Orange | Primary action buttons, prices, cart badges, promo cards, hero highlights |
| **`#FFDECF`** | Light Peach | Offer badges, steam particles, soft highlight backgrounds |
| **`#391713`** | Dark Brown | Main typography, headings, icons, dark mode elements |
| **`#F8F8F8`** | Background | Off-white clean app background fill |
| **`#D32F2F`** | Error Red | Invalid input borders & error alert messages |
| **`#2E7D32`** | Success Green | Valid input indicators & success toasts |

### B. Layout & Spacing Rules
- **8-pt Grid**: `xs: 4`, `sm: 8`, `md: 16`, `lg: 24`, `xl: 32`, `xxl: 48`.
- **Corner Radii**: Cards (`16–24px`), Input fields (`16px`), Pill buttons (`26–30px`).
- **Accessibility**: Minimum 48px touch targets for all interactive controls.

---

## 🛠️ 3. Software Design Patterns & Architecture

1. **File-Based Routing Pattern (Expo Router v58)**:
   - Routes live under `src/app/`. Every file defines a screen, and `_layout.tsx` wraps the stack.
2. **Guarded Navigation Pattern (`src/app/_layout.tsx`)**:
   - `InitialLayout` checks `isAuthenticated` state on launch. Unauthenticated users are redirected to `/welcome`; authenticating users pass through `/preparing` before entering `/`.
3. **Reactive Global State Pattern (Zustand)**:
   - `authStore` ([`src/store/authStore.ts`](./src/store/authStore.ts)): Manages session tokens & user profiles.
   - `cartStore` ([`src/store/cartStore.ts`](./src/store/cartStore.ts)): Manages cart items, promo codes, delivery fees, and tax calculations.
4. **Encrypted Token Storage Pattern (`expo-secure-store`)**:
   - Sensitive JWT access & refresh tokens are stored in encrypted `SecureStore`. User profiles and non-sensitive settings are cached in `AsyncStorage`.
5. **API Client & Failover Pattern ([`src/services/api-client.ts`](./src/services/api-client.ts))**:
   - `fetchWithTimeout` wrapper with 1.8s timeout. Auto-attaches `Authorization: Bearer <token>` and fails over from `192.168.1.11` to Android Emulator loopback (`10.0.2.2`).
6. **Biometric Authentication Pattern ([`src/hooks/useBiometrics.ts`](./src/hooks/useBiometrics.ts))**:
   - Uses `expo-local-authentication` for hardware detection & Fingerprint / Face ID prompts.

---

## 📱 4. Complete Application Screens Breakdown

1. **Welcome / Splash Choice Screen (`src/app/welcome.tsx`)**:
   - Full-bleed `#E95322` brand background with custom SVG heart + spoon + fork logo and "Log In" / "Sign Up" action buttons.
2. **Log In Screen (`src/app/login.tsx`)**:
   - `#F5CB58` top header, `#F3E9B5` cream input fields, inline red error feedback, password eye toggle, and Fingerprint/Face ID login trigger button.
3. **Sign Up Screen (`src/app/signup.tsx`)**:
   - Validation for Full Name, Email, Password (min 6 chars), Mobile, DOB, and terms agreement.
4. **Chef Kitchen Animated Loader (`src/app/preparing.tsx`)**:
   - 60 FPS 3-second Reanimated cooking animation (bouncing chef hat, sizzling pot, steam particles, 0%➔100% progress bar, rotating status messages).
5. **Home Screen (`src/app/index.tsx`)**:
   - Location header, live search bar, category chips loaded from `/menu/categories`, 30% OFF promo card, popular dishes from `/menu`, nearby restaurants, and header logout button (🚪).
6. **Live Search Screen (`src/app/search.tsx`)**:
   - Debounced search, Pure Veg 🥬 vs Non-Veg 🍗 filter pills, recent search keywords history.
7. **Food Details Screen (`src/app/food/[id].tsx`)**:
   - Hero image showcase with prep time & rating floating badges, quantity controller (`-` `qty` `+`), portion sizes (*Small, Medium, Large*), add-ons checklist, live price calculation, and "Add to Cart" button.
8. **Cart Screen (`src/app/cart.tsx`)**:
   - Persistent cart list, quantity updates, promo code coupon validator (`POST /promos/validate`), price breakdown (subtotal, delivery fee `$1.99`, tax `8%`, total), and empty state.
9. **Checkout Screen (`src/app/checkout.tsx`)**:
   - Delivery Address selector (*Home, Work*), Payment Method selector (*COD, UPI, Card*), order summary, and "Confirm Order" button calling `POST /orders`.
10. **Order Success Screen (`src/app/order-success.tsx`)**:
    - Reanimated celebration checkmark animation 🎉, Order ID badge, ETA timer, and "Track Order Live" button.
11. **Live Order Tracking (`src/app/order/[id].tsx`)**:
    - Status timeline stepper (*Order Confirmed ➔ Food Preparing ➔ Out for Delivery ➔ Order Delivered*), live driver card, and call button.
12. **Orders History Tab (`src/app/orders.tsx`)**:
    - Active Orders vs Past History tabs with "Track Live" and "Reorder Dish" actions.
13. **Profile & Settings Screen (`src/app/profile.tsx`)**:
    - Avatar photo editor (`expo-image-picker`), saved addresses link, Fingerprint biometrics toggle, notification toggles, and account logout.
14. **Notifications Screen (`src/app/notifications.tsx`)**:
    - List of unread/read order updates & promo alerts with "Mark Read" button.

---

## 🐍 5. Python Backend API Specification (16 Endpoints)

Base URL: `http://192.168.1.11:8000` (Fallback: `http://10.0.2.2:8000`)

| Module | Endpoint | Method | Purpose / Payload |
| :--- | :--- | :--- | :--- |
| **Auth** | `/auth/signup` | `POST` | Registers user (`fullName`, `email`, `password`, `mobile`, `dob`) |
| **Auth** | `/auth/login` | `POST` | Authenticates user (`email` or `phone` + `password`) |
| **Menu** | `/menu/categories` | `GET` | Fetches horizontal category chips |
| **Menu** | `/menu/stats` | `GET` | Fetches item count & category breakdown |
| **Menu** | `/menu` | `GET` | Lists 540+ dishes with `category`, `search`, `limit`, `offset` |
| **Menu** | `/menu/${id}` | `GET` | Fetches single dish details |
| **Menu** | `/menu` | `POST` | Admin: Add new dish |
| **Menu** | `/menu/${id}` | `PATCH` | Admin: Update dish price or availability |
| **Menu** | `/menu/${id}` | `DELETE` | Admin: Delete dish |
| **Orders** | `/orders` | `POST` | Places order (`customer_name`, `item_id`, `quantity`) |
| **Orders** | `/orders/${id}` | `GET` | Returns live order tracking status |
| **Orders** | `/orders` | `GET` | Returns order history |
| **Orders** | `/orders/${id}/status` | `PATCH` | Updates order status (`received`, `preparing`, `delivered`) |
| **Promos** | `/promos/validate` | `POST` | Validates promo code (`code`) and calculates discount |

---

## 🚀 6. Release Artifacts & Standalone APK

- **Expo Account**: `jaya489`
- **EAS Project**: `yumquick-food-delivery`
- **Package Name**: `com.yumquick.fooddelivery`
- **Standalone Downloadable APK Link**:
  👉 [**https://expo.dev/accounts/jaya489/projects/yumquick-food-delivery/builds/a71e3501-22d6-4a8d-9c86-051cb73a27bd**](https://expo.dev/accounts/jaya489/projects/yumquick-food-delivery/builds/a71e3501-22d6-4a8d-9c86-051cb73a27bd)
