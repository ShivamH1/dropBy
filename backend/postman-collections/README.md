# DropBy API Postman Collections

This directory contains Postman collections for testing all the APIs in the DropBy application.

## Collections Available

### 1. Individual Collections
- **`User_APIs.postman_collection.json`** - User authentication and profile APIs
- **`Captain_APIs.postman_collection.json`** - Captain authentication and profile APIs  
- **`Maps_APIs.postman_collection.json`** - Maps and location services APIs
- **`Ride_APIs.postman_collection.json`** - Ride booking and management APIs

### 2. Complete Collection
- **`DropBy_Complete_APIs.postman_collection.json`** - All APIs in one organized collection

## Setup Instructions

### Prerequisites
1. **Postman** installed on your system
2. **Backend server** running on `http://localhost:8080`

### Import Collections
1. Open Postman
2. Click **Import** button
3. Select the collection file(s) you want to import
4. The collection will be added to your Postman workspace

### Environment Variables
Each collection includes these variables:
- `baseUrl`: Server URL (default: `http://localhost:8080`)
- `userToken`: Automatically set after user login/register
- `captainToken`: Automatically set after captain login/register

## API Endpoints Overview

### User APIs (`/api/users`)
- `POST /register` - Register new user
- `POST /login` - User login
- `GET /profile` - Get user profile (requires auth)
- `POST /logout` - User logout (requires auth)

### Captain APIs (`/api/captains`)
- `POST /register` - Register new captain with vehicle
- `POST /login` - Captain login
- `GET /profile` - Get captain profile (requires auth)
- `POST /logout` - Captain logout (requires auth)

### Maps APIs (`/api/maps`)
- `POST /geocode` - Convert address to coordinates using MapTiler API (requires user auth)
- `POST /reverse-geocode` - Convert coordinates to address using MapTiler API (requires user auth)
- `POST /distance` - Get real driving distance and time using OSRM routing (requires user auth)
- `POST /suggestions` - Get address suggestions/autocomplete using MapTiler API (requires user auth)

### Ride APIs (`/api/rides`)
- `POST /create` - Create new ride request with fare calculation (requires user auth)
- `POST /get-fare` - Get fare estimates for all vehicle types (requires user auth)
- `POST /confirm` - Captain confirms ride acceptance (requires captain auth)
- `POST /start` - Captain starts ride with OTP verification (requires captain auth)
- `POST /end` - Captain completes ride (requires captain auth)

## Usage Guide

### 1. Start the Server
Make sure your backend server is running:
```bash
cd backend
npm start
# Server should be running on http://localhost:8080
```

### 2. Test Health Check
First, run the "Health Check" request to ensure the server is responding.

### 3. Authentication Flow

#### For Users:
1. **Register**: Use "User Register" to create a new account
   - The token will be automatically saved to `userToken` variable
2. **Login**: Use "User Login" for existing users
   - The token will be automatically saved to `userToken` variable
3. **Profile**: Use "Get User Profile" to fetch user details
4. **Logout**: Use "User Logout" to invalidate the token

#### For Captains:
1. **Register**: Use "Captain Register" with vehicle details
   - Available vehicle types: `car`, `motorcycle`, `auto rickshaw`
   - The token will be automatically saved to `captainToken` variable
2. **Login**: Use "Captain Login" for existing captains
3. **Profile**: Use "Get Captain Profile" to fetch captain and vehicle details
4. **Logout**: Use "Captain Logout" to invalidate the token

### 4. Maps APIs
**Note**: Maps APIs require user authentication (userToken)

1. First login as a user to get the `userToken`
2. **Geocode**: Convert addresses to coordinates using MapTiler API
3. **Reverse Geocode**: Convert coordinates to addresses using MapTiler API
4. **Distance**: Get real driving distance and time using OSRM routing (not estimates!)
5. **Suggestions**: Get address autocomplete suggestions as user types

### 5. Ride APIs
**Note**: Ride APIs require user authentication (userToken)

1. First login as a user to get the `userToken`
2. **Create Ride**: Book a new ride with automatic fare calculation
   - Choose from vehicle types: `auto`, `car`, `moto`
   - Automatically calculates fare based on distance and time
   - Generates secure OTP for ride verification
3. **Get Fare**: Get fare estimates for all vehicle types before booking

## Sample Data

### User Registration
```json
{
  "fullName": {
    "firstName": "John",
    "lastName": "Doe"
  },
  "email": "john.doe@example.com",
  "password": "password123"
}
```

### Captain Registration
```json
{
  "fullName": {
    "firstName": "Jane",
    "lastName": "Smith"
  },
  "email": "jane.smith@example.com",
  "password": "password123",
  "vehicle": {
    "color": "Blue",
    "plateNumber": "ABC123",
    "capacity": 4,
    "vehicleType": "car"
  }
}
```

### Vehicle Types
- **car**: capacity 1-8
- **motorcycle**: capacity 1-2
- **auto rickshaw**: capacity 1-6

### Maps API Sample Data

#### Geocoding Request
```json
{
  "address": "Times Square, New York, NY, USA"
}
```

#### Reverse Geocoding Request
```json
{
  "latitude": 40.7580,
  "longitude": -73.9855
}
```

#### Distance Calculation Request
```json
{
  "origin": "Times Square, New York, NY, USA",
  "destination": "Central Park, New York, NY, USA"
}
```

#### Address Suggestions Request
```json
{
  "query": "New Y",
  "limit": 5,
  "country": "US",
  "language": "en"
}
```

### Ride API Sample Data

#### Create Ride Request
```json
{
  "pickup": "Times Square, New York, NY",
  "destination": "Central Park, New York, NY",
  "vehicleType": "car"
}
```

#### Get Fare Request
```json
{
  "pickup": "Times Square, New York, NY",
  "destination": "Central Park, New York, NY"
}
```

#### Vehicle Types & Pricing
- **auto**: Base ₹30, ₹10/km, ₹2/min (most economical)
- **car**: Base ₹50, ₹15/km, ₹3/min (comfortable)
- **moto**: Base ₹20, ₹8/km, ₹1.5/min (fastest for single passenger)

### Ride API Features
- **Smart Fare Calculation**: Uses real distance and time for accurate pricing
- **Multiple Vehicle Options**: Auto, car, and motorcycle with different rates
- **Secure OTP Generation**: 4-digit OTP for ride verification
- **Real-time Routing**: Integrates with Maps API for accurate route calculation
- **Status Management**: Tracks ride status from pending to completion

### Maps API Features
- **Real Routing**: Uses OSRM for actual road-based routing (not straight-line distance)
- **Accurate Times**: Provides real driving time estimates based on road conditions
- **Multiple Formats**: Distance in meters, kilometers, and miles
- **Comprehensive Duration**: Time in seconds, minutes, hours, and formatted strings
- **Address Autocomplete**: Smart suggestions as users type (like Google Maps)
- **Smart Filtering**: Country, proximity, and bounding box filtering for suggestions
- **Global Coverage**: Works worldwide with OpenStreetMap data
- **No API Key Required**: OSRM routing is completely free

## Troubleshooting

### Common Issues

1. **401 Unauthorized**: 
   - Make sure you're logged in and the token is set
   - Check if the token has expired

2. **404 Not Found**:
   - Verify the server is running on the correct port
   - Check the `baseUrl` variable in collection settings

3. **Validation Errors**:
   - Check request body format matches the expected schema
   - Ensure required fields are provided

4. **Maps API Specific Issues**:
   - **MapTiler API Key**: Ensure `MAPTILER_API_KEY` is set in backend `.env` file
   - **Address Not Found**: Try more specific addresses or check spelling
   - **Invalid Coordinates**: Latitude must be -90 to 90, longitude -180 to 180
   - **No Route Found**: OSRM may not find routes for very remote locations
   - **Routing Timeout**: Long-distance routes may take longer to calculate

### Server Not Running
If you get connection errors:
```bash
# Navigate to backend directory
cd backend

# Install dependencies (if not done)
npm install

# Start the server
npm start
```

## Collection Features

- **Automatic Token Management**: Login/Register requests automatically save tokens
- **Pre-configured Examples**: Ready-to-use request bodies with sample data
- **Organized Structure**: APIs grouped by functionality
- **Environment Variables**: Easy server URL and token management
- **Test Scripts**: Automatic token extraction and cleanup on logout

## Notes

- All collections are configured for `http://localhost:8080`
- Tokens are automatically managed through test scripts
- Maps APIs require user authentication (not captain authentication)
- Ride APIs require user authentication (not captain authentication)
- Vehicle types are validated on captain registration and ride creation
- All password fields should be at least 6 characters
- Email validation is enforced on registration and login

### Maps API Requirements
- **MapTiler API Key**: Required for geocoding (address ↔ coordinates conversion)
- **OSRM Service**: Used automatically for routing (no API key needed)
- **User Authentication**: All Maps endpoints require valid user token
- **Internet Connection**: Required for both MapTiler and OSRM API calls
