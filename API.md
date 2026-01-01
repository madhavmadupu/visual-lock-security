# API Documentation

This document describes the REST API endpoints available in the VizLock application.

## Base URL

- **Development**: `http://localhost:3000`
- **Production**: Your production domain

## Authentication

Most endpoints use JWT-based authentication. The authentication token is stored in an HTTP-only cookie named `auth_token`.

### Cookie Details

- **Name**: `auth_token`
- **HttpOnly**: `true`
- **Secure**: `true` (in production)
- **SameSite**: `lax`
- **Path**: `/`
- **Expiration**: 7 days

## Endpoints

### 1. Register User

Register a new user with a username and visual password pattern.

**Endpoint**: `POST /api/register`

**Request Body**:
```json
{
  "username": "string",
  "coords": [
    { "x": number, "y": number },
    { "x": number, "y": number },
    { "x": number, "y": number },
    { "x": number, "y": number },
    { "x": number, "y": number }
  ]
}
```

**Request Schema**:
- `username` (string, required): Unique username for the user
- `coords` (array, required): Array of exactly 5 coordinate objects
  - Each coordinate must have `x` and `y` properties (numbers)

**Success Response**: `200 OK`
```json
{
  "message": "User registered successfully"
}
```

**Error Responses**:

- `400 Bad Request` - Invalid input (missing username or incorrect number of coordinates)
```json
{
  "error": "Invalid input"
}
```

- `409 Conflict` - Username already exists
```json
{
  "error": "User already exists"
}
```

**Example Request**:
```javascript
const response = await fetch('/api/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    username: 'john_doe',
    coords: [
      { x: 100, y: 150 },
      { x: 200, y: 150 },
      { x: 150, y: 200 },
      { x: 100, y: 250 },
      { x: 200, y: 250 }
    ]
  })
});
```

---

### 2. Login User

Authenticate a user with their username and visual password pattern.

**Endpoint**: `POST /api/login`

**Request Body**:
```json
{
  "username": "string",
  "coords": [
    { "x": number, "y": number },
    { "x": number, "y": number },
    { "x": number, "y": number },
    { "x": number, "y": number },
    { "x": number, "y": number }
  ]
}
```

**Request Schema**:
- `username` (string, required): Registered username
- `coords` (array, required): Array of exactly 5 coordinate objects matching the registered pattern

**Success Response**: `307 Temporary Redirect`

Redirects to `/dashboard` with `Set-Cookie` header containing the authentication token.

**Error Responses**:

- `400 Bad Request` - Invalid input
```json
{
  "error": "Invalid input"
}
```

- `401 Unauthorized` - Incorrect password coordinates
```json
{
  "error": "Incorrect password"
}
```

- `404 Not Found` - User does not exist
```json
{
  "error": "User not found"
}
```

**Coordinate Matching**:
- Coordinates are matched with a tolerance of **50 pixels** in both X and Y directions
- The order of coordinates matters
- Each clicked coordinate must match its corresponding registered coordinate within the tolerance

**Example Request**:
```javascript
const response = await fetch('/api/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    username: 'john_doe',
    coords: [
      { x: 105, y: 148 },  // Within 50px tolerance
      { x: 195, y: 152 },
      { x: 148, y: 203 },
      { x: 98, y: 248 },
      { x: 205, y: 252 }
    ]
  })
});

// Response will redirect to /dashboard
if (response.ok) {
  window.location.href = '/dashboard';
}
```

---

### 3. Logout User

Clear the authentication session and log out the user.

**Endpoint**: `POST /api/logout`

**Authentication**: Not required (but recommended to clear cookie even if invalid)

**Request Body**: None

**Success Response**: `307 Temporary Redirect`

Redirects to `/login` with `Set-Cookie` header clearing the authentication token.

**Example Request**:
```javascript
const response = await fetch('/api/logout', {
  method: 'POST'
});

// Response will redirect to /login
if (response.ok) {
  window.location.href = '/login';
}
```

---

## Data Models

### User

```typescript
{
  username: string;
  passwordCoords: Coordinate[];
  _id: string;           // MongoDB ObjectId
  __v: number;           // MongoDB version key
}

interface Coordinate {
  x: number;
  y: number;
}
```

### JWT Payload

The JWT token contains the following payload:

```typescript
{
  username: string;
  iat: number;           // Issued at timestamp
  exp: number;           // Expiration timestamp
}
```

---

## Error Handling

All endpoints follow a consistent error response format:

```json
{
  "error": "Error message description"
}
```

### Common HTTP Status Codes

- `200 OK` - Request successful
- `307 Temporary Redirect` - Redirect response (login/logout)
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Authentication failed
- `404 Not Found` - Resource not found
- `409 Conflict` - Resource conflict (e.g., duplicate username)
- `500 Internal Server Error` - Server error

---

## Security Considerations

### Coordinate Matching Tolerance

The system uses a 50-pixel buffer for coordinate matching to account for:
- Mouse click precision
- Screen resolution differences
- Browser rendering variations
- User hand movement

This tolerance is implemented using the Manhattan distance (L1 norm) between coordinates:

```javascript
const BUFFER = 50;
const isMatch = user.passwordCoords.every((coord, i) => {
  const dx = Math.abs(coord.x - coords[i].x);
  const dy = Math.abs(coord.y - coords[i].y);
  return dx <= BUFFER && dy <= BUFFER;
});
```

### Authentication Token

- Tokens are signed using HS256 algorithm
- Tokens expire after 7 days
- Tokens are stored in HTTP-only cookies to prevent XSS attacks
- Cookies are marked as `Secure` in production environments

### Input Validation

- Username validation (should be handled on client/server)
- Coordinate validation (exactly 5 coordinates required)
- Coordinate range validation (should be within image bounds)

---

## Rate Limiting

Currently, the API does not implement rate limiting. Consider adding rate limiting in production to prevent:
- Brute force attacks
- Account enumeration
- DDoS attacks

Recommended: Implement rate limiting using middleware or a service like Redis.

---

## CORS Configuration

The API is designed to work with the Next.js frontend. If you need to expose the API to external clients, configure CORS appropriately in your Next.js configuration or middleware.

---

## Testing the API

### Using cURL

**Register**:
```bash
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "coords": [
      {"x": 100, "y": 150},
      {"x": 200, "y": 150},
      {"x": 150, "y": 200},
      {"x": 100, "y": 250},
      {"x": 200, "y": 250}
    ]
  }'
```

**Login**:
```bash
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "username": "testuser",
    "coords": [
      {"x": 105, "y": 148},
      {"x": 195, "y": 152},
      {"x": 148, "y": 203},
      {"x": 98, "y": 248},
      {"x": 205, "y": 252}
    ]
  }' -L
```

**Logout**:
```bash
curl -X POST http://localhost:3000/api/logout \
  -b cookies.txt \
  -L
```

### Using JavaScript/TypeScript

See the example requests in each endpoint section above.

---

## Future Enhancements

Potential API improvements:

1. **Password Reset**: Endpoint to reset forgotten visual passwords
2. **Password Update**: Allow users to update their password pattern
3. **User Profile**: CRUD operations for user profiles
4. **Session Management**: Multiple device sessions, active sessions list
5. **Two-Factor Authentication**: Additional security layer
6. **API Keys**: For programmatic access
7. **Webhooks**: Event notifications
8. **GraphQL API**: Alternative to REST
