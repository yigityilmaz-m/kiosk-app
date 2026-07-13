# KioskApp

A self-service kiosk POS system built with React Native + Expo + Supabase.

> The mobile app lives in `apps/mobile-app/`

# KioskApp — Self-Service System

![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)<br>
![NativeWind](https://img.shields.io/badge/NativeWind-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![TanStack Query](https://img.shields.io/badge/TanStack_Query-FF4154?style=for-the-badge&logo=reactquery&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-443E38?style=for-the-badge&logo=zustand&logoColor=white)
![Reanimated](https://img.shields.io/badge/Reanimated_3-6C47FF?style=for-the-badge&logo=react&logoColor=white)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

A full-stack self-service kiosk built with React Native and Expo, designed as a portfolio project to demonstrate production-level mobile development patterns.

The app has two sides sharing a single codebase: a customer-facing self-order kiosk and a staff-facing order management dashboard hidden behind authentication. Orders sync in real-time between both sides.

---

## The Two Flows

**Customer side**
The customer browses a categorised product menu, builds a basket, enters their name, and places an order. Products are organised in a two-level hierarchy (e.g. Hot Drinks → Hot Coffee) with size variants (Small / Large) where applicable. The order confirmation screen counts down and returns to the menu automatically.

https://github.com/user-attachments/assets/efdcf141-5cdb-4160-8e7e-b145b05cef03

**Staff side**
Staff access a hidden login trigger on the kiosk screen (five rapid taps in the top-right corner). After authenticating, they land on a dashboard showing live order cards with full item detail. Each order progresses through a status pipeline — Pending → Preparing → Completed — with a cancel option at any stage. Two additional tabs cover product catalogue management and resource/inventory planning.

https://github.com/user-attachments/assets/09b5524f-7bbe-4154-a519-4feb93e590d0

---

## Tech Stack

### Core Framework

**Expo SDK 54 / React Native** — chose SDK 54 over 56 specifically for Expo Go compatibility, so the app can be demoed instantly by scanning a QR code without a native build step.

**Expo Router (file-based routing)** — screens map directly to the file system. Route groups `(customer)` and `staff/(tabs)` create logical separation between the two sides of the app. Stack and Tab navigators are composed declaratively in layout files.

### Backend

**Supabase** — provides three things in one:

- **Postgres** for the relational data model (products, categories, orders, order items)
- **Realtime subscriptions** so the staff dashboard updates live as orders come in, without polling
- **Auth** for staff login via email/password (`signInWithPassword`)

Row-Level Security is enabled on all tables with wide-open public policies appropriate for a kiosk demo — the README notes where `auth.uid()` checks would be added in a production context.

### State Management

**TanStack Query** for all server state — products, categories, orders. Each query has a meaningful cache key so navigating back to a subcategory is instant (cache hit, no refetch). `useProducts` seeds individual product entries into the cache so the product detail modal never makes a redundant network call on warm navigation.

**Zustand** for client-only state — the basket and the auth session. These two stores have no overlap with TanStack Query: Query owns "data that lives in Supabase", Zustand owns "data that only lives in the app."

### Styling

**NativeWind v4** — Tailwind CSS utility classes in React Native. `className` props work identically to web Tailwind, compiled by a custom Metro + Babel pipeline (`metro.config.js`, `babel.config.js`, `global.css`).

`cn()` utility combining `clsx` + `tailwind-merge` handles conditional class composition cleanly throughout the codebase.

---

## Architecture Decisions

**Feature-based folder structure** over type-based (`/features/products`, `/features/basket`, `/features/orders`, `/features/auth`). Each feature owns its components, hooks, and types together. Shared generic UI lives in `/components`.

**Monorepo shell at the root** (`KioskApp/apps/mobile-app`) — the outer wrapper exists so a future staff web app can be added without restructuring. No pnpm workspaces wired up yet; that comes when the second app is actually built.

**`StaffGuard` pattern** — a `useRequireStaff` hook handles the redirect logic, and a `StaffGuard` component handles the loading UI. Keeping these separate avoids the TypeScript error that arises from trying to return both JSX and primitives from the same hook. The guard lives in the tab layout file so all three staff tabs are protected in one place.

**Cache seeding** — `useProducts` seeds each product into the `["product", id]` cache slot via `queryClient.setQueryData` so the product detail screen gets a cache hit on warm navigation. `staleTime: 5min` on `useProduct` prevents an immediate background refetch of a freshly seeded entry.

---

## Database Schema

```
categories    id, name, slug, parent_id (self-ref FK), sort_order, image_url
products      id, name, description, price, large_price, category_id (FK), image_url, available, created_at
orders        id, customer_name, customer_note, status, total, created_at
order_items   id, order_id (FK), product_id (FK), quantity, price_at_order_time, selected_size
```

---

## Project Structure

```
KioskApp/
└── apps/
    └── mobile-app/
        ├── app/
        │   ├── _layout.tsx              # QueryClient provider + auth listener
        │   ├── (customer)/
        │   │   ├── index.tsx            # Product browser (sidebar + subcategory grid)
        │   │   ├── checkout.tsx
        │   │   ├── confirmation.tsx
        │   │   └── product/[id].tsx     # Product detail modal
        │   └── staff/
        │       ├── _layout.tsx          # Stack: login + (tabs)
        │       ├── login.tsx
        │       └── (tabs)/
        │           ├── _layout.tsx      # Tab navigator + StaffGuard
        │           ├── index.tsx        # Order dashboard
        │           ├── products.tsx     # Product management
        │           └── resources.tsx    # Resource / inventory planning
        ├── features/
        │   ├── products/
        │   ├── basket/
        │   ├── orders/
        │   └── auth/
        ├── components/                  # Shared UI
        ├── lib/                         # supabase.ts, utils.ts
        └── types/
            └── database.ts              # Shared TypeScript interfaces
```

---

## Running Locally

```bash
# Install dependencies
cd apps/mobile-app
npm install

# Set up environment
cp .env.example .env
# Fill in EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY

# Start dev server
npx expo start
```

Scan the QR code with **Expo Go** (iOS or Android) to run on device. No native build needed.

---

## What's Next

- Resource planning screen — inventory levels deducted per order, ops planning view
