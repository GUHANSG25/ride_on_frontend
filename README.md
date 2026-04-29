# RideOn — Bus Ticket Booking Platform (Frontend)

> A feature-sliced React + Vite single-page application for bus ticket booking, with role-based dashboards for Customers, Operators, and Admins.

**Repository:** [ride_on_frontend](https://github.com/GUHANSG25/ride_on_frontend)  
**Backend:** [RideOnSecurity-1](https://github.com/GUHANSG25/RideOnSecurity-1)

---

## Table of Contents

1. [System Overview](#system-overview)
2. [Tech Stack](#tech-stack)
3. [Prerequisites](#prerequisites)
4. [Directory Structure](#directory-structure)
5. [Feature-Based Architecture](#feature-based-architecture)
6. [Feature Flow Explanations](#feature-flow-explanations)
7. [Getting Started](#getting-started)
8. [Environment Configuration](#environment-configuration)
9. [API Overview](#api-overview)
10. [Security & Route Guards](#security--route-guards)

---

## System Overview

RideOn is a bus ticket-booking web application. This repository contains the React frontend only. It communicates with a Spring Boot backend (`RideOnSecurity-1`) exclusively through REST over HTTP.

| Concern | Handled By |
|---|---|
| Authentication, authorization, data persistence | Spring Boot backend |
| UI, routing, state management | This React frontend |

Three distinct role-based portals are served from the same SPA: **Customer**, **Operator**, and **Admin**.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Language | JavaScript |
| Framework | React |
| Build Tool | Vite |
| State Management | Redux Toolkit (feature slices) + Context API (auth) |
| Routing | React Router |
| HTTP Client | Axios (via shared `axiosInstance`) |
| Styling | Vanilla CSS (custom design system in `global.css`) |
| Charts | Recharts |
| OTP / SMS | Twilio (backend-triggered; OTP input handled in frontend) |
| Payment | RazorPay (Test mode)

---

## Prerequisites

- **react**
- **npm** 
- **Git**
- Backend service (`RideOnSecurity-1`) running and accessible

---

## Directory Structure

```
src/
├── main.jsx                          # React root — ReactDOM.createRoot
├── App.jsx                           # Route tree, role-based guards
│
├── api/
│   └── axiosInstance.js              # Axios base config, auth header interceptor
│
├── app/
│   └── store.js                      # Redux store — combines all feature slices
│
├── assets/
│   └── images/                       # Static image assets
│
├── components/
│   └── common/                       # Shared, reusable UI components
│       ├── AddNewModal.jsx
│       ├── Badge.jsx
│       ├── DataTable.jsx
│       ├── Footer.jsx
│       ├── Header.jsx
│       ├── Hero.jsx
│       ├── OfferCard.jsx
│       ├── ProfileSidebar.jsx
│       ├── ProtectedRoute.jsx        # Redirects unauthenticated users to /login
│       ├── RecentModal.jsx
│       ├── ReviewCard.jsx
│       ├── Search.jsx
│       ├── SearchBox.jsx
│       ├── SideBar.jsx
│       ├── SidebarNavItems.jsx
│       ├── StatsGrid.jsx
│       ├── Toast.jsx
│       └── TopBar.jsx
│
├── features/                         # Feature-sliced modules (UI + state + service)
│   ├── auth/
│   │   ├── components/
│   │   │   ├── AuthModal.jsx         # Auth modal container
│   │   │   ├── ModalShell.jsx        # Modal wrapper/backdrop
│   │   │   ├── OtpInput.jsx          # OTP digit input component
│   │   │   ├── SignInModal.jsx       # Login form
│   │   │   └── SignUpModal.jsx       # Registration form
│   │   └── context/
│   │       └── AuthContext.jsx       # Auth state (user, token, role) — Context API
│   │
│   ├── booking/
│   │   ├── components/
│   │   │   ├── BookingCard.jsx       # Single booking summary card
│   │   │   └── BookingDetail.jsx     # Full booking detail view
│   │   ├── service/
│   │   │   └── BookingService.js     # API calls: createBooking, getBookings, cancel
│   │   └── Slice/
│   │       └── BookingSlice.js       # Redux slice: bookings state + async thunks
│   │
│   ├── Bus/
│   │   ├── components/
│   │   │   ├── AddBus.jsx            # Operator: add new bus form
│   │   │   ├── BusList.jsx           # Operator: list of managed buses
│   │   │   └── UpdateBus.jsx         # Operator: edit bus details
│   │   ├── service/
│   │   │   └── BusService.js         # API calls: getBuses, addBus, updateBus, deleteBus
│   │   └── Slice/
│   │       └── BusSlice.js           # Redux slice: buses state + async thunks
│   │
│   ├── operator/
│   │   ├── components/
│   │   │   ├── AddOperator.jsx       # Admin: register new operator
│   │   │   ├── OperatorList.jsx      # Admin: all operators
│   │   │   └── PendingOperators.jsx  # Admin: approve/reject operator registrations
│   │   └── slice/
│   │       └── OperatorSlice.js      # Redux slice: operators state
│   │
│   ├── profile/
│   │   ├── components/
│   │   │   ├── ProfileCard.jsx       # Profile summary card
│   │   │   ├── ProfileField.jsx      # Editable field component
│   │   │   └── ProfileLayout.jsx     # Profile page layout wrapper
│   │   ├── service/
│   │   │   └── ProfileService.js     # API calls: getProfile, updateProfile
│   │   └── slice/
│   │       └── ProfileSlice.js       # Redux slice: profile state
│   │
│   ├── route/
│   │   ├── components/
│   │   │   ├── AddRoute.jsx          # Admin/Operator: add new bus route
│   │   │   ├── RouteList.jsx         # Admin/Operator: manage routes
│   │   │   └── ViewOnlyRouteList.jsx # Customer: browse available routes
│   │   ├── service/
│   │   │   └── routeService.js       # API calls: getRoutes, addRoute, deleteRoute
│   │   └── slice/
│   │       └── RouteSlice.js         # Redux slice: routes state
│   │
│   └── trip/
│       ├── components/
│       │   ├── AddTrip.jsx           # Operator: schedule a new trip
│       │   ├── RecentTrip.jsx        # Dashboard widget: recent trips
│       │   └── TripList.jsx          # Operator/Admin: full trip list
│       ├── service/
│       │   └── tripService.js        # API calls: getTrips, addTrip, updateTrip
│       └── Slice/
│           └── TripSlice.js          # Redux slice: trips state
│
├── pages/                            # Route-level page components
│   ├── Home.jsx                      # Public landing page
│   ├── About.jsx
│   ├── Contact.jsx
│   ├── Offer.jsx                     # Available offers/discounts
│   ├── SearchBus.jsx                 # Customer: search buses by route + date
│   ├── MyBookings.jsx                # Customer: booking history
│   ├── Profile.jsx                   # All roles: profile page
│   ├── AdminDashboard.jsx            # Admin: stats, charts, management panels
│   ├── OperatorDashboard.jsx         # Operator: bus/trip/route management
│   └── NotFoundPage.jsx              # 404 fallback
│
├── styles/                           # Component and page-level CSS files
│   ├── global.css
│   ├── auth.css
│   ├── Bookings.css
│   ├── DataTable.css
│   ├── NotFound.css
│   ├── OfferCard.css
│   ├── Profile.css
│   ├── ProfilePage.css
│   ├── RecentModal.css
│   ├── ReviewCard.css
│   ├── ScheduleModal.css
│   ├── SideBar.css
│   └── StatsGrid.css
│
└── utils/
    └── authUtils.js                  # Token helpers: getToken, getRoleFromToken, clearAuth
```

---

## Feature-Based Architecture

The `features/` directory follows a feature-slice pattern. Each feature owns its UI components, its Redux slice (state + async thunks), and its service layer (Axios calls). This keeps all concerns for a domain co-located and independently maintainable.

| Feature | Owns | Used By |
|---|---|---|
| `auth` | Login, signup, OTP modals; `AuthContext` | All roles |
| `booking` | Booking cards, detail view, slice, service | Customer |
| `Bus` | Bus CRUD components, slice, service | Operator, Admin |
| `operator` | Operator list, approval UI, slice | Admin |
| `profile` | Profile layout/fields, slice, service | All roles |
| `route` | Route CRUD + read-only view, slice, service | Operator, Admin, Customer |
| `trip` | Trip scheduling, listing, slice, service | Operator, Admin |

Global shared components reused across features live in `components/common/`. Page-level layout and routing live in `pages/` and `App.jsx`.

State is split between two strategies:

- **Redux Toolkit** — async server state: bookings, buses, routes, trips, operators, profile
- **Context API** — synchronous auth state: token, role, user identity

---

## Feature Flow Explanations

### 1. Authentication Flow

```
User → clicks Sign In
  → SignInModal renders inside ModalShell
  → POST /rideon/login { email, password }
    ← JWT token + role returned
  → Token stored in AuthContext + localStorage
  → Role-based redirect:
      ROLE_ADMIN     → /admin/dashboard
      ROLE_OPERATOR  → /operator/dashboard
      ROLE_CUSTOMER  → /home

User → enters mobile number for OTP verification
  → Backend triggers Twilio SMS with generated OTP
  → OtpInput.jsx collects digit-by-digit input
  → POST /rideon/verify-otp { mobile, otp }
    ← Verified; proceeds to dashboard
```

---

### 2. Route Guard Flow

```
Any navigation event → React Router checks route definition

  ProtectedRoute
    → reads AuthContext
    → no token present → redirect to /login

  AdminRoute    (extends ProtectedRoute)
    → role === 'ROLE_ADMIN'    → redirect to /admindashboard

  OperatorRoute (extends ProtectedRoute)
    → role === 'ROLE_OPERATOR' → redirect to /operatordashboard

  CustomerRoute (extends ProtectedRoute)
    → role === 'ROLE_CUSTOMER' → redirect to /home (registed user)
```

---

### 3. Bus Search & Booking Flow

```
Customer → /search-bus
  → SearchBox: fills origin, destination, date
  → TripSlice thunk: GET /rideon/trips?from=X&to=Y&date=Z
    ← List of available trips with bus details and pricing

Customer → selects a trip → BookingDetail
  → Chooses seat(s)
  → BookingSlice thunk: POST /rideon/bookings { tripId, seats, passengerId }
    ← Booking confirmation + booking ID
  → Toast notification shown
  → Redirect → /my-bookings
```

---

### 4. My Bookings Flow

```
Customer → /my-bookings (CustomerRoute)
  → BookingSlice thunk: GET /rideon/bookings?userId=X
    ← List of bookings
  → Rendered as BookingCard list

Customer → clicks a booking
  → BookingDetail: route, trip time, seat, status

Customer → cancels a booking
  → BookingSlice thunk: DELETE /rideon/bookings/{id}
  → Local state updated; Toast confirms cancellation
```

---

### 5. Operator Dashboard Flow

```
Operator → /operator/dashboard (OperatorRoute)
  → StatsGrid: trip counts, booking counts
  → RecentTrip widget: last 5 scheduled trips

Operator → Bus Management
  → BusList:   GET  /rideon/buses?operatorId=X
  → AddBus:    POST /rideon/buses { name, capacity, type }
  → UpdateBus: PUT  /rideon/buses/{id}

Operator → Route Management
  → RouteList: GET  /rideon/routes?operatorId=X
  → AddRoute:  POST /rideon/routes { from, to, distance }

Operator → Trip Scheduling
  → TripList: GET  /rideon/trips?operatorId=X
  → AddTrip:  POST /rideon/trips { busId, routeId, departureTime, fare }
```

---

### 6. Admin Dashboard Flow

```
Admin → /admin/dashboard (AdminRoute)
  → StatsGrid: total bookings, revenue, users, operators
  → Recharts: booking trends, revenue charts

Admin → Operator Management
  → OperatorList:        GET /rideon/operators
  → PendingOperators:    GET /rideon/operators?status=PENDING
      Approve: PUT /rideon/operators/{id}/approve
      Reject:  PUT /rideon/operators/{id}/reject
  → AddOperator:        POST /rideon/operators

Admin → Route & Bus oversight
  → Read/delete access to all routes and buses across all operators
```

---

### 7. Profile Flow

```
Any authenticated user → /profile (ProtectedRoute)
  → ProfileSlice thunk: GET /rideon/profile
    ← User data: name, email, mobile, role

  → ProfileLayout renders ProfileCard + ProfileField list
  → Edit field → PUT /rideon/profile { updatedFields }
    → ProfileSlice updates state on success
    → Toast confirms save
```

---

## Getting Started

### 1. Clone

```bash
git clone https://github.com/GUHANSG25/ride_on_frontend.git
cd ride_on_frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

Create a `.env` file in the project root:

```env
VITE_API_BASE_URL=http://localhost:8080
```

### 4. Start Dev Server

```bash
npm run dev
# Frontend runs at http://localhost:5173
```

### 5. Build for Production

```bash
npm run build
# Output in dist/
```

---

## Environment Configuration

| Variable | Description | Example |
|---|---|---|
| `VITE_API_BASE_URL` | Backend REST API base URL | `http://localhost:8080` |

`axiosInstance.js` reads `import.meta.env.VITE_API_BASE_URL` as the Axios base URL and attaches the JWT token from `localStorage` to every outbound request via a request interceptor.

---

## API Overview

| Method | Endpoint | Role | Description |
|---|---|---|---|
| `POST` | `/rideon/login` | Public | Authenticate, receive JWT |
| `POST` | `/rideon/register` | Public | Register new user |
| `POST` | `/rideon/verify-otp` | Public | Verify Twilio OTP |
| `GET` | `/rideon/trips` | Customer | Search trips by route + date |
| `POST` | `/rideon/bookings` | Customer | Create a booking |
| `GET` | `/rideon/bookings` | Customer | Get own bookings |
| `DELETE` | `/rideon/bookings/{id}` | Customer | Cancel a booking |
| `GET` | `/rideon/buses` | Operator | List operator's buses |
| `POST` | `/rideon/buses` | Operator | Add a bus |
| `PUT` | `/rideon/buses/{id}` | Operator | Update a bus |
| `GET` | `/rideon/routes` | Operator | List routes |
| `POST` | `/rideon/routes` | Operator | Add a route |
| `POST` | `/rideon/trips` | Operator | Schedule a trip |
| `GET` | `/rideon/operators` | Admin | List all operators |
| `PUT` | `/rideon/operators/{id}/approve` | Admin | Approve an operator |
| `PUT` | `/rideon/operators/{id}/reject` | Admin | Reject an operator |
| `GET` | `/rideon/profile` | All | Get own profile |
| `PUT` | `/rideon/profile` | All | Update own profile |

All protected endpoints require `Authorization: Bearer <token>`. Unauthenticated requests receive `401`; insufficient role access receives `403`.

---

## Security & Route Guards

| Guard Component | Condition Checked | Redirect On Fail |
|---|---|---|
| `ProtectedRoute` | Token present in `AuthContext` | `/login` |
| `AdminRoute` | Role === `ROLE_ADMIN` | `/` |
| `OperatorRoute` | Role === `ROLE_OPERATOR` | `/` |
| `CustomerRoute` | Role === `ROLE_CUSTOMER` | `/` |

The JWT token is stored in both `AuthContext` (in-memory for the session) and `localStorage` (persistence across page refreshes). The `axiosInstance` request interceptor reads the token from `localStorage` and injects it as the `Authorization` header on every request automatically.