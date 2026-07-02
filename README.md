<div align="center">

# ✈️ Gate Buddy — Smart Airport Companion

**Gate Buddy** is a modern, responsive airport companion web app that helps travelers navigate Nile International Airport with ease. From real-time flight tracking and QR boarding pass scanning to VIP services, accessibility support, an AI chatbot, and hotel & airline booking — Gate Buddy puts the entire airport experience in one place.

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=flat&logo=vite)](https://vitejs.dev/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5-7952B3?style=flat&logo=bootstrap)](https://getbootstrap.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-EF0079?style=flat&logo=framer)](https://www.framer.com/motion/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

[Live Demo](#) · [Report Bug](https://github.com/abdelrhmanhesham1/gate-buddy-frontend/issues) · [Request Feature](https://github.com/abdelrhmanhesham1/gate-buddy-frontend/issues)

</div>

---

## 📌 Project Overview

Gate Buddy is a frontend web application designed to streamline the airport experience for all types of travelers. Whether you're a first-time flyer or a frequent business traveler, Gate Buddy offers real-time updates, navigation assistance, and personalized airport services — all from a clean and intuitive interface.

The app is built around **Nile International Airport** and covers everything from the moment you enter the terminal to the second your flight takes off.

---

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| **UI Framework** | React 19 |
| **Build Tool** | Vite 7 |
| **Routing** | React Router DOM v7 |
| **Styling** | Bootstrap 5, Custom CSS Modules |
| **Animations** | Framer Motion 12 |
| **Icons** | Lucide React, React Icons, Bootstrap Icons |
| **HTTP Client** | Axios |
| **Alerts & Modals** | SweetAlert2 |
| **Email Service** | EmailJS |
| **UI Primitives** | Radix UI (Tooltip, HoverCard) |
| **Date Handling** | Moment.js |
| **Mock Backend** | JSON Server |
| **Dev Tooling** | ESLint, Concurrently |

---

## 🏗️ Architecture

Gate Buddy follows a **feature-based component architecture** with a clear separation of concerns:

```
src/
├── App.jsx              # Root component — defines all routes
├── main.jsx             # App entry point
├── components/
│   ├── pages/           # One file per route/screen
│   ├── shared/          # Reusable layout components (Navbar, Footer)
│   └── style/           # Per-component CSS files
utils/
└── Api.js               # Centralized API layer (Axios config)
public/
└── images/              # Static assets & airport imagery
```

**Routing** is handled entirely client-side via React Router DOM. Every page is a standalone component under `pages/`, keeping the codebase easy to navigate and extend.

**Authentication** is managed with `localStorage` — a token (`auth_token`) is stored on login, and protected routes check for it before rendering.

---

## ✨ Features

### 🔐 Authentication
- Login & Signup pages with form validation
- Password reset flow
- Auth guard — unauthenticated users are redirected to `/login`
- Social login UI (Google, Facebook, GitHub)

### 🏠 Home Dashboard
- Hero banner with airport welcome message
- Live-style flight update cards (delays, gate changes)
- Tracked flight section with QR boarding pass scan CTA
- Airport services quick-access grid
- VIP experience banner
- Accessibility & assistance section
- Weather widget + airport info card (WiFi, parking, hours)

### ✈️ Flight Tracking
- QR code boarding pass scanner (`/scan`)
- Tracked flight display with airline, gate, route, and status
- Real-time flight update cards (delayed / gate changed)

### 🤖 AI Chatbot (`/chatbot`)
- Conversational UI with typing indicator
- Quick-question suggestion chips
- Keyword-based smart replies for gates, restaurants, VIP lounges, lost & found, currency exchange, and flight status
- Available 24/7 with animated bot avatar

### 🗺️ Airport Map (`/map`)
- Interactive airport navigation map
- Gate and terminal locator

### 🌍 Explore Destinations (`/explore`)
- Destination discovery page for layover travelers
- Highlights top places to visit with images and descriptions

### 💼 Booking
- **Airline Booking** (`/Airline`) — search and browse flights
- **Hotel Booking** (`/Hotels`) — find nearby accommodations

### 🛎️ Airport Services
- **Counters** (`/counters`) — Domestic & International check-in counters
- **VIP Lounge** (`/vip`) — Premium passenger experience
- **Financial Services** (`/financial`) — ATMs & currency exchange
- **Accessibility** (`/accessibility`) — Special assistance & mobility support

### 👤 User Profile
- View and edit profile information (`/profile`, `/edit-profile`)
- Profile photo stored in `localStorage`

### 📞 Contact & Info
- Contact form with EmailJS integration
- About Us page with mission & vision
- FAQ page

---

## 🧪 Testing

> This project is currently in active frontend development. Formal test suites are planned for a future milestone.

**Manual testing covers:**
- Navigation flows across all routes
- Login / logout / redirect guards
- Chatbot message sending and reply rendering
- Form validation on Login, Signup, Contact, and Password Reset
- Responsive layout on mobile and desktop

**Planned:**
- Unit tests with Vitest + React Testing Library
- E2E tests with Playwright

---

## 📁 Folder Structure

```
gate-buddy-frontend/
├── public/
│   └── images/                  # All static images used across the app
├── src/
│   ├── App.jsx                  # Route definitions
│   ├── main.jsx                 # React DOM render entry
│   └── components/
│       ├── pages/
│       │   ├── main1.jsx        # Landing / splash screen
│       │   ├── Home.jsx         # Main dashboard (protected)
│       │   ├── Login.jsx        # Auth - login
│       │   ├── Signup.jsx       # Auth - register
│       │   ├── PasswordReset.jsx
│       │   ├── Profile.jsx
│       │   ├── EditProfile.jsx
│       │   ├── Chatbot.jsx      # AI chatbot page
│       │   ├── A_Scan.jsx       # QR boarding pass scanner
│       │   ├── explore.jsx      # Destinations explorer
│       │   ├── Map.jsx          # Airport map
│       │   ├── Counter_S.jsx    # Check-in counters
│       │   ├── Vip_S.jsx        # VIP lounge
│       │   ├── Financial_S.jsx  # ATM & currency exchange
│       │   ├── Accessabillity_S.jsx
│       │   ├── Airline.jsx      # Airline booking
│       │   ├── Hotel.jsx        # Hotel booking
│       │   ├── Aboutus.jsx
│       │   ├── Contact.jsx
│       │   └── FQA.jsx
│       ├── shared/
│       │   ├── Navbar.jsx       # Sticky top navigation with dropdowns
│       │   └── Footer.jsx       # Site-wide footer
│       └── style/               # CSS per page/component
├── utils/
│   └── Api.js                   # Axios base config
├── index.html
├── vite.config.js
├── eslint.config.js
└── package.json
```

---

## 🚀 How to Run the Project

### Prerequisites
- Node.js `v18+`
- npm `v9+`

### 1. Clone the repository

```bash
git clone https://github.com/abdelrhmanhesham1/gate-buddy-frontend.git
cd gate-buddy-frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### 4. Build for production

```bash
npm run build
```

### 5. Preview the production build

```bash
npm run preview
```

> **Note:** The app currently uses a mock authentication flow — no backend is required. On the login page, entering any email and password will grant access and redirect to the dashboard.

---

## 🔮 Future Improvements

- [ ] **Real backend integration** — Connect the commented-out Axios API calls to a live REST or GraphQL backend
- [ ] **Real-time flight data** — Integrate a live flight API (e.g., AviationStack, FlightAware)
- [ ] **QR code scanning** — Implement actual camera-based QR scanning using `html5-qrcode`
- [ ] **Push notifications** — Alert travelers about gate changes and delays in real time
- [ ] **Multilingual support** — Add Arabic language support for Egyptian travelers
- [ ] **Dark mode** — System-aware and user-toggled dark theme
- [ ] **PWA support** — Make the app installable on mobile devices
- [ ] **Unit & E2E tests** — Full test coverage with Vitest and Playwright
- [ ] **Backend auth** — Replace localStorage mock with JWT-based authentication
- [ ] **Accessibility audit** — Full WCAG 2.1 AA compliance pass

---

## 📸 Screenshots

> Screenshots will be added after the live deployment is complete.

| Page | Preview |
|---|---|
| Login | *(coming soon)* |
| Home Dashboard | *(coming soon)* |
| Chatbot | *(coming soon)* |
| Explore Destinations | *(coming soon)* |
| Airport Map | *(coming soon)* |

---

## 🤝 Connect

Built with passion for travelers ✈️

| | |
|---|---|
| **GitHub** | [@abdelrhmanhesham1](https://github.com/abdelrhmanhesham1) |
| **Email** | gatebuddy11@gmail.com |

---

<div align="center">

Made with ❤️ by the Gate Buddy Team &nbsp;·&nbsp; © 2025

</div>
