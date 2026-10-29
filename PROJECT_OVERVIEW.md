# 🍔 Food Delivery App — Project Architecture & Overview

Welcome to the **Food Delivery Mobile Application** built with **React Native**, **Expo SDK 58**, **TypeScript**, and designed for seamless integration with a **Python Backend (FastAPI / Django)**.

---

## 📌 Executive Summary

This application provides a modern 100-foot-view 10-foot-interactive mobile food delivery platform. Users can browse nearby restaurants, filter food items by categories, view special promotional offers, add dishes to cart, and track orders in real-time.

---

## 🎨 Design System & Color Palette

The app follows a custom warm, appetizing, and premium color scheme:

| Color Code | Name | Hex | Usage & Purpose |
| :--- | :--- | :--- | :--- |
| **Primary Yellow** | Gold / Sunshine | `#F5CB58` | Action filter buttons, active category pills, rating highlights |
| **Light Cream** | Soft Gold | `#F3E9B5` | Icon fills, input container fills, rating boxes, subtle borders |
| **Brand Orange** | Coral Red / Orange | `#E95322` | Hero highlights, action buttons, prices, cart badges, promo cards |
| **Light Peach** | Soft Coral | `#FFDECF` | Special offer promo tags, subtle highlight backgrounds |
| **Dark Brown** | Deep Chocolate | `#391713` | Main typography, headings, icons, dark mode elements |
| **Background** | Off-White | `#F8F8F8` | Clean app screen background fill |

Defined centrally in [`src/constants/colors.ts`](./src/constants/colors.ts).

---

## 🛠️ Technology Stack

### **Frontend Mobile Client**
- **Framework**: React Native 0.88 + Expo SDK 58
- **Language**: TypeScript 6.0
- **Routing & Navigation**: Expo Router v58 (File-based routing in `src/app/`)
- **UI Components & Icons**: Expo Vector Icons (`Ionicons`, `MaterialCommunityIcons`), Custom Stylings
- **Dev Tools**: Android Studio Emulator (`Pixel 9a`), Wireless & USB ADB

### **Target Python Backend Architecture**
- **Recommended Framework**: **FastAPI** or **Django REST Framework (DRF)**
- **API Protocol**: RESTful JSON APIs (`http://10.0.2.2:8000` for Android Emulator)
- **Real-Time Order Tracking**: WebSockets (`ws://10.0.2.2:8000/ws/orders/`)
- **Authentication**: JWT (JSON Web Tokens) stored via `expo-secure-store`

---

## 📂 Project Directory Structure

```text
reactnative-basics/
├── src/
│   ├── app/                    # Expo Router file-based screens
│   │   ├── _layout.tsx          # Root tab navigator & app setup
│   │   ├── index.tsx            # Home Page (Food categories, offers, popular items)
│   │   └── explore.tsx          # Search & Discover screen
│   ├── components/             # Reusable UI components
│   │   ├── app-tabs.tsx         # Bottom tab navigation bar
│   │   ├── themed-text.tsx      # Custom typography wrapper
│   │   └── themed-view.tsx      # Custom view wrapper
│   └── constants/
│       ├── colors.ts            # Centralized brand color palette
│       └── theme.ts             # Spacing, fonts, and tab insets
├── assets/                     # Images, icons, and logos
├── PROJECT_OVERVIEW.md         # This documentation file
├── app.json                    # Expo project configuration
└── package.json                # Project dependencies & scripts
```

---

## 🚀 Mobile App Features

### 1. **Home Screen (`src/app/index.tsx`)**
- **Delivery Header**: Displays current deliver-to address, notification badge button, and user avatar.
- **Search & Filter Bar**: Instant search input with a dedicated `#F5CB58` filter trigger.
- **Promotional Offer Banner**: 30% OFF banner with action button in `#E95322` & `#FFDECF`.
- **Category Filter Pill Scroll**: Filter food items (*All, Burger, Pizza, Asian, Dessert, Drinks*) with active selection states.
- **Popular Near You Carousel**: Cards displaying dish image, rating, prep time, price in `#E95322`, heart favorite toggle, and "Add to Cart" (`+`) button.
- **Top Restaurants List**: Displays restaurant cards with delivery fees, estimated times, and discount badges.

---

## 🔌 Connecting to Python Backend

When your Python backend is running locally on port `8000`:

| Environment | Base URL | Note |
| :--- | :--- | :--- |
| **Android Emulator** | `http://10.0.2.2:8000/api/v1` | `10.0.2.2` aliases your PC's `localhost` inside Android Emulator |
| **Physical Phone (Wi-Fi)** | `http://<your-pc-ip>:8000/api/v1` | Ensure phone and PC are on the same Wi-Fi network |
| **Web Browser** | `http://localhost:8000/api/v1` | For React Native Web testing |

---

## 🛠️ CLI Commands Cheat Sheet

```bash
# Start dev server for Android Emulator
npx expo start --android

# Start dev server with interactive menu
npx expo start

# Run TypeScript type checker
npx tsc --noEmit

# Run Expo Linter
npx expo lint

# Forward Android Metro Port over USB/ADB
adb reverse tcp:8081 tcp:8081
```

---

## 📋 Planned Next Milestones

1. **Food Item Details Screen**: Detailed view with quantity selector, extra toppings/add-ons, and "Add to Cart" bar.
2. **Cart & Checkout Screen**: Order summary, promo code application, delivery address selection, and payment options.
3. **Live Order Tracking**: Map integration & WebSocket connection for live driver status updates.
4. **Python FastAPI / Django Backend Integration**: Wiring REST endpoints for authentication, menu fetching, and order placement.
