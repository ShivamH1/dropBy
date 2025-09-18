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

1. **Registration**: User creates account → receives user object (no token)
2. **Login**: User authenticates → receives JWT token and user object
3. **Protected Routes**: Include `Authorization: Bearer <token>` header
4. **Profile Access**: Use token to access user profile information
5. **Logout**: Invalidate token and clear session data

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

## Error Handling

All endpoints follow consistent error response format:

- **Validation Errors**: Return array of specific field errors
- **Authentication Errors**: Return generic unauthorized messages
- **Server Errors**: Return generic error messages without sensitive details