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

#### Implementation Details

1. The endpoint validates the request body using express-validator
2. Password is hashed using bcrypt before storing in the database
3. JWT authentication token is generated upon successful registration
4. User data is stored in MongoDB using Mongoose
5. Password field is excluded from response using `select: false` in the schema

#### Security Considerations

- Passwords are hashed using bcrypt with a salt factor of 10
- JWT tokens expire after 1 day
- Password field is never returned in API responses