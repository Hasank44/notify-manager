# Notify Manager — User Panel

The customer-facing web application for **Notify Manager** — a centralized notification infrastructure platform. This panel lets end-users (clients) manage their domains, bots, destinations, routes, and B2C customers through a clean, modern interface.

**Live:** [app.iftyhasan.com](https://app.iftyhasan.com)  
**API:** [api.iftyhasan.com/api/v1](https://api.iftyhasan.com/api/v1)  
**Docs:** [app.iftyhasan.com/docs](https://app.iftyhasan.com/docs)

---

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [Features](#features)
3. [Folder Structure](#folder-structure)
4. [Getting Started](#getting-started)
5. [Environment Variables](#environment-variables)
6. [Available Scripts](#available-scripts)
7. [Architecture](#architecture)
8. [Design System](#design-system)
9. [API Integration](#api-integration)
10. [Deployment](#deployment)
11. [Troubleshooting](#troubleshooting)
12. [Contributing](#contributing)
13. [License](#license)

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | React 18 + Vite 6 |
| **State** | Redux Toolkit + redux-persist |
| **Routing** | React Router 7 |
| **HTTP** | Axios (with interceptors + auto-refresh) |
| **Styling** | Tailwind CSS 3.4 |
| **Icons** | lucide-react |
| **Notifications** | Sonner (toasts) |
| **Language** | JavaScript (ESM) |
| **Deployment** | Vercel |

---

## Features

### 🔐 Authentication
- Register + login with JWT (access + refresh tokens)
- Auto token refresh on 401
- Persistent session (Redux persist)
- Password change

### 📚 Documentation (Public)
- 16 fully documented pages
- Code examples in JavaScript, PHP, Python, cURL
- Field tables + response references
- SEO optimized (publicly crawlable)
- Breadcrumbs + sidebar navigation
- Copy-to-clipboard on all code blocks

### 🌐 Domain Management
- Add domains (admin approval workflow)
- View status (pending / approved / rejected)
- Update name/description
- Delete with cascade to routes

### 🤖 Telegram Bot Management
- Register own bots (Pro+ plan)
- Token auto-verification with Telegram
- Rotate tokens without downtime
- Delete protection when destinations reference the bot

### 📍 Destination Management
- 6 destination types:
  - `user` — fixed Telegram chat
  - `group` — fixed Telegram group
  - `channel` — fixed Telegram channel
  - `bot` — bot identifier
  - `user_dynamic` — single customer (B2C)
  - `user_dynamic_broadcast` — all subscribers (B2C)
- Auto-approved (no admin review)
- Ownership validation

### 🔀 Route Management
- Bind domain + notification type → destinations
- Multi-select destinations (up to 50 per route)
- Instant approval for user-created routes
- Immutable domain + type after creation

### 👥 B2C Customer Subscriptions
- Register customers with chatId mapping
- Bulk upload (CSV-style, max 5000)
- View per-customer stats (received count, last notified)
- Filter by domain, active status, search

### 📨 Notification History
- Full audit log per user
- Filter by status, type, domain, date range
- Per-destination delivery tracking
- Request ID search
- Debug-friendly error details

### 📊 Dashboard
- Notification stats (total sent, failed, this month)
- Usage counter (current month)
- Pending approvals preview
- Plan info + limits

### 🎨 UI/UX
- Dark theme (matches admin panel)
- Fully responsive (mobile + tablet + desktop)
- Loading states + skeleton screens
- Empty states with helpful guidance
- Confirmation modals for destructive actions
- Toast notifications on every action

---

## Folder Structure
user/
├── public/
│ ├── favicon.png
│ ├── robots.txt
│ └── sitemap.xml
│
├── src/
│ ├── api/
│ │ ├── axiosInstance.js # Axios config + interceptors
│ │ └── endpoints.js # Central API path constants
│ │
│ ├── components/
│ │ ├── auth/
│ │ │ ├── Login/
│ │ │ │ └── Login.jsx
│ │ │ └── Register/
│ │ │ └── Register.jsx
│ │ │
│ │ ├── pages/
│ │ │ ├── Dashboard/
│ │ │ ├── Domains/
│ │ │ ├── Bots/
│ │ │ ├── Destinations/
│ │ │ ├── Routes/
│ │ │ ├── UserSubscriptions/
│ │ │ ├── Notifications/
│ │ │ ├── Packages/
│ │ │ ├── Profile/
│ │ │ │
│ │ │ ├── Docs/
│ │ │ │ ├── DocsLayout.jsx
│ │ │ │ ├── DocsSidebar.jsx
│ │ │ │ ├── components/
│ │ │ │ │ ├── CodeBlock.jsx
│ │ │ │ │ ├── FieldTable.jsx
│ │ │ │ │ ├── Callout.jsx
│ │ │ │ │ ├── ResponseBlock.jsx
│ │ │ │ │ ├── EndpointCard.jsx
│ │ │ │ │ ├── Breadcrumbs.jsx
│ │ │ │ │ └── PageMeta.jsx
│ │ │ │ └── pages/
│ │ │ │ ├── Overview.jsx
│ │ │ │ ├── QuickStart.jsx
│ │ │ │ ├── Authentication.jsx
│ │ │ │ ├── PublicApiSubscriptions.jsx
│ │ │ │ ├── PublicApiNotify.jsx
│ │ │ │ ├── Domains.jsx
│ │ │ │ ├── Bots.jsx
│ │ │ │ ├── Destinations.jsx
│ │ │ │ ├── Routes.jsx
│ │ │ │ ├── UserSubscriptions.jsx
│ │ │ │ ├── Notifications.jsx
│ │ │ │ ├── Errors.jsx
│ │ │ │ ├── RateLimits.jsx
│ │ │ │ ├── Troubleshooting.jsx
│ │ │ │ ├── Faq.jsx
│ │ │ │ └── Examples.jsx
│ │ │ │
│ │ │ └── PlaceholderPage.jsx
│ │ │
│ │ ├── shared/
│ │ │ ├── Navbar.jsx
│ │ │ ├── Sidebar.jsx
│ │ │ ├── PageHeader.jsx
│ │ │ ├── DataTable.jsx
│ │ │ ├── Pagination.jsx
│ │ │ ├── SearchBar.jsx
│ │ │ ├── StatusBadge.jsx
│ │ │ ├── ConfirmModal.jsx
│ │ │ ├── EmptyState.jsx
│ │ │ ├── Loader.jsx
│ │ │ └── MultiSelect.jsx
│ │ │
│ │ └── web/
│ │ ├── ProtectedRoute.jsx
│ │ └── PublicRoute.jsx
│ │
│ ├── hooks/
│ │ ├── useDebounce.js
│ │ ├── useEntity.js
│ │ └── usePageMeta.js
│ │
│ ├── redux/
│ │ ├── store.js
│ │ ├── storage.js
│ │ ├── userSlice.js
│ │ ├── createEntitySlice.js
│ │ ├── entities.js
│ │ └── slices/
│ │ ├── domainsSlice.js
│ │ ├── botsSlice.js
│ │ ├── destinationsSlice.js
│ │ ├── routesSlice.js
│ │ ├── userSubscriptionsSlice.js
│ │ ├── notificationsSlice.js
│ │ ├── packagesSlice.js
│ │ └── notificationTypesSlice.js
│ │
│ ├── utils/
│ │ ├── constants.js
│ │ └── formatDate.js
│ │
│ ├── App.jsx
│ ├── main.jsx
│ └── index.css
│
├── .env
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vercel.json
└── vite.config.js

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 20.0.0
- **npm** ≥ 10.0.0
- **Backend API** running (locally on `http://localhost:3000` OR production `https://api.iftyhasan.com`)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd user

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env with your configuration
# (see Environment Variables section below)