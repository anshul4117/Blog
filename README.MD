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
- [Security Features](#security-features)
- [Query Features](#query-features)
- [Full Implementation Log](IMPLEMENTATION_SUMMARY.md)

## Features

### Core Features
- **User Authentication**: Register, Login, Logout (JWT-based).
- **Blog Management**: Create, Read, Update, Delete blogs.
- **User Profile**: View and update profile details.

### Production Features (New) 🚀
- **Robust Validation**: `Joi` schemas for strict data integrity.
- **Security**:
  - `Helmet` for secure HTTP headers.
  - `Rate Limiting` to prevent spam and brute-force (100 req/15min).
- **Reliability**:
  - **Centralized Error Handling**: Standardized JSON error responses.
  - **Graceful Shutdown**: Prevents data corruption during restarts.
- **Observability**: High-performance structured logging with `Pino`.
- **Advanced Querying**:
  - **Pagination**: `?page=1&limit=10`
  - **Search**: `?search=keyword` (Full-text search)
  - **Sorting**: `?sort=-createdAt`
  - **Field Selection**: `?fields=title,content`

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

Create a `.env` file in `Server/` (do not commit it). The project includes `.env.example` with these keys:

```
PORT = 2000
MONGO_URI = mongodb_uri_here
JWT_SECRET = <your-jwt-secret>
```

Replace placeholders with real values. `MONGO_URI` should point to your MongoDB instance.

## Available scripts

- `npm run dev` — start the server with `nodemon server.js` (development)

The `package.json` currently defines only the `dev` script.

## API Endpoints (overview)

Base URL: `http://localhost:2000` (or `PORT` in .env)

### Authentication
- `POST /api/v1.2/users/create` - Register
- `POST /api/v1.2/users/login` - Login (Rate Limited: 5 attempts/hour)
- `POST /api/v1.2/users/refresh-token` - Get new Access Token
- `POST /api/v1.2/users/logout` - Logout (Invalidates Refresh Token)

### Blogs
- `GET /api/v1.2/blogs/allblogs` - Get all blogs
  - **Search**: `?search=react`
  - **Pagination**: `?page=1&limit=5`
  - **Sort**: `?sort=-createdAt` (newest first)
- `POST /api/v1.2/blogs/create-blog` - Create new blog
- GET  /auth/allUsers — list all users (protected with `auth` middleware)

Blog routes (defined in `routes/blog.js`)

- POST /blogs/create — create a blog (protected with `auth` middleware)
- GET  /blogs/allblogs — list all blogs (protected with `auth` middleware)
- DELETE  /blogs/del-blog/:id — delete a particular bolg grom db (protected with `auth` middleware)
- GET  /blogs/:id  — get a particular blog by id from db (protected with `auth` middleware)
- PATCH /blogs/edit/:id - update a particular blog by id from db (protected with `auth` middleware) (controller: `blogs.js`)

## Quick example (register + login)

Register a user:

POST /auth/create
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