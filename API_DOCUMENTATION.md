# 🔌 GateBuddy Complete API Documentation

**Base URL**: `{{base_url}}` = `https://gate-buddy-backend-production-f6df.up.railway.app/api/v1`

**Database URL**: configured server-side via the backend's `DATABASE_URL` env var — not exposed to the client. (Redacted from source control.)

**Authentication**: Most endpoints require JWT token in header: `Authorization: Bearer <token>` or in HttpOnly cookie `jwt`

**Health Check** (outside `/api/v1`, no auth):
```
GET https://gate-buddy-backend-production-f6df.up.railway.app/health

RESPONSE (200 OK):
{
  "status": "ok",
  "timestamp": "2026-07-03T10:00:00Z"
}
```

---

## 📋 Table of Contents

1. [Authentication APIs](#-authentication-apis)
2. [User Profile APIs](#-user-profile-apis)
3. [Flight Management APIs](#-flight-management-apis)
4. [Airport Services APIs](#-airport-services-apis)
5. [Indoor Navigation APIs](#-indoor-navigation-apis)
6. [Home Dashboard API](#-home-dashboard-api)
7. [Chat Assistant API](#-chat-assistant-api)
8. [Notification APIs](#-notification-apis)
9. [Device Management APIs](#-device-management-apis)
10. [FAQ APIs](#-faq-apis)
11. [Stats & Analytics APIs](#-stats--analytics-apis)
12. [Admin APIs](#-admin-apis)

---

## 🔐 Authentication APIs

### 1. User Signup

```
POST {{base_url}}/users/signup
Content-Type: application/json

REQUEST BODY:
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "passwordConfirm": "SecurePass123!"
}

RESPONSE (201 Created):
{
  "status": "success",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "photo": null,
      "role": "user",
      "active": true,
      "createdAt": "2026-04-21T10:30:00Z"
    }
  }
}

VALIDATION ERRORS (400):
- `name`: Required, 2-50 characters.
- `email`: Required, valid email format.
- `password`: Required, min 8 characters, must contain at least one uppercase letter, one lowercase letter, and one number.
- `passwordConfirm`: Required, must exactly match `password`.
```

### 2. User Login

```
POST {{base_url}}/users/login
Content-Type: application/json

REQUEST BODY:
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}

RESPONSE (200 OK):
{
  "status": "success",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "photo": null,
      "role": "user",
      "createdAt": "2026-04-21T10:30:00Z"
    }
  }
}

SETS COOKIES:
- jwt: Access token (expires in 90 days)
- refreshToken: Refresh token (expires in 7 days)

ERROR RESPONSES:
- 401: "Incorrect email or password"
- 423: "Account locked. Try again in 1 hour" (after 5 failed attempts)
```

### 3. Logout

```
POST {{base_url}}/users/logout
Authorization: Bearer <token>

RESPONSE (200 OK):
{
  "status": "success"
}

CLEARS:
- jwt cookie
- refreshToken cookie
```

### 4. Forgot Password (Email Reset)

```
POST {{base_url}}/users/forgotPassword
Content-Type: application/json

REQUEST BODY:
{
  "email": "john@example.com"
}

RESPONSE (200 OK):
{
  "status": "success",
  "message": "Instructions sent to email"
}

OPTIONAL:
- Header `x-client-type: mobile` — if provided, sends a 6-digit verification code instead of a reset link.

SIDE EFFECTS:
- If Header `x-client-type: mobile` is provided: Sends a 6-digit verification code.
- Otherwise: Sends a password reset link (web flow).
- Reset code/link expires in 10 minutes.
```

### 5. Verify Reset Code

```
POST {{base_url}}/users/verifyResetCode
Content-Type: application/json

REQUEST BODY:
{
  "email": "john@example.com",
  "code": "123456"  // 6-digit code from email
}

RESPONSE (200 OK):
{
  "status": "success",
  "resetToken": "hashed_token_for_next_request"
}

ERROR RESPONSES:
- 400: "Invalid or expired code"
- 404: "User not found"
```

### 6. Reset Password (with Token)

```
PATCH {{base_url}}/users/resetPassword
Content-Type: application/json

REQUEST BODY:
{
  "password": "NewSecurePass123!",
  "passwordConfirm": "NewSecurePass123!"
}

RESPONSE (200 OK):
{
  "status": "success",
  "token": "new_jwt_token",
  "data": {
    "user": { ... }
  }
}

OPTIONAL:
- Alternate route form: `PATCH {{base_url}}/users/resetPassword/:token` — pass the reset token as a URL param instead of relying on the stored reset session.

ERROR RESPONSES:
- 400: "Password reset token has expired"
- 400: "Passwords do not match"
```

### 7. Google OAuth Login

```
POST {{base_url}}/users/google
Content-Type: application/json

REQUEST BODY:
{
  "idToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjEifQ..."
}

OPTIONAL:
- `state`: string — optional state parameter for CSRF protection.

RESPONSE (200 OK or 201 Created):
{
  "status": "success",
  "token": "jwt_access_token",
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@gmail.com",
      "photo": "https://...",
      "auth_providers": [
        { "provider": "google", "provider_id": "1234567890", "linked_at": "2026-04-21T10:30:00Z" }
      ]
    }
  }
}

RESPONSE CODES:
- 201: New user created via OAuth
- 200: Existing user logged in
- 400: Invalid or expired idToken
```

### 8. GitHub OAuth Login

```
POST {{base_url}}/users/github
Content-Type: application/json

REQUEST BODY:
{
  "code": "authorization_code_from_github"
}

OPTIONAL:
- `state`: string — optional state parameter for CSRF protection.

RESPONSE (200 OK or 201 Created):
{
  "status": "success",
  "token": "jwt_access_token",
  "data": {
    "user": { ... }
  }
}
```

### 9. Facebook OAuth Login

```
POST {{base_url}}/users/facebook
Content-Type: application/json

REQUEST BODY:
{
  "accessToken": "EAABsZAxxx..."
}

RESPONSE (200 OK or 201 Created):
{
  "status": "success",
  "token": "jwt_access_token",
  "data": {
    "user": { ... }
  }
}
```

### 10. Link OAuth Provider to Existing Account

```
POST {{base_url}}/users/link-provider
Authorization: Bearer <token>
Content-Type: application/json

REQUEST BODY:
{
  "provider": "google",  // "google", "github", or "facebook"
  "token": "idToken_or_accessToken"
}

RESPONSE (200 OK):
{
  "status": "success",
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "auth_providers": [
        { "provider": "google", "provider_id": "123", "linked_at": "..." }
      ]
    }
  }
}

ERROR RESPONSES:
- 400: "Invalid or expired token"
- 409: "Provider already linked to account"
```

### 11. Refresh Access Token

```
POST {{base_url}}/users/refresh
Cookie: refreshToken=<refresh_token>

RESPONSE (200 OK):
{
  "status": "success",
  "token": "new_access_token",
  "data": {
    "user": { ... }
  }
}

SETS NEW COOKIES:
- jwt: New access token
- refreshToken: New refresh token

ERROR RESPONSES:
- 401: "Invalid or expired refresh token"
```

---

## 👤 User Profile APIs

### 1. Get Current User Profile

```
GET {{base_url}}/users/me
Authorization: Bearer <token>

RESPONSE (200 OK):
{
  "status": "success",
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "photo": "https://example.com/photo.jpg",
      "role": "user",
      "active": true,
      "preferences": {
        "darkMode": false,
        "language": "en",
        "pushNotificationsEnabled": true
      },
      "createdAt": "2026-04-21T10:30:00Z",
      "updatedAt": "2026-04-21T10:30:00Z"
    }
  }
}

ERROR RESPONSES:
- 401: Unauthorized (no token provided)
- 404: User not found
```

### 2. Update User Profile / Preferences

```
PATCH {{base_url}}/users/updateMe
Authorization: Bearer <token>
Content-Type: multipart/form-data OR application/json

REQUEST BODY:
{
  "name": "John Smith"
}

OPTIONAL:
- `photo`: file — send as `multipart/form-data` field named `photo` to upload a new avatar image.
- `preferences`: object — update user preferences instead of/alongside profile fields, e.g. `{ "preferences": { "darkMode": true, "language": "es", "pushNotificationsEnabled": false } }`

RESPONSE (200 OK):
{
  "status": "success",
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Smith",
      "photo": "user-507f1f77bcf86cd799439011-1745234567890.jpeg",
      ...
    }
  }
}

VALIDATION:
- Only name, photo, and preferences can be updated via this endpoint
- This route is not for password updates (use `updateMyPassword`)

ERROR RESPONSES:
- 400: "Invalid field update"
- 401: Unauthorized
```

### 3. Update Current User Password

```
PATCH {{base_url}}/users/updateMyPassword
Authorization: Bearer <token>
Content-Type: application/json

REQUEST BODY:
{
  "passwordCurrent": "OldSecurePass123!",
  "password": "NewSecurePass123!",
  "passwordConfirm": "NewSecurePass123!"
}

RESPONSE (200 OK):
{
  "status": "success",
  "token": "new_access_token",
  "data": {
    "user": { ... }
  }
}

ERROR RESPONSES:
- 401: "Current password is incorrect"
- 400: "Passwords do not match"
- 400: "New password cannot be same as current password"
```

### 4. Delete Account (Soft Delete)

```
DELETE {{base_url}}/users/deleteMe
Authorization: Bearer <token>

RESPONSE (204 No Content):
{}

SIDE EFFECTS:
- Sets user.active = false (soft delete)
- User can no longer login
- Account data remains in database
- Can be reactivated by admin
```

---

## ✈️ Flight Management APIs

### 1. Get All Flights

```
GET {{base_url}}/flights
Authorization: Optional

OPTIONAL QUERY PARAMETERS:
- page: number (default: 1)
- limit: number (default: 100)
- sort: string
- fields: string (comma-separated field names)
- status: string (filter by status), e.g. `{{base_url}}/flights?status=DELAYED`

RESPONSE (200 OK):
{
  "status": "success",
  "results": 20,
  "data": {
    "flights": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "flightNumber": "AA1234",
        "status": "ON_TIME",
        "gate": "A23",
        "route": { "from": "New York", "fromCode": "JFK", "to": "Los Angeles", "toCode": "LAX" }
      }
    ]
  }
}
```

### 2. Get Updated Flights (Live Status Changes)

```
GET {{base_url}}/flights/updated
Authorization: Optional

OPTIONAL QUERY PARAMETERS:
- limit: number (default: 30)
- sort: string (default: "-updatedAt")

RESPONSE (200 OK):
{
  "status": "success",
  "data": {
    "flights": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "flightNumber": "AA1234",
        "airline": "American Airlines",
        "aircraft": "Boeing 737",
        "status": "DELAYED",  // ON_TIME, DELAYED, CANCELLED, BOARDING
        "gate": "A23",
        "terminal": "1",
        "route": {
          "from": "New York",
          "fromCode": "JFK",
          "to": "Los Angeles",
          "toCode": "LAX"
        },
        "departure": {
          "scheduledTime": "2026-04-21T14:30:00Z",
          "estimatedTime": "2026-04-21T14:50:00Z",
          "actualTime": null
        },
        "arrival": {
          "scheduledTime": "2026-04-21T17:45:00Z",
          "estimatedTime": "2026-04-21T18:05:00Z",
          "actualTime": null
        },
        "updatedAt": "2026-04-21T14:20:00Z"
      }
    ]
  }
}
```

### 2. Scan Boarding Pass

```
POST {{base_url}}/flights/scan
Authorization: Bearer <token>
Content-Type: application/json

REQUEST BODY:
{
  "barcodeData": "M1AAL2345 EDOE/JOHN    JFKLAX 1234567890123456789012..."
  // IATA BCBP (Resolution 792) format barcode string
}

RESPONSE (200 OK):
{
  "status": "success",
  "data": {
    "flight": {
      "_id": "507f1f77bcf86cd799439011",
      "flightNumber": "AA2345",
      "gate": "A12",
      "departure": {
        "scheduledTime": "2026-04-21T14:30:00Z",
        "estimatedTime": "2026-04-21T14:30:00Z"
      },
      "arrival": {
        "scheduledTime": "2026-04-21T17:45:00Z"
      },
      "route": {
        "toCode": "LAX",
        "to": "Los Angeles"
      }
    },
    "weather": {
      "temp": "28°C",
      "condition": "Partly Cloudy"
    },
    "weatherAtArrival": {
      "temp": "28°C",
      "condition": "Partly Cloudy"
    },
    "recommendations": [
      {
        "name": "Egyptian Museum",
        "category": "Culture",
        "description": "World-class collection of ancient Egyptian antiquities.",
        "rating": 4.7,
        "vicinity": "Tahrir Square, Cairo",
        "image": "https://upload.wikimedia.org/...",
        "imageCredit": "Wikimedia Commons",
        "googleMapsLink": "https://www.google.com/maps/search/?api=1&query=..."
      }
    ],
    "arrivalTime": "10:00 PM",
    "destinationLocalTime": "6:42 PM",
    "localTime": "6:42 PM"
  }
}

FIELD NOTES: see [Get Active Tracked Flight](#6-get-active-tracked-flight) — this endpoint returns the same weather/time/recommendation shape after creating the flight track from the scanned boarding pass.

SIDE EFFECTS:
- Creates/updates an active `FlightTrack` for the user (same as `POST /flights/:id/track`)

ERROR RESPONSES:
- 400: "Scan data missing"
- 400: "Invalid boarding pass format"
- 404: "Flight not found"
```

### 3. Get Flight Update History

```
GET {{base_url}}/flights/:id/updates
Authorization: Bearer <token>

URL PARAMETER:
- id: MongoDB ObjectId of flight

RESPONSE (200 OK):
{
  "status": "success",
  "results": 3,
  "data": {
    "updates": [
      {
        "_id": "507f1f77bcf86cd799439020",
        "flight": "507f1f77bcf86cd799439011",
        "field": "status",
        "oldValue": "ON_TIME",
        "newValue": "DELAYED",
        "recordedAt": "2026-04-21T14:20:00Z"
      }
    ]
  }
}

ERROR RESPONSES:
- 404: "Flight not found"
```

### 4. Get Single Flight Details

```
GET {{base_url}}/flights/:id
Authorization: Bearer <token>

URL PARAMETER:
- id: MongoDB ObjectId of flight

RESPONSE (200 OK):
{
  "status": "success",
  "data": {
    "flight": {
      "_id": "507f1f77bcf86cd799439011",
      "flightNumber": "AA1234",
      "airline": "American Airlines",
      "aircraft": "Boeing 737-800",
      "status": "ON_TIME",
      "gate": "A23",
      "terminal": "1",
      "capacity": 150,
      "route": {
        "from": "New York",
        "fromCode": "JFK",
        "to": "Los Angeles",
        "toCode": "LAX"
      },
      "departure": {
        "scheduledTime": "2026-04-21T14:30:00Z",
        "estimatedTime": "2026-04-21T14:30:00Z",
        "actualTime": null
      },
      "arrival": {
        "scheduledTime": "2026-04-21T17:45:00Z",
        "estimatedTime": "2026-04-21T17:45:00Z",
        "actualTime": null
      },
      "createdAt": "2026-04-20T10:00:00Z",
      "updatedAt": "2026-04-21T14:20:00Z"
    }
  }
}

ERROR RESPONSES:
- 404: "Flight not found"
```

### 5. Track a Flight

```
POST {{base_url}}/flights/:id/track
Authorization: Bearer <token>
Content-Type: application/json

URL PARAMETER:
- id: MongoDB ObjectId of flight

OPTIONAL:
- `reminderMinutes`: number — minutes before departure to remind the user (default: 25)

REQUEST BODY:
{
  "reminderMinutes": 30
}

RESPONSE (200 OK):
{
  "status": "success",
  "data": {
    "track": {
      "_id": "507f1f77bcf86cd799439012",
      "user": "507f1f77bcf86cd799439011",
      "flight": "507f1f77bcf86cd799439010",
      "isActive": true,
      "reminderMinutes": 30,
      "createdAt": "2026-04-21T14:30:00Z"
    }
  }
}

SIDE EFFECTS:
- Creates or updates flight tracking record for user
- Sets up push notification reminder
- Marks flight as tracked in user's active flights

ERROR RESPONSES:
- 404: "Flight not found"
- 401: Unauthorized
```

### 6. Get Active Tracked Flight

```
GET {{base_url}}/flights/my-flight
Authorization: Bearer <token>

RESPONSE (200 OK):
{
  "status": "success",
  "data": {
    "flight": {
      "_id": "507f1f77bcf86cd799439010",
      "flightNumber": "AA1234",
      "status": "ON_TIME",
      "gate": "A23",
      "route": {
        "from": "New York",
        "fromCode": "JFK",
        "to": "Los Angeles",
        "toCode": "LAX"
      },
      "departure": {
        "scheduledTime": "2026-04-21T14:30:00Z",
        "estimatedTime": "2026-04-21T14:30:00Z"
      },
      "arrival": {
        "scheduledTime": "2026-04-21T17:45:00Z"
      }
    },
    "airport": {
      "name": "Los Angeles International",
      "code": "LAX",
      "city": "Los Angeles",
      "timezone": "America/Los_Angeles"
    },
    "weather": {
      "temp": "28°C",
      "condition": "Partly Cloudy"
    },
    "weatherAtArrival": {
      "temp": "28°C",
      "condition": "Partly Cloudy"
    },
    "recommendations": [
      {
        "name": "Egyptian Museum",
        "category": "Culture",
        "description": "World-class collection of ancient Egyptian antiquities.",
        "rating": 4.7,
        "vicinity": "Tahrir Square, Cairo",
        "image": "https://upload.wikimedia.org/...",
        "imageCredit": "Wikimedia Commons",
        "googleMapsLink": "https://www.google.com/maps/search/?api=1&query=..."
      }
    ],
    "arrivalTime": "10:00 PM",
    "destinationLocalTime": "6:42 PM",
    "localTime": "6:42 PM"
  }
}

FIELD NOTES:
- `flight`: the tracked flight, including `_id`, `flightNumber`, and current `status`.
- `weather` / `weatherAtArrival`: identical — forecasted weather at the destination closest to the flight's scheduled arrival time (falls back to current weather if no forecast is available within 24h).
- `arrivalTime`: the flight's scheduled arrival time converted to the destination's local timezone — i.e. what time it will be, locally, when you land.
- `destinationLocalTime` / `localTime`: identical — the destination's current local time right now (not the arrival time).
- `recommendations`: top places to visit at the destination (from the recommendation microservice, max 6, with static fallbacks if that service is unavailable).

ERROR RESPONSES:
- 404: "No active tracking"
- 401: Unauthorized
- 400: "Flight destination code missing"
```

### 7. Cancel Flight Tracking

```
PATCH {{base_url}}/flights/:id/cancel-track
Authorization: Bearer <token>

URL PARAMETER:
- id: MongoDB ObjectId of flight

RESPONSE (200 OK):
{
  "status": "success",
  "message": "Flight tracking cancelled"
}

SIDE EFFECTS:
- Sets isActive = false for flight tracking
- Stops push notifications
- Removes flight from active tracked list

ERROR RESPONSES:
- 404: "Flight tracking not found"
- 401: Unauthorized
```

### 8. Create Flight (Admin Only)

```
POST {{base_url}}/flights
Authorization: Bearer <token> (Admin role required)
Content-Type: application/json

REQUEST BODY:
{
  "flightNumber": "AA1234",
  "airline": "American Airlines",
  "aircraft": "Boeing 737",
  "status": "ON_TIME",
  "gate": "A23",
  "terminal": "1",
  "route": {
    "from": "New York",
    "fromCode": "JFK",
    "to": "Los Angeles",
    "toCode": "LAX"
  },
  "departure": { "scheduledTime": "2026-04-21T14:30:00Z" },
  "arrival": { "scheduledTime": "2026-04-21T17:45:00Z" }
}

RESPONSE (201 Created):
{
  "status": "success",
  "data": {
    "flight": { ... }
  }
}

ERROR RESPONSES:
- 401: Unauthorized
- 403: Forbidden (non-admin)
- 400: Validation errors
```

### 9. Update Flight (Admin Only)

```
PATCH {{base_url}}/flights/:id
Authorization: Bearer <token> (Admin role required)
Content-Type: application/json

URL PARAMETER:
- id: MongoDB ObjectId of flight

REQUEST BODY (whitelisted fields only):
{
  "status": "DELAYED",
  "departure": {
    "gate": "B12",
    "estimatedTime": "2026-04-21T15:00:00Z"
  }
}

OPTIONAL:
- Any of: `status`, `departure.gate`, `departure.actualTime`, `departure.estimatedTime`, `departure.scheduledTime`, `departure.boardingTime`, `departure.checkInCounter`, `arrival.actualTime`, `arrival.estimatedTime`, `arrival.scheduledTime`, `arrival.gate` — all optional, only send fields you want changed.

RESPONSE (200 OK):
{
  "status": "success",
  "data": {
    "flight": { ... }
  }
}

SIDE EFFECTS:
- Any changed field is recorded in the flight's update history (`GET /flights/:id/updates`)

ERROR RESPONSES:
- 401: Unauthorized
- 403: Forbidden (non-admin)
- 404: "Not found"
```

### 10. Delete Flight (Admin Only)

```
DELETE {{base_url}}/flights/:id
Authorization: Bearer <token> (Admin role required)

URL PARAMETER:
- id: MongoDB ObjectId of flight

RESPONSE (204 No Content):
{}

ERROR RESPONSES:
- 401: Unauthorized
- 403: Forbidden (non-admin)
- 404: "Not found"
```

---

## 🗺️ Airport Services APIs

### 1. Get All Services

```
GET {{base_url}}/services
Authorization: Optional

OPTIONAL QUERY PARAMETERS:
- page: number (default: 1)
- limit: number (default: 100)
- sort: string (default: "createdAt")
- fields: string (comma-separated field names)
- category: string (filter by category), e.g. `{{base_url}}/services?category=COUNTERS`

RESPONSE (200 OK):
{
  "status": "success",
  "results": 10,
  "data": {
    "services": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "name": "Check-in Counter A",
        "category": "COUNTERS",
        "description": "International departure counter",
        "location": {
          "type": "Point",
          "coordinates": [-74.0060, 40.6413]
        },
        "terminal": "1",
        "floor": "1",
        "operatingHours": {
          "open": "05:00",
          "close": "23:00"
        },
        "status": "Open",
        "rating": 4.5,
        "reviews": 120,
        "phone": "+1-800-123-4567",
        "email": "info@jfk-airport.com"
      }
    ]
  }
}
```

### 2. Search Services

```
GET {{base_url}}/services/search
Authorization: Optional

REQUEST QUERY:
- q: string (Required) — search query, e.g. `{{base_url}}/services/search?q=Shop`

RESPONSE (200 OK):
{
  "status": "success",
  "data": {
    "services": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "name": "American Airlines Lounge",
        "category": "VIP_SERVICES",
        ...
      },
      {
        "_id": "507f1f77bcf86cd799439012",
        "name": "Priority Pass Lounge",
        ...
      }
    ]
  }
}

ERROR RESPONSES:
- 400: "Search query is required"
```

### 3. Get Nearby Services (Geospatial)

```
GET {{base_url}}/services/nearby
Authorization: Optional

REQUEST QUERY:
- lng: number (Required) — longitude
- lat: number (Required) — latitude

OPTIONAL QUERY PARAMETERS:
- distance: number (meters, default: 500)

RESPONSE (200 OK):
{
  "status": "success",
  "data": {
    "services": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "name": "Duty Free Shop",
        "category": "SHOPS",
        "location": {
          "type": "Point",
          "coordinates": [-74.0060, 40.6413]
        },
        "distance": 150
      }
    ]
  }
}

ERROR RESPONSES:
- 400: "Longitude and Latitude are required"
```

### 4. Get Counter Statistics

```
GET {{base_url}}/services/counters/stats
Authorization: Optional

RESPONSE (200 OK):
{
  "status": "success",
  "data": {
    "total": 24,
    "open": 18,
    "closed": 6
  }
}
```

### 5. Get Single Service Details

```
GET {{base_url}}/services/:id
Authorization: Optional

URL PARAMETER:
- id: MongoDB ObjectId of service

RESPONSE (200 OK):
{
  "status": "success",
  "data": {
    "service": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Check-in Counter A",
      "category": "COUNTERS",
      "description": "International departure counter for non-US destinations",
      "location": {
        "type": "Point",
        "coordinates": [-74.0060, 40.6413]
      },
      "terminal": "1",
      "floor": "1",
      "section": "North Wing",
      "operatingHours": {
        "open": "05:00",
        "close": "23:00"
      },
      "status": "Open",
      "rating": 4.5,
      "reviews": 120,
      "facilities": ["Wheelchair Accessible", "Family Room"],
      "amenities": ["WiFi", "Charging Ports"],
      "phone": "+1-800-123-4567",
      "email": "info@jfk-airport.com",
      "website": "https://jfk-airport.com",
      "staff": 5,
      "estimatedWaitTime": 15,
      "createdAt": "2026-04-20T10:00:00Z",
      "updatedAt": "2026-04-21T14:20:00Z"
    }
  }
}

ERROR RESPONSES:
- 404: "Service not found"
```

### 6. Create Service (Admin Only)

```
POST {{base_url}}/services
Authorization: Bearer <token> (Admin role required)
Content-Type: application/json

REQUEST BODY:
{
  "name": "New Service",
  "category": "COUNTERS",  // COUNTERS, VIP_SERVICES, SHOPS, RESTAURANTS, etc.
  "description": "Service description",
  "terminal": "1",
  "floor": "1",
  "location": {
    "type": "Point",
    "coordinates": [-74.0060, 40.6413]
  },
  "operatingHours": {
    "open": "05:00",
    "close": "23:00"
  },
  "status": "Open",
  "phone": "+1-800-123-4567",
  "email": "info@service.com"
}

RESPONSE (201 Created):
{
  "status": "success",
  "data": {
    "service": { ... }
  }
}

ERROR RESPONSES:
- 401: Unauthorized
- 403: "Only admins can create services"
- 400: Validation errors
```

### 7. Update Service (Admin Only)

```
PATCH {{base_url}}/services/:id
Authorization: Bearer <token> (Admin role required)
Content-Type: application/json

REQUEST BODY:
{
  "status": "Closed",
  "estimatedWaitTime": 25
}

RESPONSE (200 OK):
{
  "status": "success",
  "data": {
    "service": { ... }
  }
}

ERROR RESPONSES:
- 401: Unauthorized
- 403: "Only admins can update services"
- 404: "Service not found"
```

### 8. Delete Service (Admin Only)

```
DELETE {{base_url}}/services/:id
Authorization: Bearer <token> (Admin role required)

RESPONSE (204 No Content):
{}

ERROR RESPONSES:
- 401: Unauthorized
- 403: "Only admins can delete services"
- 404: "Service not found"
```

---

## 🗺️ Indoor Navigation APIs

### 1. Get Navigation Nodes

```
GET {{base_url}}/navigation/nodes
Authorization: Optional

OPTIONAL QUERY PARAMETERS:
- level: number (filter by floor level, e.g., 0, 1, 2)

RESPONSE (200 OK):
{
  "status": "success",
  "results": 15,
  "data": [
    {
      "nodeId": "gate_a1",
      "name": "Gate A1",
      "type": "gate",  // gate, elevator, path, shop, etc.
      "level": 1,
      "location": {
        "type": "Point",
        "coordinates": [4.7641, 52.3086]
      },
      "connectedTo": [
        { "nodeId": "path_01", "distanceMeters": 15 }
      ]
    }
  ]
}
```

### 2. Find Path (Dijkstra)

```
POST {{base_url}}/navigation/find-path
Authorization: Optional
Content-Type: application/json

REQUEST BODY:
{
  "fromNodeId": "gate_a1",
  "toNodeId": "shop_duty_free"
}

RESPONSE (200 OK):
{
  "status": "success",
  "data": {
    "path": [
      { "nodeId": "gate_a1", ... },
      { "nodeId": "path_01", ... },
      { "nodeId": "shop_duty_free", ... }
    ],
    "totalNodes": 3
  }
}

ERROR RESPONSES:
- 400: "fromNodeId and toNodeId are required"
- 404: "No path found"
```

---

## 🏠 Home Dashboard API

### Get Dashboard Data

```
GET {{base_url}}/home
Authorization: Optional (Returns general data if not authenticated)

RESPONSE (200 OK):
{
  "status": "success",
  "data": {
    "updatedFlights": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "flightNumber": "AA1234",
        "status": "DELAYED",
        "gate": "A23",
        "departure": {
          "scheduledTime": "2026-04-21T14:30:00Z",
          "estimatedTime": "2026-04-21T14:50:00Z"
        }
      }
    ],
    "featuredServices": [
      {
        "_id": "507f1f77bcf86cd799439012",
        "name": "Premium Lounge",
        "category": "VIP_SERVICES",
        "rating": 4.8,
        "reviews": 250
      }
    ],
    "metrics": {
      "activeUsers": 1250,
      "flightsTracked": 450,
      "delays": 12,
      "airportsCovered": 150,
      "userRating": "4.6/5"
    },
    "categories": [
      "COUNTERS",
      "FINANCIAL",
      "VIP_SERVICES",
      "ACCESSIBILITY",
      "SHOPS",
      "RESTAURANTS"
    ],
    "userTrack": {  // Only if authenticated
      "flight": {
        "flightNumber": "AA1234",
        "gate": "A23"
      }
    }
  }
}

CACHING:
- Dashboard data cached for 5 minutes
- Per-user tracked flight data not cached
```

---

## 🤖 Chat Assistant API

### Send Message to AI Assistant

```
POST {{base_url}}/chat/query
Authorization: Bearer <token>
Content-Type: application/json

REQUEST BODY:
{
  "message": "Where is my gate?"
}

OPTIONAL:
- `history`: array — last 4 exchanges (8 items) for multi-turn context, e.g. `[{ "role": "user", "text": "Hi, I need help." }, { "role": "assistant", "text": "Hello! I'm GateBuddy. How can I help you?" }]`

RESPONSE (200 OK):
{
  "status": "success",
  "data": {
    "reply": "Your flight KL1234 departs from Gate D7 in Terminal D. Boarding starts at 2:00 PM. Head straight from security and follow the D-gates signs — about a 5-minute walk."
  }
}

LIVE CONTEXT THE CHATBOT HAS ACCESS TO (automatically, from DB):
- User's active tracked flight (gate, status, boarding time, check-in counter)
- Any flight mentioned by number in the message (e.g. "What is KL205 status?")
- All open airport services (restaurants, lounges, shops, ATMs, accessibility)
- Terminal navigation nodes and zone layout
- Airport FAQs (Wi-Fi, prayer rooms, lost luggage, transport links)
- Live airport-wide delay/cancellation counts

BEHAVIOR:
- Powered by Google Gemini 2.5 Flash
- Max ~120 words per reply
- Responds in the same language the user writes in
- Never invents gate numbers or services not in the database
- Supports multi-turn conversation via the history array

ERROR RESPONSES:
- 401: Unauthorized
- 400: "Message is required"
```

---

## 🔔 Notification APIs

### 1. Get User Notifications

```
GET {{base_url}}/notifications
Authorization: Bearer <token>

OPTIONAL QUERY PARAMETERS:
- page: number (default: 1)
- limit: number (default: 20)
- read: boolean (filter by read status)

RESPONSE (200 OK):
{
  "status": "success",
  "results": 15,
  "data": {
    "notifications": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "user": "507f1f77bcf86cd799439010",
        "type": "FLIGHT_UPDATE",
        "title": "Upcoming Flight Reminder",
        "message": "Your flight KL1234 departs in approximately 25 minutes. Gate: D7.",
        "read": false,
        "createdAt": "2026-04-21T14:20:00Z"
      },
      {
        "_id": "507f1f77bcf86cd799439013",
        "type": "BOARDING_REMINDER",
        "title": "Boarding in 30 minutes",
        "message": "Please head to your gate for boarding",
        "read": false,
        "createdAt": "2026-04-21T14:15:00Z"
      }
    ]
  }
}

NOTIFICATION TYPES:
- FLIGHT_UPDATE: Flight status changes
- BOARDING_REMINDER: Boarding time approaching
- GATE_CHANGE: Gate assignment change
- DELAY_ALERT: Flight delay notification
- SERVICE_ALERT: Airport service availability
- RECOMMENDATION: Destination recommendations
- SYSTEM: General system notifications
```

### 2. Get Unread Notification Count

```
GET {{base_url}}/notifications/unread-count
Authorization: Bearer <token>

RESPONSE (200 OK):
{
  "status": "success",
  "data": {
    "unreadCount": 5
  }
}
```

### 3. Mark Notification as Read

```
PATCH {{base_url}}/notifications/:id/read
Authorization: Bearer <token>

URL PARAMETER:
- id: MongoDB ObjectId of notification

RESPONSE (200 OK):
{
  "status": "success",
  "data": {
    "notification": {
      "_id": "507f1f77bcf86cd799439011",
      "read": true
    }
  }
}

ERROR RESPONSES:
- 404: "Notification not found"
- 401: Unauthorized
```

### 4. Mark All Notifications as Read

```
PATCH {{base_url}}/notifications/read-all
Authorization: Bearer <token>

RESPONSE (200 OK):
{
  "status": "success",
  "message": "All notifications marked as read",
  "count": 10
}
```

### 5. Subscribe to Push Notifications

```
POST {{base_url}}/notifications/subscribe
Authorization: Bearer <token>
Content-Type: application/json

REQUEST BODY:
{
  "flightId": "507f1f77bcf86cd799439010",
  "deviceToken": "cP_JfT2QVgY:APA91bE..."
}

OPTIONAL:
- `channels`: array — notification channels to subscribe to, e.g. `["push", "email"]`

RESPONSE (200 OK):
{
  "status": "success",
  "message": "Successfully subscribed to physical device notifications",
  "data": {
    "flightId": "507f1f77bcf86cd799439010",
    "channels": ["push"],
    "deviceToken": "cP_JfT2QV..."
  }
}

ERROR RESPONSES:
- 400: "Flight ID and Device Token are required for push notifications"
- 401: Unauthorized
```

### 6. Delete Notification

```
DELETE {{base_url}}/notifications/:id
Authorization: Bearer <token>

URL PARAMETER:
- id: MongoDB ObjectId of notification

RESPONSE (204 No Content):
{}

ERROR RESPONSES:
- 404: "No notification found with that ID"
- 401: Unauthorized
```

---

## 📱 Device Management APIs

### 1. Register Device for Push Notifications

```
POST {{base_url}}/devices/register
Authorization: Bearer <token>
Content-Type: application/json

REQUEST BODY:
{
  "deviceToken": "cP_JfT2QVgY:APA91bE...",  // FCM token
  "deviceType": "ios"  // "ios", "android", "web"
}

RESPONSE (201 Created):
{
  "status": "success",
  "data": {
    "device": {
      "_id": "507f1f77bcf86cd799439011",
      "user": "507f1f77bcf86cd799439010",
      "fcmToken": "cP_JfT2QVgY:APA91bE...",
      "deviceType": "ios",
      "deviceName": "iPhone 12",
      "isActive": true,
      "lastActiveAt": "2026-04-21T14:30:00Z",
      "createdAt": "2026-04-21T14:30:00Z"
    }
  }
}

SIDE EFFECTS:
- Registers device for push notifications
- Enables FCM message delivery
- Updates device last active timestamp

ERROR RESPONSES:
- 401: Unauthorized
- 400: "FCM token is required"
```

### 2. Unregister Device

```
POST {{base_url}}/devices/unregister
Authorization: Bearer <token>
Content-Type: application/json

REQUEST BODY:
{
  "deviceToken": "cP_JfT2QVgY:APA91bE..."
}

RESPONSE (200 OK):
{
  "status": "success",
  "message": "Device unregistered successfully"
}

SIDE EFFECTS:
- Removes device from active push notification list
- User will no longer receive push notifications on this device
- Marks device as inactive in database
```

---

## 📋 FAQ APIs

### 1. Get All FAQs

```
GET {{base_url}}/faqs
Authorization: Optional

OPTIONAL QUERY PARAMETERS:
- page: number (default: 1)
- limit: number (default: 50)
- category: string (filter by category)

RESPONSE (200 OK):
{
  "status": "success",
  "results": 25,
  "data": {
    "faqs": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "question": "How do I track my flight?",
        "answer": "You can track your flight by scanning your boarding pass using the mobile app camera or by entering your flight number manually.",
        "category": "FLIGHTS",
        "order": 1,
        "helpful": 145,
        "createdAt": "2026-04-20T10:00:00Z"
      },
      {
        "_id": "507f1f77bcf86cd799439012",
        "question": "Which airport lounges are available?",
        "answer": "We partner with multiple lounge operators...",
        "category": "SERVICES",
        "order": 2,
        "helpful": 89,
        "createdAt": "2026-04-20T10:00:00Z"
      }
    ]
  }
}

FAQ CATEGORIES:
- FLIGHTS
- SERVICES
- AUTHENTICATION
- ACCOUNT
- NOTIFICATIONS
- TECHNICAL
```

### 2. Get Single FAQ

```
GET {{base_url}}/faqs/:id
Authorization: Optional

URL PARAMETER:
- id: MongoDB ObjectId of FAQ

RESPONSE (200 OK):
{
  "status": "success",
  "data": {
    "faq": {
      "_id": "507f1f77bcf86cd799439011",
      "question": "How do I track my flight?",
      "answer": "Detailed answer with instructions...",
      "category": "FLIGHTS",
      "relatedFaqs": [
        "507f1f77bcf86cd799439012",
        "507f1f77bcf86cd799439013"
      ],
      "helpful": 145,
      "createdAt": "2026-04-20T10:00:00Z"
    }
  }
}

ERROR RESPONSES:
- 404: "FAQ not found"
```

---

## 📊 Stats & Analytics APIs

### 1. Get Global Statistics

```
GET {{base_url}}/stats
Authorization: Optional

RESPONSE (200 OK):
{
  "status": "success",
  "data": {
    "metrics": {
      "activeUsers": 1250,
      "flightsTracked": 450,
      "delays": 12,
      "airportsCovered": 1,
      "userRating": "4.8/5"
    }
  }
}
```

### 2. Submit Service Rating

```
POST {{base_url}}/stats/rate
Authorization: Bearer <token>
Content-Type: application/json

REQUEST BODY:
{
  "rating": 5
}

OPTIONAL:
- `review`: string — free-text feedback, e.g. `"Excellent app! Very helpful for finding my gate."`

RESPONSE (201 Created):
{
  "status": "success",
  "data": {
    "rating": {
      "_id": "507f1f77bcf86cd799439011",
      "user": "507f1f77bcf86cd799439010",
      "rating": 5,
      "review": "Excellent app! Very helpful for finding my gate.",
      "createdAt": "2026-04-21T14:30:00Z"
    }
  }
}

VALIDATION:
- `rating`: 1-5 (Required)
- `review`: Optional text feedback
- Note: Users can only submit ONE rating for the app (enforced by unique user field).

ERROR RESPONSES:
- 401: Unauthorized
- 400: "Rating must be between 1 and 5"
- 400: "Duplicate key error" (if user already rated)
```

---

## 🛡️ Admin APIs

All endpoints in this section require `role: "admin"` (`Authorization: Bearer <admin_token>`). Flight admin CRUD (`POST/PATCH/DELETE /flights`) is documented in [Flight Management APIs](#-flight-management-apis); service admin CRUD (`POST/PATCH/DELETE /services`) is documented in [Airport Services APIs](#-airport-services-apis).

### 1. Get All Users

```
GET {{base_url}}/users
Authorization: Bearer <admin_token>

OPTIONAL QUERY PARAMETERS:
- page: number (default: 1)
- limit: number (default: 100)
- sort: string
- fields: string (comma-separated field names)
- role: string (filter by role), e.g. `{{base_url}}/users?role=admin`

RESPONSE (200 OK):
{
  "status": "success",
  "results": 150,
  "data": {
    "data": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "user",
        "createdAt": "2026-04-20T10:00:00Z"
      }
    ]
  }
}
```

### 2. Create User (Admin Only)

```
POST {{base_url}}/users
Authorization: Bearer <admin_token>
Content-Type: application/json

RESPONSE (400 Bad Request):
{
  "status": "fail",
  "message": "Please use POST /users/signup to create a new account."
}

NOTE:
- This route is intentionally disabled. Account creation must go through `POST /users/signup`.
```

### 3. Get User by ID (Admin Only)

```
GET {{base_url}}/users/:id
Authorization: Bearer <admin_token>

URL PARAMETER:
- id: MongoDB ObjectId of user

RESPONSE (200 OK):
{
  "status": "success",
  "data": {
    "data": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "active": true,
      "createdAt": "2026-04-20T10:00:00Z"
    }
  }
}

ERROR RESPONSES:
- 404: "No document found with that ID"
```

### 4. Update User (Admin Only)

```
PATCH {{base_url}}/users/:id
Authorization: Bearer <admin_token>
Content-Type: application/json

URL PARAMETER:
- id: MongoDB ObjectId of user

REQUEST BODY:
{
  "role": "admin",
  "active": true
}

RESPONSE (200 OK):
{
  "status": "success",
  "data": {
    "data": { ... }
  }
}

ERROR RESPONSES:
- 404: "No document found with that ID"
```

### 5. Delete User (Admin Only)

```
DELETE {{base_url}}/users/:id
Authorization: Bearer <admin_token>

URL PARAMETER:
- id: MongoDB ObjectId of user

RESPONSE (204 No Content):
{}

ERROR RESPONSES:
- 404: "No document found with that ID"
```

### 6. Get Admin Dashboard Stats

```
GET {{base_url}}/admin/dashboard
Authorization: Bearer <admin_token>

RESPONSE (200 OK):
{
  "status": "success",
  "data": {
    "metrics": {
      "totalUsers": 1250,
      "totalFlights": 480,
      "unreadNotifications": 34,
      "averageRating": 4.6,
      "timestamp": "2026-07-03T10:00:00Z"
    }
  }
}
```

---

## ⚠️ Error Codes Reference

| Code | Meaning             | Example                                  |
| :--- | :------------------ | :--------------------------------------- |
| 200  | OK                  | Successful request                       |
| 201  | Created             | Resource successfully created            |
| 204  | No Content          | Successful deletion                      |
| 400  | Bad Request         | Invalid input/validation error           |
| 401  | Unauthorized        | Missing/invalid authentication           |
| 403  | Forbidden           | Authenticated but lacks permission       |
| 404  | Not Found           | Resource doesn't exist                   |
| 409  | Conflict            | Resource already exists/conflict         |
| 423  | Locked              | Account locked (too many login attempts) |
| 500  | Server Error        | Internal server error                    |
| 503  | Service Unavailable | Temporary service unavailable            |

---

## 🔐 Authentication Methods

### 1. **JWT Bearer Token** (Recommended for Mobile/SPA)

```
Header: Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Token Expiry: 90 days
Refresh: POST {{base_url}}/users/refresh
```

### 2. **HttpOnly Cookie** (Automatic after login)

```
Cookie Name: jwt
Secure: true (HTTPS only in production)
HttpOnly: true (Not accessible via JavaScript)
SameSite: Strict
Expiry: 90 days
```

### 3. **OAuth 2.0** (Social Login)

```
Providers: Google, GitHub, Facebook
Response: JWT token + HttpOnly cookies
Auto-account creation on first login
```

---

## 📈 Rate Limiting

| Endpoint Type  | Limit        | Window     |
| :------------- | :----------- | :--------- |
| General API    | 100 requests | 15 minutes |
| Login          | 5 attempts   | 15 minutes |
| Signup         | 3 per IP     | 1 hour     |
| Password Reset | 3 attempts   | 1 hour     |
| OAuth          | 10 per IP    | 15 minutes |

---

**API Version**: 1.0.0
**Last Updated**: July 2026
