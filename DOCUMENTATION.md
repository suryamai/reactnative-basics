# 🍔 YUMQUICK — Food Delivery Application Complete Documentation

---

## 📌 Executive Summary

**YUMQUICK** is a high-performance cross-platform food delivery mobile application developed using **React Native**, **Expo SDK 58**, **Expo Router v58**, and **TypeScript**. The mobile app is fully integrated with a **Python REST API Backend** (running on `http://192.168.1.11:8000`) supporting over 540+ menu dishes, categories, user authentication, and order tracking.

---

## 🎨 Design System & Color Palette

Centralized in [`src/constants/colors.ts`](./src/constants/colors.ts):

| Color Name | Hex Code | Applied Components |
| :--- | :--- | :--- |
| **Primary Gold** | `#F5CB58` | Action filter buttons, active category pills, rating badges, progress bar |
| **Light Cream** | `#F3E9B5` | Input field background fill, icon circles, rating boxes |
| **Brand Orange** | `#E95322` | Hero highlights, primary action buttons, dish prices, promo banners |
| **Light Peach** | `#FFDECF` | Special offer badges, steam particles, soft accent highlights |
| **Dark Brown** | `#391713` | Main typography, headings, icons, dark mode elements |
| **Background** | `#F8F8F8` | Clean off-white screen background fill |

---

## 🔐 Authentication & Form Validation Architecture

### 1. **Validation Utility Module ([`src/utils/validation.ts`](./src/utils/validation.ts))**
Contains strict positive and negative input validators:
- `isValidEmail(email)`: Validates email regex pattern (`name@domain.com`).
- `isValidPhone(phone)`: Validates mobile number length & digits (8–15 digits).
- `isValidEmailOrPhone(input)`: Validates if input is either a valid email or phone number.
- `isValidPassword(password)`: Enforces minimum 6 characters.
- `isValidName(name)`: Enforces minimum 2 characters (letters/spaces only).
- `isValidDate(dateStr)`: Validates date format (`DD/MM/YYYY`).

### 2. **Log In Screen ([`src/app/login.tsx`](./src/app/login.tsx))**
- Styled after Figma UI Kit with `#F5CB58` yellow header and `#F3E9B5` cream input fields.
- **Negative Cases**: Shows inline red error messages and highlights borders in red (`#D32F2F`) if email/phone or password is missing or invalid.
- **Positive Case**: Valid credentials call `loginApi` and navigate to Chef Kitchen Animated Loader (`/preparing`).

### 3. **Sign Up Screen ([`src/app/signup.tsx`](./src/app/signup.tsx))**
- Styled with `#F5CB58` header, full name, email, password, mobile number, and DOB inputs in `#F3E9B5` cream.
- **Negative Cases**: Validates every field independently and highlights invalid inputs.
- **Positive Case**: Registers user session and navigates to Chef Kitchen Animated Loader (`/preparing`).

### 4. **Session Persistence & Route Guard ([`src/app/_layout.tsx`](./src/app/_layout.tsx))**
- Persists JWT tokens and user session in `@react-native-async-storage/async-storage`.
- Guarantees unauthenticated users are redirected to `/welcome`.
- Guarantees authenticating users always pass through the **Chef Kitchen Animated Loader (`/preparing`)** before entering Home Page (`/`).

---

## 👨‍🍳 Chef Kitchen Animated Loader ([`src/app/preparing.tsx`](./src/app/preparing.tsx))

A 60 FPS Reanimated kitchen animation displayed for 3 seconds upon every login/signup:
- 👨‍🍳 Bouncing Chef Hat and wiggling cooking pot with rising steam particles 💨.
- 🍔 Bouncing food items (Burger, Pizza, Cheese).
- 📊 Animated progress bar filling 0% ➔ 100% in Gold (`#F5CB58`).
- 💬 Rotating kitchen messages (*"Master Chef is firing up the kitchen..."*, *"Sizzling fresh ingredients..."*, *"Garnishing your personalized menu..."*).

---

## 📱 Application Screens Overview

1. **Welcome / Splash Screen ([`src/app/welcome.tsx`](./src/app/welcome.tsx))**:
   - Vibrant orange background (`#E95322`) with custom SVG heart + spoon + fork logo.
2. **Home Screen ([`src/app/index.tsx`](./src/app/index.tsx))**:
   - Live search bar searching 540+ dishes.
   - Horizontal category chips loaded directly from `GET /menu/categories`.
   - Popular food card list loaded from `GET /menu` with category filtering.
   - Top restaurants section & Logout button (🚪) in top-right header.
3. **Food Details Screen ([`src/app/food/[id].tsx`](./src/app/food/[id].tsx))**:
   - Hero image showcase with prep time & rating floating badges.
   - Quantity selector (`-` `qty` `+`).
   - Portion Size selector (*Small, Medium, Large*).
   - Add-ons checklist (*Extra Cheese, Extra Patty, Spicy Dip*).
   - Live price calculation and "Add to Cart" button placing orders via `POST /orders`.

---

## 🔌 Python Backend API Reference (16 Endpoints)

Base URL: `http://192.168.1.11:8000` (Fallback: `http://10.0.2.2:8000`)

| Category | Endpoint | Method | Description |
| :--- | :--- | :--- | :--- |
| **Auth** | `/auth/signup` | `POST` | Registers new user (`fullName`, `email`, `password`, `mobile`, `dob`) |
| **Auth** | `/auth/login` | `POST` | Authenticates with `email` or `phone` + `password` |
| **Menu** | `/menu/categories` | `GET` | Returns list of categories |
| **Menu** | `/menu/stats` | `GET` | Returns menu item count & category breakdown |
| **Menu** | `/menu` | `GET` | Lists dishes with `category`, `search`, `limit`, `offset` |
| **Menu** | `/menu/${id}` | `GET` | Fetches single dish details |
| **Menu** | `/menu` | `POST` | Admin: Add new dish |
| **Menu** | `/menu/${id}` | `PATCH` | Admin: Update dish price or availability |
| **Menu** | `/menu/${id}` | `DELETE` | Admin: Delete dish |
| **Orders** | `/orders` | `POST` | Places order (`customer_name`, `item_id`, `quantity`) |
| **Orders** | `/orders/${id}` | `GET` | Returns live order tracking status |
| **Orders** | `/orders` | `GET` | Returns order history |
| **Orders** | `/orders/${id}/status` | `PATCH` | Updates order status (`received`, `preparing`, `delivered`) |

---

## 💻 How to Run & Test

```bash
# 1. Start App on Android Emulator
npx expo start --android

# 2. Run TypeScript Validation
npx tsc --noEmit

# 3. Forward Python Port over ADB
adb -s emulator-5554 reverse tcp:8000 tcp:8000
```
