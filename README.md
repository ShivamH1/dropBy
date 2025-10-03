# DropBy - Ride Sharing & Delivery Platform

DropBy is a comprehensive ride-sharing and delivery platform that connects users with drivers (captains) for transportation and delivery services. The application features real-time ride tracking, intelligent fare calculation, and seamless communication between users and captains.

## 📱 Features

### For Users
- **User Registration & Authentication** - Secure account creation and login
- **Ride Booking** - Book rides with automatic fare calculation
- **Real-time Tracking** - Track your ride and captain location in real-time
- **Multiple Vehicle Types** - Choose from auto, car, or motorcycle
- **Address Search** - Smart address autocomplete with Maps integration
- **Fare Estimation** - Get fare estimates before booking

### For Captains (Drivers)
- **Captain Registration** - Register with vehicle details and verification
- **Ride Management** - Accept, confirm, start, and end rides
- **Real-time Location** - Share location with users during rides
- **Earnings Tracking** - Track completed rides and earnings
- **Vehicle Management** - Manage vehicle information and status

### Core Platform Features
- **Real-time Communication** - Socket.io powered real-time updates
- **Maps Integration** - MapTiler API for geocoding and OSRM for routing
- **Secure Authentication** - JWT-based authentication with token blacklisting
- **Smart Fare Calculation** - Distance and time-based pricing with vehicle-specific rates
- **OTP Verification** - Secure ride verification with OTP system

## 🏗️ Architecture

```
dropBy/
├── backend/          # Node.js Express API Server
│   ├── src/
│   │   ├── controllers/    # API route handlers
│   │   ├── models/        # MongoDB data models
│   │   ├── routes/        # API route definitions
│   │   ├── services/      # Business logic services
│   │   ├── middlewares/   # Authentication & validation
│   │   └── socket.js      # Socket.io real-time features
│   └── postman-collections/  # API testing collections
└── frontend/         # React TypeScript SPA
    ├── src/
    │   ├── components/    # Reusable UI components
    │   ├── pages/        # Application pages
    │   ├── service/      # API calls & context
    │   └── utils/        # Utility functions
    └── public/
```

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v16 or higher)
- **MongoDB** (v5.0 or higher)
- **MapTiler API Key** (for maps services)

### Environment Variables

Create `.env` files in both backend and frontend directories:

**Backend (.env)**
```env
# Database
MONGODB_URI=mongodb://localhost:27017/dropby

# JWT Authentication
JWT_SECRET=your_jwt_secret_key_here

# Maps Service
MAPTILER_API_KEY=your_maptiler_api_key_here

# Server Configuration
PORT=8080
NODE_ENV=development
```

**Frontend (.env)**
```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8080
```

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   cd dropBy
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   npm start
   ```
   Server will start on http://localhost:8080

3. **Frontend Setup** (in a new terminal)
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   App will start on http://localhost:5173

## 🛠️ Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with bcrypt password hashing
- **Real-time**: Socket.io for WebSocket connections
- **Maps**: MapTiler API (geocoding) + OSRM (routing)
- **Validation**: Express-validator
- **Additional**: CORS, Cookie-parser, Crypto

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Library**: shadcn/ui components
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Real-time**: Socket.io-client
- **Animations**: GSAP
- **Form Handling**: React Hook Form with Zod validation

## 📚 API Documentation

### Base URL
```
http://localhost:8080
```

### Authentication
All protected routes require JWT token in either:
- **Header**: `Authorization: Bearer <token>`
- **Cookie**: `token=<jwt_token>`

### API Endpoints

#### User Authentication
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login
- `GET /api/users/profile` - Get user profile
- `POST /api/users/logout` - User logout

#### Captain Authentication
- `POST /api/captains/register` - Captain registration with vehicle
- `POST /api/captains/login` - Captain login
- `GET /api/captains/profile` - Get captain profile
- `POST /api/captains/logout` - Captain logout

#### Maps Services
- `POST /api/maps/geocode` - Convert address to coordinates
- `POST /api/maps/reverse-geocode` - Convert coordinates to address
- `POST /api/maps/distance` - Calculate distance and time between addresses
- `POST /api/maps/suggestions` - Get address autocomplete suggestions

#### Ride Management
- `POST /api/rides/create` - Create new ride request
- `POST /api/rides/get-fare` - Get fare estimates for all vehicle types
- `POST /api/rides/confirm` - Captain confirms ride (requires captain auth)
- `POST /api/rides/start` - Start ride with OTP verification (requires captain auth)
- `POST /api/rides/end` - End completed ride (requires captain auth)

### Real-time Events (Socket.io)

#### Client → Server Events
- `join` - Join room with user/captain ID
- `update-location-captain` - Update captain's real-time location

#### Server → Client Events
- `new-ride` - New ride request for nearby captains
- `ride-confirmed` - Ride confirmed by captain
- `ride-started` - Ride started by captain
- `ride-ended` - Ride completed
- `error` - Error messages

## 💰 Pricing Structure

### Vehicle Types & Rates

| Vehicle Type | Base Fare | Per KM | Per Minute | Capacity |
|-------------|-----------|---------|------------|----------|
| **Auto** | ₹30 | ₹10 | ₹2 | 1-6 passengers |
| **Car** | ₹50 | ₹15 | ₹3 | 1-8 passengers |
| **Moto** | ₹20 | ₹8 | ₹1.5 | 1-2 passengers |

**Fare Calculation**: `Base Fare + (Distance × Per KM Rate) + (Duration × Per Minute Rate)`

## 🔧 Development

### Project Structure Details

**Backend Services**:
- `user.service.js` - User management and authentication
- `captain.service.js` - Captain management and authentication  
- `maps.service.js` - Location services and route calculation
- `ride.service.js` - Ride lifecycle management

**Frontend Pages**:
- `Landing.tsx` - Marketing landing page
- `Home.tsx` - User ride booking interface
- `CaptainHome.tsx` - Captain dashboard for managing rides
- `Riding.tsx` - User ride tracking page
- `CaptainRiding.tsx` - Captain ride management page

### Available Scripts

**Backend**
```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
```

**Frontend**
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

## 📋 Testing

### Postman Collections
Pre-configured Postman collections are available in `backend/postman-collections/`:

- `User_APIs.postman_collection.json` - User authentication APIs
- `Captain_APIs.postman_collection.json` - Captain authentication APIs
- `Maps_APIs.postman_collection.json` - Maps and location services
- `Ride_APIs.postman_collection.json` - Ride management APIs
- `DropBy_Complete_APIs.postman_collection.json` - Complete API collection

Import these collections into Postman for easy API testing.

## 🚦 Getting Started Guide

1. **Setup Environment**: Configure MongoDB and get MapTiler API key
2. **Start Backend**: Install dependencies and start server on port 8080
3. **Start Frontend**: Install dependencies and start development server
4. **Test APIs**: Import Postman collections and test endpoints
5. **Create Accounts**: Register users and captains through the UI
6. **Book Rides**: Use the user interface to book and track rides

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions:
- Check the API documentation in `backend/README.md`
- Review Postman collections for API examples
- Check the frontend documentation in `frontend/README.md`

---

**DropBy** - Your Ride, Your Way 🚗✈️🏍️
