# Grabeat Backend Architecture

## Table of Contents

- [Overview](#overview)
- [Architecture Diagram](#architecture-diagram)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Core Components](#core-components)
- [Authentication Flow](#authentication-flow)
- [Token Management](#token-management)
- [Request Lifecycle](#request-lifecycle)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Security Features](#security-features)
- [Environment Configuration](#environment-configuration)

---

## Overview

The Grabeat backend is a **RESTful API** built with **Node.js** and **Express.js**, following a **layered architecture pattern** that ensures separation of concerns, maintainability, and scalability. The system uses **PostgreSQL** as the primary database with **Prisma ORM** for type-safe database operations, and **Redis** for high-performance token management.

### Key Features

- 🔐 **JWT-based authentication** with Redis whitelist
- 🗄️ **PostgreSQL database** with Prisma ORM
- ⚡ **Redis caching** for token management
- 🛡️ **Security-first design** with Helmet.js
- 📝 **Request validation** with custom middleware
- 🔄 **Multi-device session management**
- 🚀 **RESTful API design**

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                          CLIENT LAYER                                │
│                   (Mobile App / Web Browser)                         │
└──────────────────────────┬──────────────────────────────────────────┘
                           │
                           │ HTTP/HTTPS Requests
                           │ (JSON)
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      MIDDLEWARE LAYER                                │
│  ┌──────────┐  ┌──────────┐  ┌───────────┐  ┌──────────────────┐  │
│  │  Helmet  │  │   CORS   │  │  Logger   │  │  Body Parser     │  │
│  │ Security │  │  Policy  │  │ Timestamp │  │ JSON/URL Encoded │  │
│  └──────────┘  └──────────┘  └───────────┘  └──────────────────┘  │
└──────────────────────────┬──────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│                       ROUTING LAYER                                  │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  Route: /api/auth                                            │   │
│  │  ├─ POST /login        (Public)                             │   │
│  │  ├─ POST /register     (Public)                             │   │
│  │  ├─ POST /logout       (Protected - Auth Middleware)        │   │
│  │  └─ POST /logout-all   (Protected - Auth Middleware)        │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  Route: /api/users     (Future)                             │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  Route: /api/orders    (Future)                             │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  Route: /api/products  (Future)                             │   │
│  └─────────────────────────────────────────────────────────────┘   │
└──────────────────────────┬──────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    VALIDATION LAYER                                  │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Request Validation Middleware                                │  │
│  │  • validateLogin()  - Email & Password validation            │  │
│  │  • validateRegister() - Full registration data validation    │  │
│  │  • Email format validation (regex)                           │  │
│  │  • Password strength rules (min 8 chars)                     │  │
│  └──────────────────────────────────────────────────────────────┘  │
└──────────────────────────┬──────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│                   AUTHENTICATION LAYER                               │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  authenticateToken() Middleware                               │  │
│  │  1. Extract Bearer token from Authorization header           │  │
│  │  2. Verify JWT signature & expiration                        │  │
│  │  3. Check token against Redis whitelist                      │  │
│  │  4. Attach user data to request object                       │  │
│  └──────────────────────────────────────────────────────────────┘  │
└──────────────────────────┬──────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     CONTROLLER LAYER                                 │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Auth Controller                                              │  │
│  │  • registerController() - Handle user registration           │  │
│  │  • loginController()    - Handle user login                  │  │
│  │  • logoutController()   - Handle single device logout        │  │
│  │  • logoutAllController() - Handle multi-device logout        │  │
│  │                                                               │  │
│  │  Responsibilities:                                            │  │
│  │  • HTTP request/response handling                            │  │
│  │  • JWT token generation                                      │  │
│  │  • Error handling & status codes                             │  │
│  └──────────────────────────────────────────────────────────────┘  │
└──────────────────────────┬──────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      SERVICE LAYER                                   │
│  ┌───────────────────────────┐  ┌──────────────────────────────┐   │
│  │   Auth Service            │  │   Token Service              │   │
│  │                           │  │                              │   │
│  │ • registerUser()          │  │ • storeToken()               │   │
│  │ • loginUser()             │  │ • isTokenValid()             │   │
│  │ • logoutUser()            │  │ • getTokenData()             │   │
│  │ • logoutAllDevices()      │  │ • invalidateToken()          │   │
│  │                           │  │ • invalidateAllUserTokens()  │   │
│  │ Business Logic:           │  │ • getUserActiveTokens()      │   │
│  │ • Password hashing        │  │ • refreshToken()             │   │
│  │ • User validation         │  │                              │   │
│  │ • Data sanitization       │  │ Redis Operations:            │   │
│  └───────────────────────────┘  │ • Set with TTL               │   │
│                                  │ • Token whitelisting         │   │
│                                  │ • Automatic expiration       │   │
│                                  └──────────────────────────────┘   │
└──────────────────────────┬──────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│                       DATA LAYER                                     │
│  ┌───────────────────────────┐  ┌──────────────────────────────┐   │
│  │   PostgreSQL Database     │  │   Redis Cache                │   │
│  │   (via Prisma ORM)        │  │                              │   │
│  │                           │  │  Token Whitelist Storage:    │   │
│  │  Tables:                  │  │                              │   │
│  │  ┌─────────────────────┐ │  │  Keys:                       │   │
│  │  │ User                │ │  │  • token:{token}             │   │
│  │  │ ├─ id (UUID)        │ │  │    └─ User metadata (JSON)   │   │
│  │  │ ├─ email (unique)   │ │  │                              │   │
│  │  │ ├─ fullName         │ │  │  • user:{userId}:tokens      │   │
│  │  │ ├─ phoneNumber      │ │  │    └─ Set of active tokens   │   │
│  │  │ ├─ password (hash)  │ │  │                              │   │
│  │  │ ├─ isActive         │ │  │  Features:                   │   │
│  │  │ ├─ createdAt        │ │  │  • Automatic TTL expiration  │   │
│  │  │ └─ updatedAt        │ │  │  • O(1) lookup performance   │   │
│  │  └─────────────────────┘ │  │  • Multi-device tracking     │   │
│  └───────────────────────────┘  └──────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Technology Stack

### Core Technologies

| Technology     | Version    | Purpose                 |
| -------------- | ---------- | ----------------------- |
| **Node.js**    | Latest LTS | JavaScript runtime      |
| **Express.js** | ^5.1.0     | Web framework           |
| **PostgreSQL** | Latest     | Primary database        |
| **Redis**      | Latest     | Token storage & caching |
| **Prisma ORM** | ^6.17.1    | Database ORM            |

### Key Dependencies

| Package          | Version | Purpose                           |
| ---------------- | ------- | --------------------------------- |
| **jsonwebtoken** | ^9.0.2  | JWT token generation & validation |
| **bcrypt**       | ^6.0.0  | Password hashing                  |
| **helmet**       | ^8.1.0  | HTTP security headers             |
| **cors**         | ^2.8.5  | Cross-Origin Resource Sharing     |
| **ioredis**      | Latest  | Redis client                      |
| **zod**          | ^4.1.12 | Schema validation                 |
| **dotenv**       | ^17.2.3 | Environment variables             |

---

## Project Structure

```
back-end/
├── src/
│   ├── api/                      # API modules
│   │   ├── auth/                 # Authentication module
│   │   │   ├── auth.controller.js    # HTTP handlers
│   │   │   ├── auth.service.js       # Business logic
│   │   │   ├── auth.routes.js        # Route definitions
│   │   │   ├── auth.validation.js    # Input validation
│   │   │   └── auth.test.js          # Unit tests
│   │   ├── users/                # User management (future)
│   │   ├── orders/               # Order management (future)
│   │   └── products/             # Product management (future)
│   │
│   ├── config/                   # Configuration files
│   │   ├── database.js           # Prisma client & connection
│   │   └── redis.js              # Redis client & connection
│   │
│   ├── middleware/               # Custom middleware
│   │   ├── auth.middleware.js    # JWT & token validation
│   │   ├── errorHandler.middleware.js
│   │   ├── rateLimiter.middleware.js
│   │   └── validation.middleware.js
│   │
│   ├── services/                 # Business services
│   │   ├── token.service.js      # Redis token operations
│   │   ├── email.services.js     # Email operations
│   │   └── storage.services.js   # File storage
│   │
│   ├── utils/                    # Utility functions
│   │   ├── errors.util.js        # Custom error classes
│   │   ├── logger.util.js        # Logging utilities
│   │   └── response.util.js      # Response formatters
│   │
│   ├── app.js                    # Express app configuration
│   └── server.js                 # Server entry point
│
├── prisma/
│   ├── schema.prisma             # Database schema
│   └── migrations/               # Database migrations
│
├── tests/                        # Test suites
│   ├── integration/              # Integration tests
│   └── unit/                     # Unit tests
│
├── docs/                         # Documentation
│   └── api/                      # API documentation
│
├── .env                          # Environment variables
├── .env.example                  # Environment template
├── docker-compose.yml            # Docker configuration
├── package.json                  # Dependencies
└── README.md                     # Project overview
```

---

## Core Components

### 1. Server Entry Point (`server.js`)

The server initialization process follows these steps:

```javascript
// 1. Load environment variables
dotenv.config();

// 2. Connect to PostgreSQL database
await connectDatabase();

// 3. Start Express server
app.listen(PORT, HOST);
```

**Responsibilities:**

- Environment configuration
- Database connection establishment
- Server startup and port binding
- Graceful shutdown handling

### 2. Express Application (`app.js`)

The Express app is configured with the following middleware stack:

```javascript
// Security middleware (must be first)
app.use(helmet());

// CORS configuration
app.use(cors({ origin: CLIENT_URL, credentials: true }));

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Custom request logger
app.use(requestLogger);

// Routes
app.use("/api/auth", authRoutes);
```

### 3. Database Configuration (`config/database.js`)

**Prisma Client Setup:**

- Logging enabled in development mode
- Connection pooling
- Query optimization
- Type-safe database operations

**Features:**

- Automatic query logging (development)
- Error tracking
- Connection health monitoring
- Graceful disconnection

### 4. Redis Configuration (`config/redis.js`)

**Redis Client Setup:**

- Connection pooling
- Automatic reconnection
- Retry strategy
- Event handling (connect, error, ready)

**Purpose:**

- Token whitelist storage
- Session management
- Fast lookup operations (O(1) complexity)
- Automatic key expiration (TTL)

---

## Authentication Flow

### Registration Flow

```
┌─────────┐
│ Client  │
└────┬────┘
     │
     │ POST /api/auth/register
     │ {
     │   fullName, email, password,
     │   confirmPassword, phoneNumber
     │ }
     ▼
┌─────────────────┐
│ Validation      │ ← validateRegister()
│ Middleware      │   • Check required fields
└────┬────────────┘   • Validate email format
     │                • Verify password length
     ▼
┌─────────────────┐
│ Auth Controller │ ← registerController()
└────┬────────────┘
     │
     │ 1. Call registerUser()
     ▼
┌─────────────────┐
│ Auth Service    │ ← registerUser()
│                 │   • Check if user exists
│                 │   • Validate passwords match
│                 │   • Hash password (bcrypt)
│                 │   • Create user in DB
│                 │   • Remove password from response
└────┬────────────┘
     │
     │ 2. Return user data
     ▼
┌─────────────────┐
│ Auth Controller │
│                 │   • Generate JWT token
│                 │   • Store token in Redis
└────┬────────────┘
     │
     │ 3. Return response
     ▼
┌─────────┐
│ Client  │ ← { message, user, token }
└─────────┘
```

**Steps Explained:**

1. **Client Request**: Send registration data
2. **Validation**: Verify all required fields and formats
3. **User Creation**:
   - Check email uniqueness
   - Hash password with bcrypt (cost factor: 10)
   - Create user record in PostgreSQL
4. **Token Generation**: Create JWT with user ID and email
5. **Token Storage**: Store token in Redis with automatic expiration
6. **Response**: Return user data and JWT token

### Login Flow

```
┌─────────┐
│ Client  │
└────┬────┘
     │
     │ POST /api/auth/login
     │ { email, password }
     ▼
┌─────────────────┐
│ Validation      │ ← validateLogin()
│ Middleware      │   • Check email & password present
└────┬────────────┘   • Validate email format
     │
     ▼
┌─────────────────┐
│ Auth Controller │ ← loginController()
└────┬────────────┘
     │
     │ 1. Call loginUser()
     ▼
┌─────────────────┐
│ Auth Service    │ ← loginUser()
│                 │   • Find user by email
│                 │   • Compare password hash
│                 │   • Remove password from response
└────┬────────────┘
     │
     │ 2. Return user data
     ▼
┌─────────────────┐
│ Auth Controller │
│                 │   • Generate JWT token (7d expiry)
│                 │   • Store token in Redis whitelist
└────┬────────────┘
     │
     │ 3. Return response
     ▼
┌─────────┐
│ Client  │ ← { message, user, token }
│         │   Store token in SecureStore
└─────────┘
```

### Logout Flow (Single Device)

```
┌─────────┐
│ Client  │
└────┬────┘
     │
     │ POST /api/auth/logout
     │ Authorization: Bearer <token>
     ▼
┌─────────────────┐
│ Auth Middleware │ ← authenticateToken()
│                 │   • Extract token from header
│                 │   • Verify JWT signature
│                 │   • Check Redis whitelist
│                 │   • Attach user to request
└────┬────────────┘
     │
     ▼
┌─────────────────┐
│ Auth Controller │ ← logoutController()
│                 │   • Extract token from header
│                 │   • Call logoutUser(token)
└────┬────────────┘
     │
     ▼
┌─────────────────┐
│ Token Service   │ ← invalidateToken()
│                 │   • Get token data from Redis
│                 │   • Remove from user:tokens set
│                 │   • Delete token key
└────┬────────────┘
     │
     │ Return { success: true }
     ▼
┌─────────┐
│ Client  │ ← { message: "Logout successful" }
│         │   Clear local token storage
└─────────┘
```

### Logout All Devices Flow

```
┌─────────┐
│ Client  │
└────┬────┘
     │
     │ POST /api/auth/logout-all
     │ Authorization: Bearer <token>
     ▼
┌─────────────────┐
│ Auth Middleware │ ← authenticateToken()
│                 │   • Verify token
│                 │   • Attach userId to request
└────┬────────────┘
     │
     ▼
┌─────────────────┐
│ Auth Controller │ ← logoutAllController()
│                 │   • Get userId from req.user
│                 │   • Call logoutAllDevices(userId)
└────┬────────────┘
     │
     ▼
┌─────────────────┐
│ Token Service   │ ← invalidateAllUserTokens()
│                 │   • Get all tokens for user
│                 │   • Delete all token keys (pipeline)
│                 │   • Delete user:tokens set
└────┬────────────┘
     │
     │ Return { success, count }
     ▼
┌─────────┐
│ Client  │ ← { message, count: 3 }
│         │   "Logged out from all devices"
└─────────┘
```

---

## Token Management

### Redis Token Whitelist Strategy

This implementation uses **Option 2: Token Whitelist**, where only tokens stored in Redis are considered valid.

#### Advantages:

✅ **Immediate Invalidation**: Logout takes effect instantly  
✅ **Multi-Device Control**: Track all active sessions  
✅ **Auto Expiration**: Redis TTL handles cleanup automatically  
✅ **High Performance**: O(1) lookup complexity  
✅ **Scalable**: Redis handles millions of tokens efficiently

#### Redis Data Structure:

```
┌────────────────────────────────────────────────────────┐
│ Redis Key: token:{jwt_token}                           │
│ Type: String                                           │
│ TTL: Matches JWT expiration (7 days)                  │
│ Value: {                                               │
│   "userId": "uuid-here",                               │
│   "email": "user@example.com",                         │
│   "issuedAt": 1729468800,                              │
│   "expiresAt": 1730073600                              │
│ }                                                      │
└────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────┐
│ Redis Key: user:{userId}:tokens                        │
│ Type: Set                                              │
│ TTL: Matches longest token expiration                 │
│ Members: [                                             │
│   "eyJhbGciOiJIUzI1NiIsInR5cCI6...",  # Mobile token  │
│   "eyJhbGciOiJIUzI1NiIsInR5cCI6...",  # Web token     │
│   "eyJhbGciOiJIUzI1NiIsInR5cCI6..."   # Tablet token  │
│ ]                                                      │
└────────────────────────────────────────────────────────┘
```

### Token Lifecycle

```
┌──────────────┐
│ Token Created│ (Login/Register)
└──────┬───────┘
       │
       │ storeToken(userId, token)
       ▼
┌────────────────────────────────────┐
│ Redis Store                        │
│ • token:{token} = metadata (TTL)   │
│ • user:{userId}:tokens += token    │
└──────┬─────────────────────────────┘
       │
       │ Every API Request
       ▼
┌────────────────────────────────────┐
│ Token Validation                   │
│ 1. Verify JWT signature            │
│ 2. Check Redis whitelist           │
│ 3. If exists → Allow               │
│ 4. If not → Reject (401)           │
└──────┬─────────────────────────────┘
       │
       │ On Logout
       ▼
┌────────────────────────────────────┐
│ Token Invalidation                 │
│ • Single: Remove one token         │
│ • All: Remove all user tokens      │
└──────┬─────────────────────────────┘
       │
       │ After TTL Expires
       ▼
┌────────────────────────────────────┐
│ Auto Cleanup                       │
│ Redis automatically deletes        │
│ expired keys (no manual cleanup)   │
└────────────────────────────────────┘
```

---

## Request Lifecycle

### Protected Route Request Flow

```
1. Client Request
   │
   │ GET /api/protected-resource
   │ Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6...
   ▼
2. Express Middleware Stack
   │
   ├─ helmet()           → Add security headers
   ├─ cors()             → Check origin
   ├─ express.json()     → Parse JSON body
   ├─ requestLogger()    → Log request
   └─ authenticateToken()→ [AUTHENTICATION CHECKPOINT]
       │
       ├─ Extract token from Authorization header
       ├─ Verify JWT signature with JWT_SECRET
       ├─ Check token expiration
       ├─ Query Redis: EXISTS token:{token}
       │   │
       │   ├─ Not Found → 401 "Token invalidated"
       │   └─ Found → Continue
       │
       └─ Attach to request:
           req.user = { userId, email }
           req.token = token
   │
   ▼
3. Route Handler
   │
   ├─ Validation middleware (if any)
   ├─ Controller function
   └─ Service layer
   │
   ▼
4. Database Query
   │
   ├─ Prisma ORM query
   └─ PostgreSQL database
   │
   ▼
5. Response
   │
   └─ JSON response to client
```

---

## API Endpoints

### Authentication Endpoints

#### **POST /api/auth/register**

Register a new user account.

**Access**: Public

**Request Body**:

```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "confirmPassword": "SecurePass123",
  "phoneNumber": "+1234567890"
}
```

**Response** (201 Created):

```json
{
  "message": "User registered successfully",
  "user": {
    "id": "uuid-here",
    "fullName": "John Doe",
    "email": "john@example.com",
    "phoneNumber": "+1234567890",
    "isActive": true,
    "createdAt": "2025-10-20T12:00:00.000Z",
    "updatedAt": "2025-10-20T12:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6..."
}
```

**Validation Rules**:

- All fields required
- Email must be valid format
- Email must be unique
- Password minimum 8 characters
- Passwords must match

---

#### **POST /api/auth/login**

Authenticate user and receive JWT token.

**Access**: Public

**Request Body**:

```json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response** (200 OK):

```json
{
  "message": "Login successful",
  "user": {
    "id": "uuid-here",
    "fullName": "John Doe",
    "email": "john@example.com",
    "phoneNumber": "+1234567890",
    "isActive": true
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6..."
}
```

**Error Response** (401 Unauthorized):

```json
{
  "error": "Invalid Password"
}
```

---

#### **POST /api/auth/logout**

Logout from current device (invalidate current token).

**Access**: Protected (requires valid JWT)

**Headers**:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6...
```

**Response** (200 OK):

```json
{
  "message": "Logout successful",
  "success": true
}
```

---

#### **POST /api/auth/logout-all**

Logout from all devices (invalidate all user tokens).

**Access**: Protected (requires valid JWT)

**Headers**:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6...
```

**Response** (200 OK):

```json
{
  "message": "Logged out from all devices successfully",
  "success": true,
  "count": 3
}
```

---

### Health Check Endpoints

#### **GET /health**

Check API status and uptime.

**Access**: Public

**Response** (200 OK):

```json
{
  "status": "OK",
  "timestamp": "2025-10-20T12:00:00.000Z"
}
```

#### **GET /**

API information and version.

**Access**: Public

**Response** (200 OK):

```json
{
  "message": "Grabeat API",
  "version": "1.0.0"
}
```

---

## Database Schema

### User Table

```prisma
model User {
  id          String   @id @default(uuid())
  email       String   @unique
  fullName    String
  phoneNumber String
  password    String   // Bcrypt hashed
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

**Field Details**:

| Field         | Type          | Constraints                 | Description                         |
| ------------- | ------------- | --------------------------- | ----------------------------------- |
| `id`          | String (UUID) | Primary Key, Auto-generated | Unique user identifier              |
| `email`       | String        | Unique, Required            | User email address                  |
| `fullName`    | String        | Required                    | User's full name                    |
| `phoneNumber` | String        | Required                    | Contact number                      |
| `password`    | String        | Required                    | Bcrypt hash (never returned in API) |
| `isActive`    | Boolean       | Default: true               | Account activation status           |
| `createdAt`   | DateTime      | Auto-generated              | Account creation timestamp          |
| `updatedAt`   | DateTime      | Auto-updated                | Last modification timestamp         |

**Indexes**:

- Primary index on `id`
- Unique index on `email`

---

## Security Features

### 1. Password Security

**Hashing Strategy**: Bcrypt with salt rounds = 10

```javascript
// Password hashing (registration)
const hashedPassword = await bcrypt.hash(password, 10);

// Password verification (login)
const isValid = await bcrypt.compare(password, user.password);
```

**Why Bcrypt?**

- Adaptive function (future-proof)
- Built-in salt generation
- Slow hashing (defense against brute force)
- Industry standard

### 2. JWT Token Security

**Token Structure**:

```javascript
{
  "userId": "uuid-here",
  "email": "user@example.com",
  "iat": 1729468800,  // Issued at
  "exp": 1730073600   // Expires at (7 days)
}
```

**Security Measures**:

- Signed with secret key (HS256 algorithm)
- 7-day expiration
- Stateless verification
- Payload includes minimal data

### 3. Token Whitelist (Redis)

**Why Whitelist > Blacklist?**

| Feature             | Whitelist                   | Blacklist                     |
| ------------------- | --------------------------- | ----------------------------- |
| Security            | ✅ Higher (deny by default) | ⚠️ Lower (allow by default)   |
| Memory              | ✅ Only active tokens       | ❌ All invalidated tokens     |
| Logout Speed        | ⚡ Instant                  | ⚡ Instant                    |
| Compromise Recovery | ✅ Revoke all tokens easily | ⚠️ Must track all compromised |

**How It Works**:

1. Token created → Add to whitelist
2. API request → Check whitelist
3. Token found → Allow request
4. Token not found → Reject (401)
5. Logout → Remove from whitelist

### 4. HTTP Security Headers (Helmet.js)

```javascript
app.use(helmet());
```

**Headers Added**:

- `X-DNS-Prefetch-Control`: Controls DNS prefetching
- `X-Frame-Options`: Prevents clickjacking
- `X-Content-Type-Options`: Prevents MIME sniffing
- `Strict-Transport-Security`: Enforces HTTPS
- `X-Download-Options`: Prevents file execution
- `X-Permitted-Cross-Domain-Policies`: Controls cross-domain policies

### 5. CORS Configuration

```javascript
app.use(
  cors({
    origin: process.env.CLIENT_URL, // Whitelist specific origin
    credentials: true, // Allow cookies/auth headers
  })
);
```

**Benefits**:

- Prevents unauthorized cross-origin requests
- Allows only trusted client URLs
- Supports cookie-based authentication

### 6. Input Validation

**Validation Layers**:

1. **Middleware validation** (auth.validation.js)
2. **Service-level validation** (auth.service.js)
3. **Database constraints** (Prisma schema)

**Example**:

```javascript
// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Password strength
if (password.length < 8) {
  throw new Error("Password must be at least 8 characters");
}
```

### 7. Error Handling

**Principles**:

- Never expose stack traces to clients
- Use generic error messages
- Log detailed errors server-side
- Return appropriate HTTP status codes

```javascript
// Good: Generic message
res.status(401).json({ error: "Invalid credentials" });

// Bad: Reveals information
res.status(401).json({ error: "User not found in database" });
```

---

## Environment Configuration

### Required Environment Variables

Create a `.env` file in the backend root directory:

```bash
# Server Configuration
PORT=3000
HOST=localhost
NODE_ENV=development

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/grabeat?schema=public"

# JWT
JWT_SECRET=your_super_secret_key_here_min_32_chars
JWT_EXPIRES_IN=7d

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0

# Client
CLIENT_URL=http://localhost:8081
```

### Environment Variable Descriptions

| Variable         | Required | Description                  | Example                      |
| ---------------- | -------- | ---------------------------- | ---------------------------- |
| `PORT`           | Yes      | Server port                  | `3000`                       |
| `HOST`           | Yes      | Server host                  | `localhost`                  |
| `NODE_ENV`       | Yes      | Environment mode             | `development` / `production` |
| `DATABASE_URL`   | Yes      | PostgreSQL connection string | See above                    |
| `JWT_SECRET`     | Yes      | Secret key for JWT signing   | Min 32 characters            |
| `JWT_EXPIRES_IN` | Yes      | Token expiration             | `7d`, `24h`, `30m`           |
| `REDIS_HOST`     | Yes      | Redis server host            | `localhost`                  |
| `REDIS_PORT`     | Yes      | Redis server port            | `6379`                       |
| `REDIS_PASSWORD` | No       | Redis password (if secured)  | `your_password`              |
| `REDIS_DB`       | No       | Redis database number        | `0` (default)                |
| `CLIENT_URL`     | Yes      | Frontend URL for CORS        | `http://localhost:8081`      |

### Security Best Practices

⚠️ **Never commit `.env` to version control**

✅ **Do**:

- Use `.env.example` as a template
- Use strong JWT secrets (min 32 characters)
- Use different secrets for dev/production
- Rotate secrets periodically

❌ **Don't**:

- Use default/weak secrets
- Share secrets in chat/email
- Commit `.env` files
- Use same secrets across environments

---

## Getting Started

### Prerequisites

Ensure you have the following installed:

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- Redis (v7 or higher)
- npm or yarn

### Installation Steps

1. **Clone the repository**:

```bash
git clone <repository-url>
cd back-end
```

2. **Install dependencies**:

```bash
npm install
```

3. **Set up environment variables**:

```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Start PostgreSQL and Redis** (using Docker):

```bash
docker-compose up -d
```

5. **Run database migrations**:

```bash
npx prisma migrate dev
```

6. **Generate Prisma client**:

```bash
npx prisma generate
```

7. **Start development server**:

```bash
npm run dev
```

The API will be available at `http://localhost:3000`

### Verify Installation

Test the health endpoint:

```bash
curl http://localhost:3000/health
```

Expected response:

```json
{
  "status": "OK",
  "timestamp": "2025-10-20T12:00:00.000Z"
}
```

---

## API Testing Examples

### Using cURL

**Register a new user**:

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123",
    "confirmPassword": "SecurePass123",
    "phoneNumber": "+1234567890"
  }'
```

**Login**:

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

**Logout** (replace `<TOKEN>` with your JWT):

```bash
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Authorization: Bearer <TOKEN>"
```

**Logout from all devices**:

```bash
curl -X POST http://localhost:3000/api/auth/logout-all \
  -H "Authorization: Bearer <TOKEN>"
```

---

## Future Enhancements

### Planned Features

1. **Refresh Token System**
   - Long-lived refresh tokens
   - Short-lived access tokens
   - Automatic token renewal

2. **Rate Limiting**
   - Prevent brute force attacks
   - API quota management
   - Redis-based rate limiter

3. **Email Verification**
   - Send verification emails
   - Email confirmation flow
   - Resend verification option

4. **Password Reset**
   - Forgot password flow
   - Email-based reset links
   - Secure token generation

5. **Two-Factor Authentication (2FA)**
   - TOTP-based authentication
   - Backup codes
   - SMS verification option

6. **API Documentation**
   - Swagger/OpenAPI integration
   - Interactive API explorer
   - Auto-generated docs

7. **Advanced Logging**
   - Winston logger integration
   - Log rotation
   - Error tracking (Sentry)

8. **Monitoring & Analytics**
   - Prometheus metrics
   - Grafana dashboards
   - Performance monitoring

---

## Troubleshooting

### Common Issues

#### Database Connection Failed

```
Error: Can't reach database server
```

**Solution**:

1. Check PostgreSQL is running: `docker ps`
2. Verify DATABASE_URL in `.env`
3. Test connection: `npx prisma db pull`

---

#### Redis Connection Error

```
Error: connect ECONNREFUSED 127.0.0.1:6379
```

**Solution**:

1. Check Redis is running: `docker ps`
2. Verify REDIS_HOST and REDIS_PORT in `.env`
3. Test connection: `redis-cli ping` (should return "PONG")

---

#### Token Validation Fails

```
Error: Token has been invalidated or session expired
```

**Possible Causes**:

1. Token was removed from Redis (logout)
2. Token expired (7 days passed)
3. Redis data was cleared
4. Server restarted and Redis not persistent

**Solution**:

- Login again to get a new token
- Configure Redis persistence if needed

---

#### JWT Secret Not Set

```
Error: JWT_SECRET is required
```

**Solution**:

1. Add JWT_SECRET to `.env`
2. Generate strong secret: `openssl rand -base64 32`
3. Restart server

---

## Contributing

When contributing to this project, please follow these guidelines:

1. **Code Style**: Follow existing code patterns
2. **Commits**: Use descriptive commit messages
3. **Testing**: Add tests for new features
4. **Documentation**: Update docs for API changes
5. **Security**: Never commit secrets or credentials

---

## License

This project is licensed under the ISC License.

---

## Contact & Support

For questions or support, please contact the development team.

**Author**: Cielo  
**Project**: Grabeat Backend API  
**Version**: 1.0.0

---

_Last Updated: October 20, 2025_
