# DropBy Frontend

A modern, responsive React TypeScript application for the DropBy ride-sharing platform. Built with Vite, shadcn/ui, and Tailwind CSS for a seamless user experience.

## 🚀 Overview

DropBy Frontend provides intuitive interfaces for both riders and drivers (captains) to interact with the ride-sharing platform. The application features real-time updates, beautiful UI components, and smooth animations.

## ✨ Features

### For Users (Riders)
- **Landing Page** - Marketing page with feature highlights
- **Authentication** - Secure login and registration
- **Ride Booking** - Book rides with address autocomplete
- **Real-time Tracking** - Track rides and captain location
- **Fare Calculator** - Get estimates before booking
- **Ride History** - View past and current rides

### For Captains (Drivers)  
- **Captain Dashboard** - Manage incoming ride requests
- **Ride Management** - Accept, start, and complete rides
- **Location Sharing** - Real-time location updates
- **Profile Management** - Update vehicle and personal details
- **Earnings Tracking** - Track completed rides

### UI/UX Features
- **Responsive Design** - Works seamlessly on desktop and mobile
- **Dark/Light Theme** - Adaptive theme support
- **Smooth Animations** - GSAP-powered interactions
- **Loading States** - Elegant loading and skeleton screens
- **Toast Notifications** - User feedback for all actions
- **Form Validation** - Real-time validation with error messages

## 🛠️ Technology Stack

### Core
- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type safety and better development experience
- **Vite** - Fast build tool and development server

### UI & Styling
- **shadcn/ui** - High-quality, accessible component library
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Unstyled, accessible UI primitives
- **Lucide React** - Beautiful SVG icons
- **GSAP** - Professional animation library

### State Management & Data
- **React Context API** - Global state management
- **TanStack Query** - Server state management and caching
- **React Hook Form** - Performant form handling
- **Zod** - Schema validation

### Routing & Navigation
- **React Router DOM** - Client-side routing
- **Protected Routes** - Authentication-based route protection

### Real-time & HTTP
- **Socket.io Client** - Real-time WebSocket communication
- **Axios** - HTTP client for API requests

### Development & Build
- **ESLint** - Code linting and quality
- **TypeScript ESLint** - TypeScript-specific linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

## 🏗️ Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # shadcn/ui components
│   │   ├── Header.tsx      # Navigation header
│   │   ├── RidePopUp.tsx   # Ride request modal
│   │   ├── VehiclePanel.tsx # Vehicle selection
│   │   └── ...             # Other components
│   ├── pages/              # Page components
│   │   ├── Landing.tsx     # Marketing landing page
│   │   ├── Home.tsx        # User ride booking page
│   │   ├── CaptainHome.tsx # Captain dashboard
│   │   ├── UserLogin.tsx   # User authentication
│   │   ├── CaptainLogin.tsx # Captain authentication
│   │   ├── Riding.tsx      # User ride tracking
│   │   └── CaptainRiding.tsx # Captain ride management
│   ├── service/            # API and context providers
│   │   ├── API/           # API service functions
│   │   │   ├── userAPIs.tsx
│   │   │   ├── captainAPIs.tsx
│   │   │   ├── mapsAPIs.tsx
│   │   │   └── rideAPIs.tsx
│   │   └── context/       # React Context providers
│   │       ├── UserContext.jsx      # User state management
│   │       ├── CaptainContext.jsx   # Captain state management
│   │       └── SocketClientContext.jsx # Socket.io connection
│   ├── hooks/             # Custom React hooks
│   │   ├── use-mobile.tsx # Mobile device detection
│   │   └── use-toast.ts   # Toast notification hook
│   ├── lib/               # Utility libraries
│   │   └── utils.ts       # Common utility functions
│   ├── utils/             # Helper functions
│   │   └── cookieUtils.ts # Cookie management
│   ├── assets/            # Static assets
│   │   ├── hero-image.jpg
│   │   └── features-image.jpg
│   ├── App.tsx            # Main application component
│   ├── main.tsx           # Application entry point
│   └── index.css          # Global styles
├── public/                # Static files
├── components.json        # shadcn/ui configuration
├── tailwind.config.ts     # Tailwind CSS configuration
├── vite.config.ts         # Vite configuration
└── tsconfig.json          # TypeScript configuration
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager
- Running backend server on http://localhost:8080

### Environment Variables
Create a `.env` file in the frontend root:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8080
```

### Installation & Development

1. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Start development server**
   ```bash
npm run dev
   ```
   Application will be available at http://localhost:5173

3. **Build for production**
   ```bash
   npm run build
   ```

4. **Preview production build**
   ```bash
   npm run preview
   ```

5. **Lint code**
   ```bash
   npm run lint
   ```

## 📱 Application Flow

### User Journey
1. **Landing Page** → Marketing introduction to DropBy
2. **Registration/Login** → Create account or sign in
3. **Home Page** → Main ride booking interface
4. **Ride Booking** → Enter pickup/destination, select vehicle
5. **Waiting** → Wait for captain to accept ride
6. **Riding** → Track real-time ride progress
7. **Completion** → Ride summary and rating

### Captain Journey
1. **Registration/Login** → Create captain account with vehicle details
2. **Captain Home** → Dashboard showing available ride requests
3. **Accept Ride** → Review and accept ride requests
4. **Captain Riding** → Navigate to pickup, start ride, complete journey
5. **Earnings** → Track completed rides and earnings

## 🔐 Authentication & State Management

### User Context
```typescript
const userContext = {
  user: UserData | null,
  isLoading: boolean,
  login: (userData) => void,
  logout: () => void
}
```

### Captain Context
```typescript
const captainContext = {
  captain: CaptainData | null,
  isLoading: boolean,
  login: (captainData) => void,
  logout: () => void
}
```

### Socket Context
```typescript
const socketContext = {
  socket: Socket | null,
  sendMessage: (event, data) => void,
  isConnected: boolean
}
```

## 🔄 Real-time Features

The application uses Socket.io for real-time communication:

### User Events
- **Ride Updates** - Real-time status changes
- **Captain Location** - Live tracking during rides
- **Ride Acceptance** - Instant notification when captain accepts

### Captain Events  
- **New Ride Requests** - Incoming ride notifications
- **Location Updates** - Share location with users
- **Ride Status Changes** - Real-time ride progression

## 🎨 UI Components

### Core Components
- **Header** - Navigation with authentication status
- **VehiclePanel** - Vehicle type selection with pricing
- **RidePopUp** - Ride request confirmation modal
- **LocationSearchPanel** - Address search with autocomplete
- **ConfirmRidePopUp** - Captain ride acceptance interface

### shadcn/ui Components
- **Button, Card, Dialog** - Interactive elements
- **Form, Input, Select** - Form controls with validation
- **Toast, Alert** - User feedback components
- **Skeleton, Spinner** - Loading states
- **Accordion, Tabs** - Layout components

## 🔧 API Integration

### Service Layer
All API calls are organized in the `service/API/` directory:

- **userAPIs.tsx** - User authentication and profile
- **captainAPIs.tsx** - Captain authentication and profile  
- **mapsAPIs.tsx** - Location services and geocoding
- **rideAPIs.tsx** - Ride creation and management

### Example API Usage
```typescript
import { createRide } from '@/service/API/rideAPIs';

const handleRideCreation = async (rideData) => {
  try {
    const response = await createRide(rideData);
    toast.success('Ride created successfully!');
  } catch (error) {
    toast.error('Failed to create ride');
  }
};
```

## 🚦 Route Protection

### Protected Routes
- **UserProtectedWrapper** - Protects user-only pages
- **CaptainProtectedWrapper** - Protects captain-only pages

### Route Structure
```typescript
<Routes>
  <Route path="/" element={<Landing />} />
  <Route path="/home" element={
    <UserProtectedWrapper>
      <Home />
    </UserProtectedWrapper>
  } />
  <Route path="/captain-home" element={
    <CaptainProtectedWrapper>
      <CaptainHome />
    </CaptainProtectedWrapper>
  } />
</Routes>
```

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: > 1024px

### Mobile-First Approach
All components are designed mobile-first with progressive enhancement for larger screens.

## 🧪 Development Guidelines

### Code Organization
- **Components** - Reusable UI components in PascalCase
- **Pages** - Route components representing full pages
- **Hooks** - Custom hooks prefixed with "use"
- **Utils** - Pure functions for common operations

### Styling Conventions  
- **Tailwind Classes** - Utility-first styling approach
- **Component Variants** - Using class-variance-authority for component variants
- **Responsive Design** - Mobile-first responsive utilities

### TypeScript Best Practices
- **Strict Mode** - Full TypeScript strict mode enabled
- **Interface Definitions** - Clear type definitions for all data structures
- **Generic Components** - Reusable components with proper typing

## 🔍 Debugging & Development Tools

### Development Features
- **Hot Module Replacement** - Instant updates during development
- **Source Maps** - Full source map support for debugging
- **ESLint Integration** - Real-time code quality feedback
- **TypeScript Checking** - Compile-time error detection

### Browser DevTools
- **React DevTools** - Component inspection and state debugging
- **Socket.io DevTools** - Real-time event monitoring
- **Network Tab** - API request/response monitoring

## 📦 Build & Deployment

### Production Build
```bash
npm run build
```
Generates optimized production files in the `dist/` directory.

### Build Features
- **Code Splitting** - Automatic route-based code splitting
- **Tree Shaking** - Dead code elimination
- **Asset Optimization** - Image and asset optimization
- **Gzip Compression** - Compressed output files

## 🤝 Contributing

1. Follow the existing code structure and naming conventions
2. Use TypeScript for all new components
3. Implement responsive design for all UI components
4. Add proper error handling and loading states
5. Test components on multiple screen sizes
6. Update documentation for new features

## 📄 License

This project is licensed under the ISC License.

---

**DropBy Frontend** - Modern, responsive, and user-friendly ride-sharing interface 🚗📱
