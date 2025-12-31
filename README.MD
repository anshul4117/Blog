# Blogging App — Backend Server

A production-ready Express.js + MongoDB API for a blogging platform with user authentication, blog management, and Redis caching.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Requirements](#requirements)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [API Endpoints](#api-endpoints)
- [Configuration](#configuration)
- [Security](#security)

## Features

✅ User authentication with JWT  
✅ Blog CRUD operations  
✅ Redis caching for performance  
✅ Structured logging with Pino  
✅ Security headers with Helmet  
✅ Environment-based configuration  
✅ Graceful shutdown handling  
✅ MongoDB with Mongoose ORM  
✅ Production-ready folder structure  

## Tech Stack

- **Runtime**: Node.js (v18+)
- **Framework**: Express.js v5.1.0
- **Database**: MongoDB + Mongoose v8.19.1
- **Cache**: Redis + ioredis v5.8.2
- **Auth**: JWT + bcrypt
- **Security**: Helmet v7.2.0
- **Logging**: Pino v8.21.0
- **Validation**: Joi v17.13.3
- **Dev Tools**: Nodemon, ESLint

## Project Structure

```
src/
├── config/              # Configuration files
│   ├── index.js        # Environment config loader
│   ├── logger.js       # Pino logger setup
│   ├── db.js           # MongoDB connection
│   └── redisClient.js  # Redis connection
├── routes/             # Route handlers
│   ├── auth.js         # User auth routes
│   └── blog.js         # Blog CRUD routes
├── controllers/        # Business logic
│   ├── user/
│   │   ├── createUser.js
│   │   ├── loginUser.js
│   │   ├── getAllUsers.js
│   │   ├── updateProfile.js
│   │   ├── details/
│   │   │   ├── profile.js
│   │   │   └── post.js
│   │   └── service/
│   │       └── changePassword.js
│   ├── blog/
│   │   ├── create.js
│   │   ├── allblogs.js
│   │   ├── blogs.js
│   │   └── myblogs.js
│   └── explore/
│       └── feed.js
├── middleware/         # Custom middleware
│   └── auth.js
├── models/            # Database schemas
│   ├── user.js
│   └── blog.js
├── utils/
│   └── helper/
│       └── cacheHelper.js
├── app.js             # Express app setup
└── server.js          # Server bootstrap

tests/                 # Test files (ready for implementation)
├── unit/
├── integration/
└── fixtures/

.env.example           # Environment template
.eslintrc.js          # Linting rules
package.json          # Dependencies
```

## Requirements

- **Node.js** v18.0.0 or higher
- **npm** v9.0.0 or higher
- **MongoDB** (local or Atlas)
- **Redis** (local or hosted)

## Installation

1. Clone and enter the directory:

```bash
git clone <repository>
cd Server
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Start the server:

```bash
# Development (with hot-reload)
npm run dev

# Production
npm start
```

## Environment Variables

Create a `.env` file in the root directory. Required and optional variables:

```bash
# Application
NODE_ENV=development          # development, staging, production
PORT=5000
APP_URL=http://localhost:5000
CLIENT_URL=http://localhost:3000

# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
DB_NAME=blogging_app

# Cache
REDIS_URL=redis://localhost:6379

# Security
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_EXPIRY=7d

# Logging
LOG_LEVEL=info              # error, warn, info, debug
```

## Available Scripts

```bash
npm run dev          # Start with nodemon (development)
npm start            # Start production server
npm run test         # Run Jest tests
npm run test:watch   # Watch mode for tests
npm run lint         # Check code style
npm run lint:fix     # Fix linting issues
npm run migrate      # Run database migrations
```

## API Endpoints

### Base URL
```
http://localhost:5000/api/v1.2
```

### Health Check
```
GET /health
```
Returns server status and environment info.

### Authentication Routes (`/users`)

**Register User**
```
POST /users/create
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePassword123"
}
```

**Login User**
```
POST /users/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePassword123"
}
Response: { token: "jwt_token_here" }
```

**Get All Users** (Protected)
```
GET /users/allUsers
Authorization: Bearer <token>
```

**Update Profile** (Protected)
```
PATCH /users/edit-user/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Name",
  "email": "newemail@example.com"
}
```

**Get User Profile** (Protected)
```
GET /users/profile
Authorization: Bearer <token>
```

**Change Password** (Protected)
```
PATCH /users/change-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "OldPassword123",
  "newPassword": "NewPassword456"
}
```

### Blog Routes (`/blogs`)

**Get All Blogs**
```
GET /blogs/allblogs
```

**Create Blog** (Protected)
```
POST /blogs/create
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "My First Blog",
  "content": "Blog content goes here..."
}
```

**Get Blog by ID** (Protected)
```
GET /blogs/post/:id
Authorization: Bearer <token>
```

**Get My Blogs** (Protected)
```
GET /blogs/myblogs
Authorization: Bearer <token>
```

**Update Blog** (Protected)
```
PATCH /blogs/edit/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "content": "Updated content..."
}
```

**Delete Blog** (Protected)
```
DELETE /blogs/del-blog/:id
Authorization: Bearer <token>
```

## Configuration

### Logger Setup

The application uses **Pino** for structured logging:
- **Development**: Pretty-printed logs with colors
- **Production**: JSON formatted logs for machine parsing
- Logs include timestamps, request details, and error traces

```javascript
// Access logger in code
import logger from './config/logger.js';
logger.info('Message', { data: 'value' });
```

### Security Features

✅ **Helmet**: Sets secure HTTP headers  
✅ **CORS**: Configured with `CLIENT_URL`  
✅ **JWT**: Signed tokens for authentication  
✅ **Bcrypt**: Password hashing  
✅ **Rate Limiting**: Ready for implementation  

### Config Management

Environment variables are loaded and validated on startup:
- Required variables trigger immediate exit if missing (production)
- Config object is frozen to prevent runtime modifications
- All values type-checked and validated

## Development Workflow

### Running Tests
```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm test -- --coverage
```

### Code Quality
```bash
# Lint check
npm run lint

# Auto-fix linting issues
npm run lint:fix
```

### Database Migrations
```bash
npm run migrate
```

## Deployment

### Production Setup

1. Set `NODE_ENV=production` in `.env`
2. Use production database and Redis URLs
3. Set strong `JWT_SECRET` (minimum 32 characters)
4. Run with `npm start` or process manager (PM2)

### Docker (Optional)

```bash
# Build
docker build -f docker/Dockerfile -t blogging-app .

# Run
docker run -p 5000:5000 --env-file .env blogging-app
```

## Error Handling

The API returns standardized error responses:

```json
{
  "message": "Error description",
  "status": 400,
  "timestamp": "2025-12-31T20:10:58.908Z"
}
```

Common status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Troubleshooting

**Server won't start?**
- Check `.env` file exists and has valid values
- Verify MongoDB and Redis connections
- Check port 5000 is available

**Import errors?**
- Ensure all files use ES Module syntax (import/export)
- Check relative paths start from `src/` directory
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`

**Database connection issues?**
- Verify `MONGO_URI` format
- Check whitelist IP in MongoDB Atlas
- Test connection: `mongosh <MONGO_URI>`

**Redis connection issues?**
- Verify `REDIS_URL` is correct
- Ensure Redis service is running
- Check firewall/network settings

## Next Steps

1. ✅ Configure environment variables
2. ✅ Start development server
3. ⏳ Add request validation with Joi
4. ⏳ Implement comprehensive tests
5. ⏳ Add API documentation (Swagger/OpenAPI)
6. ⏳ Set up CI/CD pipelines
7. ⏳ Containerize with Docker
8. ⏳ Deploy to production

## Additional Resources

- [PRODUCTION_FOLDER_STRUCTURE.md](./PRODUCTION_FOLDER_STRUCTURE.md) - Detailed folder structure guide
- [DEVELOPMENT_TO_PRODUCTION_GUIDE.md](./DEVELOPMENT_TO_PRODUCTION_GUIDE.md) - Full production setup guide
- [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) - What was implemented in this phase
- [Express.js Documentation](https://expressjs.com/)
- [MongoDB/Mongoose Docs](https://mongoosejs.com/)
- [Pino Logger Docs](https://getpino.io/)

## License

ISC