# Blogging App Server - Project Analysis & Current State

## 📋 Overview
A Node.js/Express backend server for a blogging platform with user authentication, blog management, and Redis caching. Built with MongoDB for data persistence and JWT for authentication.

---

## 🏗️ Project Architecture

### Tech Stack
- **Runtime**: Node.js with ES6 modules
- **Framework**: Express.js v5.1.0
- **Database**: MongoDB (Mongoose ODM)
- **Cache**: Redis (ioredis v5.8.2)
- **Authentication**: JWT + bcrypt
- **Server**: nodemon for development

### Dependencies
```json
{
  "bcrypt": "^6.0.0",           // Password hashing
  "body-parser": "^2.2.0",      // Request body parsing
  "cookie-parser": "^1.4.7",    // Cookie handling
  "cors": "^2.8.5",              // Cross-origin resource sharing
  "dotenv": "^17.2.3",           // Environment variables
  "express": "^5.1.0",           // Web framework
  "ioredis": "^5.8.2",           // Redis client
  "jsonwebtoken": "^9.0.2",      // JWT generation
  "mongodb": "^6.20.0",          // Database driver
  "mongoose": "^8.19.1",         // ODM/Schema
  "redis": "^5.9.0"              // Redis utilities
}
```

---

## 📂 Project Structure

### Configuration (`/config`)
- **db.js**: MongoDB connection with Mongoose
- **redisClient.js**: Redis connection setup with connection/error logging

### Models (`/models`)
- **user.js**: User schema with fields:
  - `name` (required, max 50 chars)
  - `email` (required, unique)
  - `password` (required, hashed)
  - `bio` (optional, max 100 chars)
  - `profession` (enum: Student, Engineer, Doctor, etc.)
  - `gender` (enum: Male, Female, Other)
  - `dob` (date of birth, default 18 years ago)
  - `interests` (array of strings)
  - Timestamps enabled

- **blog.js**: Blog schema with fields:
  - `title` (required)
  - `content` (required)
  - `userId` (required, references User)
  - `tags` (array of strings)
  - `published` (boolean, default false)
  - Timestamps enabled

### Middleware (`/middleware`)
- **auth.js**: JWT authentication middleware
  - Extracts token from cookies
  - Verifies JWT using `JWT_SECRET`
  - Attaches decoded user data to `req.user`
  - Returns 401 if token missing or invalid

### Routes (`/routes`)
#### Authentication Routes (`/api/v1.2/users`)
- `POST /create` - Register new user
- `POST /login` - Login user (sets JWT cookie)
- `GET /allUsers` - List all users (protected)
- `PATCH /edit-user/:id` - Update user profile (protected)
- `GET /profile` - Get current user profile (protected)
- `PATCH /change-password` - Change password (protected)

#### Blog Routes (`/api/v1.2/blogs`)
- `GET /allblogs` - Get all published blogs (cached)
- `POST /create` - Create new blog (protected)
- `GET /post/:id` - Get blog by ID (protected)
- `GET /myblogs` - Get user's own blogs (protected, cached)
- `PATCH /edit/:id` - Update blog (protected)
- `DELETE /del-blog/:id` - Delete blog (protected)

### Controllers (`/controllers`)

#### User Controllers
1. **createUser.js**
   - Validates required fields (name, email, password)
   - Checks for duplicate emails
   - Hashes password with bcrypt (salt rounds: 10)
   - Creates and saves new user

2. **loginUser.js**
   - Validates email and password
   - Compares password with bcrypt
   - Generates JWT token (1-hour expiration)
   - Sets httpOnly cookie
   - Returns user info and success status

3. **getAllUsers.js**
   - Fetches all users
   - Excludes password field from response

4. **updateProfile.js**
   - Validates user ID
   - Enforces constraints:
     - Name max 50 characters
     - Bio max 100 characters
     - Minimum age 18 years
   - Updates user profile fields

5. **details/profile.js**
   - Retrieves current user's profile
   - Excludes password from response

6. **service/changePassword.js**
   - Validates all password fields provided
   - Confirms new password matches confirm field
   - Verifies old password with bcrypt
   - Prevents using same password as old
   - Hashes and updates password

#### Blog Controllers
1. **create.js**
   - Validates title and content
   - Gets userId from auth middleware
   - Creates blog with published=true
   - Invalidates related Redis caches

2. **allblogs.js**
   - Implements Redis caching (30-min TTL)
   - Checks cache first, returns if exists
   - Fetches from MongoDB if no cache
   - Populates userId references with user data
   - Caches result in Redis

3. **myblogs.js**
   - Similar to allblogs but filters by userId
   - Cache key: `my_blogs:{userId}`
   - 30-min cache TTL

4. **blogs.js** (Multiple functions)
   - **getBlogById**: Fetches single blog by ID
   - **deleteBlog**: 
     - Deletes blog from MongoDB
     - Invalidates user's blog cache
     - Updates all blogs cache
   - **updateBlog**: Updates blog title, content, author

### Utilities (`/utils`)
- **helper/cacheHelper.js**
  - `invalidateUserBlogs(userId)`: Clears user's blog cache
  - `updateAllBlogsCacheAfterDelete(blogId)`: Removes deleted blog from all_blogs cache

### Entry Points
- **server.js**: Database connection + server initialization on configured PORT
- **app.js**: Express app setup with middleware and routes

---

## 🔑 Key Features

### Authentication & Security
- ✅ JWT-based authentication
- ✅ bcrypt password hashing (10 salt rounds)
- ✅ httpOnly cookies for token storage
- ✅ CORS configured with frontend URL
- ✅ Protected routes with auth middleware

### Data Management
- ✅ MongoDB with Mongoose ODM
- ✅ Relational data (blogs reference users)
- ✅ Field validation in schemas
- ✅ Timestamps on all models

### Performance
- ✅ Redis caching for frequent queries
- ✅ Cache invalidation on updates/deletes
- ✅ 30-minute cache TTL for blogs
- ✅ User data population in queries

### User Features
- ✅ User registration with email validation
- ✅ User login with JWT
- ✅ Profile updates (bio, profession, gender, interests)
- ✅ Password change with old password verification
- ✅ Age verification (minimum 18 years)
- ✅ Multiple profession categories

### Blog Features
- ✅ Create blogs (published immediately)
- ✅ Read all blogs or user-specific blogs
- ✅ Update blog content
- ✅ Delete blogs
- ✅ Tag support (not actively used)
- ✅ Author tracking via userId

---

## 🔧 Environment Configuration

### Required .env Variables
```
PORT=2000                    # Server port
MONGO_URI=mongodb+srv://...  # MongoDB connection string
JWT_SECRET=your-secret-key   # JWT signing secret
CLIENT_URL=http://localhost:3000  # Frontend URL for CORS
REDIS_URL=redis://localhost:6379  # Redis connection
```

---

## 🚀 How It Works (Request Flow)

### User Registration Flow
1. Client sends POST to `/api/v1.2/users/create`
2. Server validates input
3. Checks for duplicate email
4. Hashes password with bcrypt
5. Creates user document in MongoDB
6. Returns created user object

### Login Flow
1. Client sends POST to `/api/v1.2/users/login`
2. Server finds user by email
3. Compares passwords with bcrypt
4. Generates JWT token
5. Sets httpOnly cookie with token
6. Returns user info

### Blog Creation Flow
1. Client sends POST to `/api/v1.2/blogs/create` with JWT cookie
2. Auth middleware validates token
3. Server extracts userId from token
4. Creates blog document
5. Clears related Redis caches
6. Returns created blog

### Cache Hit Flow (Get All Blogs)
1. Client requests `/api/v1.2/blogs/allblogs`
2. Server checks Redis for "all_blogs" key
3. If found: returns cached JSON (30 mins)
4. If not: queries MongoDB, caches result, returns data

---

## 📊 Data Relationships

```
User (1) ─── (N) Blog
  ├─ name
  ├─ email (unique)
  ├─ password
  ├─ bio
  ├─ profession
  ├─ gender
  ├─ dob
  └─ interests

Blog
  ├─ title
  ├─ content
  ├─ userId → references User
  ├─ tags
  └─ published
```

---

## 💡 Current Implementation Status

### Implemented ✅
- Basic user authentication (register, login)
- JWT token management
- Blog CRUD operations
- Redis caching layer
- User profile management
- Password change functionality
- Data validation
- CORS setup
- Protected routes

### Partially Implemented ⚠️
- Error handling (basic try-catch blocks)
- Input validation (minimal checks)
- Blog tags (schema supports but not utilized)
- Published flag (all blogs created as published)
- Feed/explore features (routes exist but incomplete)

### Not Implemented ❌
- Rate limiting
- Request logging/monitoring
- Comprehensive error responses
- Input sanitization
- Request validation schemas
- API documentation (Swagger)
- Search functionality
- Pagination
- Sorting
- Filtering
- User roles/permissions
- Email verification
- Password reset
- Refresh token implementation
- Tests (unit/integration)
- Deployment configuration

---

## 📝 API Response Examples

### Successful Registration
```json
{
  "message": "User created successfully",
  "user": {
    "_id": "123...",
    "name": "John Doe",
    "email": "john@example.com",
    "timestamps": {}
  }
}
```

### Successful Login
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": "123...",
    "email": "john@example.com",
    "name": "John Doe"
  }
}
```

### Blog Fetched (from cache)
```json
{
  "message": "Blogs fetched successfully (from cache)",
  "length": 5,
  "blogs": [...]
}
```

---

## 🎯 Code Quality Notes

### Strengths
- Clear separation of concerns (routes, controllers, models)
- Consistent use of async/await
- Environment-based configuration
- Redis integration for performance
- Password hashing implementation
- JWT-based auth pattern

### Areas for Improvement
- Inconsistent error response structures
- Limited input validation
- No request logging
- No API documentation
- No test coverage
- Magic strings (cache TTL, enum values hardcoded)
- Missing graceful shutdown handlers
- No versioning strategy for APIs
- Limited code comments

---

## 🔍 Known Issues/Observations

1. **Password hashing in changePassword**: Updates `user.dob = Date.now()` (should not change DOB on password change)
2. **allUsers.js**: Imports from `models/User.js` (case sensitivity issue - should be lowercase)
3. **Redis error handling**: Logs but doesn't prevent app startup
4. **Blog creation**: Sets `published: true` by default (no draft mode)
5. **Cache invalidation**: Partially implemented (only for user-specific operations)
6. **CORS**: Hardcoded as commented out in some places
7. **Token expiration**: Only 1 hour (no refresh token mechanism)
8. **No input sanitization**: Could be vulnerable to NoSQL injection

---

**Last Updated**: December 29, 2025  
**Version**: 0.1.0 (Early Development)
