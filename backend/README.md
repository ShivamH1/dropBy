# DropBy Backend API Documentation

A comprehensive ride-sharing and delivery platform backend built with Node.js, Express, MongoDB, and Socket.io.

## 🚀 Server Information

- **Base URL**: `http://localhost:8080`
- **Protocol**: HTTP/HTTPS with WebSocket support for real-time features
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT tokens with blacklisting support

## 🔧 Setup & Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v5.0 or higher) 
- MapTiler API Key (for maps services)

### Environment Variables
Create a `.env` file in the backend root:

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

### Installation
```bash
cd backend
npm install
npm start
```

Server will start on `http://localhost:8080`

## 🏗️ Architecture

```
backend/
├── src/
│   ├── controllers/       # Request handlers
│   │   ├── user.controller.js
│   │   ├── captain.controller.js  
│   │   ├── maps.controller.js
│   │   └── ride.controller.js
│   ├── models/           # MongoDB schemas
│   │   ├── userModel.js
│   │   ├── captainsModel.js
│   │   ├── rideModel.js
│   │   └── blackListToken.model.js
│   ├── routes/           # API endpoints
│   │   ├── user.routes.js
│   │   ├── captain.routes.js
│   │   ├── maps.routes.js
│   │   └── ride.routes.js
│   ├── services/         # Business logic
│   │   ├── user.service.js
│   │   ├── captain.service.js
│   │   ├── maps.service.js
│   │   └── ride.service.js
│   ├── middlewares/      # Auth & validation
│   │   └── auth.middleware.js
│   ├── db/              # Database connection
│   │   └── db.js
│   ├── socket.js        # Real-time features
│   ├── index.js         # Express app setup
│   └── server.js        # Server startup
└── postman-collections/ # API testing
```

## 🔐 Authentication

All protected routes require JWT token via:
- **Header**: `Authorization: Bearer <token>`
- **Cookie**: `token=<jwt_token>`

### Token Management
- **Expiration**: 24 hours
- **Blacklisting**: Logout invalidates tokens
- **Middleware**: `authUser` for users, `authCaptain` for captains

## 📋 API Endpoints

### Health Check
- `GET /health` - Server status check

---

## 👤 User Endpoints

### Register User

Register a new user in the system.

**URL**: `/api/users/register`  
**Method**: `POST`  
**Authentication**: Not required

#### Request Body

| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| fullName.firstName | String | User's first name | Required, min length: 3 |
| fullName.lastName | String | User's last name | Required, min length: 3 |
| email | String | User's email address | Required, valid email format |
| password | String | User's password | Required, min length: 6 |

**Example Request**:
```json
{
  "fullName": {
    "firstName": "John", 
    "lastName": "Doe"
  },
  "email": "john.doe@example.com",
  "password": "securepassword123"
}
```

#### Responses

**Status Code: 201 Created**
```json
{
  "token": "jwt_authentication_token",
  "user": {
    "fullName": {
      "firstName": "John",
      "lastName": "Doe"
    },
    "email": "john.doe@example.com",
    "_id": "user_id",
    "socketId": null,
    "__v": 0
  }
}
```

**Status Code: 400 Bad Request**
```json
{
  "errors": [
    {
      "msg": "First name is required",
      "param": "fullName.firstName", 
      "location": "body"
    }
  ]
}
```

### Login User

Authenticate a user and get a token.

**URL**: `/api/users/login`

**Method**: `POST`

**Authentication**: Not required

#### Request Body

| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| email | String | User's email address | Required, valid email format |
| password | String | User's password | Required |

**Example Request**:
```json
{
  "email": "john.doe@example.com",
  "password": "securepassword123"
}
```

#### Responses

**Status Code: 200 OK**

User successfully authenticated.

```json
{
  "token": "jwt_authentication_token",
  "user": {
    "fullName": {
      "firstName": "John",
      "lastName": "Doe"
    },
    "email": "john.doe@example.com",
    "_id": "user_id",
    "__v": 0
  }
}
```

**Status Code: 401 Unauthorized**

Invalid credentials or authentication failed.

```json
{
  "error": "Invalid email or password"
}
```

#### Implementation Details

1. The endpoint validates the request body using express-validator
2. Password is compared with the stored hash using bcrypt
3. JWT authentication token is generated upon successful login
4. Password field is excluded from the response

#### Security Considerations

- Passwords are never returned in API responses
- Generic error messages are used to prevent user enumeration
- JWT tokens expire after 24 hours
- Password field is never returned in API responses

### Get User Profile

Get the authenticated user's profile information.

**URL**: `/api/users/profile`

**Method**: `GET`

**Authentication**: Required (Bearer Token)

#### Headers

| Header | Type | Description | Required |
|--------|------|-------------|----------|
| Authorization | String | Bearer token for authentication | Yes |

**Example Request**:
```bash
GET /api/users/profile
Authorization: Bearer jwt_authentication_token
```

#### Responses

**Status Code: 200 OK**

User profile retrieved successfully.

```json
{
  "user": {
    "fullName": {
      "firstName": "John",
      "lastName": "Doe"
    },
    "email": "john.doe@example.com",
    "_id": "user_id",
    "__v": 0,
    "socketId": null
  },
  "message": "Profile fetched successfully"
}
```

**Status Code: 401 Unauthorized**

Invalid or missing authentication token.

```json
{
  "error": "Unauthorized"
}
```

OR

```json
{
  "error": "User not found"
}
```

#### Implementation Details

1. Requires valid JWT token in Authorization header or cookies
2. Token is verified against JWT_SECRET
3. User is fetched from database using token payload
4. Password field is never included in response

### Logout User

Logout the authenticated user and invalidate their token.

**URL**: `/api/users/logout`

**Method**: `POST`

**Authentication**: Required (Bearer Token)

#### Headers

| Header | Type | Description | Required |
|--------|------|-------------|----------|
| Authorization | String | Bearer token for authentication | Yes |

**Example Request**:
```bash
POST /api/users/logout
Authorization: Bearer jwt_authentication_token
```

#### Responses

**Status Code: 200 OK**

User successfully logged out.

```json
{
  "message": "Logout successful"
}
```

**Status Code: 401 Unauthorized**

Invalid or missing authentication token.

```json
{
  "error": "Unauthorized"
}
```

#### Implementation Details

1. Clears authentication cookie from browser
2. Adds token to blacklist to prevent reuse
3. Blacklisted tokens automatically expire after 24 hours
4. Middleware checks blacklist on subsequent requests

## Security Considerations

- **Password Security**: All passwords are hashed using bcrypt with salt rounds
- **JWT Security**: Tokens expire after 24 hours to limit exposure window
- **Token Blacklisting**: Logout invalidates tokens by adding them to a blacklist
- **Input Validation**: All endpoints use express-validator for request validation
- **Error Handling**: Generic error messages prevent user enumeration attacks
- **CORS**: Configured to accept requests from authorized origins only
- **Data Sanitization**: User input is validated and sanitized before processing

## Authentication Flow

### User Authentication Flow
1. **Registration**: User creates account → receives user object (no token)
2. **Login**: User authenticates → receives JWT token and user object
3. **Protected Routes**: Include `Authorization: Bearer <token>` header
4. **Profile Access**: Use token to access user profile information
5. **Logout**: Invalidate token and clear session data

### Captain Authentication Flow
1. **Registration**: Captain creates account → receives captain object with JWT token
2. **Login**: Captain authenticates → receives JWT token and captain object
3. **Protected Routes**: Include `Authorization: Bearer <token>` header
4. **Profile Access**: Use token to access captain profile information
5. **Logout**: Invalidate token and clear session data

### Key Differences
- **User registration**: No token provided (requires separate login)
- **Captain registration**: JWT token provided immediately
- **Middleware**: Users use `authUser`, Captains use `authCaptain`
- **Token payload**: Same structure (`{ id: user/captain_id, iat, exp }`)
- **Blacklisting**: Both user and captain tokens use same blacklist system

## Captain Endpoints

### Register Captain

Register a new captain (driver) in the system.

**URL**: `/api/captains/register`

**Method**: `POST`

**Authentication**: Not required

#### Request Body

| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| fullName.firstName | String | Captain's first name | Required, min length: 3 |
| fullName.lastName | String | Captain's last name | Required, min length: 3 |
| email | String | Captain's email address | Required, valid email format |
| password | String | Captain's password | Required, min length: 6 |
| vehicle.color | String | Vehicle color | Required |
| vehicle.plateNumber | String | Vehicle plate number | Required |
| vehicle.capacity | Number | Vehicle passenger capacity | Required, minimum: 1 |
| vehicle.vehicleType | String | Type of vehicle | Required, enum: ["car", "motorcycle", "auto rickshaw"] |

**Example Request**:
```json
{
  "fullName": {
    "firstName": "Ramesh",
    "lastName": "Loadha"
  },
  "email": "rameshlodha@gmail.com",
  "password": "231231",
  "vehicle": {
    "color": "blue",
    "plateNumber": "MH32 QLW 3321",
    "capacity": 3,
    "vehicleType": "car"
  }
}
```

#### Responses

**Status Code: 201 Created**

Captain successfully registered.

```json
{
  "captain": {
    "fullName": {
      "firstName": "Ramesh",
      "lastName": "Loadha"
    },
    "email": "rameshlodha@gmail.com",
    "_id": "captain_id",
    "vehicle": {
      "color": "blue",
      "plateNumber": "MH32 QLW 3321",
      "capacity": 3,
      "vehicleType": "car"
    },
    "status": "inactive",
    "socketId": null,
    "__v": 0
  },
  "token": "jwt_authentication_token",
  "message": "Registration successful"
}
```

**Status Code: 400 Bad Request**

Invalid request body, validation error, or captain already exists.

```json
{
  "errors": [
    {
      "msg": "First name is required",
      "param": "fullName.firstName",
      "location": "body"
    }
  ]
}
```

OR

```json
{
  "error": "Captain already exists"
}
```

OR

```json
{
  "error": "All required fields must be provided"
}
```

#### Implementation Details

1. The endpoint validates the request body using express-validator
2. Checks if captain with the same email already exists
3. Password is hashed using bcrypt before storage
4. JWT authentication token is generated upon successful registration
5. Captain status defaults to "inactive" until activated
6. Vehicle information is stored as nested object

#### Security Considerations

- Passwords are hashed using bcrypt with salt rounds
- Email uniqueness is enforced at database level
- Password field is never returned in API responses
- JWT tokens expire after 24 hours

### Login Captain

Authenticate a captain and get a token.

**URL**: `/api/captains/login`

**Method**: `POST`

**Authentication**: Not required

#### Request Body

| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| email | String | Captain's email address | Required, valid email format |
| password | String | Captain's password | Required |

**Example Request**:
```json
{
  "email": "rameshlodha@gmail.com",
  "password": "231231"
}
```

#### Responses

**Status Code: 200 OK**

Captain successfully authenticated.

```json
{
  "token": "jwt_authentication_token",
  "captain": {
    "fullName": {
      "firstName": "Ramesh",
      "lastName": "Loadha"
    },
    "email": "rameshlodha@gmail.com",
    "_id": "captain_id",
    "vehicle": {
      "color": "blue",
      "plateNumber": "MH32 QLW 3321",
      "capacity": 3,
      "vehicleType": "car"
    },
    "status": "inactive",
    "socketId": null,
    "__v": 0
  },
  "message": "Login successful"
}
```

**Status Code: 401 Unauthorized**

Invalid credentials or authentication failed.

```json
{
  "error": "Invalid email!"
}
```

OR

```json
{
  "error": "Invalid password!"
}
```

#### Implementation Details

1. The endpoint validates the request body using express-validator
2. Password is compared with the stored hash using bcrypt
3. JWT authentication token is generated upon successful login
4. Password field is excluded from the response

### Get Captain Profile

Get the authenticated captain's profile information.

**URL**: `/api/captains/profile`

**Method**: `GET`

**Authentication**: Required (Bearer Token)

#### Headers

| Header | Type | Description | Required |
|--------|------|-------------|----------|
| Authorization | String | Bearer token for authentication | Yes |

**Example Request**:
```bash
GET /api/captains/profile
Authorization: Bearer jwt_authentication_token
```

#### Responses

**Status Code: 200 OK**

Captain profile retrieved successfully.

```json
{
  "captain": {
    "fullName": {
      "firstName": "Ramesh",
      "lastName": "Loadha"
    },
    "email": "rameshlodha@gmail.com",
    "_id": "captain_id",
    "vehicle": {
      "color": "blue",
      "plateNumber": "MH32 QLW 3321",
      "capacity": 3,
      "vehicleType": "car"
    },
    "status": "inactive",
    "socketId": null,
    "__v": 0
  },
  "message": "Profile fetched successfully"
}
```

**Status Code: 401 Unauthorized**

Invalid or missing authentication token.

```json
{
  "error": "Unauthorized"
}
```

OR

```json
{
  "error": "Captain not found"
}
```

#### Implementation Details

1. Requires valid JWT token in Authorization header or cookies
2. Token is verified against JWT_SECRET
3. Captain is fetched from database using token payload
4. Uses dedicated `authCaptain` middleware for captain authentication

### Logout Captain

Logout the authenticated captain and invalidate their token.

**URL**: `/api/captains/logout`

**Method**: `POST`

**Authentication**: Required (Bearer Token)

#### Headers

| Header | Type | Description | Required |
|--------|------|-------------|----------|
| Authorization | String | Bearer token for authentication | Yes |

**Example Request**:
```bash
POST /api/captains/logout
Authorization: Bearer jwt_authentication_token
```

#### Responses

**Status Code: 200 OK**

Captain successfully logged out.

```json
{
  "message": "Logout successful"
}
```

**Status Code: 401 Unauthorized**

Invalid or missing authentication token.

```json
{
  "error": "Unauthorized"
}
```

#### Implementation Details

1. Clears authentication cookie from browser
2. Adds token to blacklist to prevent reuse
3. Uses captain service for logout logic
4. Middleware checks blacklist on subsequent requests

## Maps Endpoints

### Geocode Address

Convert an address to coordinates (latitude and longitude).

**URL**: `/api/maps/geocode`

**Method**: `POST`

**Authentication**: Required (Bearer Token)

#### Headers

| Header | Type | Description | Required |
|--------|------|-------------|----------|
| Authorization | String | Bearer token for authentication | Yes |

#### Request Body

| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| address | String | Address to convert to coordinates | Required |

**Example Request**:
```json
{
  "address": "Times Square, New York, NY"
}
```

#### Responses

**Status Code: 200 OK**

Address successfully geocoded.

```json
{
  "success": true,
  "data": {
    "latitude": 40.7580,
    "longitude": -73.9855,
    "formattedAddress": "Times Square, New York, NY, USA",
    "confidence": 0.9,
    "addressComponents": {
      "country": "United States",
      "region": "New York",
      "place": "New York",
      "postcode": "10036"
    }
  },
  "message": "Address geocoded successfully"
}
```

**Status Code: 400 Bad Request**

Invalid request body or address not found.

```json
{
  "success": false,
  "message": "Address is required"
}
```

OR

```json
{
  "success": false,
  "error": "No coordinates found for the provided address"
}
```

**Status Code: 401 Unauthorized**

Invalid or missing authentication token.

```json
{
  "error": "Unauthorized"
}
```

**Status Code: 500 Internal Server Error**

API error or service unavailable.

```json
{
  "success": false,
  "error": "Invalid MapTiler API key"
}
```

#### Implementation Details

1. Uses MapTiler Geocoding API for address conversion
2. Returns latitude and longitude coordinates
3. Includes formatted address and confidence score
4. Provides detailed address components (country, region, etc.)
5. Handles various error scenarios (invalid API key, rate limits, etc.)

### Reverse Geocode Coordinates

Convert coordinates (latitude and longitude) to an address.

**URL**: `/api/maps/reverse-geocode`

**Method**: `POST`

**Authentication**: Required (Bearer Token)

#### Headers

| Header | Type | Description | Required |
|--------|------|-------------|----------|
| Authorization | String | Bearer token for authentication | Yes |

#### Request Body

| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| latitude | Number | Latitude coordinate | Required, between -90 and 90 |
| longitude | Number | Longitude coordinate | Required, between -180 and 180 |

**Example Request**:
```json
{
  "latitude": 40.7580,
  "longitude": -73.9855
}
```

#### Responses

**Status Code: 200 OK**

Coordinates successfully reverse geocoded.

```json
{
  "success": true,
  "data": {
    "formattedAddress": "Times Square, New York, NY, USA",
    "addressComponents": {
      "country": "United States",
      "region": "New York",
      "place": "New York",
      "postcode": "10036"
    }
  },
  "message": "Coordinates reverse geocoded successfully"
}
```

**Status Code: 400 Bad Request**

Invalid coordinates or validation error.

```json
{
  "success": false,
  "message": "Valid latitude and longitude numbers are required"
}
```

OR

```json
{
  "success": false,
  "message": "Invalid coordinates. Latitude must be between -90 and 90, longitude between -180 and 180"
}
```

**Status Code: 401 Unauthorized**

Invalid or missing authentication token.

```json
{
  "error": "Unauthorized"
}
```

#### Implementation Details

1. Validates coordinate ranges before processing
2. Uses MapTiler reverse geocoding API
3. Returns formatted address with components
4. Handles edge cases for coordinates in remote areas

### Calculate Distance and Time

Calculate distance and estimated travel time between two addresses.

**URL**: `/api/maps/distance`

**Method**: `POST`

**Authentication**: Required (Bearer Token)

#### Headers

| Header | Type | Description | Required |
|--------|------|-------------|----------|
| Authorization | String | Bearer token for authentication | Yes |

#### Request Body

| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| origin | String | Starting address | Required |
| destination | String | Destination address | Required |

**Example Request**:
```json
{
  "origin": "Times Square, New York, NY",
  "destination": "Central Park, New York, NY"
}
```

#### Responses

**Status Code: 200 OK**

Distance calculated successfully.

```json
{
  "success": true,
  "data": {
    "origin": {
      "address": "Times Square, New York, NY",
      "coordinates": {
        "latitude": 40.7580,
        "longitude": -73.9855
      },
      "formattedAddress": "Times Square, New York, NY, USA"
    },
    "destination": {
      "address": "Central Park, New York, NY",
      "coordinates": {
        "latitude": 40.7829,
        "longitude": -73.9654
      },
      "formattedAddress": "Central Park, New York, NY, USA"
    },
    "route": {
      "distance": {
        "meters": 2847,
        "kilometers": 2.85,
        "miles": 1.77
      },
      "duration": {
        "seconds": 342,
        "minutes": 6,
        "hours": 0.1,
        "formatted": "6m"
      }
    }
  },
  "message": "Distance and time calculated successfully using real routing data"
}
```

**Status Code: 400 Bad Request**

Invalid addresses or geocoding failure.

```json
{
  "success": false,
  "message": "Both origin and destination addresses are required"
}
```

OR

```json
{
  "success": false,
  "message": "Could not geocode one or both addresses"
}
```

**Status Code: 401 Unauthorized**

Invalid or missing authentication token.

```json
{
  "error": "Unauthorized"
}
```

#### Implementation Details

1. **Address Geocoding**: Uses MapTiler API to convert addresses to coordinates
2. **Real Routing**: Integrates with OSRM (Open Source Routing Machine) for actual road routing
3. **Accurate Calculations**: Provides real driving distance and time, not estimates
4. **Multiple Units**: Returns distance in meters, kilometers, and miles
5. **Comprehensive Time Data**: Provides duration in seconds, minutes, hours, and formatted string
6. **Error Handling**: Robust error handling for geocoding failures and routing issues
7. **Global Coverage**: Works worldwide using OpenStreetMap data

#### Notes

- **Real Routing Data**: Uses OSRM (Open Source Routing Machine) for accurate road-based routing
- **Actual Driving Distance**: Calculates real driving distance, not straight-line distance
- **Precise Travel Times**: Provides accurate travel time estimates based on actual road conditions
- **Multiple Formats**: Returns distance in meters, kilometers, and miles
- **Time Formats**: Returns duration in seconds, minutes, hours, and human-readable format
- **Free Service**: OSRM is completely free with no API key required
- **Global Coverage**: Works worldwide with OpenStreetMap data

### Get Address Suggestions (Autocomplete)

Get address suggestions/autocomplete based on partial input, similar to Google Maps autocomplete.

**URL**: `/api/maps/suggestions`

**Method**: `POST`

**Authentication**: Required (Bearer Token)

#### Headers

| Header | Type | Description | Required |
|--------|------|-------------|----------|
| Authorization | String | Bearer token for authentication | Yes |

#### Request Body

| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| query | String | Partial address or place name | Required, min length: 2 |
| limit | Number | Maximum number of suggestions | Optional, 1-10, default: 5 |
| country | String | Country code to filter results | Optional, e.g., "US", "CA" |
| proximity | String | Longitude,latitude for proximity bias | Optional, e.g., "-74.0060,40.7128" |
| bbox | String | Bounding box to limit results | Optional, "minX,minY,maxX,maxY" |
| language | String | Language code for results | Optional, 2-char code, e.g., "en" |

**Example Request**:
```json
{
  "query": "New Y",
  "limit": 5,
  "country": "US",
  "language": "en"
}
```

#### Responses

**Status Code: 200 OK**

Address suggestions retrieved successfully.

```json
{
  "success": true,
  "data": {
    "query": "New Y",
    "suggestions": [
      {
        "id": "suggestion_0",
        "text": "New York, NY, USA",
        "placeName": "New York, New York, United States",
        "coordinates": {
          "latitude": 40.7128,
          "longitude": -74.0060
        },
        "relevance": 0.99,
        "placeType": ["place"],
        "context": [
          {
            "id": "country.19678805456372290",
            "text": "United States",
            "shortCode": "us"
          },
          {
            "id": "region.17349986251855570",
            "text": "New York",
            "shortCode": "US-NY"
          }
        ],
        "properties": {
          "category": null,
          "landmark": false,
          "address": null
        }
      }
    ],
    "count": 1
  },
  "message": "Address suggestions retrieved successfully"
}
```

**Status Code: 400 Bad Request**

Invalid request body or validation error.

```json
{
  "success": false,
  "message": "Query is required for address suggestions"
}
```

OR

```json
{
  "errors": [
    {
      "msg": "Query must be at least 2 characters",
      "param": "query",
      "location": "body"
    }
  ]
}
```

**Status Code: 401 Unauthorized**

Invalid or missing authentication token.

```json
{
  "error": "Unauthorized"
}
```

**Status Code: 500 Internal Server Error**

API error or service unavailable.

```json
{
  "success": false,
  "error": "Invalid MapTiler API key"
}
```

#### Implementation Details

1. **MapTiler Autocomplete**: Uses MapTiler's geocoding API with `autocomplete=true` parameter
2. **Smart Filtering**: Supports country, proximity, and bounding box filtering
3. **Relevance Scoring**: Results are ordered by relevance score
4. **Rich Context**: Includes place type, context hierarchy, and properties
5. **Minimum Query Length**: Requires at least 2 characters to prevent excessive API calls
6. **Rate Limiting**: Respects MapTiler API rate limits

#### Usage Tips

- **Debounce Input**: Implement debouncing on frontend to avoid excessive API calls
- **Country Filtering**: Use country codes to limit results to specific regions
- **Proximity Bias**: Use user's location for proximity-based suggestions
- **Caching**: Consider caching common queries to improve performance

## 🚗 Ride Endpoints

### Create Ride

Create a new ride request with automatic fare calculation and captain notification.

**URL**: `/api/rides/create`  
**Method**: `POST`  
**Authentication**: Required (User Bearer Token)

#### Request Body

| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| pickup | String | Pickup address | Required, min length: 3 |
| destination | String | Destination address | Required, min length: 3 |
| vehicleType | String | Type of vehicle requested | Required, enum: ["auto", "car", "moto"] |

**Example Request**:
```json
{
  "pickup": "Times Square, New York, NY",
  "destination": "Central Park, New York, NY", 
  "vehicleType": "car"
}
```

#### Responses

**Status Code: 201 Created**
```json
{
  "ride": {
    "_id": "ride_id",
    "user": "user_id",
    "pickup": "Times Square, New York, NY",
    "destination": "Central Park, New York, NY",
    "fare": 95.5,
    "status": "pending",
    "vehicleType": "car",
    "__v": 0
  },
  "message": "Ride created successfully"
}
```

**Status Code: 400 Bad Request** - Invalid request or validation error
**Status Code: 401 Unauthorized** - Missing or invalid authentication token

#### Implementation Details
- **Automatic Fare Calculation** based on real distance and time
- **OTP Generation** for secure ride verification
- **Captain Notification** via Socket.io to nearby captains (2km radius)
- **Real-time Updates** sent to matching captains

---

### Get Fare Estimates

Get fare estimates for all vehicle types before booking.

**URL**: `/api/rides/get-fare`  
**Method**: `POST`  
**Authentication**: Required (User Bearer Token)

#### Request Body

| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| pickup | String | Pickup address | Required, min length: 3 |
| destination | String | Destination address | Required, min length: 3 |

**Example Request**:
```json
{
  "pickup": "Times Square, New York, NY",
  "destination": "Central Park, New York, NY"
}
```

#### Responses

**Status Code: 200 OK**
```json
{
  "auto": 87.5,
  "car": 125.8, 
  "moto": 65.2
}
```

---

### Confirm Ride (Captain)

Captain confirms acceptance of a ride request.

**URL**: `/api/rides/confirm`  
**Method**: `POST`  
**Authentication**: Required (Captain Bearer Token)

#### Request Body

| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| rideId | String | MongoDB ObjectId of the ride | Required, valid MongoDB ID |

**Example Request**:
```json
{
  "rideId": "60f7b3b3b3f3b3b3b3f3b3b3"
}
```

#### Responses

**Status Code: 200 OK**
```json
{
  "_id": "ride_id",
  "user": {...},
  "captain": "captain_id",
  "pickup": "Times Square, New York, NY",
  "destination": "Central Park, New York, NY",
  "fare": 95.5,
  "status": "accepted",
  "vehicleType": "car",
  "__v": 0
}
```

#### Implementation Details
- **Status Update**: Changes ride status from "pending" to "accepted"
- **Captain Assignment**: Links captain to the ride
- **User Notification**: Sends real-time update to user via Socket.io

---

### Start Ride (Captain)

Captain starts the ride after OTP verification.

**URL**: `/api/rides/start`  
**Method**: `POST`  
**Authentication**: Required (Captain Bearer Token)

#### Request Body

| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| rideId | String | MongoDB ObjectId of the ride | Required, valid MongoDB ID |
| otp | String | 4-digit OTP from user | Required, exactly 4 characters |

**Example Request**:
```json
{
  "rideId": "60f7b3b3b3f3b3b3b3f3b3b3",
  "otp": "1234"
}
```

#### Responses

**Status Code: 200 OK**
```json
{
  "_id": "ride_id",
  "user": {...},
  "captain": {...},
  "pickup": "Times Square, New York, NY",
  "destination": "Central Park, New York, NY", 
  "fare": 95.5,
  "status": "ongoing",
  "vehicleType": "car",
  "__v": 0
}
```

**Status Code: 400 Bad Request** - Invalid OTP or ride not found
**Status Code: 401 Unauthorized** - Invalid captain token

#### Implementation Details
- **OTP Verification**: Validates 4-digit OTP against ride record
- **Status Update**: Changes ride status to "ongoing"
- **Real-time Update**: Notifies user that ride has started

---

### End Ride (Captain)

Captain completes the ride when destination is reached.

**URL**: `/api/rides/end`  
**Method**: `POST`  
**Authentication**: Required (Captain Bearer Token)

#### Request Body

| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| rideId | String | MongoDB ObjectId of the ride | Required, valid MongoDB ID |

**Example Request**:
```json
{
  "rideId": "60f7b3b3b3f3b3b3b3f3b3b3"
}
```

#### Responses

**Status Code: 200 OK**
```json
{
  "_id": "ride_id",
  "user": {...},
  "captain": {...},
  "pickup": "Times Square, New York, NY",
  "destination": "Central Park, New York, NY",
  "fare": 95.5,
  "status": "completed",
  "vehicleType": "car",
  "__v": 0
}
```

#### Implementation Details
- **Status Update**: Changes ride status to "completed"
- **Final Notification**: Sends completion update to user
- **Captain Availability**: Captain becomes available for new rides

---

### Pricing Structure

| Vehicle Type | Base Fare | Per KM | Per Minute | Capacity |
|-------------|-----------|---------|------------|----------|
| **Auto** | ₹30 | ₹10 | ₹2 | 1-6 passengers |
| **Car** | ₹50 | ₹15 | ₹3 | 1-8 passengers | 
| **Moto** | ₹20 | ₹8 | ₹1.5 | 1-2 passengers |

**Fare Formula**: `Base Fare + (Distance × Per KM) + (Duration × Per Minute)`

---

## 🔄 Real-time Features (Socket.io)

The application uses Socket.io for real-time communication between users, captains, and the server.

### Connection Setup
```javascript
// Client connection
const socket = io('http://localhost:8080');
```

### Client → Server Events

#### Join Room
```javascript
socket.emit('join', {
  userId: 'user_or_captain_id',
  userType: 'user' // or 'captain'
});
```
- **Purpose**: Associates socket connection with user/captain
- **Parameters**: `userId` (MongoDB ObjectId), `userType` ('user' or 'captain')
- **Effect**: Updates user/captain `socketId` in database

#### Update Captain Location
```javascript
socket.emit('update-location-captain', {
  userId: 'captain_id',
  location: {
    ltd: 40.7128,
    lng: -74.0060
  }
});
```
- **Purpose**: Updates captain's real-time location
- **Parameters**: `userId` (captain ID), `location` (latitude/longitude object)
- **Effect**: Updates captain location in database for ride matching

### Server → Client Events

#### New Ride Request
**Event**: `new-ride`
```javascript
socket.on('new-ride', (rideData) => {
  // Display ride request to captain
  console.log('New ride request:', rideData);
});
```
- **Triggered**: When user creates a ride request
- **Sent to**: Captains within 2km radius of pickup location
- **Data**: Complete ride object with user details (OTP removed for security)

#### Ride Confirmed
**Event**: `ride-confirmed`
```javascript
socket.on('ride-confirmed', (rideData) => {
  // Notify user that captain accepted ride
});
```
- **Triggered**: When captain confirms a ride
- **Sent to**: User who requested the ride
- **Data**: Updated ride object with captain details

#### Ride Started
**Event**: `ride-started`
```javascript
socket.on('ride-started', (rideData) => {
  // Notify user that ride has begun
});
```
- **Triggered**: When captain starts ride with valid OTP
- **Sent to**: User in the ride
- **Data**: Updated ride object with "ongoing" status

#### Ride Ended
**Event**: `ride-ended`
```javascript
socket.on('ride-ended', (rideData) => {
  // Notify user that ride is complete
});
```
- **Triggered**: When captain ends the ride
- **Sent to**: User in the ride  
- **Data**: Final ride object with "completed" status

#### Error Events
**Event**: `error`
```javascript
socket.on('error', (errorData) => {
  console.error('Socket error:', errorData.message);
});
```
- **Triggered**: On invalid data or connection errors
- **Examples**: Invalid location data, malformed requests

### Implementation Details

#### Connection Management
- **Auto-reconnection**: Client automatically reconnects on disconnect
- **Room Management**: Users/captains join rooms based on their IDs
- **Database Sync**: Socket IDs stored in user/captain records

#### Security Considerations
- **OTP Protection**: OTPs are removed from ride data before broadcasting
- **User Validation**: Socket events validate user/captain authentication
- **Location Validation**: Location updates require valid coordinate ranges

#### Geographic Features
- **Radius Matching**: Captains found within 2km of pickup location
- **Real-time Tracking**: Captain locations updated continuously
- **Efficient Queries**: MongoDB geospatial queries for nearby captains

---

All endpoints follow consistent error response format:

- **Validation Errors**: Return array of specific field errors
- **Authentication Errors**: Return generic unauthorized messages
- **Server Errors**: Return generic error messages without sensitive details
- **Maps API Errors**: Include specific error messages for geocoding failures