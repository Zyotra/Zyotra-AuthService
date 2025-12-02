# Zyotra Authentication Service

**Authentication microservice for the Zyotra VPS deployment platform.**

A high-performance authentication service built with Bun, Elysia.js, Drizzle ORM, and PostgreSQL. This microservice handles user registration, login, JWT-based authentication, and refresh token management for the Zyotra ecosystem.

---

## 🚀 Features

- **User Registration & Login** - Secure user authentication with bcrypt password hashing
- **JWT Authentication** - Access tokens (15 min) and refresh tokens (15 days)
- **Session Management** - Persistent refresh token storage with automatic cleanup
- **Protected Routes** - Middleware-based route protection
- **Database Migrations** - Drizzle ORM for type-safe database operations
- **High Performance** - Built on Bun runtime for maximum speed

---

## 📁 Project Structure

```
├── src/
│   ├── index.ts                    # Application entry point
│   ├── routes.ts                   # Route definitions
│   │
│   ├── controllers/
│   │   └── auth/
│   │       ├── loginController.ts      # Handles user login
│   │       └── registerController.ts   # Handles user registration
│   │
│   ├── db/
│   │   ├── client.ts               # Database connection
│   │   └── schema.ts               # Database schema (users, login_sessions)
│   │
│   ├── jwt/
│   │   ├── generateTokens.ts      # Access & refresh token generation
│   │   └── verifyTokens.ts        # Token verification logic
│   │
│   ├── middlewares/
│   │   └── checkAuth.ts           # Authentication middleware
│   │
│   ├── types/
│   │   └── types.ts               # TypeScript type definitions
│   │
│   └── utils/
│       └── hashPassword.ts        # Password hashing utility
│
├── drizzle.config.ts              # Drizzle ORM configuration
├── tsconfig.json                  # TypeScript configuration
├── package.json                   # Dependencies and scripts
└── README.md                      # This file
```

---

## 🗂️ File Breakdown

### **Core Files**

#### `src/index.ts`
Application entry point that:
- Initializes Elysia server
- Loads environment variables
- Registers routes with middleware support
- Applies `checkAuth` middleware to protected routes
- Starts the server on configured PORT

#### `src/routes.ts`
Centralized route configuration defining:
- HTTP method (GET, POST, PUT, DELETE, PATCH)
- Path
- Handler function
- Middleware stack
- Protection status (`isProtected: boolean`)

### **Controllers**

#### `src/controllers/auth/loginController.ts`
Handles user login:
- Validates email and password
- Compares hashed passwords using bcrypt
- Generates access and refresh tokens
- Returns user ID and tokens on success

#### `src/controllers/auth/registerController.ts`
Handles user registration:
- Accepts email and password
- Hashes password with bcrypt
- Inserts user into database
- Returns success message

### **Database**

#### `src/db/client.ts`
Database connection setup:
- Uses `postgres-js` driver
- Drizzle ORM client initialization
- Connection string from `DATABASE_URL` env variable

#### `src/db/schema.ts`
Database schema definitions:

**`users` table:**
- `id` - Serial primary key
- `email` - Unique email (varchar 255)
- `password` - Hashed password (text)
- `createdAt` - Timestamp (default now)
- `updatedAt` - Timestamp (default now)

**`login_sessions` table:**
- `id` - Serial primary key
- `userId` - Foreign key to users (cascade delete)
- `refreshToken` - Unique token string
- `createdAt` - Timestamp (default now)
- `expiresAt` - Expiration timestamp

### **JWT**

#### `src/jwt/generateTokens.ts`
Token generation:
- `generateAccessToken()` - Creates 15-minute JWT access tokens
- `generateRefreshToken()` - Creates 15-day JWT refresh tokens and stores in DB
- Cleans up old refresh tokens for the user

#### `src/jwt/verifyTokens.ts`
Token verification:
- `verifyAccessToken()` - Validates access token signature and expiry
- `verifyRefreshToken()` - Validates refresh token against database and checks expiry

### **Middleware**

#### `src/middlewares/checkAuth.ts`
Authentication middleware:
- Extracts token from request body
- Verifies access token
- Attaches user data to request context
- Returns 401 for invalid/missing tokens
- Uses Elysia's `derive()` and `guard()` pattern

### **Utils**

#### `src/utils/hashPassword.ts`
Password hashing utility:
- Uses bcryptjs with salt rounds of 10
- Returns hashed password string

### **Types**

#### `src/types/types.ts`
TypeScript definitions:
- `HTTPMethod` - HTTP verb types
- `apiRoute` - Route configuration interface
- `StatusCode` - HTTP status code enum

---

## 🔧 Setup Instructions

### Prerequisites
- [Bun](https://bun.sh) v1.0+
- PostgreSQL database

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd zyotra-auth-service
```

2. **Install dependencies**
```bash
bun install
```

3. **Configure environment variables**
Create a `.env` file in the root directory:
```env
# Server
PORT=3000

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/zyotra_auth

# JWT Secrets
ACCESS_TOKEN_SECRET=your-access-token-secret-here
REFRESH_TOKEN_SECRET=your-refresh-token-secret-here
```

4. **Run database migrations**
```bash
bun run db:generate    # Generate migration files
bun run db:migrate     # Apply migrations
```

5. **Start the development server**
```bash
bun run dev
```

The server will start at `http://localhost:3000` (or your configured PORT).

---

## 📡 API Endpoints

### **POST /register**
Register a new user

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response (201):**
```json
{
  "message": "User registered successfully"
}
```

---

### **POST /login**
Authenticate user and receive tokens

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "userId": 1,
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## 🔐 Authentication Flow

1. **Registration:**
   - User submits email and password
   - Password is hashed with bcrypt
   - User record created in database

2. **Login:**
   - User submits credentials
   - Password verified against hash
   - Access token (15 min) and refresh token (15 days) generated
   - Refresh token stored in `login_sessions` table

3. **Protected Routes:**
   - Client sends access token in request body
   - `checkAuth` middleware verifies token
   - If valid, request proceeds with user context
   - If invalid, returns 401 Unauthorized

4. **Token Refresh:**
   - When access token expires, use refresh token
   - Verify refresh token against database
   - Issue new access token

---

## 🛠️ Development Scripts

```bash
bun run dev           # Start development server with hot reload
bun run start         # Start production server
bun run db:generate   # Generate Drizzle migration files
bun run db:migrate    # Run database migrations
bun run db:push       # Push schema changes to database
bun run db:studio     # Open Drizzle Studio (database GUI)
```

---

## 🏗️ Tech Stack

- **Runtime:** [Bun](https://bun.sh) - Fast JavaScript runtime
- **Framework:** [Elysia.js](https://elysiajs.com) - High-performance web framework
- **ORM:** [Drizzle ORM](https://orm.drizzle.team) - TypeScript ORM
- **Database:** PostgreSQL
- **Authentication:** JWT (jsonwebtoken)
- **Password Hashing:** bcryptjs
- **Language:** TypeScript

---

## 🔒 Security Features

- Passwords hashed with bcrypt (10 salt rounds)
- JWT tokens with configurable secrets
- Refresh token rotation on new login
- Cascade deletion of sessions on user deletion
- Environment-based configuration
- SQL injection protection via Drizzle ORM

---

## 📝 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/db` |
| `ACCESS_TOKEN_SECRET` | Secret for access token signing | `your-secret-key` |
| `REFRESH_TOKEN_SECRET` | Secret for refresh token signing | `your-refresh-secret` |

---

## 🚧 Roadmap

- [ ] Add email verification
- [ ] Implement password reset flow
- [ ] Add OAuth providers (Google, GitHub)
- [ ] Rate limiting for auth endpoints
- [ ] Redis integration for token blacklisting
- [ ] Two-factor authentication (2FA)
- [ ] API key authentication for service-to-service communication

---

## 🤝 Contributing

This is a microservice for the Zyotra platform. For contribution guidelines, please refer to the main Zyotra repository.

---

## 📄 License

MIT License - see LICENSE file for details

---

## 🔗 Related Services

- **Zyotra Main Platform** - VPS deployment orchestration
- **Zyotra API Gateway** - Service mesh and routing
- **Zyotra Deployment Service** - Git-based deployments

---

**Built with ❤️ for the Zyotra ecosystem**
