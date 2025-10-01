# DropBy API Documentation

## User Endpoints

### Register User

Register a new user in the system.

**URL**: `/api/users/register`

**Method**: `POST`

**Authentication**: Not required

#### Request Body

| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| fullName.firstName | String | User's first name | Required, min length: 3, max length: 20 |
| fullName.lastName | String | User's last name | Required, min length: 3, max length: 20 |
| email | String | User's email address | Required, valid email format, min length: 3, max length: 20 |
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

User successfully registered.

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

**Status Code: 400 Bad Request**

Invalid request body or validation error.

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
  "error": "Error message"
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

## Ride Endpoints

### Create Ride

Create a new ride request with fare calculation.

**URL**: `/api/rides/create`

**Method**: `POST`

**Authentication**: Required (User Bearer Token)

#### Headers

| Header | Type | Description | Required |
|--------|------|-------------|----------|
| Authorization | String | Bearer token for user authentication | Yes |

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

Ride successfully created with fare calculation.

```json
{
  "ride": {
    "_id": "ride_id",
    "user": "user_id",
    "pickup": "Times Square, New York, NY",
    "destination": "Central Park, New York, NY",
    "fare": 95.5,
    "status": "pending",
    "otp": "1234",
    "__v": 0
  },
  "message": "Ride created successfully"
}
```

**Status Code: 400 Bad Request**

Invalid request body or validation error.

```json
{
  "errors": [
    {
      "msg": "Invalid pickup address",
      "param": "pickup",
      "location": "body"
    }
  ]
}
```

OR

```json
{
  "error": "All fields are required"
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

1. **Fare Calculation**: Automatically calculates fare based on distance and estimated travel time
2. **Route Analysis**: Uses Maps service to get accurate distance and duration
3. **OTP Generation**: Generates a 4-digit OTP for ride verification
4. **Vehicle-Specific Pricing**: Different rates for auto, car, and moto
5. **Status Management**: Ride starts with "pending" status

#### Fare Calculation Formula

**Base Fare**:
- Auto: ₹30
- Car: ₹50  
- Moto: ₹20

**Per Kilometer Rate**:
- Auto: ₹10/km
- Car: ₹15/km
- Moto: ₹8/km

**Per Minute Rate**:
- Auto: ₹2/min
- Car: ₹3/min  
- Moto: ₹1.5/min

**Total Fare** = Base Fare + (Distance in km × Per km rate) + (Duration in minutes × Per minute rate)

#### Security Considerations

- Requires user authentication
- OTP is marked as `select: false` in database queries for security
- Validates all input parameters
- Uses secure random OTP generation

## Error Handling

All endpoints follow consistent error response format:

- **Validation Errors**: Return array of specific field errors
- **Authentication Errors**: Return generic unauthorized messages
- **Server Errors**: Return generic error messages without sensitive details
- **Maps API Errors**: Include specific error messages for geocoding failures