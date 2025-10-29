# API Documentation

Complete API reference for the backend service.

## Base URL

```
Development: http://localhost:5000/api/v1
Production: https://api.yourdomain.com/api/v1
```

## Authentication

The API uses JWT (JSON Web Token) for authentication. Include the token in the Authorization header:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

### Token Expiration

- Access Token: 24 hours
- Refresh Token: 7 days

## Response Format

All API responses follow a consistent format:

### Success Response

```json
{
  "success": true,
  "data": {
    // Response data
  },
  "message": "Operation successful",
  "meta": {
    "timestamp": "2025-10-29T10:00:00Z",
    "version": "1.0.0"
  }
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": [
      {
        "field": "email",
        "message": "Email is required"
      }
    ]
  },
  "meta": {
    "timestamp": "2025-10-29T10:00:00Z",
    "version": "1.0.0"
  }
}
```

## Status Codes

| Status Code | Description |
|-------------|-------------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 204 | No Content - Request successful, no content to return |
| 400 | Bad Request - Invalid request data |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 409 | Conflict - Resource already exists |
| 422 | Unprocessable Entity - Validation error |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error - Server error |
| 503 | Service Unavailable - Server temporarily unavailable |

## Error Codes

| Code | Description |
|------|-------------|
| VALIDATION_ERROR | Input validation failed |
| AUTHENTICATION_ERROR | Authentication failed |
| AUTHORIZATION_ERROR | Insufficient permissions |
| NOT_FOUND | Resource not found |
| ALREADY_EXISTS | Resource already exists |
| RATE_LIMIT_EXCEEDED | Too many requests |
| INTERNAL_ERROR | Internal server error |

## Rate Limiting

- **Rate Limit**: 100 requests per 15 minutes per IP
- **Headers**: 
  - `X-RateLimit-Limit`: Total allowed requests
  - `X-RateLimit-Remaining`: Remaining requests
  - `X-RateLimit-Reset`: Time when limit resets (Unix timestamp)

## API Endpoints

---

## Authentication Endpoints

### Register User

Create a new user account.

**Endpoint:** `POST /auth/register`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "name": "John Doe"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "123",
      "email": "user@example.com",
      "name": "John Doe",
      "createdAt": "2025-10-29T10:00:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "User registered successfully"
}
```

**Validation Rules:**
- Email: Required, valid email format, unique
- Password: Required, minimum 8 characters, at least one uppercase, one lowercase, one number
- Name: Required, 2-100 characters

**Error Responses:**
- `400` - Invalid input data
- `409` - Email already exists

**Example:**
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!",
    "name": "John Doe"
  }'
```

---

### Login User

Authenticate user and get access token.

**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "123",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Login successful"
}
```

**Error Responses:**
- `400` - Invalid input data
- `401` - Invalid credentials

**Example:**
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!"
  }'
```

---

### Get Current User

Get authenticated user's profile.

**Endpoint:** `GET /auth/me`

**Authentication:** Required

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "123",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "user",
      "createdAt": "2025-10-29T10:00:00Z",
      "updatedAt": "2025-10-29T10:00:00Z"
    }
  }
}
```

**Error Responses:**
- `401` - Unauthorized (invalid or missing token)

**Example:**
```bash
curl -X GET http://localhost:5000/api/v1/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

### Refresh Token

Get a new access token using refresh token.

**Endpoint:** `POST /auth/refresh`

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses:**
- `401` - Invalid refresh token

---

### Logout

Invalidate user session.

**Endpoint:** `POST /auth/logout`

**Authentication:** Required

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

## User Endpoints

### Get All Users

Get list of all users (Admin only).

**Endpoint:** `GET /users`

**Authentication:** Required (Admin)

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20, max: 100)
- `sort` (optional): Sort field and order (e.g., `createdAt:desc`)
- `role` (optional): Filter by role
- `search` (optional): Search by name or email

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "123",
        "email": "user@example.com",
        "name": "John Doe",
        "role": "user",
        "createdAt": "2025-10-29T10:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 50,
      "pages": 3
    }
  }
}
```

**Error Responses:**
- `401` - Unauthorized
- `403` - Forbidden (not admin)

**Example:**
```bash
curl -X GET "http://localhost:5000/api/v1/users?page=1&limit=20&sort=createdAt:desc" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

### Get User by ID

Get specific user details.

**Endpoint:** `GET /users/:id`

**Authentication:** Required

**Path Parameters:**
- `id`: User ID

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "123",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "user",
      "createdAt": "2025-10-29T10:00:00Z",
      "updatedAt": "2025-10-29T10:00:00Z"
    }
  }
}
```

**Error Responses:**
- `401` - Unauthorized
- `403` - Forbidden (can only view own profile unless admin)
- `404` - User not found

**Example:**
```bash
curl -X GET http://localhost:5000/api/v1/users/123 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

### Update User

Update user profile.

**Endpoint:** `PUT /users/:id`

**Authentication:** Required

**Path Parameters:**
- `id`: User ID

**Request Body:**
```json
{
  "name": "John Smith",
  "email": "newmail@example.com"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "123",
      "email": "newmail@example.com",
      "name": "John Smith",
      "role": "user",
      "updatedAt": "2025-10-29T12:00:00Z"
    }
  },
  "message": "User updated successfully"
}
```

**Error Responses:**
- `400` - Invalid input data
- `401` - Unauthorized
- `403` - Forbidden (can only update own profile unless admin)
- `404` - User not found
- `409` - Email already in use

---

### Delete User

Delete user account (Admin only).

**Endpoint:** `DELETE /users/:id`

**Authentication:** Required (Admin)

**Path Parameters:**
- `id`: User ID

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

**Error Responses:**
- `401` - Unauthorized
- `403` - Forbidden (admin only)
- `404` - User not found

---

## Health Check

### Get API Health

Check API status.

**Endpoint:** `GET /health`

**Authentication:** Not required

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2025-10-29T10:00:00Z",
    "uptime": 123456,
    "version": "1.0.0"
  }
}
```

---

## Pagination

List endpoints support pagination with these query parameters:

- `page`: Page number (starting from 1)
- `limit`: Items per page (max 100)

Response includes pagination metadata:

```json
{
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5,
    "hasNext": true,
    "hasPrev": false
  }
}
```

## Filtering & Sorting

### Filtering

Use query parameters to filter results:

```
GET /users?role=admin&status=active
```

### Sorting

Use the `sort` parameter with field name and order:

```
GET /users?sort=createdAt:desc
GET /users?sort=name:asc
```

Multiple sorts:
```
GET /users?sort=role:asc,createdAt:desc
```

## Webhooks

*(Optional: Document webhook endpoints if your application supports them)*

## Rate Limiting

The API implements rate limiting to prevent abuse:

- **Standard rate limit**: 100 requests per 15 minutes
- **Auth endpoints**: 5 requests per 15 minutes
- **Rate limit headers**: Included in all responses

When rate limit is exceeded:

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Please try again later.",
    "retryAfter": 900
  }
}
```

## Postman Collection

Import the Postman collection for easy API testing:

[Download Postman Collection](./postman_collection.json)

## SDK & Libraries

*(Optional: Link to client libraries/SDKs if available)*

- JavaScript/TypeScript SDK
- Python SDK
- Mobile SDKs

## Change Log

### Version 1.0.0 (2025-10-29)
- Initial API release
- User authentication
- User management
- Basic CRUD operations

---

For questions or issues, please contact the development team or open an issue in the repository.
